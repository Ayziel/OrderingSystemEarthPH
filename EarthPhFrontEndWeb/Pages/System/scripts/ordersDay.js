const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
console.log("userRole", userRole);
console.log("usertoken", usertoken);

document.addEventListener('DOMContentLoaded', () => {
    fetch('https://earthph.sdevtech.com.ph/orders/getOrders')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(orders => {
        if (!orders || orders.length === 0) {
            console.log('No orders found.');
            return;
        }
        
        // Get the user data from localStorage
        const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));
        const userUid = matchedUser ? matchedUser.uid : null;
        const userRole = matchedUser ? matchedUser.role : null;

        // Only filter if role is 'agent'
        if (userRole === 'agent' && userUid) {
            orders = orders.filter(order => order.userUid === userUid);
        }

        const today = new Date();
        const startOfDay = new Date(today);
        const endOfDay = new Date(today);

        // Adjust startOfDay and endOfDay for today's boundaries
        startOfDay.setHours(0, 0, 0, 0);
        endOfDay.setHours(23, 59, 59, 999);

        const todayOrders = orders.filter(order => {
            const orderDate = new Date(order.orderDate);
            return orderDate >= startOfDay && orderDate <= endOfDay;
        });

        if (todayOrders.length === 0) {
            console.log('No orders for today.');
            return;
        }

        // Sort today's orders by order date (ascending)
        todayOrders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
        populateOrders(todayOrders);
    })
    .catch(error => console.error('Error fetching orders:', error));

});

function populateOrders(orders) {
    const ordersBody = document.querySelector('.orders-body');
    ordersBody.innerHTML = ''; // Clear previous rows

    let globalCounter = 1;

    orders.forEach(order => {
        const row = document.createElement('tr');
    
        // Populate row with order data and add the button for 'Status' after the totalAmount
        row.innerHTML = `
            <td>${globalCounter++}</td>
            <td>${order.storeName || 'No store name'}</td>
            <td>${order.agentName || 'No agent name'}</td>
            <td>${new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            <td>${order.area || 'No location'}</td>
            <td>${order.totalItems || 'No items'}</td>
            <td>${order.totalAmount ? '₱ ' + order.totalAmount.toFixed(2) : 'No amount'}</td>
            <td>${order.paymentMode ? order.paymentMode.charAt(0).toUpperCase() + order.paymentMode.slice(1) : 'No method'}</td>
            <td>
                <select class="status-dropdown" data-order-id="${order._id}" ${userRole === 'agent' ? 'disabled' : ''}>
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="paid" ${order.status === 'paid' ? 'selected' : ''}>Paid</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    <option value="received" ${order.status === 'received' ? 'selected' : ''}>Received</option>
                </select>
            </td>
            <td class="open-button">Open</td>
        `;
    
        // Add change event listener to status dropdown (inside the loop)
        row.querySelector('.status-dropdown').addEventListener('change', (e) => {
            const updatedStatus = e.target.value;
            const orderId = e.target.getAttribute('data-order-id');
            console.log(`Order ID: ${orderId}, Updated Status: ${updatedStatus}`);
            
            // Call the updateOrderStatus function
            updateOrderStatus(orderId, updatedStatus);
        });
    
        // Add click event listener to row
        row.addEventListener('click', () => {
            openModal(order); // Pass the entire order object to the modal
        });
    
        ordersBody.appendChild(row);
    });
    
}


document.getElementById('export-btn').addEventListener('click', exportToExcel);

const modal = document.getElementById('orderModal');
function openModal(order) {
    // Get the modal and its content area
    const modal = document.getElementById('order-modal');
    const modalContent = modal.querySelector('.modal-content');

    // Create table rows for order details
    const orderDetailsHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3>Order Details</h3>
            <button id="close-modal" style="border: none; background: none; color:rgb(29, 29, 29); cursor: pointer; font-size: 16px;">X</button>
        </div>
        <table>
            <tr>
                <th>Store Name</th>
                <td>${order.storeName || 'No store name'}</td>
            </tr>
            <tr>
                <th>Agent Name</th>
                <td>${order.agentName || 'No agent name'}</td>
            </tr>
            <tr>
                <th>Team Leader</th>
                <td>${order.teamLeaderName || 'No team leader'}</td>
            </tr>
            <tr>
                <th>Order Date</th>
                <td>${order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString('en-US', { timeZone: 'Asia/Manila' })
                    : 'No date'}</td>
            </tr>
            <tr>
                <th>Area</th>
                <td>${order.area || 'No area'}</td>
            </tr>
            <tr>
                <th>Total Items</th>
                <td id="total-items">${order.totalItems || 0}</td>
            </tr>
            <tr>
                <th>Total Amount</th>
                <td id="total-amount">${order.totalAmount ? `₱ ${order.totalAmount.toFixed(2)}` : 'No amount'}</td>
            </tr>
            <tr>
                <th>Remarks</th>
                <td>${order.remarks || 'No remarks'}</td>
            </tr>
        </table>
    `;

    // Add the product details as a table if products exist
    let productsHTML = '';
    if (order.products && order.products.length > 0) {
        productsHTML = `
            <h4>Products:</h4>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.products
                        .map(
                            (product, index) => `
                        <tr>
                            <td>${product.name}</td>
                            <td>₱${product.price.toFixed(2)}</td>
                            <td>${product.quantity}</td>
                            <td>₱${(product.price * product.quantity).toFixed(2)}</td>
                        </tr>
                        `)
                        .join('')}
                </tbody>
            </table>
            <button id="save-button" style="display: none;">Save</button>
        `;
    } else {
        productsHTML = `<p>No products available.</p>`;
    }

    // Combine order details and products into the modal content
    modalContent.innerHTML = orderDetailsHTML + productsHTML;

    // Show the modal
    modal.style.display = 'block';

    // Add event listener to close the modal
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Handle edit button click
    document.getElementById('edit-button').addEventListener('click', () => {
        const priceInputs = document.querySelectorAll('.product-price');
        const quantityInputs = document.querySelectorAll('.product-quantity');
        
        // Enable the price and quantity fields
        priceInputs.forEach(input => input.disabled = false);
        quantityInputs.forEach(input => input.disabled = false);

        // Show save button, hide edit button
        document.getElementById('save-button').style.display = 'inline-block';
        document.getElementById('edit-button').style.display = 'none';
    });

    // Update total whenever price or quantity is changed
    const updateTotal = (index) => {
        const price = parseFloat(document.querySelectorAll('.product-price')[index].value);
        const quantity = parseInt(document.querySelectorAll('.product-quantity')[index].value, 10);
        const total = price * quantity;
        document.getElementById(`product-total-${index}`).textContent = `₱${total.toFixed(2)}`;

        // Recalculate and update total amount and total items
        updateOrderSummary(order.products);
    };

    // Update the order summary (total amount and total items)
    const updateOrderSummary = (products) => {
        const { totalAmount, totalItems } = calculateTotalAmountAndItems(products);
        console.log('Updating order summary: totalAmount', totalAmount, 'totalItems', totalItems);
        document.getElementById('total-amount').textContent = `₱ ${totalAmount.toFixed(2)}`;
        document.getElementById('total-items').textContent = totalItems;
    };

    // Calculate total amount and total items
    function calculateTotalAmountAndItems(products) {
        let totalAmount = 0;
        let totalItems = 0;
        products.forEach(product => {
            totalAmount += product.total;
            totalItems += product.quantity;
        });
        console.log('Calculated totalAmount:', totalAmount, 'totalItems:', totalItems);
        return { totalAmount, totalItems };
    }

    // Add event listeners to the price and quantity inputs
    const priceInputs = document.querySelectorAll('.product-price');
    const quantityInputs = document.querySelectorAll('.product-quantity');

    priceInputs.forEach((input, index) => {
        input.addEventListener('input', () => updateTotal(index));
    });

    quantityInputs.forEach((input, index) => {
        input.addEventListener('input', () => updateTotal(index));
    });

    // Handle save button click
    document.getElementById('save-button').addEventListener('click', () => {
        console.log('Save button clicked');

        const updatedProducts = order.products.map((product, index) => {
            const price = parseFloat(document.querySelectorAll('.product-price')[index].value);
            const quantity = parseInt(document.querySelectorAll('.product-quantity')[index].value, 10);
            return {
                ...product,
                price,
                quantity,
                total: price * quantity, // Recalculate total
            };
        });

        // Recalculate total amount and total items after the update
        const { totalAmount, totalItems } = calculateTotalAmountAndItems(updatedProducts);
        console.log('Updated products:', updatedProducts);
        console.log('Sending data to the backend: totalAmount', totalAmount, 'totalItems', totalItems);

        // Update the order with new products, totalAmount, and totalItems
        fetch(`https://earthph.sdevtech.com.ph/orders/updateOrders/${order._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`,
            },
            body: JSON.stringify({
                products: updatedProducts,
                totalAmount: totalAmount,
                totalItems: totalItems,  // Send totalItems to the backend
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from backend:', data);
            if (data.message === 'Order updated successfully') {
                console.log('Order updated successfully');
                window.location.reload(); // Refresh the page to get the updated data
            } else {
                console.error('Failed to update order:', data.message);
            }
        })
        .catch(error => console.error('Error updating order:', error));
    });
}







function updateOrderStatus(orderId, status) {
    fetch(`https://earthph.sdevtech.com.ph/orders/updateOrders/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`,
        },
        body: JSON.stringify({ status: status }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Order updated successfully') {
            console.log('Order status updated:', data.order);
        } else {
            console.error('Failed to update order:', data.message);
        }
    })
    .catch(error => console.error('Error updating order:', error));
}
