document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
    document.getElementById('order-date').value = today;
    getStores();

    // Log the order data from localStorage on load
    const savedOrderData = localStorage.getItem('orderData');
    if (savedOrderData) {
        console.log('Order Data from localStorage on load:', JSON.parse(savedOrderData)); // Log the order data being saved
    } else {
        console.log('No order data found in localStorage on load.');
    }
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
        console.log('Fetched user data:', data); // Log all the fetched data
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
    console.log('Matched User:', matchedUser);

    // Populate area field with matched user's address
    document.getElementById('area').value = matchedUser.address;

    // Populate team leader name field if available
    const teamLeader = findTeamLeader(users, matchedUser.team);
    if (teamLeader) {
        document.getElementById('team-leader-name').value = `${teamLeader.firstName} ${teamLeader.lastName}`;
    } else {
        console.log('No team leader found for the current team.');
    }

    // Save the matched user in localStorage
    localStorage.setItem('matchedUser', JSON.stringify(matchedUser));
}

// Function to find the team leader from the same team
function findTeamLeader(users, team) {
    return users.find(user => user.role.toLowerCase() === "teamleader" && user.team === team);
}

document.getElementById('confirm-button').addEventListener('click', (event) => {
    event.preventDefault();  // Prevent any default form submission behavior

    const storeSelect = document.getElementById('store-name');
    const selectedStoreName = storeSelect.options[storeSelect.selectedIndex].text;


    const orderData = {
        agentName: document.getElementById('agent-name').value,
        teamLeaderName: document.getElementById('team-leader-name').value,
        area: document.getElementById('area').value,
        orderDate: document.getElementById('order-date').value,
        storeName: selectedStoreName,  // Use the text content of the selected option
        tin: document.getElementById('tin').value
    };

    console.log('Order Data to save:', orderData); // Log the order data being saved

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

async function getStores() {
    try {
        const response = await fetch('https://earthph.sdevtech.com.ph/stores/getStores');
        if (response.ok) {
            const storesData = await response.json();  // assuming the data is in JSON format
            console.log(storesData); // Log the data for debugging
            if (Array.isArray(storesData.stores)) {  // Ensure stores is an array
                populateStoresDropdown(storesData.stores);  // Pass the stores array
            } else {
                console.error('stores is not an array:', storesData.stores);
            }
        } else {
            console.error('Error fetching stores data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching stores data:', error);
    }
}

function populateStoresDropdown(stores) {
    const storeSelect = document.getElementById('store-name');
    
    // Clear existing options (except the first placeholder option)
    storeSelect.innerHTML = '<option value="">Select store name</option>';
    
    // Populate the dropdown with store options
    stores.forEach(store => {
        const option = document.createElement('option');
        option.value = store._id;
        option.textContent = store.name;
        option.setAttribute('data-uid', store.uid); // Store the store uid in a data attribute
        option.setAttribute('data-tin', store.tin); // Store the store's TIN in a data attribute
        option.setAttribute('data-store', JSON.stringify(store)); // Store the entire store object in a data attribute
        storeSelect.appendChild(option);
    });

    // Add event listener to store the selected store's data in localStorage
    storeSelect.addEventListener('change', () => {
        const selectedOption = storeSelect.options[storeSelect.selectedIndex];
        
        // Check if the selected option has a valid store data
        const storeData = selectedOption && selectedOption.getAttribute('data-store') ? JSON.parse(selectedOption.getAttribute('data-store')) : null;
        
        if (storeData) {
            localStorage.setItem('storeData', JSON.stringify(storeData)); // Store the entire store data in localStorage
            console.log('Selected store data:', storeData); // Log the store data for debugging
            
            // Now update the TIN field with the selected store's TIN
            const storeTIN = selectedOption.getAttribute('data-tin');
            document.getElementById('tin').value = storeTIN; // Set the TIN field value to the selected store's TIN
            console.log('Updated TIN:', storeTIN); // Log the updated TIN for debugging
        }
    });
}


// Form validation before submission
document.getElementById('orderForm').addEventListener('submit', (event) => {
    const storeSelect = document.getElementById('store-name');
    const selectedOption = storeSelect.options[storeSelect.selectedIndex];
    
    // Check if no valid store is selected (value is empty or no store data exists)
    const storeData = selectedOption && selectedOption.getAttribute('data-store') ? JSON.parse(selectedOption.getAttribute('data-store')) : null;

    if (!storeData) {
        event.preventDefault(); // Prevent form submission
        alert('Please select a valid store.'); // Show an alert if no valid store is selected
    }
});


