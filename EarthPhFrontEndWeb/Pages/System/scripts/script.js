const body = document.querySelector("body");
const darkLight = document.querySelector("#darkLight");
const sidebar = document.querySelector(".sidebar");
const submenuItems = document.querySelectorAll(".submenu_item");
const sidebarOpen = document.querySelector("#sidebarOpen");
const sidebarClose = document.querySelector(".collapse_sidebar");
const sidebarExpand = document.querySelector(".expand_sidebar");
const link = document.createElement("link");
link.rel = "manifest";
link.href = "/System/manifest.json";
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
    //document.getElementById("install-btn").style.display = "block";

    // document.getElementById("install-btn").addEventListener("click", () => {
    //     installPrompt.prompt();
    //     installPrompt.userChoice.then((choiceResult) => {
    //         if (choiceResult.outcome === "accepted") {
    //             console.log("User accepted the install prompt");
    //         } else {
    //             console.log("User dismissed the install prompt");
    //         }
    //     });
    // });
});

sidebarOpen.addEventListener("click", () => sidebar.classList.toggle("close"));

sidebarClose.addEventListener("click", () => {
  sidebar.classList.add("close", "hoverable");
});
sidebarExpand.addEventListener("click", () => {
  sidebar.classList.remove("close", "hoverable");
});

sidebar.addEventListener("mouseenter", () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.remove("close");
  }
});
sidebar.addEventListener("mouseleave", () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.add("close");
  }
});

darkLight.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    document.setI
    darkLight.classList.replace("bx-sun", "bx-moon");
  } else {
    darkLight.classList.replace("bx-moon", "bx-sun");
  }
});

submenuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    item.classList.toggle("show_submenu");
    submenuItems.forEach((item2, index2) => {
      if (index !== index2) {
        item2.classList.remove("show_submenu");
      }
    });
  });
});



//this controls log in log out script
if (window.innerWidth < 768) {
  sidebar.classList.add("close");
} else {
  sidebar.classList.remove("close");
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
      window.location.href = 'https://earthhomecareph.astute.services/System/login.html';  // Adjust path accordingly
  }
});


const logout = document.getElementById('logoutBtn');
logout.addEventListener('click', logoutUser);

function logoutUser() {
  // Clear all data from localStorage
  localStorage.clear(); 
  console.log('All data cleared from localStorage.');

  // Redirect to the login page
  window.location.href = 'https://earthhomecareph.astute.services/System/login.html'; // Adjust path as needed
}



document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    // Redirect to login if no token
    window.location.href = 'https://earthhomecareph.astute.services/System/login.html';
  }
});
