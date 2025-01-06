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

        // Create a data object to send in the request
        const userData = { 
            firstName, 
            lastName, 
            phoneNumber, 
            workPhone, 
            email, 
            address,  // Include address
            tin,      // Include TIN
            team, 
            userName, 
            password, 
            role 
        };

        console.log("Captured Form Data:", {
          firstName, lastName, phoneNumber, workPhone, email, address, tin, team, userName, password, role
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
