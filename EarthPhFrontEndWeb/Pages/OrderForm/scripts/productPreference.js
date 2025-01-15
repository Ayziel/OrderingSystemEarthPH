let orderData = JSON.parse(localStorage.getItem('orderData'));
console.log("STORENAME TEST",orderData.storeName)

document.getElementById('surveyForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission (page refresh)
    let matchedUser = JSON.parse(localStorage.getItem('matchedUser'));
    let orderData = JSON.parse(localStorage.getItem('orderData'));
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);

    

    // Collect data from the form
    const surveyData = {
        insectControl: formData.get('insectControl'),
        rodentControl: formData.get('rodentControl'),
        fabricSpray: formData.get('fabricSpray'),
        airConCleaner: formData.get('airConCleaner'),
        petCare: formData.get('petCare'),
        userUid: matchedUser.uid,
        storeName: orderData.storeName,
        // Add selected products (you can update this part depending on your UI)
        selectedProducts: getSelectedProducts()
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
            // Redirect to the order info page after successful submission
             window.location.href = "https://earthhomecareph.astute.services/OrderForm/Order-Info.html";
        } else {
            alert('Failed to submit survey. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting survey:', error);
        alert('An error occurred. Please try again.');
    }
});

// Function to get selected products from the form (modify based on your form elements)
function getSelectedProducts() {
    // Example: Assuming there are checkboxes or a multi-select dropdown for products
    const selectedProductCheckboxes = document.querySelectorAll('input[name="selectedProducts"]:checked');
    const selectedProducts = Array.from(selectedProductCheckboxes).map(checkbox => checkbox.value);
    return selectedProducts;
}

const link = document.createElement("link");
link.rel = "manifest";
link.href = "/System/manifest.json";
document.head.appendChild(link);

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/System/service-worker.js")
        .then(() => console.log("Service Worker registered"))
        .catch((error) => console.log("Service Worker registration failed:", error));
}

// Listen for the "beforeinstallprompt" event
window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    const installPrompt = event;
    //document.getElementById("install-btn").style.display = "block";

    // document.getElementById("install-btn").addEventListener("click", () => {
    //     installPrompt.prompt();
    //     installPrompt.userChoice.then((choiceResult) => {
    //         if (choiceResult.outcome === "accepted") {
    //             console.log("User accepted the install prompt");
    //         } else {
    //             console.log("User dismissed the install prompt");
    //         }
    //     });
    // });
}); 