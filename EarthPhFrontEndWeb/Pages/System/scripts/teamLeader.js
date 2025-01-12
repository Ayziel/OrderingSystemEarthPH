const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
console.log("userRole", userRole);
console.log("usertoken", usertoken);

// Function to log all localStorage data
const logLocalStorageItems = () => {
    console.log('Logging localStorage contents:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`${key}: ${value}`);
    }
};

// Call the function to log localStorage contents
logLocalStorageItems();

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

        // Clear previous data in the table body
        document.getElementById('agent-data').innerHTML = '';

        // Filter users with the role "teamLeader"
        const teamLeaders = users.filter(user => user.role === 'teamLeader');

        // Loop through each team leader and populate the table rows
        teamLeaders.forEach(user => {
            // Create a new row for each team leader
            const row = document.createElement('tr');

            // Name (combine first and last names)
            const nameCell = document.createElement('td');
            nameCell.textContent = `${user.firstName} ${user.lastName}`;
            row.appendChild(nameCell);

            // Team Leader based on the team
            let teamLeader = user.phoneNumber;
            const teamLeaderCell = document.createElement('td');
            teamLeaderCell.textContent = teamLeader;
            row.appendChild(teamLeaderCell);

            // Status (Always ONLINE)
            const statusCell = document.createElement('td');
            statusCell.textContent = user.team;
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
            button.style.backgroundColor = 'green !important'; // Apply background color with !important

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
    document.getElementById('modal-firstName').textContent = user.firstName;
    document.getElementById('modal-lastName').textContent = user.lastName;
    document.getElementById('modal-phoneNumber').textContent = user.phoneNumber;
    document.getElementById('modal-email').textContent = user.email;
    document.getElementById('modal-team').textContent = user.team;
    document.getElementById('modal-role').textContent = user.role;

    // Show the modal
    document.getElementById('userModal').style.display = "flex";
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

            // Filter users with the role "teamLeader"
            const teamLeaders = users.filter(user => user.role === 'teamLeader');

            // Prepare the headers based on the keys you want to export
            const headers = ["First Name", "Last Name", "Phone Number", "Email", "Team", "Role"];

            // Prepare the data by mapping the teamLeaders to the format
            const formattedData = teamLeaders.map(user => [
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
