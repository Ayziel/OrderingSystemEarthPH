const sidebarMenu = document.querySelector('.menu_items');
const tableContainer = document.querySelector('.table-container'); // Select the table container


document.addEventListener('DOMContentLoaded', () => {

    if (userRole === 'agent') {
        const adminLink = document.getElementById('adminLink');
        adminLink.style.display = 'none';
        // Hide all menu items except Dashboard and Agents
        sidebarMenu.querySelectorAll('.item').forEach(item => {
          const navlinkText = item.querySelector('.navlink')?.textContent.trim();
          if (navlinkText == 'Agents' || navlinkText == 'Admin') {
            item.style.display = 'none'; // Hide other menu items
          }
        });
      }
    
      // Additional logic for teamLeader role
      if (userRole === 'teamLeader') {
        const adminLink = document.getElementById('adminLink');
        adminLink.style.display = 'none';
        // Show Agent Performance section for teamLeader
        if (tableContainer) {
          tableContainer.style.display = 'block'; // Ensure it remains visible for team leaders
        }
        // Hide other sections that are not relevant to team leaders
        sidebarMenu.querySelectorAll('.item').forEach(item => {
          const navlinkText = item.querySelector('.navlink')?.textContent.trim();
          if (navlinkText == 'Admin') {
            item.style.display = 'none'; // Hide sections that shouldn't be shown
          }
        });
      }

      if (userRole === 'Admin' || userRole === 'teamLeader') {
        const stockLink = document.getElementById('stockLink');
        stockLink.style.display = 'none';
      }

});

const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));


document.getElementById('agent-name-nav-bar').innerText = (matchedUser.firstName + " " + matchedUser.lastName) || 'Agent Name';

document.getElementById('agent-role-nav-bar').innerText = (matchedUser.role) || 'Agent Role';


const newOrderLink = document.getElementById('newOrderLink');
const viewOrderLink = document.getElementById('viewOrderLink');
newOrderLink.addEventListener('click', () => { 
    localStorage.setItem('isViewOrderMode', false); // Set boolean as true
    console.log("isViewOrderMode set to true in localStorage.");
});
viewOrderLink.addEventListener('click', () => { 
    localStorage.setItem('isViewOrderMode', true); // Set boolean as true
    console.log("isViewOrderMode set to true in localStorage.");
});