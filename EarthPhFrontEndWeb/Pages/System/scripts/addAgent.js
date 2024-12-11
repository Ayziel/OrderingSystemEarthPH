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
        const team = document.getElementById('team').value;
        const userName = document.getElementById('userName').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        const repeatPassword = document.getElementById('repeat_password').value;

        if (!firstName || !lastName || !phoneNumber || !workPhone || !email || !team || !userName || !password || !repeatPassword || !role) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== repeatPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        // Create a data object to send in the request
        const userData = { firstName, lastName, phoneNumber, workPhone, email, team, userName, password, role};
        
        console.log('Request Body:', userData);
        try {
            const response = await fetch('https://earthph.sdevtech.com.ph/users/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData) // Convert the data to JSON
            });

            const result = await response.json();
            
            if (response.ok) {
                alert('User created successfully');
            } else {
                alert('Error creating user: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error with the request.');
        }
    });
});
