const link = document.createElement("link");
link.rel = "manifest";
link.href = "/manifest.json";
document.head.appendChild(link);

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/System/service-worker.js")
        .then(() => console.log("Service Worker registered"))
        .catch((error) => console.log("Service Worker registration failed:", error));
}
// Listen for the "beforeinstallprompt" event
window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    const installPrompt = event;
}); 

console.log("Manifest shared loaded");