let productDetails = []; 
const storeData = JSON.parse(localStorage.getItem('storeData'));
const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));

const paymentImageInput = document.getElementById('paymentImage');
let base64PaymentImage = ""; 



document.addEventListener("DOMContentLoaded", () => {

    if(localStorage.getItem('isViewOrderMode') === 'true'){
        document.getElementById('acceptOrderBtn').disabled = true;
    }

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
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
        }
    };

    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "/System/manifest.json";
    document.head.appendChild(link);

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/System/service-worker.js")
            .then(() => console.log("Service Worker registered"))
            .catch((error) => console.log("Service Worker registration failed:", error));
    }

    // Listen for the "beforeinstallprompt" event
    window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    const installPrompt = event;
    //document.getElementById("install-btn").style.display = "block";

    // document.getElementById("install-btn").addEventListener("click", () => {
    //     installPrompt.prompt();
    //     installPrompt.userChoice.then((choiceResult) => {
    //         if (choiceResult.outcome === "accepted") {
    //             console.log("User accepted the install prompt");
    //         } else {
    //             console.log("User dismissed the install prompt");
    //         }
    //     });
    // });
    }); 

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
            if (!(product.storeUid.includes(storeUid) || product.storeUid.includes("0"))) {
                console.log("Skipping product due to storeUid mismatch");
                return;
            }
    
            const discountOptions = Array.from({ length: 9 }, (_, i) => `<option value="${i * 10}">${i * 10}%</option>`).join('');
    
            // Create the product HTML structure first
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
    
            // Append the product HTML to the list
            productListElement.innerHTML += productHTML;
    
            // Now apply the visibility check after the HTML has been added
            const productContainer = document.querySelector(`[data-uid="${product.uid}"]`);
            // if (productContainer) {
            //     const bundleElement = productContainer.querySelector('.Bundle');
            //     if (bundleElement) {
            //         if (!product.productName.includes("Coil")) {
            //             bundleElement.style.display = "none"; // Hide the bundle if "Coil" is not in the product name
            //         } else {
            //             console.log('Bundle should be visible for product:', product.productName); // Debugging statement
            //         }
            //     }
            // }
        });
    
        addQuantityButtonListeners(); // Attach listeners after rendering the products
        attachBundleUpdateListeners(); // Attach listeners for bundle updates
    };
    
    

    // const attachBundleUpdateListeners = () => {
    //     const quantityInputs = document.querySelectorAll(".product-quantity");
    
    //     quantityInputs.forEach(input => {
    //         const sku = input.dataset.sku;
    //         const bundleElement = document.getElementById(`bundle-${sku}`);
    
    //         input.addEventListener("input", () => {
    //             const quantity = parseInt(input.value) || 0;
    //             const bundle = Math.floor(quantity / 5); // Calculate bundle
    //             if (bundleElement) {
    //                 bundleElement.textContent = `ARS Coil Bundle (5 + 1) = ${bundle}`;
    //             }
    //         });
    //     });
    
    //     const buttons = document.querySelectorAll(".minus-btn, .plus-btn");
    
    //     buttons.forEach(button => {
    //         button.addEventListener("click", (e) => {
    //             const sku = e.target.dataset.sku;
    //             const quantityInput = document.querySelector(`.product-quantity[data-sku="${sku}"]`);
    //             const bundleElement = document.getElementById(`bundle-${sku}`);
    //             const quantity = parseInt(quantityInput.value) || 0;
    //             const bundle = Math.floor(quantity / 5); // Calculate bundle
    //             if (bundleElement) {
    //                 bundleElement.textContent = `ARS Coil Bundle (5 + 1) = ${bundle}`;
    //             }
    //         });
    //     });
    // };
    
    
    
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
        document.getElementById("totalAmountReceipt").innerText = `₱${totalAmount.toFixed(2)}`;
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
    
    const checkStockAvailability = async (productUid, orderedQuantity) => {
        const product = productDetails.find(item => item.product_uid === productUid);
        //const maxStock = 99;
        if (!product) return true; // If the product doesn't exist in order, it's not restricted
     
        const currentStock = await getStockLevelFromDatabase(productUid); // Await the stock level for this product
        if(!currentStock.stock) return true; // If no existing stocks found, it's not restricted
        return currentStock.stock >= (currentStock.quantity+orderedQuantity); // Compare current stock with the ordered quantity
    };
     
    const getStockLevelFromDatabase = async (productUid) => {
        const stockData = await fetchStockData(); // Wait for the stock data to be fetched
        const productStock = stockData.find(stock => stock.product_uid === productUid);
        //console.log(productStock);
        return productStock ? productStock : 0; // Return the stock or 0 if not found
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

             productDetails.forEach(item => {

                     // For items that don't have "ARS Coil", just display as is
                     itemsHTML += `
                         <p><strong>${item.name}</strong><br>
                            Price: ₱${item.price.toFixed(2)}<br>
                            Quantity: ${item.quantity}<br>
                            Total: ₱${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                     `;
                     totalAmount += item.total;
         });
            

            itemsPurchasedElement.innerHTML = itemsHTML;
            totalAmountElement.textContent = `₱${totalAmount}`;
        };

        if (submitOrderButton) {
            submitOrderButton.addEventListener("click", (event) => {
                event.preventDefault();
                
                // Get the selected payment mode from the dropdown
                const paymentMode = document.getElementById("paymentMode").value;
        
                // If payment mode is GCash, call handleGCashCheckAndCreate
                if (paymentMode === "credit") {
                    console.log("Payment made by GCash.");
                    handleGCashCheckAndCreate();
                } else {
                    // If not GCash, log as cash
                    console.log("Payment made by cash.");
                }
                
                // Display receipt modal and generate receipt regardless of payment mode
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
                if(!(checkExceedsStock())){
                    quantityInput.value = quantity + 1;
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
    
    const checkExceedsStock = () => {
        const products = document.querySelectorAll(".product-container");

        products.forEach(async product => {
            const productUid = product.getAttribute('data-uid'); // Extract the uid from the data-uid attribute
            const quantity = parseInt(product.querySelector(".product-quantity").value)+1 || 1;
            //console.log("New Orders: " + quantity);
            //console.log (!checkStockAvailability(productUid, quantity))
            const isAvailable = await checkStockAvailability(productUid, quantity);

            // if(!isAvailable){
            //     //exceeds.push (`${product.querySelector("strong").innerText}`);
            //     alert(`The following products exceeded stock limit: ${product.querySelector("strong").innerText}`);
            //     product.querySelector(".product-quantity").value = 0;
            //     return true;
            // }
        });
        return false;
    }


    const initialize = () => {
        handleModals();
        handleReceiptModal();

        const orderUid = uuid.v4();
        const stockUid = uuid.v4();
        const generateReceiptUid = () => {
            const timestamp = Date.now().toString().slice(-4); // Last 4 digits of the timestamp
            const randomNum = Math.floor(1000 + Math.random() * 9000); // Random 3-digit number
            return `RCPT-${timestamp}-${randomNum}`;
        };
        const receiptUid = generateReceiptUid();
        document.getElementById("receiptID").textContent = receiptUid;

        document.getElementById('acceptOrderBtn').addEventListener('click', async () => {
            const button = document.getElementById('acceptOrderBtn');

            // Check if the button is already in the "Continue" state
            if (button.textContent === "Order Again") {
                console.warn('Order already accepted. Preventing duplicate submission.');
                return;
            }
        
            if (button.disabled) {
                console.warn('Button is already disabled. Preventing duplicate submission.');
                return;
            }
        
            button.disabled = true;
        
        
            // const updatedProducts = productDetails.map(product => {
            //     const isARSCoil = product.name.toLowerCase().includes('ars coil'); // Check if the name contains "ARS Coil"
            //     const extraItems = isARSCoil ? Math.floor(product.quantity / 5) : 0; // Calculate extra items
            //     const adjustedQuantity = product.quantity + extraItems; // Adjust quantity
            //     const adjustedTotalItems = product.totalItems;
            //     return {
            //         ...product,
            //         quantity: adjustedQuantity, // Use the adjusted quantity
            //         originalQuantity: product.quantity, // Save the original quantity for reference
            //         description: product.description || 'No description available',
            //     };
            // });
            
        
            const user = JSON.parse(localStorage.getItem('orderData')) || {};
        
            //////// TEST
            
            //user.agentName = "Agent Name";;
            //user.teamLeaderName = "Team Leader Name";
            //user.area = "Area";
            //user.storeName = "McDonalds";
            //user.tin = "123123123";
            
            ////////
            const totalItems = updatedProducts.reduce((acc, product) => {
                return acc + product.quantity; // Sum of the adjusted quantity
            }, 0);

            const orderData = {
                agentName: user.agentName,
                teamLeaderName: user.teamLeaderName,
                area: user.area,
                orderDate: new Date().toISOString(),
                storeName: user.storeName,
                tin: user.tin,
                listPrice: parseFloat(document.getElementById('listPrice').value),
                totalItems: totalItems, 
                totalAmount: parseFloat(document.getElementById('totalAmount').value),
                paymentMode: document.getElementById('paymentMode').value,
                remarks: document.getElementById('remarks').value,
                paymentImage: document.getElementById('paymentMode').value === 'credit' ? base64PaymentImage : "No Image",
                uid: orderUid,
                storeUid: storeData.uid, //none
                userUid: matchedUser.uid,
                receiptUid: receiptUid,
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
            console.log("Order Data:", orderData);
        
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
        
            if (missingFields.length > 0) {
                alert('Please fill out the following required fields before submitting the order: ' + missingFields.join(', '));
                button.disabled = false;
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
                        const stockData = {
                            uid: stockUid,
                            parent_uid: parentUid,  // Auto-populate parent_uid using the uid from matchedUser
                            product_uid: product.product_uid ? product.product_uid : "test",  // Correctly reference the uid from the product object
                            store_name: orderData.storeName,
                            product_name: product.name,
                            quantity: product.quantity,
                            stock: product.stock ? product.stock : 100
                        };
                        
                        // Search if same parent_uid/product_uid pair already exists in the stocks
                        fetch('https://earthph.sdevtech.com.ph/stocks/getStock')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(async data => {

                            const stocks = data.stocks || data; // Adjust this if the array is inside a property

                            if (!Array.isArray(stocks)) {
                                console.error("The response is not an array");
                                return;
                            }



                            // Compare the parent_uid and product_uid of each stock

                            const newStock = stocks.find((stock) => stock.parent_uid == parentUid && stock.product_uid == product.product_uid);

                            
                            if(newStock){

                                const updatedStock = {
                                    uid: newStock.uid,
                                    quantity: (parseInt(product.quantity, 10) + parseInt(newStock.quantity, 10))
                                }

                                fetch('https://earthph.sdevtech.com.ph/stocks/updateStock', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(updatedStock)
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`HTTP error! status: ${response.status}`);
                                    }
                                    return response.json();
                                })
                                .then(data => {

                                })
                                .catch(error => {
                                    console.error('Error updating stock:', error);
                                    alert('Failed to update stock. Please try again later.');
                                });
                                return;
                            } else {
                                // If no match found, create new stock entry
                                console.log("No match found - creating new stock entry...");
                                const stockResponse = await fetch('https://earthph.sdevtech.com.ph/stocks/createStock', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                                    },
                                    body: JSON.stringify(stockData)
                                });
                            
                                const stockResult = await stockResponse.json();
                            
                                if (!stockResponse.ok) {
                                    throw new Error(`Failed to create stock for product ${product.name}: ${stockResult.message}`);
                                }
                            }
                        })
                        .catch(error => console.error('Error fetching stocks:', error));
                    });
        
                    await Promise.all(stockPromises);
        
                    // Change button to "Continue"
                    button.textContent = "Order Again";
                    button.style.backgroundColor = "#4CAF50";
                    button.style.color = "#fff";
        
                    // Disable the button after it's changed to "Continue" to prevent further submissions
                    button.disabled = true;
        
                    alert('Order accepted and saved successfully!');
        
                    // Optionally, add a listener for the "Continue" button to navigate
                    button.addEventListener('click', () => {
                        window.location.href = "https://earthhomecareph.astute.services/OrderForm/Agent-Info.html";
                    });
                } else {
                    alert(`Failed to save order: ${result.message}`);
                }
            } catch (error) {
                console.error('Network error:', error);
                alert('A network error occurred. Please check your connection.');
            } finally {
                button.disabled = false;
            }
        });
        

        const handleOrderClick = (event) => {
            event.preventDefault();
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


const handleGCashCheckAndCreate = async () => {
    try {
        const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));

        if (!matchedUser || !matchedUser.team || matchedUser.role !== "agent") {
            console.log("Matched user not found or user is not an agent.");
            return;
            throw new Error("Matched user not found in localStorage or user is not an agent.");
            
        }

        const userTeam = matchedUser.team;

        // Fetch all users to find the team leader
        const usersResponse = await fetch('https://earthph.sdevtech.com.ph/users/getUsers');
        const data = await usersResponse.json(); // Parse the JSON once


        const users = data.users;  // Access the 'users' array from the response

        const teamLeader = users.find(user => user.team === userTeam && user.role === "teamLeader");
        if (!teamLeader) {
            alert(`No team leader found for team: ${userTeam}`);
            console.log("No team leader found for team:", userTeam);
            throw new Error("No team leader found.");
        }

        const teamLeaderUid = teamLeader.uid;
        console.log("Team Leader UID:", teamLeaderUid);

        // Check if the team leader already has GCash data
        const gcashResponse = await fetch(`https://earthph.sdevtech.com.ph/gCash/getGcash/${teamLeaderUid}`);
        console.log("GCash response status:", gcashResponse.status);

        // Read the response body once
        const gcashData = gcashResponse.status === 404 ? null : await gcashResponse.json();
        console.log("GCash data for team leader:", gcashData);

        const balance = parseFloat(document.getElementById('totalAmount').value);
        console.log("Order balance fetched from input field:", balance);

        if (!gcashData || !gcashData.gcash || gcashData.gcash.userUid !== teamLeaderUid) {
            console.log("No matching GCash data or mismatch in UID, creating new GCash data.");

            const newGcashData = {
                userUid: teamLeaderUid,
                balance: balance,
                createdAt: new Date().toISOString(),
            };

            console.log("New GCash data to be created:", newGcashData);

            const createResponse = await fetch('https://earthph.sdevtech.com.ph/gCash/createGCash', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(newGcashData),
            });

            console.log("Create GCash response status:", createResponse.status);

            const createData = await createResponse.json(); // Read the response body once
            if (!createResponse.ok) {
                console.log("Error creating GCash record:", createData);
                throw new Error(`Failed to create GCash record: ${createData.message}`);
            }

            console.log("New GCash record created:", createData);
            return createData; // Successfully created GCash record
        } else {
            console.log("GCash data found for team leader:", gcashData.gcash);

            const updatedBalance = gcashData.gcash.balance + balance;
            console.log("Updated balance after adding new order amount:", updatedBalance);

            const updatedGcashData = {
                userUid: teamLeaderUid,
                totalAmount: document.getElementById("totalAmount").value,
            };

            console.log("Updated GCash data to be saved:", updatedGcashData);

            // Check if all required fields are present
            if (!updatedGcashData.userUid || updatedGcashData.totalAmount === undefined) {
                console.log("Error: Missing required fields in GCash update data.");
                throw new Error("Missing required fields in GCash update data.");
            }

            const updateResponse = await fetch('https://earthph.sdevtech.com.ph/gCash/updateGCash', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(updatedGcashData),
            });

            console.log("Update GCash response status:", updateResponse.status);

            const updateData = await updateResponse.json(); // Read the response body once
            if (!updateResponse.ok) {
                console.log("Error updating GCash record:", updateData);
                throw new Error(`Failed to update GCash record: ${updateData.message}`);
            }

            console.log("GCash balance updated:", updateData);
            return updateData; // Successfully updated GCash record
        }
    } catch (error) {
        console.error("Error in GCash check and create process:", error);
        throw error; // Reject the promise with the error
    }
};





