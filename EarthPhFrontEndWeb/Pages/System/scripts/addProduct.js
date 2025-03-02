const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
const chosenStoresArray = [];

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
        const productDescription = document.querySelector('input[placeholder="Enter product Code"]').value;
        const brand = document.querySelector('input[placeholder="Enter brand name"]').value;
        const productCategory = document.querySelector('select').value;
        const manufacturer = document.querySelector('input[placeholder="Enter manufacturer"]').value;
        const price = parseFloat(document.querySelector('input[placeholder="Enter Price"]').value);
        const size = document.querySelector('input[placeholder="Enter Size"]').value;
        const free = parseFloat(document.querySelector('input[placeholder="Enter Free per bundle"]').value) || 0;
        const bundle = document.querySelector('input[placeholder="Enter Bundle"]').value || 0;
        // Get the selected store name and UID
        const storeSelect = document.querySelector('#store-name');
        const storeName = chosenStoresArray.map(store => store.name);  // Array of store names
        const storeUid = chosenStoresArray.map(store => store.uid);  
    
        const uid = uuid.v4();
    
        // Handle image upload (if any)
        let productImage = null;
        if (productImageInput.files.length > 0) {
            const file = productImageInput.files[0];
            productImage = await convertToBase64(file);
            // Show an alert confirming the image upload

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
            size,
            productImage, // This will be a Base64 string if an image is uploaded
            free,
            bundle
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
                location.reload(); // Reload the page after success
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

function populateStoresDropdown(stores) {
    const storeSelect = document.getElementById('store-name');
    
    // Clear the current options (e.g., loading message)
    storeSelect.innerHTML = '<option value="">Select a store...</option>';
    
    // Add "All Stores" as a hardcoded option with UID 0
    const allStoresOption = document.createElement('option');
    allStoresOption.value = '0';  // Hardcoded UID for "All Stores"
    allStoresOption.textContent = 'All Stores'; // Display the name "All Stores"
    storeSelect.appendChild(allStoresOption);

    // Populate dropdown with store data
    stores.forEach(store => {
        const option = document.createElement('option');
        option.value = store.uid;  // Store UID as the value
        option.textContent = store.name; // Display store name
        storeSelect.appendChild(option);
    });

    // Add event listener for selecting stores
    storeSelect.addEventListener('change', function () {
        addToChosenStores(storeSelect);
    });
}

function addToChosenStores(storeSelect) {
    const chosenStoresSelect = document.getElementById('store-chosen');
    const selectedOption = storeSelect.options[storeSelect.selectedIndex];

    if (!selectedOption || selectedOption.value === "") return; // Ignore if no store selected

    // Check if the store is already in the chosen stores array
    const existingStore = chosenStoresArray.find(
        store => store.uid === selectedOption.value
    );

    if (existingStore) {
        alert("This store is already added.");
        return;
    }

    // Add the store to the chosen stores array
    const newStore = {
        uid: selectedOption.value,
        name: selectedOption.textContent,
    };
    chosenStoresArray.push(newStore);

    // Add the selected store to the "Stores Chosen" dropdown
    const newOption = document.createElement('option');
    newOption.value = newStore.uid; // Store UID
    newOption.textContent = newStore.name; // Store Name
    chosenStoresSelect.appendChild(newOption);
    
    // Optional: Reset the "Choose a Store" dropdown
    storeSelect.value = "";
}


function removeFromChosenStores(uid) {
    const chosenStoresSelect = document.getElementById('store-chosen');

    // Remove the store from the chosen stores array
    const index = chosenStoresArray.findIndex(store => store.uid === uid);
    if (index !== -1) {
        chosenStoresArray.splice(index, 1);
    }

    // Remove the store from the dropdown
    const optionToRemove = Array.from(chosenStoresSelect.options).find(
        option => option.value === uid
    );
    if (optionToRemove) {
        chosenStoresSelect.removeChild(optionToRemove);
    }
}


function handleImageUpload(event) {
    const file = event.target.files[0]; // Get the selected file
    const feedbackElement = document.getElementById('imageFeedback'); // Red text element

    if (file) {
        feedbackElement.textContent = `Image "${file.name}" has been selected.`;
        feedbackElement.style.display = 'block'; // Show the red text
        feedbackElement.style.color = 'green'; // Change the text color to green
    } else {
        feedbackElement.textContent = '';
        feedbackElement.style.display = 'none'; // Hide the red text
    }
}

window.onload = function() {
    getStores();
}

