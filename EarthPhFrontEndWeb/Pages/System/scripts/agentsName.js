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
    document.getElementById('modal-firstName').value = user.firstName;
    document.getElementById('modal-lastName').value = user.lastName;
    document.getElementById('modal-phoneNumber').value = user.phoneNumber;
    document.getElementById('modal-email').value = user.email;
    document.getElementById('modal-team').value = user.team;
    document.getElementById('modal-role').value = user.role;

    // Show the modal
    document.getElementById('userModal').style.display = "flex";

    // Enable editing on the fields when Edit is clicked
    document.getElementById('edit-button').onclick = function() {
        enableEditing();
    };

    // Save updated data to the database
    document.getElementById('save-button').onclick = function() {
        saveUpdatedData(user.id);  // Send updated data for saving
    };
}

// Close the modal when the close button is clicked
document.querySelector('.close').onclick = function () {
    document.getElementById('userModal').style.display = "none";
}


// Enable editing functionality
function enableEditing() {
    // Make the inputs editable
    const inputs = document.querySelectorAll('#userModal input');
    inputs.forEach(input => {
        input.readOnly = false;
    });

    // Enable the save button
    document.getElementById('save-button').disabled = false;

    // Change the edit button to 'Cancel' if desired
    document.getElementById('edit-button').style.display = 'none';
    document.getElementById('cancel-button').style.display = 'block';
}

// Function to save the updated user data
function saveUpdatedData(userId) {
    const updatedUser = {
        firstName: document.getElementById('modal-firstName').value,
        lastName: document.getElementById('modal-lastName').value,
        phoneNumber: document.getElementById('modal-phoneNumber').value,
        email: document.getElementById('modal-email').value,
        team: document.getElementById('modal-team').value,
        role: document.getElementById('modal-role').value
    };

    fetch(`https://earthph.sdevtech.com.ph/users/updateUser/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`  // Include token if needed for authentication
        },
        body: JSON.stringify(updatedUser)
    })
    .then(response => response.json())
    .then(data => {
        alert('User updated successfully');
        document.getElementById('userModal').style.display = 'none';
        location.reload();  // Optionally reload the page to reflect changes
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert('Failed to update user');
    });
}

// Close the modal when the close button is clicked
document.querySelector('.close').onclick = function () {
    document.getElementById('userModal').style.display = "none";
}

// Close the modal if the user clicks outside of it
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
