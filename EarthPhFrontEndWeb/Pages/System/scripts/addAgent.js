

const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
console.log("userRole", userRole);
console.log("usertoken", usertoken);

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

        const agents = usersData.filter(user => user.role === "Agent");

        let nextAgentId = 1;
        if (agents.length > 0) {
            const agentIds = agents.map(agent => parseInt(agent.id)).filter(num => !isNaN(num));
            nextAgentId = (Math.max(...agentIds) || 0) + 1;
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
            id: nextAgentId // Assign the next agent ID
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
                body: JSON.stringify(userData) // Convert the data to JSON
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
});
