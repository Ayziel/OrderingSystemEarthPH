// // Get modal and related elements
// const contactNo = document.getElementById('contactNo');
// const issueDate = document.getElementById('issueDate');
// const itemPurchased = document.getElementById('itemPurchased');
// const totalAmount = document.getElementById('totalAmount');
// const paymentMethod = document.getElementById('paymentMethod');
// const status = document.getElementById('status');

// var modal = document.getElementById("productModal");
// var addItemBtn = document.getElementById("addItemBtn");
// var closeBtn = document.getElementsByClassName("close")[0];
// var submitProductsBtn = document.getElementById("submitProductsBtn");
// var selectedCount = document.getElementById('selectedCount');
// var productCountDisplay = document.getElementById('productCount');
// var listPriceInput = document.getElementById('list-price');
// var totalItemsInput = document.getElementById('total-items');
// var discountInput = document.getElementById('discount');
// var totalAmountInput = document.getElementById('total-amount');
// var proofOfPaymentContainer = document.querySelector('.proof-of-payment-container'); // Corrected selector
// var modeOfPayment = document.getElementById('payment-mode');

// let products = [];

// let submitOrderBtn = document.getElementById('submitOrderBtn');
// // Function to open the modal when "Add Item" is clicked

// const sizeSelect = document.querySelector('.product-size-select');
// const checkbox = document.querySelector('.product-checkbox');
// const productTotal = document.querySelector('.product-total');

// submitOrderBtn.addEventListener('click', async () => {
//     submitLog();
// });


// function submitLog() {
//     // Collect product data from dynamically generated product details
//     let productDetailsContainer = document.getElementById("product-details");


//     // Get all the product details
//     let productDetails = productDetailsContainer.querySelectorAll(".product-detail");

//     productDetails.forEach(function(product) {
//         let name = product.querySelector("p:nth-child(1)").textContent.replace("Product Name: ", "");
//         let price = parseFloat(product.querySelector("p:nth-child(3)").textContent.replace("Price: ₱", ""));
//         let quantity = parseInt(product.querySelector("p:nth-child(4)").textContent.replace("Quantity: ", ""));
//         let total = parseFloat(product.querySelector("p:nth-child(5)").textContent.replace("Total: ₱", ""));

//         // Push each product's details to the array
//         products.push({
//             name: name,
//             price: price,
//             quantity: quantity,
//             total: total
//         });
//     });

//     // Log all the collected product data
//     console.log("Products: ", products);

//     // Log the full order data (including products)
//     const orderData = {
//         // agentName: document.getElementById("agent-name").value,
//         // teamLeaderName: document.getElementById("team-leader").value,
//         // area: document.getElementById("area").value,
//         // orderDate: document.getElementById("order-date").value,
//         // storeName: document.getElementById("store-name").value,
//         // houseAddress: document.getElementById("house-address").value,
//         // townProvince: document.getElementById("town-province").value,
//         // storeCode: document.getElementById("store-code").value,
//         // tin: document.getElementById("tin").value,
//         // discount: document.getElementById("discount").value,

//         listPrice: document.getElementById("list-price").value,
//         totalItems: document.getElementById("total-items").value,
//         totalAmount: document.getElementById("total-amount").value,
//         paymentMode: document.getElementById("payment-mode").value,
//         paymentImage: document.getElementById("payment-image").value,
//         remarks: document.getElementById("remarks").value,
//         products: products // Include the products array
//     };

//     // Log the entire order data
//     console.log("Order Data: ", orderData);
// }


// // Function to update data-price and total display
// // Select all size selects and attach event listeners
// function updateProductPrice(selectElement) {
//     // Get the SKU from the selected size dropdown
//     const sku = selectElement.getAttribute('data-sku');
    
//     // Get the selected option's data-price
//     const selectedOption = selectElement.options[selectElement.selectedIndex];
//     const newPrice = selectedOption.getAttribute('data-price');
    
//     // Find the associated checkbox and update its data-price attribute
//     const checkbox = document.querySelector(`.product-checkbox[data-sku="${sku}"]`);
//     if (checkbox) {
//         checkbox.setAttribute('data-price', newPrice);
//     }
// }

// // Attach event listeners to all product size selects
// document.querySelectorAll('.product-size-select').forEach(select => {
//     select.addEventListener('change', (event) => updateProductPrice(event.target));
// });

// // Select quantity inputs and attach event listeners
// document.querySelectorAll('.product-quantity').forEach(input => {
//     input.addEventListener('input', function() {
//         let productControls = this.closest('.product-controls');
//         let sizeSelect = productControls.querySelector('.product-size-select');
//         let selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
//         let price = parseFloat(selectedOption.getAttribute('data-price'));
//         let quantity = parseInt(this.value) || 1;

//         // Calculate total based on price and quantity
//         let total = price * quantity;
//         let productTotalDisplay = productControls.querySelector('.product-total');
//         productTotalDisplay.textContent = `Total: $${total.toFixed(2)}`;
//     });
// });


// // Select the input element
// const quantityInput = document.querySelector('.product-quantity');

// // Function to update the price
// function updatePrice() {
//     const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
//     const newPrice = selectedOption.getAttribute('data-price');

//     // Update the data-price of the checkbox
//     checkbox.setAttribute('data-price', newPrice);

//     // Get the updated quantity value
//     const quantity = quantityInput.value;
//     const total = newPrice * quantity;
//     productTotal = total;
// }
// sizeSelect.addEventListener('change', updatePrice);


// modeOfPayment.addEventListener('change', function() {
//     if (modeOfPayment.value == 'cash') {
//         proofOfPaymentContainer.style.display = 'none'; 
//     } else {
//         proofOfPaymentContainer.style.display = 'block';
//     }
// });

// addItemBtn.onclick = function() {
//     modal.style.display = "flex"; 
//     console.log("addItem");
//     // updateSelectedCount(); 
// }

// // Function to close the modal when the close (x) is clicked
// closeBtn.onclick = function() {
//     modal.style.display = "none";
// }

// // Function to close modal if user clicks outside of the modal content
// window.onclick = function(event) {
//     // Close the modal only if the click is outside of the modal content
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }


// submitProductsBtn.onclick = function() {
//     console.log("Submit item");
//     let productDetailsContainer = document.getElementById("product-details");
//     productDetailsContainer.innerHTML = ''; 
//     let totalPrice = 0; // To calculate total price
//     let totalItemCount = 0; // To calculate total number of items
    
//     // Get all checked products
//     var checkboxes = document.querySelectorAll(".product-checkbox:checked");
//     let productCount = checkboxes.length; 
//     productCountDisplay.textContent = productCount;

//     checkboxes.forEach(function(checkbox) {
//         let sku = checkbox.getAttribute("data-sku");
//         let name = checkbox.getAttribute("data-name");
//         let price = parseFloat(checkbox.getAttribute("data-price"));
//         let quantityInput = document.querySelector(`.product-quantity[data-sku="${sku}"]`);
//         let quantity = parseInt(quantityInput.value); // Get the selected quantity
        
//         totalItemCount += quantity; // Add quantity to total item count
//         totalPrice += price * quantity; // Calculate total price based on quantity and price

//         // Create a product detail block to show in the main form
//         let productDetail = `
//             <div class="product-detail">
//                 <p><strong>Product Name:</strong> ${name}</p>
//                 <p><strong>Price:</strong> ₱${price.toFixed(2)}</p>
//                 <p><strong>Quantity:</strong> ${quantity}</p>
//                 <p><strong>Total:</strong> ₱${(price * quantity).toFixed(2)}</p>
//             </div>
//             <div class="product-divider-popup"></div>
//         `;
//         productDetailsContainer.innerHTML += productDetail; 
//     });

//     // Display the total number of items and total price
//     totalItemsInput.value = totalItemCount;
//     listPriceInput.value = `₱${totalPrice.toFixed(2)}`;
//     totalAmountInput.value = `₱${totalPrice.toFixed(2)}`;

//     // After adding products, close the modal
//     modal.style.display = "none";
// };



// // Add event listeners to checkboxes to update count on change
// var checkboxes = document.querySelectorAll(".product-checkbox");
// checkboxes.forEach(function(checkbox) {
//     // checkbox.addEventListener('change', updateSelectedCount);
// });

// // Handle quantity changes separately from modal close logic
// document.querySelectorAll('.quantity-controls button').forEach(button => {
//     button.addEventListener('click', function(e) {
//         e.preventDefault(); // Prevent default behavior (e.g., form submission or other default actions)
//         e.stopPropagation(); // Prevent modal close

//         let input = this.parentElement.querySelector('input');
//         let currentValue = parseInt(input.value);

//         // Increase or decrease quantity based on button type
//         if (this.textContent.trim() === '+') {
//             input.value = currentValue + 1;
//         } else if (this.textContent.trim() === '-' && currentValue > 1) {
//             input.value = currentValue - 1;
//         }
//     });
// });


// // Get survey modal and related elements


// // Open the survey modal when the button is clicked


// // Close the survey modal when the close (x) is clicked

// // Close the modal if user clicks outside the modal content
// window.onclick = function(event) {
//     if (event.target == surveyModal) {
//         surveyModal.style.display = "none";
//     }
// }

// // Print the receipt

// document.getElementById('submitOrderBtn').addEventListener('click', async () => {
//     // Example: Defining 'products' array (replace with your actual data if needed)

//     // Retrieve data from localStorage
//     const orderData = JSON.parse(localStorage.getItem('orderData')) || {};
//     console.log('Retrieved Order Data from localStorage:', orderData);

//     // Add additional data from the second site
//     const additionalData = {
//         listPrice: listPriceInput,
//         totalItems: parseInt(document.getElementById('total-items').value || 0, 10),
//         totalAmount: parseFloat(document.getElementById('total-amount').value || 0),
//         paymentMode: document.getElementById('payment-mode').value,
//         paymentImage: document.getElementById('payment-image').value,
//         remarks: document.getElementById('remarks').value,
//         products: products, // Now the products variable is defined
//     };

//     // Populate the modal fields with the dynamic values
//     document.getElementById('contactNo').textContent = "098454887";
//     document.getElementById('issueDate').textContent = new Date().toISOString().split('T')[0];
//     // document.getElementById('itemPurchased').textContent = parseInt(document.getElementById('total-items').value || 0, 10); // Replace with actual product name
//     document.getElementById('totalAmount').textContent = totalAmountInput.value;
//     document.getElementById('paymentMethod').textContent = document.getElementById('payment-mode').value;
//     document.getElementById('status').textContent = "Paid"; // Adjust as needed
//     console.log("totalamount", totalAmountInput.value)
//     // Merge the data
//     const finalData = { ...orderData, ...additionalData };

//     // Log the final data being sent to the database
//     console.log('Data being sent to the database:', finalData);

//     try {
//         // Upload the merged data
//         const response = await fetch('https://earthph.sdevtech.com.ph/orders/createOrder', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(finalData) // Send order data as JSON
//         });

//         const result = await response.json();

//         if (response.ok) {
//             alert('Order created successfully');
//             localStorage.removeItem('orderData'); // Clear localStorage if upload is successful
//         } else {
//             // Log the error message from the API
//             console.error('Error creating order:', result);
//             alert('Error creating order: ' + result.message || 'Unknown error');
//         }
//     } catch (error) {
//         // Log detailed error in case of request failure
//         console.error('Request error:', error);
//         alert('There was an error with the request.');
//     }
// });


// document.getElementById('logbutton').addEventListener('click', () => {
//     // Log individual inputs and variables
//     console.log("Contact No:", document.getElementById('contactNo').value);
//     console.log("Issue Date:", document.getElementById('issueDate').value);
//     console.log("Item Purchased:", document.getElementById('itemPurchased').value);
//     console.log("Total Amount:", document.getElementById('totalAmount').value);
//     console.log("Payment Method:", document.getElementById('paymentMethod').value);
//     console.log("Status:", document.getElementById('status').value);

//     // Log products array
//     console.log("Products Array:", products);

//     // Log the order data if available
//     const orderData = {
//         listPrice: document.getElementById('list-price').value,
//         totalItems: document.getElementById('total-items').value,
//         totalAmount: document.getElementById('total-amount').value,
//         paymentMode: document.getElementById('payment-mode').value,
//         paymentImage: document.getElementById('payment-image').value,
//         remarks: document.getElementById('remarks').value,
//         products: products // Include the products array
//     };
//     console.log("Order Data:", orderData);

//     // If using localStorage, log stored data
//     const storedData = localStorage.getItem('orderData');
//     if (storedData) {
//         console.log("Stored Order Data:", JSON.parse(storedData));
//     } else {
//         console.log("No Order Data found in localStorage.");
//     }
// });

