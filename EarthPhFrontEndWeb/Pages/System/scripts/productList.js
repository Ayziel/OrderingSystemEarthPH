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
    const productList = document.getElementById('product-list'); // Table body
    const modal = document.getElementById('modal-product');
    const closeModal = modal.querySelector('.close-product');
    
    // Modal content elements
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductDescription = document.getElementById('modal-product-description');
    const modalProductBrand = document.getElementById('modal-product-brand');
    const modalProductPrice = document.getElementById('modal-product-price');
    
    const saveButton = document.getElementById('save-product-btn');

    productList.innerHTML = ''; // Clear existing rows before populating

    let globalCounter = 1; // Global counter for SKUs

    products.forEach(product => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${globalCounter++}</td>
            <td>${truncateText(product.productName || 'N/A', 30)}</td>
            <td>${truncateText(product.productDescription || 'No description', 50)}</td>
            <td>${truncateText(product.brand || 'No brand', 30)}</td>
            <td>₱ ${product.price ? product.price.toFixed(2) : '0.00'}</td>
            <td><button class="edit-product-btn" data-id="${product._id}">Edit</button></td>
        `;

        // Add click event to open the product-specific modal with details
        row.addEventListener('click', () => {
            modalProductName.textContent = product.productName || 'N/A';
            modalProductDescription.textContent = product.productDescription || 'No description';
            modalProductBrand.textContent = product.brand || 'No brand';
            modalProductPrice.textContent = `₱ ${product.price ? product.price.toFixed(2) : '0.00'}`;
            modal.style.display = 'block'; // Show modal
        });

        productList.appendChild(row);
    });

    // Open the modal to edit product details
    const editButtons = document.querySelectorAll('.edit-product-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            const product = products.find(p => p._id === productId);

            // Make modal fields editable
            modalProductName.innerHTML = `<input type="text" value="${product.productName || ''}" id="edit-product-name">`;
            modalProductDescription.innerHTML = `<textarea id="edit-product-description">${product.productDescription || ''}</textarea>`;
            modalProductBrand.innerHTML = `<input type="text" value="${product.brand || ''}" id="edit-product-brand">`;
            modalProductPrice.innerHTML = `<input type="number" value="${product.price || 0}" id="edit-product-price">`;
            
            // Show the save button
            saveButton.style.display = 'inline-block';

            // Save button click event
            saveButton.onclick = () => {
                const updatedProduct = {
                    productName: document.getElementById('edit-product-name').value,
                    productDescription: document.getElementById('edit-product-description').value,
                    brand: document.getElementById('edit-product-brand').value,
                    price: parseFloat(document.getElementById('edit-product-price').value),
                };

                // Update the product in the database
                fetch(`https://earthph.sdevtech.com.ph/products/updateProduct/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}`,
                    },
                    body: JSON.stringify(updatedProduct),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Product updated:', data);
                    modal.style.display = 'none'; // Close modal
                    location.reload(); // Reload the page to reflect changes
                })
                .catch(error => console.error('Error updating product:', error));
            };
        });
    });

    // Close modal when the close button is clicked
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', event => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
