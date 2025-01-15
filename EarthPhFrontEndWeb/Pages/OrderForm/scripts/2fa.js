const sendCodeButton = document.getElementById('sendCode');
const verifyButton = document.getElementById('verifyButton');
const phoneInput = document.getElementById('phone');
const verificationCodeInput = document.getElementById('verificationCode');

// API URL (replace with Movider API URL)
const API_URL = 'https://api.movider.co/sms/verify';  // Example URL for Movider

// Step 1: Send SMS verification code
sendCodeButton.addEventListener('click', async () => {
    const phone = phoneInput.value.trim();

    if (!phone) {
        alert('Please enter a valid phone number.');
        return;
    }

    try {
        // Send SMS via Movider API (change URL and parameters accordingly)
        const response = await fetch(API_URL + '/send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MOVIDER_API_KEY}` // Use your API key
            },
            body: JSON.stringify({
                phone_number: phone
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Verification code sent to your phone.');
            verificationCodeInput.disabled = false;
            verifyButton.disabled = false;
        } else {
            alert('Error sending code. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error. Please try again later.');
    }
});

// Step 2: Verify the code
verifyButton.addEventListener('click', async (event) => {
    event.preventDefault();
    
    const phone = phoneInput.value.trim();
    const verificationCode = verificationCodeInput.value.trim();

    if (!verificationCode) {
        alert('Please enter the verification code.');
        return;
    }

    try {
        // Send the verification code to Movider for verification
        const response = await fetch(API_URL + '/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MOVIDER_API_KEY}` // Use your API key
            },
            body: JSON.stringify({
                phone_number: phone,
                verification_code: verificationCode
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Phone number verified successfully!');
            // Proceed to your next action (like redirecting, etc.)
        } else {
            alert('Invalid verification code. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Verification failed. Please try again later.');
    }
});
