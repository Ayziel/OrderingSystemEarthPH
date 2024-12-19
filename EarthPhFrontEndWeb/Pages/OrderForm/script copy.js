// // Get modal and related elements
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

// let submitOrderBtn = document.getElementById('submitOrderBtn');
// // Function to open the modal when "Add Item" is clicked

// const sizeSelect = document.querySelector('.product-size-select');
// const checkbox = document.querySelector('.product-checkbox');
// const productTotal = document.querySelector('.product-total');

// function submitLog() {
//     console.log("clicked");

//     // Collect other form data as before
//     console.log("Agent Name: " + document.getElementById("agent-name").value);
//     console.log("Team Leader: " + document.getElementById("team-leader").value);
//     console.log("Area: " + document.getElementById("area").value);
//     console.log("Order Date: " + document.getElementById("order-date").value);
//     console.log("Store Name: " + document.getElementById("store-name").value);
//     console.log("House Number and Street: " + document.getElementById("house-address").value);
//     console.log("Town and Province: " + document.getElementById("town-province").value);
//     console.log("Store Code: " + document.getElementById("store-code").value);
//     console.log("TIN: " + document.getElementById("tin").value);
//     console.log("List Price of Orders: " + document.getElementById("list-price").value);
//     console.log("Discount Percentage: " + document.getElementById("discount").value);
//     console.log("Total Number of Items Bought: " + document.getElementById("total-items").value);
//     console.log("Total Amount: " + document.getElementById("total-amount").value);
//     console.log("Mode of Payment: " + document.getElementById("payment-mode").value);
//     console.log("Proof of Payment Image: " + document.getElementById("payment-image").value);
//     console.log("Remarks: " + document.getElementById("remarks").value);

//     // Collect product data from dynamically generated product details
//     let productDetailsContainer = document.getElementById("product-details");
//     let products = [];

//     // Get all the product details
//     let productDetails = productDetailsContainer.querySelectorAll(".product-detail");

//     productDetails.forEach(function(product) {
//         let name = product.querySelector("p:nth-child(1)").textContent.replace("Product Name: ", "");
//         let description = product.querySelector("p:nth-child(2)").textContent.replace("Description: ", "");
//         let price = parseFloat(product.querySelector("p:nth-child(3)").textContent.replace("Price: ₱", ""));
//         let quantity = parseInt(product.querySelector("p:nth-child(4)").textContent.replace("Quantity: ", ""));
//         let total = parseFloat(product.querySelector("p:nth-child(5)").textContent.replace("Total: ₱", ""));

//         // Push each product's details to the array
//         products.push({
//             name: name,
//             description: description,
//             price: price,
//             quantity: quantity,
//             total: total
//         });
//     });

//     // Log all the collected product data
//     console.log("Products: ", products);

//     // Log the full order data (including products)
//     const orderData = {
//         agentName: document.getElementById("agent-name").value,
//         teamLeaderName: document.getElementById("team-leader").value,
//         area: document.getElementById("area").value,
//         orderDate: document.getElementById("order-date").value,
//         storeName: document.getElementById("store-name").value,
//         houseAddress: document.getElementById("house-address").value,
//         townProvince: document.getElementById("town-province").value,
//         storeCode: document.getElementById("store-code").value,
//         tin: document.getElementById("tin").value,
//         listPrice: document.getElementById("list-price").value,
//         discount: document.getElementById("discount").value,
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
//     updateSelectedCount(); 
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

// // Function to update the count of selected products
// function updateSelectedCount() {
//     let count = 0;
//     var checkboxes = document.querySelectorAll(".product-checkbox");
//     checkboxes.forEach(function(checkbox) {
//         if (checkbox.checked) {
//             count++;
//         }
//     });
//     selectedCount.textContent = `Selected Products: ${count}`;
// }

// // Add event listeners to checkboxes to update count on change
// var checkboxes = document.querySelectorAll(".product-checkbox");
// checkboxes.forEach(function(checkbox) {
//     checkbox.addEventListener('change', updateSelectedCount);
// });

// // Set the current date in the Order Date input field
// window.onload = function() {
//     const orderDateInput = document.getElementById("order-date");
//     const today = new Date().toISOString().split("T")[0]; 
//     orderDateInput.value = today; 
// };

// submitProductsBtn.onclick = function() {
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
//         let description = checkbox.getAttribute("data-description");
//         let price = parseFloat(checkbox.getAttribute("data-price"));
//         let quantityInput = document.querySelector(`.product-quantity[data-sku="${sku}"]`);
//         let quantity = parseInt(quantityInput.value); // Get the selected quantity
        
//         totalItemCount += quantity; // Add quantity to total item count
//         totalPrice += price * quantity; // Calculate total price based on quantity and price

//         // Create a product detail block to show in the main form
//         let productDetail = `
//             <div class="product-detail">
//                 <p><strong>Product Name:</strong> ${name}</p>
//                 <p><strong>Description:</strong> ${description}</p>
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

//     // Calculate discounted total (default to totalPrice if no discount is applied)
//     let discount = parseFloat(discountInput.value) || 0;
//     let discountedTotal = totalPrice - (totalPrice * (discount / 100));

//     // Display discounted total
//     totalAmountInput.value = `₱${discountedTotal.toFixed(2)}`;

//     // Apply discount if the user changes the discount input
//     discountInput.oninput = function() {
//         let discount = parseFloat(discountInput.value) || 0;
//         let discountedTotal = totalPrice - (totalPrice * (discount / 100));
//         totalAmountInput.value = `₱${discountedTotal.toFixed(2)}`;
// };

//     // After adding products, close the modal
//     modal.style.display = "none";
// }

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

// // Barangay list for "San Fernando, Pampanga"
// document.getElementById('town-province').addEventListener('change', function() {
//     var barangayDropdown = document.getElementById('barangay');
//     var selectedTown = this.value;

//     // Clear existing barangay options
//     barangayDropdown.innerHTML = '<option value="" selected disabled>Select Barangay</option>';

//     // Enable the barangay dropdown
//     barangayDropdown.disabled = false;

//     // Define barangays for San Fernando Pampanga and Makati
//     var barangays = {
//         'san-fernando-pampanga': [
//             'Alasas', 'Baliti', 'Bulaon', 'Calulut', 'Dela Paz Norte', 'Dela Paz Sur', 
//             'Del Carmen', 'Del Pilar', 'Del Rosario', 'Dolores', 'Juliana', 'Lara', 
//             'Lourdes', 'Magliman', 'Maimpis', 'Malino', 'Malpitic', 'Pandaras', 
//             'Panipuan', 'Pulung Bulu', 'Pulung Cacutud', 'Quebiawan', 'Saguin', 
//             'San Agustin', 'San Felipe', 'San Isidro', 'San Jose', 'San Juan', 
//             'San Nicolas', 'Santa Lucia', 'Santa Teresita', 'Santo Niño', 
//             'Sindalan', 'Telabastagan', 'Sinulatan II'
//         ],
//         'makati': [
//             'Bel-Air', 'Carmona', 'Cembo', 'Comembo', 'Dasmariñas', 'Forbes Park', 
//             'Guadalupe Nuevo', 'Guadalupe Viejo', 'Kasilawan', 'La Paz', 
//             'Magallanes', 'Olympia', 'Poblacion', 'Post Proper Northside', 
//             'Post Proper Southside', 'San Antonio', 'San Isidro', 'San Lorenzo', 
//             'Santa Cruz', 'Singkamas', 'Tejeros', 'Urdaneta', 'Valenzuela', 
//             'Bangkal', 'East Rembo', 'Pio del Pilar', 'Pembo', 'Pitogo', 'Rizal', 
//             'South Cembo', 'West Rembo'
//         ]
//     };

//     // Populate barangay dropdown based on selected town
//     if (barangays[selectedTown]) {
//         barangays[selectedTown].forEach(function(brgy) {
//             var option = document.createElement('option');
//             option.value = brgy.toLowerCase().replace(/\s+/g, '-');
//             option.textContent = brgy;
//             barangayDropdown.appendChild(option);
//         });
//     }
// });

// // Get survey modal and related elements
// var surveyModal = document.getElementById("surveyModal");
// var surveyBtn = document.getElementById("surveyBtn");
// var closeSurveyBtn = document.getElementsByClassName("close-survey")[0];
// var submitSurveyBtn = document.getElementById("submitSurveyBtn");

// // Open the survey modal when the button is clicked
// surveyBtn.onclick = function() {
//     surveyModal.style.display = "flex";
// }

// // Close the survey modal when the close (x) is clicked
// closeSurveyBtn.onclick = function() {
//     surveyModal.style.display = "none";
// }

// // Close the modal if user clicks outside the modal content
// window.onclick = function(event) {
//     if (event.target == surveyModal) {
//         surveyModal.style.display = "none";
//     }
// }


// document.getElementById("orderForm").addEventListener("submit", function (e) {
//     e.preventDefault(); // Prevent the default form submission

    

//     // Example items for the receipt
//     const items = [
//         { name: "Lorem ipsum", qty: 1, price: 9.2 },
//         { name: "Lorem ipsum dolor sit", qty: 1, price: 19.2 },
//         { name: "Lorem ipsum dolor sit amet", qty: 1, price: 15.0 },
//     ];

//     let subTotal = 0;
//     const tbody = document.getElementById("orderDetails");
//     tbody.innerHTML = ""; // Clear previous items

//     items.forEach(item => {
//         subTotal += item.price;

//         const row = `<tr>
//             <td>${item.name}</td>
//             <td>${item.qty}</td>
//             <td>₱${item.price.toFixed(2)}</td>
//         </tr>`;
//         tbody.innerHTML += row;
//     });

//     document.getElementById("subTotal").innerText = subTotal.toFixed(2);
//     document.getElementById("cash").innerText = (subTotal + 92.4).toFixed(2); // Example cash

//     // Show the receipt and Print Order button
//     document.getElementById("orderReceipt").style.display = "block";
//     document.getElementById("printOrderBtn").style.display = "block";
// });

// // Print the receipt
// function printOrder() {
//     const printContents = document.getElementById("orderReceipt").innerHTML;
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write("<html><head><title>Print Order</title></head><body>");
//     printWindow.document.write(printContents);
//     printWindow.document.write("</body></html>");
//     printWindow.document.close();
//     printWindow.print();
// }
