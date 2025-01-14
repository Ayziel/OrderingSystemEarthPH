const logGCashData = () => {
    return new Promise((resolve, reject) => {
        // Fetch matched user from localStorage
        const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));
        
        if (matchedUser && matchedUser.uid) {
            const userUid = matchedUser.uid;
            console.log("User UID for GCash data logging:", userUid);
            
            // Fetch GCash data for the user
            fetch(`https://earthph.sdevtech.com.ph/gCash/getGcash/${userUid}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch GCash data: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.gcash && data.gcash.userUid === userUid) {
                        console.log("GCash data found for user:", data.gcash);
                        
                        // Update the #gcash element with the cash value (Peso sign)
                        document.getElementById('gcash').textContent = `₱${data.gcash.cash || '0'}`; // Use '₱0' if no cash value is found
                        
                        resolve(data.gcash);  // Resolve the promise with the GCash data
                    } else {
                        console.log("No GCash data found for user UID:", userUid);
                        
                        // Set the #gcash element to '₱0' if no data is found
                        document.getElementById('gcash').textContent = '₱0';
                        
                        resolve(null); // Resolve with null if no GCash data is found
                    }
                })
                .catch(error => {
                    console.error("Error fetching GCash data:", error);
                    reject(error); // Reject the promise on error
                });
        } else {
            reject("Matched user not found in localStorage.");
        }
    });
};

// Fetch and log the data when the page loads
logGCashData();

// Function to open modal and show GCash data in a table format
const openGCashModal = () => {
    // Fetch GCash data for all users
    fetch('https://earthph.sdevtech.com.ph/gCash/getAllGcash')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch all GCash data: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('gcashTableBody');
            tableBody.innerHTML = ''; // Clear any existing rows

            // Add the current user's GCash data as the first row
            const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));
            if (matchedUser && matchedUser.uid) {
                const currentUserRow = document.createElement('tr');
                currentUserRow.innerHTML = `
                    <td>Your GCash (UID: ${matchedUser.uid})</td>
                    <td>₱${data.gcash.find(item => item.userUid === matchedUser.uid)?.cash || '0'}</td>
                `;
                tableBody.appendChild(currentUserRow);
            }

            // Add other users' GCash data to the table
            data.gcash.forEach(gcash => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${gcash.userUid}</td>
                    <td>₱${gcash.cash || '0'}</td>
                `;
                tableBody.appendChild(row);
            });

            // Show the modal
            $('#gcashModal').modal('show');
        })
        .catch(error => {
            console.error("Error fetching all GCash data:", error);
            document.getElementById('gcashModalContent').textContent = 'Error loading GCash data.';
            $('#gcashModal').modal('show');
        });
};


// Add click event to the GCash card
document.getElementById('gcashCard').addEventListener('click', openGCashModal);
