let productDetailsData = [];

document.addEventListener("DOMContentLoaded", function () {
    /*** VARIABLES ***/
 // Array to store product details

    /*** FETCH AND POPULATE PRODUCTS ***/


    // Function to log all items in localStorage
const logLocalStorageItems = () => {
    console.log("Items in localStorage:");
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`${key}: ${value}`);
    }
};

// Call this function whenever you want to check the localStorage contents
logLocalStorageItems();


    // Fetch products from the database
    const fetchProducts = async () => {
        try {
            const response = await fetch("https://earthph.sdevtech.com.ph/products/getProduct", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data.products || []; // Ensure we return an empty array if products is missing
        } catch (error) {
            console.error("Error fetching products:", error);
            return []; // Return an empty array if there's an error
        }
    };

    // Populate product list dynamically
    const populateProductList = async () => {
        const products = await fetchProducts();
        const productList = document.getElementById("product-list");

        if (!productList) {
            console.error("Product list element not found!");
            return;
        }

        if (products.length === 0) {
            productList.innerHTML = "<p>No products available.</p>";
            return;
        }

        products.forEach(product => {
            const randomImageURL = "https://picsum.photos/100";
            const productHTML = `
                <div class="product-container" data-sku="${product.productSKU}">
                    <div class="product-row">
                        <strong>${product.brand} ${product.productName}</strong>
                    </div>
                    <div class="product-row product-divider-popup">
                        <img src="${randomImageURL}" alt="Product Image">
                        <div class="product-controls">
                            <div class="quantity-controls">
                                <button class="minus-btn" data-sku="${product.productSKU}">-</button>
                                <input type="text" class="product-quantity" data-sku="${product.productSKU}" value="0" readonly>
                                <button class="plus-btn" data-sku="${product.productSKU}">+</button>
                            </div>
                            <div class="product-size-total">
                                <select class="product-size-select" data-sku="${product.productSKU}">
                                    <option value="${product.price}" data-price="${product.price}">${product.price}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>`;
            productList.innerHTML += productHTML;
        });

        addQuantityButtonListeners();
    };

    /*** ORDER COMPUTATION ***/

    const updateOrderComputation = () => {
        const products = document.querySelectorAll(".product-container");
        let totalItems = 0;
        let totalAmount = 0;

        products.forEach(product => {
            const quantity = parseInt(product.querySelector(".product-quantity").value) || 0;
            const price = parseFloat(product.querySelector(".product-size-select").value);

            if (quantity > 0) {
                totalItems += quantity;
                totalAmount += quantity * price;
            }
        });

        document.getElementById("listPrice").value = totalAmount.toFixed(2);
        document.getElementById("totalItems").value = totalItems;
        document.getElementById("totalAmount").value = totalAmount.toFixed(2);
    };

    /*** PRODUCT DETAILS UPDATE ***/

    const updateProductDetails = () => {
        const productDetails = document.getElementById("productDetails");
        const productDetailsModal = document.getElementById("productDetailsModal");
        const products = document.querySelectorAll(".product-container");

        let detailsHTML = "";
        let modalDetailsHTML = "";
        productDetailsData = [];

        products.forEach(product => {
            const productName = product.querySelector("strong").innerText;
            const quantity = parseInt(product.querySelector(".product-quantity").value) || 0;
            const price = parseFloat(product.querySelector(".product-size-select").value);

            if (quantity > 0) {
                productDetailsData.push({
                    name: productName,
                    price: price,
                    quantity: quantity,
                    total: quantity * price
                });

                const itemHTML = `
                    <div class="product-detail">
                        <strong>${productName}</strong>
                        <p>Price: $${price.toFixed(2)}</p>
                        <p>Quantity: ${quantity}</p>
                        <p>Total: $${(quantity * price).toFixed(2)}</p>
                        <hr>
                    </div>`;

                detailsHTML += itemHTML;
                modalDetailsHTML += itemHTML;
            }
        });

        productDetails.innerHTML = detailsHTML || "<p>No items selected.</p>";
        productDetailsModal.innerHTML = modalDetailsHTML || "<p>No items selected in the modal.</p>";
    };

    /*** MODAL HANDLING ***/

    const handleModals = () => {
        const addItemBtn = document.getElementById("addItemBtn");
        const closeModalBtn = document.getElementById("closeModalBtn");
        const productModal = document.getElementById("productModal");

        if (addItemBtn && closeModalBtn && productModal) {
            addItemBtn.addEventListener("click", () => {
                productModal.style.display = "block";
            });

            closeModalBtn.addEventListener("click", () => {
                productModal.style.display = "none";
            });
        }

        const submitProductsBtn = document.getElementById("submitProductsBtn");
        if (submitProductsBtn) {
            submitProductsBtn.addEventListener("click", () => {
                updateOrderComputation();
                updateProductDetails();
                productModal.style.display = "none";
            });
        }
    };

    /*** RECEIPT MODAL ***/

    const handleReceiptModal = () => {
        const receiptModal = document.getElementById("receiptModal");
        const closeReceiptBtn = document.querySelector(".close-receipt");
        const printReceiptBtn = document.getElementById("printReceiptBtn");
        const submitOrderBtn = document.getElementById("submitOrderBtn");

        const generateReceipt = () => {
            const issueDateElement = document.getElementById("issueDate");
            const currentDate = new Date().toLocaleDateString();
            issueDateElement.textContent = currentDate;

            const itemsPurchasedElement = document.getElementById("productDetailsModal");
            const totalAmountElement = document.getElementById("totalAmount");

            let itemsHTML = "";
            let totalAmount = 0;

            productDetailsData.forEach(item => {
                itemsHTML += `
                    <p><strong>${item.name}</strong><br>
                       Price: $${item.price.toFixed(2)}<br>
                       Quantity: ${item.quantity}<br>
                       Total: $${item.total.toFixed(2)}</p>`;
                totalAmount += item.total;
            });

            itemsPurchasedElement.innerHTML = itemsHTML;
            totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
        };

        if (submitOrderBtn) {
            submitOrderBtn.addEventListener("click", (event) => {
                event.preventDefault();
                receiptModal.style.display = "block";
                generateReceipt();
            });
        }

        if (closeReceiptBtn) {
            closeReceiptBtn.addEventListener("click", () => {
                receiptModal.style.display = "none";
            });
        }

        if (printReceiptBtn) {
            printReceiptBtn.addEventListener("click", () => {
                window.print();
            });
        }
    };

    /*** QUANTITY BUTTON LISTENERS ***/

    const addQuantityButtonListeners = () => {
        const plusButtons = document.querySelectorAll(".plus-btn");
        const minusButtons = document.querySelectorAll(".minus-btn");

        plusButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const quantityInput = button.closest(".quantity-controls").querySelector(".product-quantity");
                let quantity = parseInt(quantityInput.value) || 0;
                quantityInput.value = quantity + 1;

                updateOrderComputation();
                updateProductDetails();
            });
        });

        minusButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const quantityInput = button.closest(".quantity-controls").querySelector(".product-quantity");
                let quantity = parseInt(quantityInput.value) || 0;
                if (quantity > 0) {
                    quantityInput.value = quantity - 1;
                }

                updateOrderComputation();
                updateProductDetails();
            });
        });
    };

    /*** INITIALIZE ***/

    populateProductList();
    handleModals();
    handleReceiptModal();

    document.getElementById('acceptOrderBtn').addEventListener('click', async () => {
        // Log product details data to check its content
        console.log('Product Details Data:', productDetailsData);
    
        // Ensure every product has a description
        const updatedProducts = productDetailsData.map(product => ({
            ...product,
            description: product.description || 'No description available' // Add default description if missing
        }));
    
        // Assuming user details are stored as a JSON object in localStorage
        const user = JSON.parse(localStorage.getItem('orderData')) || {};
    
        console.log("test", user.userFullName);
    
        // Then use the extracted values to populate order data
        const orderData = {
            agentName: user.agentName,
            teamLeaderName: user.teamLeaderName,
            area: user.area,
            orderDate: new Date().toISOString(), // Use the current date as orderDate
            storeName: user.storeName,
            houseAddress: user.houseAddress,
            townProvince: user.townProvince,
            storeCode: user.storeCode,
            tin: user.tin,
            listPrice: parseFloat(document.getElementById('listPrice').value),
            totalItems: parseInt(document.getElementById('totalItems').value),
            totalAmount: parseFloat(document.getElementById('totalAmount').value),
            paymentMode: document.getElementById('paymentMode').value,
            remarks: document.getElementById('remarks').value,
            paymentImage: document.getElementById('paymentMode').value === 'credit' ? document.getElementById('paymentImage').value : "No Image",
            products: updatedProducts.length > 0 ? updatedProducts : [{
                name: 'No product selected',
                price: 0,
                quantity: 0,
                total: 0,
                description: 'No description available' // Add a default description
            }]
        };
    
        // Log the order data to check if all fields are populated correctly
        console.log('Order data to be sent:', orderData);
    
        const isFieldMissing = (field, fieldName) => {
            // Check if the field is not a string or is empty or undefined
            if (typeof field !== 'string' || field.trim() === '') {
                console.log(`${fieldName} is missing`);
                return true;
            }
            return false;
        };
    
        // Check for missing required fields
        if (
            isFieldMissing(orderData.agentName, 'agentName') ||
            isFieldMissing(orderData.teamLeaderName, 'teamLeaderName') ||
            isFieldMissing(orderData.area, 'area') ||
            isFieldMissing(orderData.storeName, 'storeName') ||
            isFieldMissing(orderData.houseAddress, 'houseAddress') ||
            isFieldMissing(orderData.townProvince, 'townProvince') ||
            isFieldMissing(orderData.storeCode, 'storeCode') ||
            isFieldMissing(orderData.tin, 'tin') ||
            isFieldMissing(orderData.paymentMode, 'paymentMode') ||
            isFieldMissing(orderData.remarks, 'remarks') ||
            (orderData.paymentMode === 'credit' && isFieldMissing(orderData.paymentImage, 'paymentImage'))  // Check if paymentImage is missing when paymentMode is credit
        ) {
            alert('Please fill out all required fields before submitting the order.');
            return;
        }
    
        // Send POST request to backend
        try {
            const response = await fetch('https://earthph.sdevtech.com.ph/orders/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(orderData)
            });
    
            const result = await response.json();
            console.log('Response from backend:', result);
    
            if (response.ok) {
                // If order is successful, change the button text and color
                const acceptOrderBtn = document.getElementById('acceptOrderBtn');
                acceptOrderBtn.textContent = "Continue";
                acceptOrderBtn.style.backgroundColor = "#4CAF50"; // Change the color to green (or any other color you prefer)
                acceptOrderBtn.style.color = "#fff"; // White text color
    
                alert('Order accepted and saved successfully!');
    
                // Add a redirect on click of the button
                acceptOrderBtn.removeEventListener('click', handleOrderClick); // Remove previous event listener to avoid multiple triggers
    
                acceptOrderBtn.addEventListener('click', () => {
                    window.location.href = "https://earthhomecareph.astute.services/OrderForm/Agent-Info.html"; // Redirect to the desired URL
                });
            } else {
                alert(`Failed to save order: ${result.message}`);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('A network error occurred. Please check your connection.');
        }
    });
    
    // Function to handle initial button click (for order submission)
    const handleOrderClick = (event) => {
        event.preventDefault();
        // Initial order handling logic (before redirect)
        console.log("Initial order submission");
    };
    
    
});

   // Get the payment mode dropdown and the payment method display element
   const paymentModeDropdown = document.getElementById('paymentMode');
   const paymentMethodSpan = document.getElementById('paymentMethod');

   // Function to update the payment method display
   const updatePaymentMethodDisplay = () => {
       const selectedPaymentMode = paymentModeDropdown.value;
       
       // If a valid payment mode is selected, update the span text
       if (selectedPaymentMode) {
           paymentMethodSpan.textContent = selectedPaymentMode === 'cash' ? 'Cash' : 'G Cash';
       } else {
           paymentMethodSpan.textContent = 'Not selected';
       }
   };

   // Update payment method display on change of payment mode selection
   paymentModeDropdown.addEventListener('change', updatePaymentMethodDisplay);

   // Initial update of the payment method display when page loads
   updatePaymentMethodDisplay();

   let storeName = document.getElementById("storeName");
   const user = JSON.parse(localStorage.getItem('orderData')) || {};
   storeName.textContent = user.storeName || 'EarthPH'; // Use textContent to set the display text