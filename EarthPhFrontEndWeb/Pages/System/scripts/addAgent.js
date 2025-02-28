

const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');


document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');

    userForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the form from refreshing the page

        // Capture the form data
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const workPhone = document.getElementById('workPhone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value; // New field
        const tin = document.getElementById('tin').value;         // New field
        const team = document.getElementById('team').value;
        const userName = document.getElementById('userName').value;
        const password = document.getElementById('password').value;
        const repeatPassword = document.getElementById('repeat_password').value;
        const role = document.getElementById('role').value;
        const area = document.getElementById('area').value;
        const uid = uuid.v4();

        // Validate fields
        if (!firstName || !lastName || !phoneNumber || !workPhone || !email || !address || !tin || !team || !userName || !password || !repeatPassword || !role) {
            console.log("Form validation failed: Missing required fields");
            alert("Please fill in all fields.");
            return;
        }
        console.log("Validation passed: All required fields are filled.");

        if (password !== repeatPassword) {
            console.log("Password mismatch: Passwords do not match");
            alert("Passwords do not match. Please try again.");
            return;
        }
        console.log("Password match: Passwords are the same.");

        const usersResponse = await fetch('https://earthph.sdevtech.com.ph/users/getUsers');
        const usersData = await usersResponse.json();

        let nextUserId = 1;
        if (Array.isArray(usersData) && usersData.length > 0) {
            const userIds = usersData.map(user => parseInt(user.id)).filter(num => !isNaN(num));
            nextUserId = (Math.max(...userIds) || 0) + 1;
        }
        

        // Create a data object to send in the request
        const userData = { 
            uid,
            firstName, 
            lastName, 
            phoneNumber, 
            workPhone, 
            email, 
            address,
            tin,
            team, 
            userName, 
            password, 
            role,
            area,
            id: nextUserId // Assign the next agent ID
        };

        console.log("Captured Form Data:", {
          firstName, lastName, phoneNumber, workPhone, email, address, tin, team, userName, password, role, uid
        });

        // Set headers with auth token if available
        const headers = {
            'Content-Type': 'application/json',
        };

        if (usertoken) {
            headers['Authorization'] = `Bearer ${usertoken}`;
            console.log('Authorization header set: ', `Bearer ${usertoken}`);
        } else {
            console.log('No auth token found, authorization header not set');
        }

        try {
            console.log("Sending request to create user...");
            const response = await fetch('https://earthph.sdevtech.com.ph/users/createUser', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(userData), // Convert the data to JSON
            });

            const result = await response.json();
            console.log("Response from server:", result);
            console.log("Response status:", response.status);

            if (response.ok) {
                console.log('User created successfully');
                alert('User created successfully');

                // Now, create GCash for the user
                console.log("Initializing GCash creation...");
                const gcashData = { userUid: uid, balance: 0 };
                const gcashResponse = await fetch('https://earthph.sdevtech.com.ph/gCash/createGCash', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(gcashData),
                });

                const gcashResult = await gcashResponse.json();
                console.log("GCash Response from server:", gcashResult);
                console.log("GCash Response status:", gcashResponse.status);

                if (gcashResponse.ok) {
                    console.log('GCash created successfully');
                    alert('GCash initialized successfully for the user.');
                } else {
                    console.error('Error creating GCash:', gcashResult.message || 'No message');
                    alert(`GCash creation failed: ${gcashResult.message || 'Unknown error'}`);
                }
            } else {
                console.log('Error creating user:', result.message || 'No message');
                alert('Error creating user: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error with fetch request:', error);
            alert('There was an error with the request.');
        }
    });
    
    // populateAreas.js

// Fetch and populate the area dropdown on page load
window.onload = function () {
    populateAreaDropdown();
    populateTeamDropdown()
};

// Function to fetch areas from the backend and populate the select dropdown
function populateAreaDropdown() {
    fetch('https://earthph.sdevtech.com.ph/area/getAreas') // Replace with your actual endpoint
        .then(response => response.json())
        .then(data => {
            const areaSelect = document.getElementById("area");
            areaSelect.innerHTML = ''; // Clear current options

            // Add a default option
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            defaultOption.textContent = "Select an area";
            areaSelect.appendChild(defaultOption);

            // Loop through the fetched areas and create option elements
            data.areas.forEach(area => {
                const option = document.createElement("option");
                option.value = area.area;  // Value to be sent in the form
                option.textContent = `${area.area}`; // Display the area and its code
                areaSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching areas:', error);
            alert('Error fetching areas. Please try again.');
        });
}

function populateTeamDropdown() {
    fetch('https://earthph.sdevtech.com.ph/team/getTeam') // Replace with your actual endpoint for teams
        .then(response => response.json())
        .then(data => {
            const teamSelect = document.getElementById("team");
            teamSelect.innerHTML = ''; // Clear current options

            // Add a default option
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            defaultOption.textContent = "Select a team";
            teamSelect.appendChild(defaultOption);

            // Loop through the fetched teams and create option elements
            if (data.teams && data.teams.length > 0) {
                data.teams.forEach(team => {
                    const option = document.createElement("option");
                    option.value = team.teamName;  // Value to be sent in the form
                    option.textContent = team.teamName; // Display the team name
                    teamSelect.appendChild(option);
                });
            } else {
                const noTeamsOption = document.createElement("option");
                noTeamsOption.disabled = true;
                noTeamsOption.textContent = "No teams available";
                teamSelect.appendChild(noTeamsOption);
            }
        })
        .catch(error => {
            console.error('Error fetching teams:', error);
            alert('Error fetching teams. Please try again.');
        });
}

});
