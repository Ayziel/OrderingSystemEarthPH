const CACHE_NAME = "pwa-cache-v1";
const assets = [
    "/",
    // '/EarthPhFrontEndWeb/Pages/System/index.html',
    // '/EarthPhFrontEndWeb/Pages/System/Add-Agent.html',
    // '/EarthPhFrontEndWeb/Pages/System/Add-Store.html',
    // '/EarthPhFrontEndWeb/Pages/System/Agent-Leader.html',
    // '/EarthPhFrontEndWeb/Pages/System/Agent-Name.html',
    // '/EarthPhFrontEndWeb/Pages/System/All-Orders.html',
    // '/EarthPhFrontEndWeb/Pages/System/All-Stores.html',
    // '/EarthPhFrontEndWeb/Pages/System/login.html',
    // '/EarthPhFrontEndWeb/Pages/System/Orders-Day.html',
    // '/EarthPhFrontEndWeb/Pages/System/Orders-Month.html',
    // '/EarthPhFrontEndWeb/Pages/System/Orders-Week.html',
    // '/EarthPhFrontEndWeb/Pages/System/Product-list.html',
    // '/EarthPhFrontEndWeb/Pages/System/stock-list.html',
    // '/EarthPhFrontEndWeb/Pages/System/survey.html',
    // '/EarthPhFrontEndWeb/Pages/System/View-Store.html',
    // '/EarthPhFrontEndWeb/Pages/System/styles/style.css',
];

// Install the service worker and cache resources
self.addEventListener("install", (event) => {
    // event.waitUntil(
    //     caches.open(CACHE_NAME).then((cache) => {
    //         return cache.addAll(assets);
    //     })
    // );
});

// Intercept fetch requests and serve cached resources
self.addEventListener("fetch", (event) => {
    // console.log("EVENT", event)
    // event.respondWith(caches.match(event.request).then(cacheRes => {
    //     return cacheRes || fetch(event.request);
    // }));


    // event.respondWith(
    //     caches.match(event.request).then((response) => {
    //         return response || fetch(event.request);
    //     }).catch(() => caches.match("/offline.html"))
    // );
});

// Activate the new service worker and delete old caches
self.addEventListener("activate", (event) => {
    // const cacheWhitelist = [CACHE_NAME];
    // event.waitUntil(
    //     caches.keys().then((cacheNames) => {
    //         return Promise.all(
    //             cacheNames.map((cacheName) => {
    //                 if (!cacheWhitelist.includes(cacheName)) {
    //                     return caches.delete(cacheName);
    //                 }
    //             })
    //         );
    //     })
    // );
});
