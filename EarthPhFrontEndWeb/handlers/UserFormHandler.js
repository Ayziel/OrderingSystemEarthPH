document.getElementById('userForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from refreshing the page
    
    // Get the values from the form fields
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const workPhone = document.getElementById('workPhone').value;
    const email = document.getElementById('email').value;
    const team = document.getElementById('team').value;

    // Prepare the user data object to send to the server
    const userData = { firstName, middleName, lastName, workPhone, phoneNumber, email, team };

    try {
        const response = await fetch('http://localhost:5001/users/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData) // Convert the user data to JSON
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
