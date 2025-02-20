const staticCacheName = "site-static-v12";
const dynamicCacheName = "site-dynamic-v12";
const cacheLimit = 100;

const dashboardAssets = [
    "/EarthPhFrontEndWeb/Pages/System/fallback.html",
    "/EarthPhFrontEndWeb/Pages/System/index.html",
    "/EarthPhFrontEndWeb/Pages/System/scripts/dashboard.js",
    "/EarthPhFrontEndWeb/Pages/System/styles/dashboard/css/lib/bootstrap/bootstrap.min.css",
    "/EarthPhFrontEndWeb/Pages/System/scripts/agentPerformance.js",
    "/EarthPhFrontEndWeb/Pages/System/scripts/gcashdashboard.js",
    "/EarthPhFrontEndWeb/Pages/System/styles/dashboard/css/style.css",
    "/EarthPhFrontEndWeb/Pages/System/styles/dashboard/css/helper.css",
    "/EarthPhFrontEndWeb/Pages/System/styles/gcash.css",
    "/EarthPhFrontEndWeb/Pages/System/styles/agentPerformance.css",
    "/images/logo.jpg",
];

const generalAssets = [
    "/",
    "/EarthPhFrontEndWeb/Pages/System/styles/style.css",
    "/EarthPhFrontEndWeb/Pages/System/styles/navbar.css",
    "/EarthPhFrontEndWeb/Pages/System/scripts/script.js",
    "/EarthPhFrontEndWeb/Pages/System/scripts/manifestShared.js",
    "/EarthPhFrontEndWeb/Pages/System/scripts/sideNavigation.js",
];

const assets = [...dashboardAssets, ...generalAssets];

function notifyClients(data) {
    self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => {
            client.postMessage(data);
        });
    });
}

const limitCacheSize = (cacheName, size) => {
    caches.open(cacheName).then((cache) => {
        cache.keys().then((keys) => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(() => limitCacheSize(cacheName, size));
            }
        });
    });
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            return cache.addAll(assets);
        }).then(() => {
            self.skipWaiting(); // Force activation after installation
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
                    .map((key) => caches.delete(key))
            );
        }).then(() => {
            self.clients.claim();
            return self.clients.matchAll({ type: "window" }).then((clients) => {
                clients.forEach((client) => client.navigate(client.url)); // Refresh open tabs
            });
        })
    );
});


self.addEventListener("fetch", (event) => {
    const { request } = event;

    if (request.method === "POST" && request.url.includes("/order")) {
        event.respondWith(handleOrderRequest(event));
        return;
    }

    if (request.method === "GET") {
        event.respondWith(
            caches.match(request).then((cacheResponse) => {
                if (cacheResponse) return cacheResponse; // Serve cache first

                return fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse.ok) {
                            return caches.open(dynamicCacheName).then((cache) => {
                                cache.put(request, networkResponse.clone());
                                limitCacheSize(dynamicCacheName, cacheLimit);
                                return networkResponse;
                            });
                        }
                        return networkResponse;
                    })
                    .catch(() => caches.match("/EarthPhFrontEndWeb/Pages/System/fallback.html")); // Offline fallback
            })
        );
    }
});


async function handleOrderRequest(event) {
    try {
        return await fetch(event.request);
    } catch (error) {
        const formData = await event.request.clone().formData();
        const order = {};
        formData.forEach((value, key) => (order[key] = value));

        saveToIndexedDB("ordersDB", "orders", order);

        // ✅ Register background sync
        self.registration.sync.register("sync-orders").catch(err => console.error("Sync registration failed", err));

        return new Response(JSON.stringify({ status: "offline", message: "Order saved locally." }), {
            headers: { "Content-Type": "application/json" }
        });
    }
}


function saveToIndexedDB(dbName, storeName, data) {
    const dbRequest = indexedDB.open(dbName, 1);

    dbRequest.onupgradeneeded = (event) => {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
        }
    };

    dbRequest.onsuccess = (event) => {
        let db = event.target.result;

        if (!db.objectStoreNames.contains(storeName)) {
            console.error(`Object store "${storeName}" does not exist.`);
            return;
        }

        let tx = db.transaction(storeName, "readwrite");
        let store = tx.objectStore(storeName);
        store.add({ ...data, id: Date.now() }); // Ensure an ID exists
    };
}


self.addEventListener("sync", (event) => {
    if (event.tag === "sync-orders") {
        event.waitUntil(syncData("ordersDB", "orders", "/order"));
    } else if (event.tag === "sync-surveys") {
        event.waitUntil(syncData("surveyDB", "surveys", "https://earthph.sdevtech.com.ph/survey/createSurvey"));
    }
});

async function syncData(dbName, storeName, apiEndpoint) {
    const dbRequest = indexedDB.open(dbName, 1);

    dbRequest.onsuccess = (event) => {
        let db = event.target.result;
        let tx = db.transaction(storeName, "readwrite");
        let store = tx.objectStore(storeName);
        let getAll = store.getAll();

        getAll.onsuccess = async () => {
            const dataItems = getAll.result;
            if (dataItems.length > 0) {
                notifyClients({ type: "sync-start", count: dataItems.length });
            }

            for (let dataItem of dataItems) {
                try {
                    let response = await fetch(apiEndpoint, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(dataItem),
                    });

                    if (response.ok) {
                        let deleteTx = db.transaction(storeName, "readwrite"); // Separate transaction
                        let deleteStore = deleteTx.objectStore(storeName);
                        deleteStore.delete(dataItem.id);

                        notifyClients({ type: "sync-success", message: `Data synced: ${dataItem.id}` });
                    }
                } catch (error) {
                    console.log("Failed to sync", dataItem);
                }
            }
        };
    };
}

