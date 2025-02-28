
const addImage = document.getElementById('addImage');
const applyBtn = document.getElementById('applyBtn');

// Get the stored data from localStorage
const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));

// Extract firstName, lastName, and uid
const matchedUserUID = matchedUser.uid; 
const matchedUserullName = `${matchedUser.firstName} ${matchedUser.lastName}`;

let selectedStoreData = null;
for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    console.log(`${key}: ${localStorage.getItem(key)}`);
}

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

    if (localStorage.getItem("isViewOrderMode") === "true") {
        addImage.style.display = 'block';
        applyBtn.style.display = 'block';
        } 
});

document.addEventListener('DOMContentLoaded', async () => {
    console.log("VIEW ORDER MODE",localStorage.getItem('isViewOrderMode'))
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
    const missingFields = [];

    if (!matchedUserullName || matchedUserullName.trim() === "") {
        missingFields.push("Agent Name");
    }
    if (!matchedUserUID || matchedUserUID.trim() === "") {
        missingFields.push("Agent UID");
    }
    if (!selectedStoreData) {
        missingFields.push("Store Data");
    } else {
        if (!selectedStoreData.address || selectedStoreData.address.trim() === "") {
            missingFields.push("Store Address");
        }
        if (!selectedStoreData.name || selectedStoreData.name.trim() === "") {
            missingFields.push("Store Name");
        }
        if (!selectedStoreData.uid || selectedStoreData.uid.trim() === "") {
            missingFields.push("Store UID");
        }
    }

    if (missingFields.length > 0) {
        alert(`Please fill in the following required fields before submitting:\n- ${missingFields.join("\n- ")}`);
        return;
    }



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
    if (localStorage.getItem("isViewOrderMode") === "true") {
    window.location.href = 'https://earthhomecareph.astute.services/OrderForm/Order-Info.html'
    } else {
        window.location.href = 'https://earthhomecareph.astute.services/OrderForm/Product-Preference.html';
}
});

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');

    let applybtnLabel = document.querySelector('.apply-label');
    const uploadFeedback = document.getElementById('upload-feedback');
    const imageInput = document.getElementById('image-upload');
    const filenameDisplay = document.getElementById('uploaded-tin-filename');

    // Handle the image file selection
    imageInput.addEventListener('change', function(event) {
        const fileInput = event.target;
        const fileName = fileInput.files[0] ? fileInput.files[0].name : ''; // Get the name of the uploaded file
        
        if (fileName) {
            // Show the file name in the paragraph and make it visible
            filenameDisplay.textContent = `Uploaded file: ${fileName}`;
            filenameDisplay.style.display = 'block';
        } else {
            // Hide the paragraph if no file is selected
            filenameDisplay.style.display = 'none';
        }
    });

    // Event listener for the Apply button
    applybtnLabel.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the page from reloading
        // Static data that you want to submit
        const agentName = matchedUserullName;
        const agentUid =  matchedUserUID;
        const location = selectedStoreData.address; // Make sure it's 'Location' on the backend
        const storeName = selectedStoreData.name;
        const storeUid = selectedStoreData.uid;
        const uid = selectedStoreData.uid;
        const createdAt = new Date().toISOString();

        // Prepare the data to be sent to the server
        const storeData = {
            agentName,
            agentUid,
            Location: location, // Correct field name 'Location'
            storeName,
            storeUid,
            uid,
            createdAt
        };

        // Check if an image was selected and convert it to base64
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function() {
                // Append the base64 string of the image to the storeData object
                storeData.image = reader.result;

                // Log the data to be sent to the server
                console.log('Data to be sent:', storeData);

                // Send the data to the server using fetch
                fetch('https://earthph.sdevtech.com.ph/viewStoreRoutes/createStore', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(storeData), // Sending data as JSON
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.message || 'Failed to submit data');
                        });
                    }
                    return response.json();  // Parse the response JSON
                })
                .then(result => {
                    console.log('Success:', result);
                    alert('Data uploaded successfully!');

                    // Update the feedback message (check if the element exists first)
                    if (uploadFeedback) {
                        uploadFeedback.textContent = 'Data uploaded successfully!';
                        uploadFeedback.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Error uploading data:', error);
                    alert('Failed to upload data: ' + error.message);

                    // Update the feedback message (check if the element exists first)
                    if (uploadFeedback) {
                        uploadFeedback.textContent = 'Failed to upload data.';
                        uploadFeedback.style.display = 'block';
                    }
                });
            };
            // Read the image file as base64
            reader.readAsDataURL(file);
        } else {
            // If no file is selected, send the store data without image
            fetch('https://earthph.sdevtech.com.ph/viewStoreRoutes/createStore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(storeData), // Sending data as JSON
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Failed to submit data');
                    });
                }
                return response.json();  // Parse the response JSON
            })
            .then(result => {
                console.log('Success:', result);
                alert('Data uploaded successfully!');

                // Update the feedback message (check if the element exists first)
                if (uploadFeedback) {
                    uploadFeedback.textContent = 'Data uploaded successfully!';
                    uploadFeedback.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error uploading data:', error);
                alert('Failed to upload data: ' + error.message);

                // Update the feedback message (check if the element exists first)
                if (uploadFeedback) {
                    uploadFeedback.textContent = 'Failed to upload data.';
                    uploadFeedback.style.display = 'block';
                }
            });
        }
    });

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

async function getStores() {
    try {
        const response = await fetch('https://earthph.sdevtech.com.ph/stores/getStores');
        if (response.ok) {
            const storesData = await response.json(); // assuming the data is in JSON format
            console.log(storesData); // Log the data for debugging
            
            if (Array.isArray(storesData.stores)) { // Ensure stores is an array
                // Trim names and sort alphabetically
                storesData.stores.sort((a, b) => a.name.trim().localeCompare(b.name.trim(), 'en', { sensitivity: 'base' }));
                
                populateStoresDropdown(storesData.stores); // Pass the sorted stores array
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
    const storeSelect = $('#store-name');
    storeSelect.empty().append('<option value="">Select store name</option>');

    let savedStore = localStorage.getItem('storeData') ? JSON.parse(localStorage.getItem('storeData')) : null;

    stores.forEach(store => {
        const option = $('<option></option>')
            .val(store._id)
            .text(store.name)
            .attr('data-uid', store.uid)
            .attr('data-tin', store.tin)
            .attr('data-address', store.address)
            .attr('data-store', JSON.stringify(store));

        if (savedStore && savedStore._id === store._id) {
            option.prop('selected', true); // Auto-select previous store
        }

        storeSelect.append(option);
    });

    // Initialize select2 for search functionality
    storeSelect.select2({
        placeholder: 'Search store name...',
        allowClear: true
    });

    function updateStoreDetails() {
        const selectedOption = storeSelect.find(':selected');
        const storeData = selectedOption.data('store') ? JSON.parse(selectedOption.attr('data-store')) : null;

        if (storeData) {
            selectedStoreData = storeData;
            localStorage.setItem('storeData', JSON.stringify(storeData));
            console.log('Selected store data:', storeData);

            $('#tin').val(selectedOption.attr('data-tin'));
            $('#area').val(selectedOption.attr('data-address'));
        }
    }

    // Auto-populate fields on page load if a store was selected before
    if (savedStore) {
        updateStoreDetails();
    }

    // Listen for changes and update fields accordingly
    storeSelect.on('change', updateStoreDetails);
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


if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
            if (registration.active && registration.active.scriptURL.includes("site-static-v8")) {
                registration.unregister();
                console.log("Old service worker unregistered.");
            }
        });
    });
}