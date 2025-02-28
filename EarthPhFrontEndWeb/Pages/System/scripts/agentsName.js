const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://earthph.sdevtech.com.ph/users/getUsers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Retrieve matchedUser from localStorage
            const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));

            if (!matchedUser) {
                console.error('Matched user not found in local storage.');
                return;
            }

            let agents;

            // Apply filter only if matchedUser is a teamLeader
            if (matchedUser.role === 'teamLeader') {
                agents = data.users.filter(user => user.role === 'agent' && user.team === matchedUser.team);
            } else {
                agents = data.users.filter(user => user.role === 'agent');
            }

            // Initialize pagination
            $('#pagination-container').pagination({
                dataSource: agents,
                pageSize: 10, // Number of users per page
                showPageNumbers: true,
                showPrevious: true,
                showNext: true,
                callback: function (data, pagination) {
                    populateUsers(data); // Call populateUsers with paginated data
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Failed to fetch agent data. Please check your server.');
        });
});
/**
 * Populates the users table with the provided data
 * @param {Array} users - List of users to display
 */
function populateUsers(users) {
    const userTableBody = document.getElementById('agent-data');

    if (!userTableBody) {
        console.error("Error: Element with ID 'agent-data' not found.");
        return;
    }

    userTableBody.innerHTML = ''; // Clear previous data

    users.forEach(user => {
        const row = document.createElement('tr');

        // Name (combine first and last names)
        const nameCell = document.createElement('td');
        nameCell.textContent = `${user.firstName} ${user.lastName}`;
        row.appendChild(nameCell);

        // Phone Number
        const adminCell = document.createElement('td');
        adminCell.textContent = user.phoneNumber;
        row.appendChild(adminCell);

        // Status (Team)
        const statusCell = document.createElement('td');
        statusCell.textContent = user.team;
        row.appendChild(statusCell);

        // View Button
        const buttonCell = document.createElement('td');
        const button = document.createElement('div');
        button.textContent = 'View';
        buttonCell.classList.add('view-button');

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            openModal(user);
        });

        buttonCell.appendChild(button);
        row.appendChild(buttonCell);

        row.addEventListener('click', () => openModal(user));

        userTableBody.appendChild(row);
    });
}


// Function to open modal and populate data
function openModal(user) {
    // Populate modal with user data
    document.getElementById('modal-firstName').textContent = user.firstName;
    document.getElementById('modal-lastName').textContent = user.lastName;
    document.getElementById('modal-phoneNumber').textContent = user.phoneNumber;
    document.getElementById('modal-email').textContent = user.email;
    document.getElementById('modal-team').textContent = user.team;  
    document.getElementById('modal-role').textContent = user.role;  
    document.getElementById('modal-address').textContent = user.address;
    document.getElementById('modal-password').textContent = user.password;
    

    // Show the modal
    document.getElementById('userModal').style.display = "flex";

    // Reset buttons
    if (userRole === 'agent') {
        document.getElementById('edit-button').style.display = 'none';
    } else {
        document.getElementById('edit-button').style.display = 'block';
    }
 
    document.getElementById('save-button').style.display = 'none';

    // Set button functionalities
    document.getElementById('edit-button').onclick = enableEditing;
    document.getElementById('save-button').onclick = function () {
        saveUpdatedData(user._id);
    };
    const deleteButton = document.getElementById('delete-button');
    if (userRole === 'agent') {
        deleteButton.style.display = 'none';
    }
    
    deleteButton.onclick = function () {
        deleteUser(user._id);
    };
}

function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    fetch(`https://earthph.sdevtech.com.ph/users/deleteUser/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${usertoken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('User deleted successfully!');
            document.getElementById('userModal').style.display = 'none';
            window.location.reload(); // Refresh to update the user list
        } else {
            throw new Error('Failed to delete user.');
        }
    })
    .catch(error => {
        console.error('Error deleting user:', error);
        alert(`Error: ${error.message}`);
    });
}
// Enable editing for specific fields
function enableEditing() {
    replaceTextWithInput('modal-firstName');
    replaceTextWithInput('modal-lastName');
    replaceTextWithInput('modal-phoneNumber');
    replaceTextWithInput('modal-email');
    replaceTextWithInput('modal-address');
    replaceTextWithInput('modal-password');
    replaceTextWithDropdown('modal-team', [
        { label: 'Betta', value: 'Betta' },
        { label: 'Alpha', value: 'Alpha' },
        { label: 'Gamma', value: 'Gamma' },
        { label: 'Delta', value: 'Delta' }
    ]);
    replaceTextWithDropdown('modal-role', [
        { label: 'Agent', value: 'agent' },
        { label: 'Team Leader', value: 'teamLeader' },
        { label: 'Manager', value: 'manager' },
        { label: 'Admin', value: 'admin' }
    ]);

    // Hide Edit button, Show Save button
    document.getElementById('edit-button').style.display = 'none';
    const saveButton = document.getElementById('save-button');
    saveButton.style.display = 'block';
    saveButton.removeAttribute('disabled');  // ✅ Enable save button
}
// Function to replace text with an input field (only for editable fields)

function replaceTextWithDropdown(id, options) {
    const span = document.getElementById(id);
    const selectedValue = span.textContent.trim();

    const select = document.createElement('select');
    select.id = id;

    // Populate dropdown with options
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        if (option.label === selectedValue || option.value === selectedValue) {
            optionElement.selected = true;
        }
        select.appendChild(optionElement);
    });

    span.replaceWith(select);
}
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
        team: document.getElementById('modal-team')?.value?.trim() || "",
        role: document.getElementById('modal-role')?.value?.trim() || "",
        userName: document.getElementById('modal-userName')?.value?.trim() || "",
        tin: document.getElementById('modal-tin')?.value?.trim() || "",
        uid: document.getElementById('modal-uid')?.value?.trim() || "",
        password:document.getElementById('modal-password')?.value?.trim() || "",
    };

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
        window.location.reload();
    })
    .catch(error => {
        console.error("Error updating user:", error);
        alert(`Failed to update user: ${error.message || 'Unknown error'}`);
    });
}


// Close modal when clicking the close button
document.querySelector('.close').onclick = function () {
    document.getElementById('userModal').style.display = "none";
    window.location.reload();
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

            // Filter users with the role "Admin"
            const admins = users.filter(user => user.role === 'Admin');

            // Prepare the headers based on the keys you want to export
            const headers = ["First Name", "Last Name", "Phone Number", "Email", "Team", "Role"];

            // Prepare the data by mapping the admins to the format
            const formattedData = admins.map(user => [
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
document.getElementById("modal-password").style.webkitTextSecurity = "disc";  // Initially hide the password
