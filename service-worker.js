const staticCacheName = "site-static-v1";
const assets = [
    "/", 
    "/EarthPhFrontEndWeb/Pages/System/index.html",
    "/EarthPhFrontEndWeb/Pages/System/styles/style.css",
    "/EarthPhFrontEndWeb/Pages/System/login.html",
    "/EarthPhFrontEndWeb/Pages/System/styles/log-in.css",
    "https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap",
    "https://fonts.gstatic.com/s/poppins/v15/pxiEyp8kv8JHgFVrJJfecg.ttf",
    // Add Font Awesome CDN URLs
    "https://unicons.iconscout.com/release/v4.0.0/css/line.css",
    "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css",
    "https://cdn.jsdelivr.net/npm/font-awesome@5.15.4/css/all.min.css", // Example FA CDN
    // Other important external resources (like images)

];



// Install the service worker and cache resources
self.addEventListener("install", (event) => {
    // event.waitUntil(
    //     caches.open(staticCacheName).then((cache) => {
    //         console.log("Caching static assets...");
    //         return cache.addAll(assets);
    //     }).catch((err) => console.error("Caching failed", err))
    // );
});

// Intercept fetch requests and serve cached resources
self.addEventListener("fetch", (event) => {
    // const url = event.request.url;

    // // Handle requests for external resources (fonts, icons, etc.)
    // if (url.includes("fonts.googleapis.com") || 
    //     url.includes("fonts.gstatic.com") || 
    //     url.includes("unicons.iconscout.com") ||
    //     url.includes("unpkg.com") || 
    //     url.includes("cdn.jsdelivr.net")) {

    //     const modifiedRequest = new Request(event.request, {
    //         mode: 'no-cors' // Set no-cors mode for external requests
    //     });

    //     event.respondWith(
    //         caches.match(modifiedRequest).then((cachedResponse) => {
    //             //return cachedResponse || fetch(modifiedRequest);
    //             return cachedResponse
    //         })
    //     );
    // } else {
    //     // For other resources (local files), check cache and then fetch if not available
    //     event.respondWith(
    //         caches.match(event.request).then((cacheResponse) => {
    //             return cacheResponse || fetch(event.request);
    //         })
    //     );
    // }
});



// Activate the new service worker and delete old caches
self.addEventListener("activate", (event) => {
    console.log("activated")
});
