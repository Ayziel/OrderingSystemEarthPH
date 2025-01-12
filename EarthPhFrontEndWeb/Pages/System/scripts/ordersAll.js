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

            // Remove the filtering for today's orders
            // const today = new Date().toISOString().split('T')[0];
            // const todaysOrders = orders.filter(order => {
            //     const orderDate = new Date(order.orderDate).toISOString().split('T')[0];
            //     return orderDate === today;
            // });

            // if (todaysOrders.length === 0) {
            //     console.log('No orders from today.');
            //     return;
            // }

            // Sort all orders by order date
            orders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
            populateOrders(orders);
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
        <td>${order.totalAmount ? '₱ ' + order.totalAmount.toFixed(2) : 'No amount'}</td>
        <td>
            <select class="status-dropdown" data-order-id="${order._id}">
                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="paid" ${order.status === 'paid' ? 'selected' : ''}>Paid</option>
                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                <option value="received" ${order.status === 'received' ? 'selected' : ''}>Received</option>
            </select>
        </td>
        <td class="open-button">Open</td>
    `;

        // Add change event listener to status dropdown
        row.querySelector('.status-dropdown').addEventListener('change', (e) => {
            const updatedStatus = e.target.value;
            console.log(`Order ID: ${order._id}, Updated Status: ${updatedStatus}`);

            // Call the updateOrder method (or just log for now)
            // updateOrder(order._id, updatedStatus);
        });

        // Add click event listener to row
        row.addEventListener('click', () => {
            openModal(order); // Pass the entire order object to the modal
        });

        ordersBody.appendChild(row);
    });
}



document.getElementById('export-btn').addEventListener('click', exportToExcel);

function exportToExcel() {
    // Fetch the orders data from the API
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

            // Sort all orders by order date
            orders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));

            // Prepare data for Excel export
            const rows = [];
            const headers = [
                "No.",
                "Agent Name",
                "Store Name",
                "Order Date",
                "Area",
                "Payment Mode",
                "Products",
                "Total Amount",
            ];
            rows.push(headers);

            orders.forEach((order, index) => {
                const rowData = [
                    index + 1,
                    order.agentName,
                    order.storeName,
                    new Date(order.orderDate).toLocaleString(), // Format date
                    order.area,
                    order.paymentMode,
                    order.products.map(product => `${product.name} (Qty: ${product.quantity}, Price: ${product.price})`).join(" - "), // Format product details
                    order.totalAmount,
                ];
                rows.push(rowData);
            });

            // Create a workbook and sheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(rows);
            XLSX.utils.book_append_sheet(wb, ws, "Orders Export");

            // Trigger the download of the Excel file
            XLSX.writeFile(wb, 'All_Orders_Export.xlsx');
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            alert('Failed to fetch orders. Please try again later.');
        });
}

const modal = document.getElementById('orderModal');
// const closeModal = modal.querySelector('.close');

function openModal(order) {
    const modal = document.getElementById('order-modal');
    const modalContent = modal.querySelector('.modal-content');

    // Order Details (non-editable fields remain as text)
    const orderDetailsHTML = `
        <h3>Order Details</h3>
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
                <td><input type="number" id="edit-total-items" value="${order.totalItems || 0}" /></td>
            </tr>
            <tr>
                <th>Total Amount</th>
                <td>₱ <span id="display-total-amount">${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</span></td>
            </tr>
            <tr>
                <th>Remarks</th>
                <td>${order.remarks || 'No remarks'}</td>
            </tr>
        </table>
    `;

    // Product Details (editable fields for quantity and price)
    const productsHTML = order.products && order.products.length > 0
        ? `
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
                            <td>
                                <input type="number" step="0.01" class="edit-product-price" data-index="${index}" value="${product.price.toFixed(2)}" />
                            </td>
                            <td>
                                <input type="number" class="edit-product-quantity" data-index="${index}" value="${product.quantity}" />
                            </td>
                            <td>₱ <span class="product-total" data-index="${index}">${product.total.toFixed(2)}</span></td>
                        </tr>
                    `
                    )
                    .join('')}
            </tbody>
        </table>
    `
        : '<p>No products available.</p>';

    // Combine content and include Save button
    modalContent.innerHTML = `
        ${orderDetailsHTML}
        ${productsHTML}
        <button id="save-order">Save</button>
        <button id="close-modal">Close</button>
    `;

    // Show modal
    modal.style.display = 'block';

    // Add event listeners
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.querySelectorAll('.edit-product-price, .edit-product-quantity').forEach(input => {
        input.addEventListener('input', () => updateProductTotals(order.products));
    });

    document.getElementById('save-order').addEventListener('click', () => saveOrderChanges(order));
}

// Function to update product totals when editing
function updateProductTotals(products) {
    const updatedTotalItems = Array.from(document.querySelectorAll('.edit-product-quantity')).reduce((sum, input, index) => {
        const quantity = parseFloat(input.value) || 0;
        const priceInput = document.querySelector(`.edit-product-price[data-index="${index}"]`);
        const price = parseFloat(priceInput.value) || 0;
        const total = quantity * price;

        // Update displayed product total
        const totalDisplay = document.querySelector(`.product-total[data-index="${index}"]`);
        totalDisplay.textContent = total.toFixed(2);

        return sum + quantity;
    }, 0);

    // Update total items
    document.getElementById('edit-total-items').value = updatedTotalItems;

    // Update total amount
    const totalAmount = Array.from(document.querySelectorAll('.product-total')).reduce((sum, span) => sum + parseFloat(span.textContent), 0);
    document.getElementById('display-total-amount').textContent = totalAmount.toFixed(2);
}

// Function to save changes and send updates to the server
async function saveOrderChanges(order) {
    // Collect updated data
    const totalItems = parseInt(document.getElementById('edit-total-items').value) || 0;
    const updatedProducts = order.products.map((product, index) => ({
        ...product,
        price: parseFloat(document.querySelector(`.edit-product-price[data-index="${index}"]`).value) || product.price,
        quantity: parseInt(document.querySelector(`.edit-product-quantity[data-index="${index}"]`).value) || product.quantity,
    }));

    // Update the order object
    const updatedOrder = {
        ...order,
        totalItems: totalItems,
        totalAmount: updatedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0),
        products: updatedProducts,
    };

    try {
        // Send updated order to the server
        const response = await fetch('https://earthph.sdevtech.com.ph/orders/updateOrders', {
            method: 'PUT', // Use PUT to match the server route
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedOrder),
        });

        if (response.ok) {
            alert('Order updated successfully!');
            location.reload(); // Refresh the page  
        } else {
            alert('Failed to update order. Please try again.');
        }
    } catch (error) {
        console.error('Error updating order:', error);
        alert('An error occurred while updating the order.');
    }
}
