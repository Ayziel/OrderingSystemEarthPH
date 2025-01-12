const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
console.log("userRole", userRole);
console.log("usertoken", usertoken);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent form submission from refreshing the page

        // Capture the login data
        const userName = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Check if the fields are filled
        if (!userName || !password) {
            alert('Please fill in both fields.');
            return;
        }

        try {
            // Fetch the users data from the server
            const response = await fetch('https://earthph.sdevtech.com.ph/users/getUsers');
            const data = await response.json();
            const users = data.users;

            // Find the user with the provided username
            const user = users.find(u => u.userName === userName);

            if (!user) {
                alert('User not found.');
                return;
            }

            // Check if the entered password matches the user's password
            if (user.password === password) { // In production, this should be hashed comparison
                alert('Login successful');

                // Store the user data in localStorage
                localStorage.setItem('authToken', 'user-jwt-token'); // Store user JWT token
                localStorage.setItem('userName', user.userName);
                localStorage.setItem('userFullName', user.firstName + " " + user.lastName);
                localStorage.setItem('userTeam', user.team);
                localStorage.setItem('userID', user._id); // Store user ID (or token)
                localStorage.setItem('userRole', user.role); // Optionally store the role

                // Create the matched user data with all available information
                const matchedUser = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    workPhone: user.workPhone,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                    team: user.team,
                    userName: user.userName,
                    tin: user.tin,
                    password: user.password,
                    role: user.role,
                    address: user.address,
                    uid: user.uid, // Unique Identifier
                };

                // Save the full user data to localStorage
                localStorage.setItem('matchedUser', JSON.stringify(matchedUser));

                // Detect if the user is on a mobile device
                const isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;

                // Redirect based on device type
                if (isMobile) {
                    window.location.href = 'https://earthhomecareph.astute.services/OrderForm/Agent-Info.html'; // Mobile version URL
                } else {
                    window.location.href = 'https://earthhomecareph.astute.services/System/index.html'; // Desktop version URL
                }
            } else {
                alert('Incorrect password.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error with the login process.');
        }
    });
});

document.getElementById('togglePassword').addEventListener('change', function () {
    const passwordField = document.getElementById('password');
    if (this.checked) {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
});
