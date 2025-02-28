const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
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

                    window.location.href = 'https://earthhomecareph.astute.services/System/index.html'; // Desktop version URL
                
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


let deferredPrompt; // This will store the 'beforeinstallprompt' event

// Listen for the 'beforeinstallprompt' event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default installation prompt from showing automatically
    e.preventDefault();
    // Store the event to trigger it later
    deferredPrompt = e;

    // Show the custom install button if it's not installed yet
    document.getElementById('installButton').style.display = 'block';
});

// Handle the install button click
document.getElementById('installButton').addEventListener('click', () => {
    // Check if deferredPrompt is available (to prevent errors if it's undefined)
    if (deferredPrompt) {
        // Show the installation prompt when the user clicks the button
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            // Reset the deferred prompt to null after the user responds
            deferredPrompt = null;
        });
    } else {
        console.log("Install prompt is not available.");
    }
});

// Event to hide the install button if the app is already installed
window.addEventListener('appinstalled', () => {
    // Hide the install button after installation
    document.getElementById('installButton').style.display = 'none';
});
