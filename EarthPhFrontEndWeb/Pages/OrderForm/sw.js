const CACHE_NAME = "order-management-cache-v1";
const urlsToCache = [
  "./Agent-info.html",
  "./Order-info.html",
  "./Product-Preference.html",
  "./styles/agentInfo.css",
  "./styles/orderInfo.css",
  "./styles/productPreference.css",
  "./script.js",
  "./scripts/orderInfo.js",
  "./scripts/agentInfo.js",
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
