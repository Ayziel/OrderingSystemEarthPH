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
        const price = Math.ceil(parseFloat(document.querySelector('input[placeholder="Enter Price"]').value));
        const quantity = 1;
    
        // Get the selected store name and UID
        const storeSelect = document.querySelector('#store-name');
        const storeName = storeSelect.value;
        const storeUid = storeSelect.options[storeSelect.selectedIndex]?.getAttribute('data-uid'); // Get the UID from the selected option
    
        const uid = uuid.v4();
    
        // Handle image upload (if any)
        let productImage = null;
        if (productImageInput.files.length > 0) {
            const file = productImageInput.files[0];
            productImage = await convertToBase64(file);
        }
    
        // Create a data object to send in the request
        const productData = {
            uid,
            productSKU,
            productName,
            productDescription,
            brand,
            productCategory,
            manufacturer,
            storeName,
            storeUid, // Include store UID
            price,
            quantity,
            productImage, // This will be a Base64 string if an image is uploaded
        };
    
        console.log('Product Data to send:', productData);
    
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
    const originalValue = parseFloat(discountInput.value);

    // Update input box with the selected percentage value
    if (discountDropdown.value !== '') {
        discountInput.value = (originalValue * discountDropdown.value / 100).toFixed(2);
    }
}

function syncDiscountWithInput() {
    const discountDropdown = document.getElementById('discountDropdown');
    const discountInput = document.getElementById('discountInput');
    const originalValue = parseFloat(discountInput.value);

    // Update input box with the selected percentage value
    if (discountDropdown.value !== '' && discountDropdown.value !== '0') {
        discountInput.value = (originalValue * discountDropdown.value / 100).toFixed(2);
    } else {
        discountInput.value = originalValue.toFixed(2); // No discount applied
    }
}

function syncInputWithDropdown() {
    const discountDropdown = document.getElementById('discountDropdown');
    const discountInput = document.getElementById('discountInput');

    // If a custom value is entered, reset the dropdown to a blank option
    discountDropdown.value = 0;
}
  
// Function to fetch stores data from API
async function getStores() {
    try {
        const response = await fetch('https://earthph.sdevtech.com.ph/stores/getStores');
        if (response.ok) {
            const storesData = await response.json();
            console.log(storesData);  // Log data for debugging
            if (Array.isArray(storesData.stores)) {
                populateStoresDropdown(storesData.stores);
            } else {
                console.error('stores is not an array:', storesData.stores);
            }
        } else {
            console.error('Error fetching stores data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching stores data:', error);
    }
}

// Function to populate the dropdown with store data
function populateStoresDropdown(stores) {
    const storeSelect = document.getElementById('store-name');
    
    // Clear the current options (e.g., loading message)
    storeSelect.innerHTML = '<option value="">Select a store...</option>';
    
    // Populate dropdown with store data
    stores.forEach(store => {
        const option = document.createElement('option');
        option.value = store.name;  // Store name as the display value
        option.textContent = store.name; // Display store name
        option.setAttribute('data-uid', store.uid); // Include store.uid in a data attribute
        storeSelect.appendChild(option);
    });
}


// Call getStores function when the page loads
window.onload = function() {
    getStores();
}
