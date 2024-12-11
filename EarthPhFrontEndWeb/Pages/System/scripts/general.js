const logout = document.getElementById('logoutBtn');
logout.addEventListener('click', logoutUser);

function logoutUser() {
    // Remove the token and other user-related data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userID');
    localStorage.removeItem('userRole');
    console.log('User logged out.');
    // Redirect to the login page
    window.location.href = '/System/login.html'; // Adjust path as needed
}
