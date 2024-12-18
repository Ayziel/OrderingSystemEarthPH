const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
console.log("userRole", userRole);
console.log("usertoken", usertoken);

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.querySelector('.form');
    
    // Product Image File Input
    const productImageInput = document.getElementById('productImageInput');
    
    // Handle form submission
    productForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the form from refreshing the page
        
        // Capture the form data
        const productSKU = document.querySelector('input[placeholder="Enter"]').value;
        const productName = document.querySelector('input[placeholder="Enter product name"]').value;
        const productDescription = document.querySelector('input[placeholder="Enter product description"]').value;
        const brand = document.querySelector('input[placeholder="Enter brand name"]').value;
        const productCategory = document.querySelector('select').value;
        const manufacturer = document.querySelector('input[placeholder="Enter manufacturer"]').value;
        const price = document.querySelector('input[placeholder="Enter Price"]').value;
        const quantity = document.querySelector('input[placeholder="Enter Quantity"]').value;

        // Handle image upload (if any)
        let productImage = null;
        if (productImageInput.files.length > 0) {
            const file = productImageInput.files[0];
            productImage = await convertToBase64(file);
        }

        // Create a data object to send in the request
        const productData = {
            productSKU,
            productName,
            productDescription,
            brand,
            productCategory,
            manufacturer,
            price,
            quantity,
            productImage,  // This will be a Base64 string if an image is uploaded
        };

        try {
            const response = await fetch('https://earthph.sdevtech.com.ph/products/createProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData), // Convert the data to JSON
            });

            const result = await response.json();
            
            if (response.ok) {
                alert('Product created successfully');
                // Optionally, reset the form after successful submission
                productForm.reset();
            } else {
                alert('Error creating product: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error with the request.');
        }
    });
});

// Function to convert image file to Base64 string
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


function syncDiscountWithInput() {
    const discountDropdown = document.getElementById('discountDropdown');
    const discountInput = document.getElementById('discountInput');
  
    // Update input box with the selected percentage value
    if (discountDropdown.value !== '') {
        discountInput.value = (discountDropdown.value) ;
    }
  }
  
  function syncInputWithDropdown() {
    const discountDropdown = document.getElementById('discountDropdown');
    const discountInput = document.getElementById('discountInput');
  
    // If a custom value is entered, reset the dropdown to a blank option
    discountDropdown.value = '';
  }
  