const usertoken = localStorage.getItem('authToken');
const userID = localStorage.getItem('userID');
let userData = {};


console.log("usertoken", usertoken);
console.log("userID", userID);


document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
    document.getElementById('order-date').value = today;
});

document.addEventListener('DOMContentLoaded', async () => {
    const userID = localStorage.getItem('userID');
    console.log("UserID from localStorage:", userID);

    try {
        const response = await fetch('https://earthph.sdevtech.com.ph/users/getUsers');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const users = data.users;

        // Find the current user
        const matchedUser = users.find(user => user._id === userID);

        if (matchedUser) {
            console.log('Matched User:', matchedUser);

            // Populate the agent-name field
            document.getElementById('agent-name').value = `${matchedUser.firstName} ${matchedUser.lastName}`;

            // Find the team leader from the same team
            const teamLeader = users.find(user => user.role.toLowerCase() === "teamleader" && user.team === matchedUser.team);

            if (teamLeader) {
                document.getElementById('team-leader-name').value = `${teamLeader.firstName} ${teamLeader.lastName}`;
            } else {
                console.log('No team leader found for the current team.');
            }
        } else {
            console.log('No matching user found.');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});




document.getElementById('confirm-button').addEventListener('click', () => {
    const orderData = {
        agentName: document.getElementById('agent-name').value,
        teamLeaderName: document.getElementById('team-leader-name').value,
        area: document.getElementById('area').value,
        orderDate: document.getElementById('order-date').value,  // Use the value from the input field
        storeName: document.getElementById('store-name').value,
        houseAddress: document.getElementById('house-street').value,
        townProvince: document.getElementById('barangay').value,
        storeCode: document.getElementById('store-code').value,
        tin: document.getElementById('tin').value,
    };

    // Log the data being saved
    console.log('Order Data to save:', orderData);

    // Save to localStorage
    localStorage.setItem('orderData', JSON.stringify(orderData));

    // Log all localStorage data
    console.log('All data in localStorage:', localStorage);

    // Redirect to the next page
    window.location.href = 'https://earthph.sdevtech.com.ph/OrderForm/Order-Info.html'; // Replace with your desired link
});

const orderData = {
    agentName: document.getElementById('agent-name').value,
    teamLeaderName: document.getElementById('team-leader-name').value,
    area: document.getElementById('area').value,
    orderDate: document.getElementById('order-date').value,  // Use the value from the input field
    storeName: document.getElementById('store-name').value,
    houseAddress: document.getElementById('house-street').value,
    townProvince: document.getElementById('barangay').value,
    storeCode: document.getElementById('store-code').value,
    tin: document.getElementById('tin').value,
};

// Log the data being saved
console.log('Order Data to save:', orderData);

function logoutUser() {
    // Remove the token and other user-related data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userID');
    localStorage.removeItem('userRole');
    console.log('User logged out.');
    // Redirect to the login page
    window.location.href = 'https://earthph.sdevtech.com.ph/System/login.html'; // Adjust path as needed
}