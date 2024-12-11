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

            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            const todaysOrders = orders.filter(order => {
                const orderDate = new Date(order.orderDate).toISOString().split('T')[0];
                return orderDate === today;
            });

            if (todaysOrders.length === 0) {
                console.log('No orders from today.');
                return;
            }

            todaysOrders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate)); // Sort orders by date
            populateOrders(todaysOrders); // Populate table with today's orders
        })
        .catch(error => console.error('Error fetching orders:', error));
});

function populateOrders(orders) {
    const ordersBody = document.querySelector('.orders-body');
    ordersBody.innerHTML = ''; // Clear previous rows

    let globalCounter = 1;

    orders.forEach(order => {
        const row = document.createElement('tr');

        // Main order row displaying order summary
        row.innerHTML = `
            <td>${globalCounter++}</td>
            <td>${new Date(order.orderDate).toLocaleDateString('en-US', { timeZone: 'Asia/Manila' })}</td>
            <td>${order.storeName || 'No store name'}</td>
            <td colspan="1">
                <button class="transactions_view-btn">View Products</button>
            </td>
            <td>₱ ${order.totalAmount.toFixed(2)}</td>
        `;

        // Add click event listener to row for modal
        row.querySelector('.transactions_view-btn').addEventListener('click', () => {
            openModal(order); // Pass the entire order object to the modal
        });

        ordersBody.appendChild(row);
    });
}

document.getElementById('export-transactions-btn').addEventListener('click', exportToExcel);

function exportToExcel() {
    const ordersTable = document.querySelector('.orders-table');
    if (!ordersTable) {
        console.log('No order table found!');
        return;
    }

    const rows = [];
    const headers = [];

    // Get the headers from the table
    const headerCells = ordersTable.querySelectorAll('thead th');
    headerCells.forEach(cell => headers.push(cell.textContent.trim()));
    rows.push(headers);

    // Get the rows of order data (not product details)
    const orderRows = ordersTable.querySelectorAll('tbody tr');
    orderRows.forEach(row => {
        const rowData = [];
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => rowData.push(cell.textContent.trim()));
        rows.push(rowData);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Today's Orders");

    XLSX.writeFile(wb, 'Orders_Today.xlsx');
}

const modal = document.getElementById('transaction-modal');
const closeModal = document.querySelector('.close');

function openModal(order) {
    // Get the modal and its content area
    const modalContent = modal.querySelector('.modal-content');

    // Build the order details table
    const orderDetailsHTML = `
        <h3>Order Details</h3>
        <table>
            <tr><th>Store Name</th><td>${order.storeName || 'No store name'}</td></tr>
            <tr><th>Agent Name</th><td>${order.agentName || 'No agent name'}</td></tr>
            <tr><th>Team Leader</th><td>${order.teamLeaderName || 'No team leader'}</td></tr>
            <tr><th>Order Date</th><td>${order.orderDate
                ? new Date(order.orderDate).toLocaleDateString('en-US', { timeZone: 'Asia/Manila' })
                : 'No date'}</td></tr>
            <tr><th>Area</th><td>${order.area || 'No area'}</td></tr>
            <tr><th>House Address</th><td>${order.houseAddress || 'No house address'}</td></tr>
            <tr><th>Town/Province</th><td>${order.townProvince || 'No town/province'}</td></tr>
            <tr><th>Total Items</th><td>${order.totalItems || 0}</td></tr>
            <tr><th>Total Amount</th><td>₱${order.totalAmount ? order.totalAmount.toFixed(2) : 'No amount'}</td></tr>
            <tr><th>Remarks</th><td>${order.remarks || 'No remarks'}</td></tr>
        </table>
    `;

    // Build the products table
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
                            product => `
                            <tr>
                                <td>${product.name}</td>
                                <td>₱${product.price.toFixed(2)}</td>
                                <td>${product.quantity}</td>
                                <td>₱${(product.price * product.quantity).toFixed(2)}</td>
                            </tr>
                        `
                        )
                        .join('')}
                </tbody>
            </table>
        `;
    } else {
        productsHTML = `<p>No products available.</p>`;
    }

    // Populate the modal content
    modalContent.innerHTML = orderDetailsHTML + productsHTML + '<button id="close-modal">Close</button>';

    // Show the modal
    modal.style.display = 'block';

    // Add event listener to close the modal
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

