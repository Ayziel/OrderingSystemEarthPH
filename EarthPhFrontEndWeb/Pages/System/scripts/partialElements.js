const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
console.log("userRole", userRole);
console.log("usertoken", usertoken);

document.addEventListener("DOMContentLoaded", function() {
    // Fetch the content of HeaderNav.html
    fetch('./partials/HeaderNav.html')
        .then(response => response.text())
        .then(data => {
            // Insert the content of HeaderNav.html into the navHeader div
            document.querySelector('.navHeader').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading HeaderNav.html:', error);
        });
});

document.addEventListener("DOMContentLoaded", function() {
    // Fetch the content of HeaderNav.html
    fetch('./partials/sidebarNav.html')
        .then(response => response.text())
        .then(data => {
            // Insert the content of HeaderNav.html into the navHeader div
            document.querySelector('.navSidebar').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading navSidebar.html:', error);
        });
});
