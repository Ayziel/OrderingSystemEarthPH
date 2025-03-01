const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
let tin = '';

document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');

    userForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the form from refreshing the page

        // Capture the form data
        const storeAddress = document.getElementById('storeAddress').value;
        const storeName = document.getElementById('storeName').value;
        const status = document.getElementById('role').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const email = document.getElementById('email').value;
        const storeId = document.getElementById('storeId')?.value || null; // Check if updating

        const uid = storeId ? document.getElementById('uid').value : uuid.v4(); // Use existing UID if updating
        const guid = generateGUID(); // Generate GUID

        // Restrict input to only numbers and dashes, ensuring TIN format
        document.getElementById('tin').addEventListener('keypress', function (event) {
            if (!/[\d\-]/.test(event.key)) {
                event.preventDefault();
            }
        });

        // Check if any required fields are empty
        if (!storeAddress || !storeName || !status || !firstName || !lastName || !phoneNumber || !email || !tin) {
            alert("Please fill in all fields.");
            return;
        }

        // Convert phone numbers to numbers (ensure they're treated as numeric values)
        const parsedPhoneNumber = parseInt(phoneNumber, 10);

        // Create a data object
        const storeData = {
            storeAddress,
            storeName,
            status,
            firstName,
            lastName,
            phoneNumber: parsedPhoneNumber,
            email,
            uid,
            guid,  // Add GUID right after UID
            tin
        };

        // Decide whether to create or update the store
        let apiUrl = storeId
            ? `https://earthph.sdevtech.com.ph/stores/updateStore`
            : `https://earthph.sdevtech.com.ph/stores/createStore`;

        let method = storeId ? 'PUT' : 'POST';

        try {
            const response = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`
                },
                body: JSON.stringify(storeId ? { storeId, ...storeData } : storeData)
            });

            const result = await response.json();

            if (response.ok) {
                alert(storeId ? 'Store updated successfully' : 'Store created successfully');
                window.location.reload();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error with the request.');
        }
    });
});

// Generate GUID function
function generateGUID() {
    const date = new Date();
    const year = String(date.getFullYear()).slice(2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${year}${month}${day}${hour}${minute}${randomNum}`;
}

// Format TIN input
document.getElementById('tin').addEventListener('input', function (event) {
    let value = event.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    let formatted = '';

    for (let i = 0; i < value.length; i += 3) {
        if (formatted.length > 0) {
            formatted += '-';
        }
        formatted += value.substring(i, i + 3);
    }

    if (formatted.length > 15) {
        formatted = formatted.substring(0, 15);
    }

    event.target.value = formatted;
    tin = formatted;
});
