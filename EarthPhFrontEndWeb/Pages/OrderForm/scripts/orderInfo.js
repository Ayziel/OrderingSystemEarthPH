let productDetails = []; 
const storeData = JSON.parse(localStorage.getItem('storeData'));
const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));

const paymentImageInput = document.getElementById('paymentImage');
let base64PaymentImage = ""; 

document.addEventListener("DOMContentLoaded", () => {

    paymentImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                base64PaymentImage = reader.result;
            };
            reader.readAsDataURL(file);
        }
    });

    const logLocalStorageItems = () => {
        console.log("Items in localStorage:");
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            console.log(`${key}: ${value}`);
        }
    };

    logLocalStorageItems();

    const fetchProducts = async () => {
        try {
            const response = await fetch("https://earthph.sdevtech.com.ph/products/getProduct", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            console.log("Data",data);
            return data.products || [];
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    };

    const populateProductList = async () => {
        const storeData = JSON.parse(localStorage.getItem('storeData')); // Parse the storeData object
        const products = await fetchProducts();
        const productListElement = document.getElementById("product-list");
        const storeUid = storeData ? storeData.uid : null;
    
        if (!productListElement) {
            console.error("Product list element not found!");
            return;
        }
    
        if (products.length === 0) {
            productListElement.innerHTML = "<p>No products available. <a href='/add-product'>Add a product</a></p>";
            return;
        }
    
        products.forEach(product => {
            // Filter products based on storeUid
            if (product.storeUid !== storeUid && storeUid !== null) {
                return; // Skip this product if it doesn't match the storeUid
            }
    
            const discountOptions = Array.from({ length: 9 }, (_, i) => `<option value="${i * 10}">${i * 10}%</option>`).join('');
    
            const productHTML = `
                <div class="product-container" data-uid="${product.uid}" data-sku="${product.productSKU}" data-store-uid="${product.storeUid}">
                    <div class="product-row">
                        <strong>${product.productName}</strong>
                    </div>
                    <div class="product-row product-divider-popup">
                        <img src="${product.productImage}" class="product-image" alt="Product Image">
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
                            <div class="discount-dropdown">
                                <select id="discount-percentage-${product.productSKU}" class="discount-percentage" data-sku="${product.productSKU}">
                                    ${discountOptions}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>`;
    
            productListElement.innerHTML += productHTML;
        });
    
        addQuantityButtonListeners();
    };
    
    
    populateProductList();

    const updateOrderComputation = () => {
        const products = document.querySelectorAll(".product-container");
        let totalItems = 0;
        let totalAmount = 0;

        products.forEach(product => {
            const quantity = parseInt(product.querySelector(".product-quantity").value) || 0;
            const price = parseFloat(product.querySelector(".product-size-select").value);
            const discountPercentage = parseInt(product.querySelector(".discount-percentage").value) || 0;

            const discountAmount = price * (discountPercentage / 100);
            const discountedPrice = price - discountAmount;

            if (quantity > 0) {
                totalItems += quantity;
                totalAmount += quantity * discountedPrice;
            }
        });

        document.getElementById("listPrice").value = totalAmount.toFixed(2);
        document.getElementById("totalItems").value = totalItems;
        document.getElementById("totalAmount").value = totalAmount.toFixed(2);

    };

    const storeUid = localStorage.getItem('storeUid'); // Retrieve storeUid from localStorage

    const updateProductDetails = () => {
        const productDetailsElement = document.getElementById("productDetails");
        const productDetailsModalElement = document.getElementById("productDetailsModal");
        const products = document.querySelectorAll(".product-container");
        
        let detailsHTML = "";
        let modalDetailsHTML = "";
        productDetails = [];
    
        products.forEach(product => {
            const productName = product.querySelector("strong").innerText;
            const quantity = parseInt(product.querySelector(".product-quantity").value) || 0;
            const price = parseFloat(product.querySelector(".product-size-select").value);
            const discountPercentage = parseInt(product.querySelector(".discount-percentage").value) || 0;
            const productUid = product.getAttribute('data-uid'); // Extract the uid from the data-uid attribute
    
            if (quantity > 0) {
                // Check if this product is already in productDetails array
                const existingProduct = productDetails.find(item => item.product_uid === productUid);
    
                if (existingProduct) {
                    // If product exists, update its quantity and total
                    existingProduct.quantity += quantity;
                    const discountAmount = price * (discountPercentage / 100);
                    const discountedPrice = price - discountAmount;
                    existingProduct.total += quantity * discountedPrice;
                } else {
                    // If the product doesn't exist in the order, add it to the array
                    const discountAmount = price * (discountPercentage / 100);
                    const discountedPrice = price - discountAmount;
                    const total = quantity * discountedPrice;
    
                    productDetails.push({
                        name: productName,
                        price: discountedPrice,
                        quantity: quantity,
                        total: total,
                        discount: discountPercentage,
                        product_uid: productUid // Include product_uid
                    });
                }
    
                // Add the HTML for displaying the product details in the list and modal
                const itemHTML = `
                    <div class="product-detail">
                        <strong>${productName}</strong>
                        <p>Price: ₱${(price - (price * (discountPercentage / 100))).toFixed(2)}</p>
                        <p>Discount: ${discountPercentage}%</p>
                        <p>Quantity: ${quantity}</p>
                        <p>Total: ₱${(quantity * (price - (price * (discountPercentage / 100)))).toFixed(2)}</p>
                        <hr>
                    </div>`;
    
                detailsHTML += itemHTML;
                modalDetailsHTML += itemHTML;
            }
        });
    
        productDetailsElement.innerHTML = detailsHTML;
        productDetailsModalElement.innerHTML = modalDetailsHTML;
    };
    
    const checkStockAvailability = (productUid, orderedQuantity) => {
        const product = productDetails.find(item => item.product_uid === productUid);
        if (!product) return true; // If the product doesn't exist in order, it's not restricted
    
        const currentStock = getStockLevelFromDatabase(productUid); // Retrieve the stock level for this product
        return currentStock >= (product.quantity + orderedQuantity);
    };
    

    const handleModals = () => {
        const addItemButton = document.getElementById("addItemBtn");
        const closeModalButton = document.getElementById("closeModalBtn");
        const productModal = document.getElementById("productModal");

        if (addItemButton && closeModalButton && productModal) {
            addItemButton.addEventListener("click", () => {
                productModal.style.display = "block";
            });

            closeModalButton.addEventListener("click", () => {
                productModal.style.display = "none";
            });
        }

        const submitProductsButton = document.getElementById("submitProductsBtn");
        if (submitProductsButton) {
            submitProductsButton.addEventListener("click", () => {
                updateOrderComputation();
                updateProductDetails();
                productModal.style.display = "none";
            });
        }
    };

    const handleReceiptModal = () => {
        const receiptModal = document.getElementById("receiptModal");
        const closeReceiptButton = document.querySelector(".close-receipt");
        const printReceiptButton = document.getElementById("printReceiptBtn");
        const submitOrderButton = document.getElementById("submitOrderBtn");

        receiptModal.style.display = "none";

        const generateReceipt = () => {
            const issueDateElement = document.getElementById("issueDate");
            const currentDate = new Date().toLocaleDateString();
            issueDateElement.textContent = currentDate;

            const itemsPurchasedElement = document.getElementById("productDetailsModal");
            const totalAmountElement = document.getElementById("modalTotalAmount");

            let itemsHTML = "";
            let totalAmount = 0;
            console.log("productDetails", productDetails);
            productDetails.forEach(item => {
                itemsHTML += `
                    <p><strong>${item.name}</strong><br>
                       Price: ₱${item.price.toFixed(2)}<br>
                       Quantity: ${item.quantity}<br>
                       Total: ₱${item.total.toFixed(2)}</p>
                       `;
                totalAmount += item.total;
            });

            itemsPurchasedElement.innerHTML = itemsHTML;
            totalAmountElement.textContent = `₱${totalAmount.toFixed(2)}`;
        };

        if (submitOrderButton) {
            submitOrderButton.addEventListener("click", (event) => {
                event.preventDefault();
                receiptModal.style.display = "block";
                generateReceipt();
            });
        }

        if (closeReceiptButton) {
            closeReceiptButton.addEventListener("click", () => {
                receiptModal.style.display = "none";
            });
        }

        if (printReceiptButton) {
            printReceiptButton.addEventListener("click", () => {
                window.print();
            });
        }
    };

    const addQuantityButtonListeners = () => {
        const plusButtons = document.querySelectorAll(".plus-btn");
        const minusButtons = document.querySelectorAll(".minus-btn");
    
        plusButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const quantityInput = button.closest(".quantity-controls").querySelector(".product-quantity");
    
                if (!quantityInput) {
                    console.error("Product quantity input not found!");
                    return;
                }
    
                let quantity = parseInt(quantityInput.value) || 0;
                quantityInput.value = quantity + 1;
    
                if (typeof updateOrderComputation === 'function') {
                    updateOrderComputation();
                } else {
                    console.warn("updateOrderComputation function is not defined.");
                }
    
                if (typeof updateProductDetails === 'function') {
                    updateProductDetails();
                } else {
                    console.warn("updateProductDetails function is not defined.");
                }
            });
        });
    
        minusButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const quantityInput = button.closest(".quantity-controls").querySelector(".product-quantity");
    
                if (!quantityInput) {
                    console.error("Product quantity input not found!");
                    return;
                }
    
                let quantity = parseInt(quantityInput.value) || 0;
                if (quantity > 0) {
                    quantityInput.value = quantity - 1;
                }
    
                if (typeof updateOrderComputation === 'function') {
                    updateOrderComputation();
                } else {
                    console.warn("updateOrderComputation function is not defined.");
                }
    
                if (typeof updateProductDetails === 'function') {
                    updateProductDetails();
                } else {
                    console.warn("updateProductDetails function is not defined.");
                }
            });
        });
    };
    

    const initialize = () => {
        handleModals();
        handleReceiptModal();

        const orderUid = uuid.v4();
        const stockUid = uuid.v4();

        document.getElementById('acceptOrderBtn').addEventListener('click', async () => {
            const button = document.getElementById('acceptOrderBtn');
            const goToDashboardBtn = document.getElementById('adashboardBtn');  // Get the "Go to Dashboard" button
        
            // Initially, disable the "Go to Dashboard" button
            goToDashboardBtn.disabled = true;
        
            // Check if the button is in the "Order Again" state
            if (button.textContent === "Order Again") {
                window.open('https://earthhomecareph.astute.services/OrderForm/Agent-Info.html');
                // Proceed with the same logic as for the first order submission
                await processOrder();
                return;
            }
        
            // Check if the button is already disabled (to prevent duplicate submission)
            if (button.disabled) {
                console.warn('Button is already disabled. Preventing duplicate submission.');
                return;
            }
        
            // Disable the button immediately to prevent multiple clicks
            button.disabled = true;
        
            // Log the productDetails array to verify its structure
            console.log('productDetails:', productDetails);
        
            const updatedProducts = productDetails.map(product => {
                console.log('Product before update:', product); // Log the product before update
                const updatedProduct = {
                    ...product,
                    description: product.description || 'No description available',
                };
                console.log('Product after update:', updatedProduct); // Log the product after update
                return updatedProduct;
            });
        
            const user = JSON.parse(localStorage.getItem('orderData')) || {};
        
            const orderData = {
                agentName: user.agentName,
                teamLeaderName: user.teamLeaderName,
                area: user.area,
                orderDate: new Date().toISOString(),
                storeName: user.storeName,
                tin: user.tin,
                listPrice: parseFloat(document.getElementById('listPrice').value),
                totalItems: parseInt(document.getElementById('totalItems').value),
                totalAmount: parseFloat(document.getElementById('totalAmount').value),
                paymentMode: document.getElementById('paymentMode').value,
                remarks: document.getElementById('remarks').value,
                paymentImage: document.getElementById('paymentMode').value === 'credit' ? base64PaymentImage : "No Image",
                uid: orderUid,
                storeUid: storeData.uid,
                userUid: matchedUser.uid,
                products: updatedProducts.length > 0 ? updatedProducts : [{
                    name: 'No product selected',
                    price: 0,
                    quantity: 0,
                    total: 0,
                    description: 'No description available',
                    discount: 0,
                    product_uid: 'defaultProductUid' // Add a default product_uid for the placeholder product
                }]
            };
        
            console.log('Order Data:', orderData); // Log the order data
        
            // Check for missing fields
            const isFieldMissing = (field, fieldName) => {
                if (typeof field !== 'string' || field.trim() === '') {
                    console.log(`${fieldName} is missing`);
                    return true;
                }
                return false;
            };
        
            let missingFields = [];
            if (isFieldMissing(orderData.agentName, 'Agent Name')) missingFields.push('Agent Name');
            if (isFieldMissing(orderData.teamLeaderName, 'Team Leader Name')) missingFields.push('Team Leader Name');
            if (isFieldMissing(orderData.area, 'Area')) missingFields.push('Area');
            if (isFieldMissing(orderData.storeName, 'Store Name')) missingFields.push('Store Name');
            if (isFieldMissing(orderData.tin, 'TIN')) missingFields.push('TIN');
            if (isFieldMissing(orderData.paymentMode, 'Payment Mode')) missingFields.push('Payment Mode');
            if (isFieldMissing(orderData.remarks, 'Remarks')) missingFields.push('Remarks');
            if (orderData.paymentMode === 'credit' && isFieldMissing(orderData.paymentImage, 'Payment Image')) missingFields.push('Payment Image');
        
            // If any required fields are missing, show alert and reset the button
            if (missingFields.length > 0) {
                alert('Please fill out the following required fields before submitting the order: ' + missingFields.join(', '));
                button.disabled = false; // Re-enable the button in case of missing fields
                return;
            }
        
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
        
                if (response.ok) {
                    const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));  // Retrieve matched user from localStorage
                    const parentUid = matchedUser ? matchedUser.uid : "defaultParentUid";  // Use the uid from matchedUser or a default value
        
                    const stockPromises = orderData.products.map(async (product) => {
                        console.log('STOCK PRODUCTS:', product);
                        const stockData = {
                            uid: stockUid,
                            parent_uid: parentUid,  // Auto-populate parent_uid using the uid from matchedUser
                            product_uid: product.product_uid ? product.product_uid : "test",  // Correctly reference the uid from the product object
                            store_name: orderData.storeName,
                            product_name: product.name,
                            quantity: product.quantity
                        };
        
                        const stockResponse = await fetch('https://earthph.sdevtech.com.ph/stocks/createStock', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('authToken')}`
                            },
                            body: JSON.stringify(stockData)
                        });
        
                        const stockResult = await stockResponse.json();
                        console.log('Stock response:', stockResult);
        
                        if (!stockResponse.ok) {
                            throw new Error(`Failed to create stock for product ${product.name}: ${stockResult.message}`);
                        }
                    });
        
                    await Promise.all(stockPromises);
        
                    // Change button to "Order Again" after successful submission
                    button.textContent = "Order Again";
                    button.style.backgroundColor = "#FF9800";
                    button.style.color = "#fff";
                    button.disabled = false; // Enable the button to allow "Order Again"
        
                    alert('Order accepted and saved successfully!');
                    
                    // Enable "Go to Dashboard" button after order is completed
                    goToDashboardBtn.disabled = false;  // Enable the "Go to Dashboard" button
                } else {
                    alert(`Failed to save order: ${result.message}`);
                }
            } catch (error) {
                console.error('Network error:', error);
                alert('A network error occurred. Please check your connection.');
            } finally {
                button.disabled = false; // Re-enable the button after the process
            }
        });

        
        document.getElementById('dashboardBtn').addEventListener('click', async () => {
            window.location.href = 'https://earthhomecareph.astute.services/';  // Redirect to the specified URL
        });
        
        
        
        // Function to handle "Order Again"
        async function processOrder() {
            const button = document.getElementById('acceptOrderBtn');
            // Re-trigger the order process (similar to initial submission)
            button.disabled = true;
            await document.getElementById('acceptOrderBtn').click();  // Trigger the same logic as the first time
        }
        
        

        const handleOrderClick = (event) => {
            event.preventDefault();
            console.log("Initial order submission");
        };
    };

    initialize();
});

const fetchStockData = async () => {
    try {
        const response = await fetch("https://earthph.sdevtech.com.ph/stocks/getStock", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        return data.stocks || [];
    } catch (error) {
        console.error("Error fetching stock data:", error);
        return [];
    }
};


const paymentModeDropdown = document.getElementById('paymentMode');
const paymentMethodSpan = document.getElementById('paymentMethod');

const updatePaymentMethodDisplay = () => {
    const selectedPaymentMode = paymentModeDropdown.value;

    paymentMethodSpan.textContent = selectedPaymentMode ? (selectedPaymentMode === 'cash' ? 'Cash' : 'G Cash') : 'Not selected';
};

paymentModeDropdown.addEventListener('change', updatePaymentMethodDisplay);
updatePaymentMethodDisplay();

const storeNameElement = document.getElementById("storeName");
const userData = JSON.parse(localStorage.getItem('orderData')) || {};
storeNameElement.textContent = userData.storeName || 'EarthPH';
