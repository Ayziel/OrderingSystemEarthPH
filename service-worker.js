const staticCacheName = "site-static-v30";
const dynamicCacheName = "site-dynamic-v30";
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
        caches.open(staticCacheName).then(async (cache) => {
            for (let asset of assets) {
                try {
                    let response = await fetch(asset);
                    if (!response.ok) throw new Error(`Failed to fetch ${asset}: ${response.statusText}`);
                    await cache.put(asset, response.clone());
                } catch (err) {
                    console.warn(`⚠️ Skipping ${asset}:`, err.message);
                }
            }
        }).then(() => {
            self.skipWaiting();
        })
    );
});



self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => 
                        key.startsWith("site-static-") || key.startsWith("site-dynamic-") // ✅ Target all versions
                    )
                    .filter((key) => key !== staticCacheName && key !== dynamicCacheName) // ✅ Keep only the latest
                    .map((key) => caches.delete(key))
            );
        }).then(() => {
            self.clients.claim(); // Ensure control over all clients
            return self.clients.matchAll({ type: "window" }).then((clients) => {
                clients.forEach((client) => client.navigate(client.url)); // Refresh open tabs
            });
        })
    );
});

async function handleSurveyRequest(event) {
    try {
        return await fetch(event.request); // ✅ Try sending survey online
    } catch (error) {
        const formData = await event.request.clone().formData();
        const survey = {};
        formData.forEach((value, key) => (survey[key] = value));

        saveSurveyToIndexedDB(survey);

        // ✅ Register background sync only if supported
        if ("sync" in self.registration) {
            self.registration.sync.register("sync-surveys")
                .catch(err => console.error("Sync registration failed", err));
        } else {
            console.warn("Background sync not supported, surveys will stay in IndexedDB until next sync attempt.");
        }

        return new Response(JSON.stringify({ status: "offline", message: "Survey saved locally." }), {
            headers: { "Content-Type": "application/json" }
        });
    }
}


async function syncSurveyData() {
    return new Promise((resolve, reject) => {
        const dbRequest = indexedDB.open("surveysDB", 1);

        dbRequest.onsuccess = (event) => {
            let db = event.target.result;
            let tx = db.transaction("surveys", "readwrite");
            let store = tx.objectStore("surveys");
            let getAll = store.getAll();

            getAll.onsuccess = async () => {
                const surveys = getAll.result;

                if (surveys.length === 0) {
                    console.log("No survey data to sync.");
                    return resolve();
                }

                for (let survey of surveys) {
                    try {
                        let response = await fetch("https://earthph.sdevtech.com.ph/survey/createSurvey", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(survey),
                        });

                        if (response.ok) {
                            await deleteSurveyFromIndexedDB(db, survey.id);
                            console.log(`✅ Survey ${survey.id} synced successfully.`);
                        }
                    } catch (error) {
                        console.error(`❌ Sync failed for survey ${survey.id}`, error);
                    }
                }

                resolve();
            };
        };

        dbRequest.onerror = (event) => {
            console.error("❌ IndexedDB error for surveys:", event.target.error);
            reject(event.target.error);
        };
    });
}


self.addEventListener("fetch", (event) => {
    const { request } = event;

    if (request.url.startsWith("chrome-extension://")) {
        return;
    }

    if (request.method === "POST" && request.url.includes("/survey")) {
        event.respondWith(handleSurveyRequest(event)); // ✅ Handle survey request
        return;
    }

    if (request.method === "GET") {
        event.respondWith(
            fetch(request) // ✅ Try fetching from the network first
                .then((networkResponse) => {
                    return caches.open(dynamicCacheName).then((cache) => {
                        cache.put(request, networkResponse.clone()); // ✅ Update the cache with fresh data
                        limitCacheSize(dynamicCacheName, cacheLimit);
                        return networkResponse;
                    });
                })
                .catch(() => {
                    return caches.match(request).then((cacheResponse) => {
                        if (cacheResponse) return cacheResponse; // ✅ Return cached version if available
                        return caches.match("/EarthPhFrontEndWeb/Pages/System/fallback.html"); // ✅ Offline fallback
                    });
                })
        );
    }
});

function saveSurveyToIndexedDB(surveyData) {
    const dbRequest = indexedDB.open("surveysDB", 1);

    dbRequest.onupgradeneeded = (event) => {
        let db = event.target.result;
        if (!db.objectStoreNames.contains("surveys")) {
            db.createObjectStore("surveys", { keyPath: "id", autoIncrement: true });
        }
    };

    dbRequest.onsuccess = (event) => {
        let db = event.target.result;
        let tx = db.transaction("surveys", "readwrite");
        let store = tx.objectStore("surveys");
        store.add({ ...surveyData, id: Date.now() }); // Ensure unique ID
    };
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
    if (event.tag === "sync-surveys") {
        event.waitUntil(syncSurveyData());
    }

    // Placeholder for future order sync functionality
    // if (event.tag === "sync-orders") {
    //     console.log("Sync orders is not implemented yet, but will be in the future.");
    // }
});

async function deleteSurveyFromIndexedDB(db, id) {
    return new Promise((resolve, reject) => {
        let tx = db.transaction("surveys", "readwrite");
        let store = tx.objectStore("surveys");
        let request = store.delete(id);

        request.onsuccess = () => {
            console.log(`✅ Deleted survey ${id} from IndexedDB.`);
            resolve();
        };

        request.onerror = (event) => {
            console.error(`❌ Failed to delete survey ${id}`, event.target.error);
            reject(event.target.error);
        };
    });
}
