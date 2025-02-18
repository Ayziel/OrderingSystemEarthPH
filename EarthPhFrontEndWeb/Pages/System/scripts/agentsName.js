const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
console.log("userRole", userRole);
console.log("usertoken", usertoken);

// Fetch the users data from the server
fetch('https://earthph.sdevtech.com.ph/users/getUsers')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const users = data.users;

        // Filter users with the role "teamLeader"
        const teamLeaders = users.filter(user => user.role === 'teamLeader');

        // Clear previous data in the table body
        document.getElementById('agent-data').innerHTML = '';

        // Loop through each agent and populate the table rows
        users.forEach(user => {
            if (user.role !== 'agent') return; // Skip if the user is not an agent

            // Create a new row for each agent
            const row = document.createElement('tr');

            // Name (combine first and last names)
            const nameCell = document.createElement('td');
            nameCell.textContent = `${user.firstName} ${user.lastName}`;
            row.appendChild(nameCell);

            // Find the team leader for the current user's team
            const teamLeader = teamLeaders.find(leader => leader.team === user.team);
            const teamLeaderName = teamLeader ? `${teamLeader.firstName} ${teamLeader.lastName}` : 'Unknown';

            const teamLeaderCell = document.createElement('td');
            teamLeaderCell.textContent = user.team;
            row.appendChild(teamLeaderCell);

            // Status (Always ONLINE)
            const statusCell = document.createElement('td');
            statusCell.textContent = user.phoneNumber;
            row.appendChild(statusCell);

            const button = document.createElement('td');
            button.textContent = 'Click me';
            button.style.padding = '10px';
            button.style.backgroundColor = '#66bb6a';
            button.style.color = 'white';
            button.style.textAlign = 'center';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '5px';
            button.style.transition = 'background-color 0.3s ease';
            button.style.backgroundColor = 'green'; // Apply background color with !important

            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#28a745'; 
            });
            
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#66bb6a';
            });
            
            row.appendChild(button);

            // Add click event to open the modal with the user data
            row.onclick = function () {
                openModal(user);
            };

            // Append the row to the table body
            document.getElementById('agent-data').appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert('Failed to fetch agent data. Please check your server.');
    });

    
// Function to open modal and populate data
function openModal(user) {
    // Populate modal with user data
    document.getElementById('modal-firstName').textContent = user.firstName;
    document.getElementById('modal-lastName').textContent = user.lastName;
    document.getElementById('modal-phoneNumber').textContent = user.phoneNumber;
    document.getElementById('modal-email').textContent = user.email;
    document.getElementById('modal-team').textContent = user.team;  // NOT EDITABLE
    document.getElementById('modal-role').textContent = user.role;  // NOT EDITABLE
    document.getElementById('modal-address').textContent = user.address;

    // Show the modal
    document.getElementById('userModal').style.display = "flex";

    // Reset buttons
    document.getElementById('edit-button').style.display = 'block';
    document.getElementById('save-button').style.display = 'none';

    // Set button functionalities
    document.getElementById('edit-button').onclick = enableEditing;
    document.getElementById('save-button').onclick = function () {
        console.log("Saving data for user:", user._id);
        saveUpdatedData(user._id);
    };
}

// Enable editing for specific fields
function enableEditing() {
    replaceTextWithInput('modal-firstName');
    replaceTextWithInput('modal-lastName');
    replaceTextWithInput('modal-phoneNumber');
    replaceTextWithInput('modal-email');
    replaceTextWithInput('modal-address');

    // Hide Edit button, Show Save button
    document.getElementById('edit-button').style.display = 'none';
    const saveButton = document.getElementById('save-button');
    saveButton.style.display = 'block';
    saveButton.removeAttribute('disabled');  // ✅ Enable save button
}

// Function to replace text with an input field (only for editable fields)
function replaceTextWithInput(id) {
    const span = document.getElementById(id);
    const text = span.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = text;
    input.id = id;
    span.replaceWith(input);
}

// Function to revert input fields back to spans
function revertInputToSpan(id, value) {
    const input = document.getElementById(id);
    const span = document.createElement('span');
    span.id = id;
    span.textContent = value;
    input.replaceWith(span);
}

function saveUpdatedData(userId) {
    if (!userId) {
        alert("User ID is missing.");
        console.error("Error: userId is undefined or null.");
        return;
    }

    const updatedUser = {
        firstName: document.getElementById('modal-firstName')?.value?.trim() || "",
        lastName: document.getElementById('modal-lastName')?.value?.trim() || "",
        phoneNumber: document.getElementById('modal-phoneNumber')?.value?.trim() || "",
        workPhone: document.getElementById('modal-workPhone')?.value?.trim() || "",
        email: document.getElementById('modal-email')?.value?.trim() || "",
        address: document.getElementById('modal-address')?.value?.trim() || "",
        team: document.getElementById('modal-team')?.textContent || "",  // Non-editable
        role: document.getElementById('modal-role')?.textContent || "",  // Non-editable
        userName: document.getElementById('modal-userName')?.value?.trim() || "",
        tin: document.getElementById('modal-tin')?.value?.trim() || "",
        uid: document.getElementById('modal-uid')?.value?.trim() || "",
    };

    console.log("Updating user:", userId, updatedUser);

    if (!usertoken) {
        alert("User token is missing.");
        console.error("Error: User token is missing.");
        return;
    }

    fetch(`https://earthph.sdevtech.com.ph/users/updateUser/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
        },
        body: JSON.stringify(updatedUser)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        console.log("Server Response:", data);
        alert('User updated successfully');

        // Update displayed values
        for (const key in updatedUser) {
            if (updatedUser[key]) {
                document.getElementById(`modal-${key}`).textContent = updatedUser[key];
            }
        }

        // Reset buttons
        document.getElementById('edit-button').style.display = 'block';
        document.getElementById('save-button').style.display = 'none';

        // Close modal
        document.getElementById('userModal').style.display = 'none';
    })
    .catch(error => {
        console.error("Error updating user:", error);
        alert(`Failed to update user: ${error.message || 'Unknown error'}`);
    });
}


// Close modal when clicking the close button
document.querySelector('.close').onclick = function () {
    document.getElementById('userModal').style.display = "none";
}

// Close modal when clicking outside
window.onclick = function (event) {
    if (event.target === document.getElementById('userModal')) {
        document.getElementById('userModal').style.display = "none";
    }
}

// Function to export data
function exportUserData() {
    fetch('https://earthph.sdevtech.com.ph/users/getUsers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const users = data.users;

            // Filter users with the role "agent"
            const agents = users.filter(user => user.role === 'agent');

            // Prepare the headers based on the keys you want to export
            const headers = ["First Name", "Last Name", "Phone Number", "Email", "Team", "Role"];

            // Prepare the data by mapping the agents to the format
            const formattedData = agents.map(user => [
                user.firstName,
                user.lastName,
                user.phoneNumber,
                user.email,
                user.team,
                user.role
            ]);

            // Add headers as the first row
            formattedData.unshift(headers);

            // Create a worksheet from the data
            const ws = XLSX.utils.aoa_to_sheet(formattedData);

            // Create a workbook with the worksheet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "User Data");

            // Export the workbook to an Excel file
            XLSX.writeFile(wb, 'User_Data.xlsx');
        })
        .catch(error => {
            console.error('Error exporting data:', error);
            alert('Failed to export user data. Please try again later.');
        });
}

// Add event listener to export button
document.getElementById('export-btn').addEventListener('click', exportUserData);
