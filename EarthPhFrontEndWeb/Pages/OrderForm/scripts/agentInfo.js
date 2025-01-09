document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
    document.getElementById('order-date').value = today;
});



document.addEventListener('DOMContentLoaded', async () => {
    
    const userID = localStorage.getItem('userID');
    console.log("UserID from localStorage:", userID);

    try {
        // Fetch user data
        const users = await fetchUserData();

        if (users) {
            // Find the matched user
            const matchedUser = findUserByID(users, userID);

            if (matchedUser) {
                console.log('Matched User:', matchedUser);

                // Populate fields with matched user data
                populateUserData(matchedUser, users);
            } else {
                console.log('No matching user found.');
            }
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});

// Function to fetch user data from API
async function fetchUserData() {
    try {
        const response = await fetch('https://earthph.sdevtech.com.ph/users/getUsers');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.users; // Return users data
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to find a user by ID
function findUserByID(users, userID) {
    return users.find(user => user._id === userID);
}

// Function to populate the form with matched user data
function populateUserData(matchedUser, users) {
    // Populate agent name field
    document.getElementById('agent-name').value = `${matchedUser.firstName} ${matchedUser.lastName}`;

    // Populate area field with matched user's address
    document.getElementById('area').value = matchedUser.address;

    // Populate TIN field with matched user's TIN
    document.getElementById('tin').value = matchedUser.tin;
    // Populate team leader name field if available
    const teamLeader = findTeamLeader(users, matchedUser.team);
    if (teamLeader) {
        document.getElementById('team-leader-name').value = `${teamLeader.firstName} ${teamLeader.lastName}`;
    } else {
        console.log('No team leader found for the current team.');
    }
}

// Function to find the team leader from the same team
function findTeamLeader(users, team) {
    return users.find(user => user.role.toLowerCase() === "teamleader" && user.team === team);
}

document.getElementById('confirm-button').addEventListener('click', (event) => {
    event.preventDefault();  // Prevent any default form submission behavior
    console.log("TEST")
    const orderData = {
        agentName: document.getElementById('agent-name').value,
        teamLeaderName: document.getElementById('team-leader-name').value,
        area: document.getElementById('area').value,
        orderDate: document.getElementById('order-date').value,
        storeName: document.getElementById('store-name').value,
        tin: document.getElementById('tin').value,
    };

    console.log('Order Data to save:', orderData);

    try {
        // Save to localStorage
        localStorage.setItem('orderData', JSON.stringify(orderData));
        console.log('Data saved to localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }

    // Redirect to the next page
    console.log('Redirecting to next page...');
    window.location.href = 'https://earthhomecareph.astute.services/OrderForm/Product-Preference.html';
});


document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'https://earthhomecareph.astute.services/System/login.html';  // Adjust path accordingly
    }
});

// Get the modal
var modal = document.getElementById("myModal");

// Get the icon that opens the modal
var helpIcon = document.getElementById("help-icon");

// Get the <span> element that closes the modal
var closeModal = document.getElementById("close-modal");

// When the user clicks on the icon, open the modal
helpIcon.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.getElementById('confirm-button').addEventListener('click', () => {
    // Placeholder for handling data and creating the second HTML file.
    alert('Data confirmed. Process the filtered data as required.');
});