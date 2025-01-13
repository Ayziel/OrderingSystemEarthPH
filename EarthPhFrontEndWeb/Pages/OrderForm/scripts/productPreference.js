document.getElementById('submit-button').addEventListener('click', async () => {
    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);

    // Collect data from the form
    const surveyData = {
        insectControl: formData.get('insectControl'),
        rodentControl: formData.get('rodentControl'),
        fabricSpray: formData.get('fabricSpray'),
        airConCleaner: formData.get('airConCleaner'),
        petCare: formData.get('petCare'),
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
            form.reset(); // Reset the form after submission
        } else {
            alert('Failed to submit survey. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting survey:', error);
        alert('An error occurred. Please try again.');
    }

    window.location.href = "https://earthhomecareph.astute.services/OrderForm/Order-Info.html";
});

// Function to get selected products from the form (modify based on your form elements)
function getSelectedProducts() {
    // Example: Assuming there are checkboxes or a multi-select dropdown for products
    const selectedProductCheckboxes = document.querySelectorAll('input[name="selectedProducts"]:checked');
    const selectedProducts = Array.from(selectedProductCheckboxes).map(checkbox => checkbox.value);
     alert('Survey has been submitted!');
  
    // Redirect to the order info page
  
    return selectedProducts;
    
}
