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
    // Remove the token and other user-related data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userID');
    localStorage.removeItem('userRole');
    console.log('User logged out.');
    // Redirect to the login page
    window.location.href = 'https://earthhomecareph.astute.services/System/login.html'; // Adjust path as needed
}


document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole'); // Assume userRole is stored in localStorage

  if (!token) {
    // Redirect to login if no token
    window.location.href = 'https://earthhomecareph.astute.services/System/login.html';
  }

  const sidebarMenu = document.querySelector('.menu_items');
  const tableContainer = document.querySelector('.table-container'); // Select the table container

  if (userRole === 'agent') {
    // Hide all menu items except Dashboard and Agents
    sidebarMenu.querySelectorAll('.item').forEach(item => {
      const navlinkText = item.querySelector('.navlink')?.textContent.trim();
      if (navlinkText !== 'Dashboard' && navlinkText !== 'Agents') {
        item.style.display = 'none'; // Hide other menu items
      }
    });

    // Remove the entire Agent Performance section for agents
    if (tableContainer) {
      tableContainer.remove(); // Remove the container for agents
    }
  }

  // Additional logic for teamLeader role
  if (userRole === 'teamLeader') {
    // Show Agent Performance section for teamLeader
    if (tableContainer) {
      tableContainer.style.display = 'block'; // Ensure it remains visible for team leaders
    }

    // Hide other sections that are not relevant to team leaders
    sidebarMenu.querySelectorAll('.item').forEach(item => {
      const navlinkText = item.querySelector('.navlink')?.textContent.trim();
      if (navlinkText !== 'Dashboard' && navlinkText !== 'Agents' && navlinkText !== 'Team Performance') {
        item.style.display = 'none'; // Hide sections that shouldn't be shown
      }
    });

    document.getElementById('newOrderLink').style.display = 'none'; // Hide the New Order link
  }
});
