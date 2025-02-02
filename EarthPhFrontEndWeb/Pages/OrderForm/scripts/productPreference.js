let orderData = JSON.parse(localStorage.getItem('orderData'));
console.log("STORENAME TEST", orderData?.storeName);

document.getElementById('surveyForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page refresh

    let matchedUser = JSON.parse(localStorage.getItem('matchedUser'));
    let orderData = JSON.parse(localStorage.getItem('orderData'));
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);

    // Collect data from the form
    const surveyData = {
        lionTigerCoil: formData.get('lionTigerCoil'),
        bayconCoil: formData.get('bayconCoil'),
        otherBrandsCoil: formData.get('otherBrandsCoil'),
        arsCoil: formData.get('arsCoil'),
        userUid: matchedUser?.uid,
        storeName: orderData?.storeName,
    };

    console.log('Survey Data:', surveyData);

    try {
        const response = await fetch('https://earthph.sdevtech.com.ph/survey/createSurvey', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(surveyData),
        });

        const result = await response.json();
        console.log('Server Response:', result);

        if (response.ok) {
            alert('Survey submitted successfully!');
            // Redirect after successful submission
            window.location.href = "https://earthhomecareph.astute.services/OrderForm/Order-Info.html";
        } else {
            alert('Failed to submit survey. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting survey:', error);
        alert('An error occurred. Please try again.');
    }
});

// Add manifest link
const link = document.createElement("link");
link.rel = "manifest";
link.href = "/System/manifest.json";
document.head.appendChild(link);

// Register service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/System/service-worker.js")
        .then(() => console.log("Service Worker registered"))
        .catch((error) => console.log("Service Worker registration failed:", error));
}
