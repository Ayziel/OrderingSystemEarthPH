const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
console.log("userRole", userRole);
console.log("usertoken", usertoken);

document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
  
    userForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the form from refreshing the page
        
        // Capture the form data
        const storeAddress = document.getElementById('storeAddress').value;
        const storeName = document.getElementById('storeName').value;
        const status = document.getElementById('role').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const email = document.getElementById('email').value;

        // Check if any required fields are empty
        if (!storeAddress || !storeName || !status || !firstName || !lastName || !phoneNumber || !email) {
            alert("Please fill in all fields.");
            return;
        }

        // Convert phone numbers to numbers (ensure they're treated as numeric values)
        const parsedPhoneNumber = parseInt(phoneNumber, 10);

        // Create a data object to send in the request (removed workPhone)
        const storeData = {
            storeAddress,
            storeName,
            status,
            firstName,
            lastName,
            phoneNumber: parsedPhoneNumber,  // Use parsed phone number here
            email
          };
          
        
        
        // Log the data being sent for debugging
        console.log('Request Body:', storeData);

        try {
            const response = await fetch('https://earthph.sdevtech.com.ph/stores/createOrUpdateStore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`
                },
                body: JSON.stringify(storeData) // Convert the data to JSON
            });

            const result = await response.json();
            
            if (response.ok) {
                alert('Store created successfully');
            } else {
                alert('Error creating store: ' + result.message);
            }
        } catch (error) {
            if (error.response) {
                console.error('API Error Response:', error.response);
            } else {
                console.error('Error:', error);
            }
            alert('There was an error with the request.');
        }
    });
});
