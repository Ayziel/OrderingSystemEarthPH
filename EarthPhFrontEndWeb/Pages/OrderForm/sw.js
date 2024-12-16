const CACHE_NAME = "order-management-cache-v1";
const urlsToCache = [
  "Pages/OrderForm/Agent-info.html",
  "Pages/OrderForm/styles/agentInfo.css",
  "Pages/OrderForm/scripts/agentInfo.js",
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
