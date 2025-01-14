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
    // Fetch all users and GCash data
    Promise.all([
        fetch('https://earthph.sdevtech.com.ph/users/getUsers').then(response => response.json()),
        fetch('https://earthph.sdevtech.com.ph/gCash/getAllGcash').then(response => response.json())
    ])
    .then(([usersData, gcashData]) => {
        const tableBody = document.getElementById('gcashTableBody');
        tableBody.innerHTML = ''; // Clear any existing rows

        // Fetch matched user data from localStorage
        const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));

        if (!matchedUser) {
            console.error("Matched user not found in localStorage");
            return;
        }

        // Filter GCash data based on user's role
        if (matchedUser.role === "Admin") {
            // If Admin, show all TeamLeader's GCash data
            gcashData.gcash.forEach(gcash => {
                const user = usersData.users.find(user => user.uid === gcash.userUid && user.role === "teamLeader");

                if (user) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.firstName} ${user.lastName}</td>
                        <td>${user.team}</td>
                        <td>${user.role}</td>
                        <td>₱${gcash.cash || '0'}</td>
                    `;
                    tableBody.appendChild(row);
                }
            });
        } else if (matchedUser.role === "teamLeader" || matchedUser.role === "agent") {
            // If TeamLeader or Agent, show only their own GCash data
            const currentUserGCash = gcashData.gcash.find(item => item.userUid === matchedUser.uid);
            const currentUser = usersData.users.find(user => user.uid === matchedUser.uid);

            if (currentUserGCash && currentUser) {
                const currentUserRow = document.createElement('tr');
                currentUserRow.innerHTML = `
                    <td>Your GCash (${currentUser.firstName} ${currentUser.lastName})</td>
                    <td>${currentUser.team}</td>
                    <td>${currentUser.role}</td>
                    <td>₱${currentUserGCash.cash || '0'}</td>
                `;
                tableBody.appendChild(currentUserRow);
            }
        }

        // Show the modal
        $('#gcashModal').modal('show');
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        document.getElementById('gcashModalContent').textContent = 'Error loading GCash or Users data.';
        $('#gcashModal').modal('show');
    });
};

// Add click event to the GCash card
document.getElementById('gcashCard').addEventListener('click', openGCashModal);

