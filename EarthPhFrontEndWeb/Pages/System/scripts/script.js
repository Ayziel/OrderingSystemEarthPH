const body = document.querySelector("body");
const darkLight = document.querySelector("#darkLight");
const sidebar = document.querySelector(".sidebar");
const submenuItems = document.querySelectorAll(".submenu_item");
const sidebarOpen = document.querySelector("#sidebarOpen");
const sidebarClose = document.querySelector(".collapse_sidebar");
const sidebarExpand = document.querySelector(".expand_sidebar");


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

const buttonsToDisable = document.querySelectorAll(".disable-on-offline");

function updateButtonState() {
  buttonsToDisable.forEach(button => {
      // Store original text only if it's not already set
      if (!button.hasAttribute("data-original-text")) {
          button.setAttribute("data-original-text", button.textContent);
      }

      if (navigator.onLine) {
          button.removeAttribute("disabled");
          button.style.removeProperty("background-color");
          button.textContent = button.getAttribute("data-original-text"); // Restore original text
      } else {
          button.setAttribute("disabled", "true");
          button.style.setProperty("background-color", "red", "important");
          button.textContent = `Can't ${button.getAttribute("data-original-text")}`; // Add "Can't"
      }
  });
}



// Initial check
updateButtonState();

// Listen for connection changes
window.addEventListener("online", updateButtonState);
window.addEventListener("offline", updateButtonState);

// Prevent actions and alert when offline
document.addEventListener("click", (event) => {
    if (!navigator.onLine && event.target.matches(".disable-on-offline")) {
        event.preventDefault();
        alert("You are offline. This action cannot be performed.");
    }
});
function updateOfflineBanner() {
  const offlineBanner = document.getElementById("offline-banner");

  if (navigator.onLine) {
      offlineBanner.style.display = "none"; // Hide banner when online
  } else {
      offlineBanner.style.display = "flex"; // Show banner when offline
  }
}

// Check on page load and listen for connection changes
updateOfflineBanner();
window.addEventListener("online", updateOfflineBanner);
window.addEventListener("offline", updateOfflineBanner);
