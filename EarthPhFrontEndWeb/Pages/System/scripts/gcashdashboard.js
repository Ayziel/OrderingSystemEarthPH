const logGCashData = () => {
    return new Promise((resolve, reject) => {
        // Fetch matched user from localStorage
        const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));
        if(matchedUser.role === "agent") {
            document.getElementById('gcashWidget').style.display = 'none';
            const elements = document.querySelectorAll('.col-md-3');

            // Loop through each element and change its class to "col-md-4"
            elements.forEach(element => {
                element.classList.remove('col-md-3');
                element.classList.add('col-md-4');
            });
        }
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
                        document.getElementById('gcash').textContent = `₱${(parseFloat(data.gcash.cash || '0')).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;



                        // Use '₱0' if no cash value is found
                        
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
    console.log('Opening GCash Modal...'); // Add this log to confirm it's being triggered

    // Fetch all users and GCash data
    Promise.all([
        fetch('https://earthph.sdevtech.com.ph/users/getUsers').then(response => response.json()),
        fetch('https://earthph.sdevtech.com.ph/gCash/getAllGcash').then(response => response.json())
    ])
    .then(([usersData, gcashData]) => {
        console.log('Fetched users and GCash data:', usersData, gcashData); // Log the fetched data


        let userqualification = "";
        // Clear existing rows in all tables
        const adminTableBody = document.getElementById('adminTableBody');
        adminTableBody.innerHTML = ''; // Clear any existing rows in the admin table

        const tableBody = document.getElementById('gcashTableBody');
        tableBody.innerHTML = ''; // Clear any existing rows in the GCash table

        // Fetch matched user data from localStorage
        const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));



        if (!matchedUser) {
            console.error("Matched user not found in localStorage");
            return;
        }

        console.log('Matched User:', matchedUser); // Log matched user data

        if (matchedUser.role === "Admin") {
            userqualification = "teamLeader";
        }
        else if (matchedUser.role === "teamLeader") { 
            userqualification = "Admin";
        }

        usersData.users.forEach(user => {   
            if (user.role === userqualification) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.team || 'N/A'}</td>
                    <td>${user.role}</td>
                    <td>${user.phoneNumber || 'N/A'}</td>
                `;
                
                // Add a click event listener to the row
                row.addEventListener('click', () => {
                    console.log('User data clicked:', user); // Log the user data for the clicked row
        
                    // Open the Send Funds modal
                    $('#sendFundsModal').modal('show');  // Open the modal using Bootstrap's modal method
        
                    // Populate the admin name in the modal
                    document.getElementById('adminName').textContent = `${user.firstName} ${user.lastName}`;
        
                    // Optional: Store the clicked user's data in a global variable if needed later
                    window.selectedAdmin = user;

                    // Fetch the current user and admin GCash data
                    const senderGCash = gcashData.gcash.find(gcash => gcash.userUid === matchedUser.uid);
                    const receiverGCash = gcashData.gcash.find(gcash => gcash.userUid === user.uid);

                    if (!senderGCash || !receiverGCash) {
                        console.error('GCash data not found for user or admin.');
                        return;
                    }

                    // Bind Send Funds button click event
                    document.getElementById('sendFundsBtn').addEventListener('click', () => {
                        const amountToSend = parseFloat(document.getElementById('sendFundsInput').value);

                        if (isNaN(amountToSend) || amountToSend <= 0) {
                            alert('Please enter a valid amount.');
                            return;
                        }

                        // Ensure sender has enough balance
                        const senderBalance = parseFloat(senderGCash.cash);
                        if (senderBalance < amountToSend) {
                            alert('Insufficient funds.');
                            return;
                        }

                        fetch('https://earthph.sdevtech.com.ph/gCash/sendGCash', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                senderUid: matchedUser.uid,
                                receiverUid: user.uid,
                                amount: amountToSend
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message === 'GCash successfully sent.') {
                                alert('Funds sent successfully!');
                                window.location.reload();  // Reload the page to refresh GCash balances
                            } else {
                                alert(data.message || 'Something went wrong.');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('Error sending funds. Please try again later.');
                        });
                    });
                });
        
                adminTableBody.appendChild(row);
            }
        });
        
        // Filter GCash data based on the matched user role
        if (matchedUser.role === "Admin") {
            const adminGCash = gcashData.gcash.find(item => item.userUid === matchedUser.uid);
            const adminUser = usersData.users.find(user => user.uid === matchedUser.uid);
        
            if (adminGCash && adminUser) {
                const adminRow = document.createElement('tr');
                adminRow.innerHTML = `
                    <td>Your GCash (${adminUser.firstName} ${adminUser.lastName})</td>
                    <td>${adminUser.team}</td>
                    <td>${adminUser.role}</td>
                    <td>₱${parseFloat(adminGCash.cash || 0).toFixed(2)}</td>
                `;
                tableBody.appendChild(adminRow);
            }
        
            // Sort the users so Admins appear first
            const sortedUsers = usersData.users.sort((a, b) => {
                // Admins come first, then others
                if (a.role === "Admin" && b.role !== "Admin") return -1;
                if (a.role !== "Admin" && b.role === "Admin") return 1;
                return 0; // Maintain relative order for the same roles
            });
        
            // Log rows being appended for other users with GCash data
            sortedUsers.forEach(user => {
                if (user.uid !== matchedUser.uid) {
                    const gcash = gcashData.gcash.find(gcash => gcash.userUid === user.uid);
        
                    if (gcash) {
                        const row = document.createElement('tr');
                        row.innerHTML = ` 
                            <td>${user.firstName} ${user.lastName}</td>
                            <td>${user.team}</td>
                            <td>${user.role}</td>
                            <td>₱${parseFloat(gcash.cash || 0).toFixed(2)}</td>
                        `;
                        tableBody.appendChild(row);
                    }
                }
            });
        }
         else if (matchedUser.role === "teamLeader" || matchedUser.role === "agent") {
            const currentUserGCash = gcashData.gcash.find(item => item.userUid === matchedUser.uid);
            const currentUser = usersData.users.find(user => user.uid === matchedUser.uid);

            if (currentUserGCash && currentUser) {
                const currentUserRow = document.createElement('tr');
                currentUserRow.innerHTML = `
                    <td>Your GCash (${currentUser.firstName} ${currentUser.lastName})</td>
                    <td>${currentUser.team}</td>
                    <td>${currentUser.role}</td>
                    <td>₱${parseFloat(currentUserGCash.cash).toFixed(2) || '0'}</td>
                `;
                tableBody.appendChild(currentUserRow);
            }
        }

        // Log to check if modal is shown
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
