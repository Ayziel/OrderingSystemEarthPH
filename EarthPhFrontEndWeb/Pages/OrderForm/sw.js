const CACHE_NAME = "order-management-cache-v1";
const urlsToCache = [
  "/OrderForm/Agent-info.html",  // Full paths for the service worker
  "/OrderForm/Order-info.html",
  "/OrderForm/Product-Preference.html",
  "/OrderForm/styles/agentInfo.css",
  "/OrderForm/styles/orderInfo.css",
  "/OrderForm/styles/productPreference.css",
  "/OrderForm/script.js",
  "/OrderForm/scripts/orderInfo.js",
  "/OrderForm/scripts/agentInfo.js",
  // Add other JS and CSS files here
];


self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
