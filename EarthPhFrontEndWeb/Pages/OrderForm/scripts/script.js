
    function updateButtonState() {
        const button = document.getElementById("uploadButton");
        if (navigator.onLine) {
            button.removeAttribute("disabled"); // Enable button when online
        } else {
            button.setAttribute("disabled", "true"); // Disable button when offline
        }
    }

    // Check connection on page load
    updateButtonState();

    // Listen for connection changes
    window.addEventListener("online", updateButtonState);
    window.addEventListener("offline", updateButtonState);
