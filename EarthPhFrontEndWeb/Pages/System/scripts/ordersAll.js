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
        <td>${order.orderDate }</td>
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
    `;

        // Add click event listener to row
        row.addEventListener('click', () => {
            openModal(order); // Pass the entire order object to the modal
        });

        ordersBody.appendChild(row);
    });

    // Add event listener for the status button click (if needed)
    const statusButtons = document.querySelectorAll('.status-btn');
    statusButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const orderId = e.target.dataset.orderId;
            console.log(`Updating status for order with ID: ${orderId}`);
            // You can add logic to update the order status here
        });
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
const closeModal = modal.querySelector('.close');

function openModal(order) {
    const modal = document.getElementById('order-modal');
    const modalContent = modal.querySelector('.modal-content');

    // Populate the modal with order details and include edit functionality
    const orderDetailsHTML = `
        <div class="modal-header">
            <h3>Order Details</h3>
            <button id="close-modal" class="close-modal-button">&times;</button>
        </div>
        <table>
            <tr>
                <th>Store Name</th>
                <td><input type="text" id="edit-store-name" value="${order.storeName || ''}" class="modal-input" disabled></td>
            </tr>
            <tr>
                <th>Agent Name</th>
                <td><input type="text" id="edit-agent-name" value="${order.agentName || ''}" class="modal-input" disabled></td>
            </tr>
            <tr>
                <th>Area</th>
                <td><input type="text" id="edit-area" value="${order.area || ''}" class="modal-input" disabled></td>
            </tr>
            <tr>
                <th>Total Amount</th>
                <td><input type="number" id="edit-total-amount" value="${order.totalAmount || 0}" class="modal-input" disabled></td>
            </tr>
            <tr>
                <th>Status</th>
                <td>
                    <select id="edit-status" class="modal-input" disabled>
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="paid" ${order.status === 'paid' ? 'selected' : ''}>Paid</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        <option value="received" ${order.status === 'received' ? 'selected' : ''}>Received</option>
                    </select>
                </td>
            </tr>
        </table>
        <button id="edit-button" class="edit-button">Edit</button>
        <button id="save-button" style="display:none;" class="save-button">Save</button>
    `;

    modalContent.innerHTML = orderDetailsHTML;

    // Show the modal
    modal.style.display = 'block';
    document.body.classList.add('modal-open');

    // Close modal
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });

    // Edit button functionality
    document.getElementById('edit-button').addEventListener('click', () => {
        document.querySelectorAll('.modal-input').forEach(input => input.disabled = false);
        document.getElementById('save-button').style.display = 'inline-block';
    });

    // Save button functionality
    document.getElementById('save-button').addEventListener('click', () => {
        const updatedOrder = {
            _id: order._id,
            storeName: document.getElementById('edit-store-name').value,
            agentName: document.getElementById('edit-agent-name').value,
            area: document.getElementById('edit-area').value,
            totalAmount: parseFloat(document.getElementById('edit-total-amount').value),
            status: document.getElementById('edit-status').value,
        };

        saveOrderToDatabase(updatedOrder);
    });
}

function saveOrderToDatabase(updatedOrder) {
    fetch('https://earthph.sdevtech.com.ph/orders/updateOrder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Updated Order:", data);
            alert('Order updated successfully!');
            location.reload(); // Refresh the page
        })
        .catch(error => {
            console.error('Error updating order:', error);
            alert('Failed to update order. Please try again later.');
        });
}
