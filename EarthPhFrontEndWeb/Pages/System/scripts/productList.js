const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
console.log("userRole", userRole);
console.log("usertoken", usertoken);

// Function to truncate text for display
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('https://earthph.sdevtech.com.ph/products/getProduct') // Corrected route
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.products || data.products.length === 0) {
                console.log('No products found.');
                return;
            }

            // Populate the UI with the fetched products
            populateProducts(data.products);
        })
        .catch(error => console.error('Error fetching products:', error));
});

// Function to dynamically populate product data
function populateProducts(products) {
    const productList = document.getElementById('product-list');
    const modal = document.getElementById('modal-product');
    const closeModal = modal.querySelector('.close-product');

    // Modal content elements
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductDescription = document.getElementById('modal-product-description');
    const modalProductBrand = document.getElementById('modal-product-brand');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalProductDiscount = document.getElementById('modal-product-discount'); // Added discount modal field
    const editProductButton = document.getElementById('edit-product');
    const saveProductButton = document.getElementById('save-product');

    productList.innerHTML = ''; // Clear existing rows before populating

    let globalCounter = 1;

    products.forEach(product => {
        const row = document.createElement('tr');

        const priceWithDiscount = product.discount ? (product.price - (product.price * product.discount / 100)) : product.price;

        row.innerHTML = `
            <td>${globalCounter++}</td>
            <td>${truncateText(product.productName || 'N/A', 30)}</td>
            <td>${truncateText(product.productDescription || 'No description', 50)}</td>
            <td>${truncateText(product.brand || 'No brand', 30)}</td>
            <td>₱ ${priceWithDiscount ? priceWithDiscount.toFixed(2) : '0.00'}</td>
            <td>% ${product.discount ? product.discount.toFixed(2) : '0'}</td>
        `;

        row.addEventListener('click', () => {
            // When the product is clicked, populate the modal with its details
            modalProductName.textContent = product.productName || 'N/A';
            modalProductDescription.textContent = product.productDescription || 'No description';
            modalProductBrand.textContent = product.brand || 'No brand';
            modalProductPrice.textContent = `₱ ${priceWithDiscount ? priceWithDiscount.toFixed(2) : '0.00'}`; // Show discounted price in modal
            modalProductDiscount.value = product.discount || ''; // Display discount in modal input field

            modal.style.display = 'block'; // Show modal

            // Enable editing when the "Edit" button is clicked
            editProductButton.onclick = () => {
                modalProductName.contentEditable = true;
                modalProductDescription.contentEditable = true;
                modalProductBrand.contentEditable = true;
                modalProductPrice.contentEditable = true;
                modalProductDiscount.disabled = false; // Allow editing of discount
                editProductButton.style.display = 'none';  // Hide the edit button after clicking
                saveProductButton.style.display = 'inline';  // Show the save button
            };

            // Save the changes when the "Save" button is clicked
            saveProductButton.onclick = async () => {
                // Get the edited values
                const updatedProduct = {
                    productSKU: product.productSKU,  // Ensure the product SKU is passed along
                    productName: modalProductName.textContent,
                    productDescription: modalProductDescription.textContent,
                    brand: modalProductBrand.textContent,
                    price: parseFloat(modalProductPrice.textContent.replace('₱', '').trim()),
                    discount: parseFloat(modalProductDiscount.value) || 0 // Get the discount value
                };

                try {
                    const response = await fetch('https://earthph.sdevtech.com.ph/products/updateProduct', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${usertoken}`  // Send token for authentication
                        },
                        body: JSON.stringify(updatedProduct)  // Send the updated product data
                    });

                    const data = await response.json();

                    if (response.ok) {
                        console.log('Product updated:', data);
                        modal.style.display = 'none';  // Close modal on successful update
                    } else {
                        console.error('Error updating product:', data.message);
                    }
                } catch (error) {
                    console.error('Error updating product:', error);
                }
            };
        });

        productList.appendChild(row);
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', event => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Example function to update the product data
function updateProductData(productId, updatedProduct) {
    // Here, you would typically make an API call to update the product data
    // For now, we're just logging the updated product
    console.log(`Updating product ${productId}:`, updatedProduct);
}
