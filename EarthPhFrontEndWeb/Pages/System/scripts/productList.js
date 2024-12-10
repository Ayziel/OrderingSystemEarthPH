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

// Helper function to truncate text
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}



