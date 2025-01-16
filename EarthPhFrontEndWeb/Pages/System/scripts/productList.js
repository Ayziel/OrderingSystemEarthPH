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
             <td class="open-cell">Open</td>
        `;

        // Design Hard Coded Rush implementation
            const openCell = row.querySelector('.open-cell');
            openCell.style.padding = '10px';
            openCell.style.backgroundColor = '#66bb6a'; // Lighter green
            openCell.style.color = 'white';
            openCell.style.textAlign = 'center';
            openCell.style.cursor = 'pointer';
            openCell.style.borderRadius = '5px';
            openCell.style.transition = 'background-color 0.3s ease';

            // Add hover effect
            openCell.addEventListener('mouseover', () => {
                openCell.style.backgroundColor = '#28a745'; // Darker green on hover
            });

            openCell.addEventListener('mouseout', () => {
                openCell.style.backgroundColor = '#66bb6a'; // Reset to lighter green
            });

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
                window.location.reload();
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


deleteProductButton = document.getElementById('delete-product');

// Add an event listener to the delete button
deleteProductButton.addEventListener('click', () => {
    // Get the product details from the modal
    const modalProductName = document.getElementById('modal-product-name').textContent;
    const modalProductDescription = document.getElementById('modal-product-description').textContent;
    const modalProductBrand = document.getElementById('modal-product-brand').textContent;

    if (!modalProductName || !modalProductDescription || !modalProductBrand) {
        alert('No product selected to delete!');
        return;
    }

    // Confirm deletion
    const confirmDelete = confirm(`Are you sure you want to delete "${modalProductName}"?`);
    if (!confirmDelete) return;

    // Send DELETE request with all three fields
    fetch('https://earthph.sdevtech.com.ph/products/deleteProduct', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productName: modalProductName,
            productDescription: modalProductDescription,
            productBrand: modalProductBrand
        }),  // Send all three fields for deletion
    })
        .then(response => {
            if (response.ok) {
                alert('Product deleted successfully!');
                modal.style.display = 'none'; // Close modal
                location.reload(); // Refresh the page or update UI
            } else {
                throw new Error('Failed to delete product.');
            }
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            alert('An error occurred while deleting the product.');
        });
});





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
