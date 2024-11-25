// Fetch the users data from the server
fetch('http://localhost:5001/users/getUsers')
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

        // Loop through each user and populate the table rows
        users.forEach(user => {
            // Create a new row for each user
            const row = document.createElement('tr');

            // Name (combine first and last names)
            const nameCell = document.createElement('td');
            nameCell.textContent = `${user.firstName} ${user.lastName}`;
            row.appendChild(nameCell);

            // Age (randomized between 25 and 35)
            const age = Math.floor(Math.random() * (35 - 25 + 1)) + 25;
            const ageCell = document.createElement('td');
            ageCell.textContent = age;
            row.appendChild(ageCell);

            // Team Leader based on the team
            let teamLeader = '';
            switch (user.team) {
                case 'Alpha':
                    teamLeader = 'Kharl Panganiban';
                    break;
                case 'Gamma':
                    teamLeader = 'Francesca Tengco';
                    break;
                case 'Betta':
                    teamLeader = 'Joy Madriaga';
                    break;
                case 'Delta':
                    teamLeader = 'Chris Soriaga';
                    break;
                default:
                    teamLeader = 'Unknown';
            }
            const teamLeaderCell = document.createElement('td');
            teamLeaderCell.textContent = teamLeader;
            row.appendChild(teamLeaderCell);

            // Status (Always ONLINE)
            const statusCell = document.createElement('td');
            statusCell.textContent = 'ONLINE';
            row.appendChild(statusCell);

            // Append the row to the table body
            document.getElementById('agent-data').appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        alert('Failed to fetch agent data. Please check your server.');
    });
