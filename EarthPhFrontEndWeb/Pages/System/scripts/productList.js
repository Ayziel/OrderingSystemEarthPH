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
    const modalProductId = document.getElementById('modal-product-id'); // NEW: Hidden element for productId
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductDescription = document.getElementById('modal-product-description');
    const modalProductBrand = document.getElementById('modal-product-brand');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalProductDiscount = document.getElementById('modal-product-discount');
    const editProductButton = document.getElementById('edit-product');
    const saveProductButton = document.getElementById('save-product');
    const productImageImage = document.getElementById('modal-product-image');

    productList.innerHTML = ''; // Clear existing rows before populating

    let globalCounter = 1;

    products.forEach(product => {
        const row = document.createElement('tr');
        row.setAttribute('data-product-id', product.productId); // Store product ID in dataset

        const priceWithDiscount = product.discount ? (product.price - (product.price * product.discount / 100)) : product.price;

        row.innerHTML = `
            <td class="table-data">${globalCounter++}</td>
            <td class="table-data">${truncateText(product.productName || 'N/A', 30)}</td>
            <td class="table-data">${truncateText(product.productDescription || 'No description', 50)}</td>
            <td class="table-data">${truncateText(product.brand || 'No brand', 30)}</td>
            <td class="table-data">₱ ${priceWithDiscount ? priceWithDiscount.toFixed(2) : '0.00'}</td>
            <td class="table-data">% ${product.discount ? product.discount.toFixed(2) : '0'}</td>
            <td class="open-cell">Open</td>
        `;

        // Styling for "Open" button
        const openCell = row.querySelector('.open-cell');
        openCell.style.padding = '10px';
        openCell.style.backgroundColor = '#66bb6a';
        openCell.style.color = 'white';
        openCell.style.textAlign = 'center';
        openCell.style.cursor = 'pointer';
        openCell.style.borderRadius = '5px';
        openCell.style.transition = 'background-color 0.3s ease';

        openCell.addEventListener('mouseover', () => {
            openCell.style.backgroundColor = '#28a745';
        });

        openCell.addEventListener('mouseout', () => {
            openCell.style.backgroundColor = '#66bb6a';
        });

        row.addEventListener('click', () => {
            // Populate modal with product details
            modalProductId.textContent = product.productId; // NEW: Store product ID in modal
            modalProductName.textContent = product.productName || 'N/A';
            modalProductDescription.textContent = product.productDescription || 'No description';
            modalProductBrand.textContent = product.brand || 'No brand';
            modalProductPrice.textContent = `₱ ${priceWithDiscount ? priceWithDiscount.toFixed(2) : '0.00'}`;
            modalProductDiscount.value = product.discount || '';

            modal.style.display = 'block';

            // Enable editing when "Edit" button is clicked
            editProductButton.onclick = () => {
                modalProductName.contentEditable = true;
                modalProductDescription.contentEditable = true;
                modalProductBrand.contentEditable = true;
                modalProductPrice.contentEditable = true;
                modalProductDiscount.disabled = false;
                editProductButton.style.display = 'none';
                saveProductButton.style.display = 'inline';
            };

            // Save changes when "Save" button is clicked
            saveProductButton.onclick = async () => {
                const updatedProduct = {
                    productId: modalProductId.textContent, // Use stored product ID
                    productName: modalProductName.textContent,
                    productDescription: modalProductDescription.textContent,
                    brand: modalProductBrand.textContent,
                    price: parseFloat(modalProductPrice.textContent.replace('₱', '').trim()),
                    discount: parseFloat(modalProductDiscount.value) || 0
                };

                try {
                    const response = await fetch('https://earthph.sdevtech.com.ph/products/updateProduct', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${usertoken}`
                        },
                        body: JSON.stringify(updatedProduct)
                    });

                    const data = await response.json();

                    if (response.ok) {
                        console.log('Product updated:', data);
                        modal.style.display = 'none';
                        window.location.reload();
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


// Ensure the delete button exists before adding an event listener
const deleteProductButton = document.getElementById('delete-product');

if (deleteProductButton) {
    deleteProductButton.addEventListener('click', async () => {
        // Get product ID from a hidden field or dataset attribute
        const modalProductIdElement = document.getElementById('modal-product-id');
        const modalProductId = modalProductIdElement ? modalProductIdElement.dataset.productId || modalProductIdElement.textContent : null;

        if (!modalProductId) {
            alert('No product selected to delete!');
            return;
        }

        // Confirm deletion
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`https://earthph.sdevtech.com.ph/products/deleteProduct/${modalProductId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${usertoken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete product.');
            }

            alert('Product deleted successfully!');

            // Close the modal safely
            const modal = document.getElementById('modal-product');
            if (modal) modal.style.display = 'none';

            location.reload(); // Refresh the page or update UI
        } catch (error) {
            console.error('Error deleting product:', error);
            alert(`Error: ${error.message}`);
        }
    });
}



function exportToExcel() {
    console.log("Exporting products to Excel...");

    fetch('https://earthph.sdevtech.com.ph/products/getProduct')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const products = data.products;

            // Prepare the headers based on the keys you want to export
            const headers = ["Product SKU", "Product Name", "Description", "Brand", "Category", "Price", "Discount", "Quantity"];

            // Prepare the data by mapping the products to the desired format
            const formattedData = products.map(product => [
                product.productSKU,  // SKU
                product.productName,  // Name
                product.productDescription,  // Description
                product.brand,  // Brand
                product.productCategory,  // Category
                `₱ ${product.price.toFixed(2)}`,  // Price
                `${product.discount}%`,  // Discount (as percentage)
                product.quantity  // Quantity
            ]);

            // Add headers as the first row
            formattedData.unshift(headers);

            // Create a worksheet from the data
            const ws = XLSX.utils.aoa_to_sheet(formattedData);

            // Create a workbook with the worksheet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Product Data");

            // Export the workbook to an Excel file
            XLSX.writeFile(wb, 'Product_Data.xlsx');
        })
        .catch(error => {
            console.error('Error exporting data:', error);
            alert('Failed to export product data. Please try again later.');
        });
}

// Add event listener to export button
document.getElementById('export-btn').addEventListener('click', exportToExcel);
