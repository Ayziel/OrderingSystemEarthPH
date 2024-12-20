document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5001/orders/getOrders')
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

            todaysOrders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
            populateOrders(todaysOrders);
        })
        .catch(error => console.error('Error fetching orders:', error));
});

function populateOrders(orders) {
    const ordersBody = document.querySelector('.orders-body');
    ordersBody.innerHTML = ''; // Clear previous rows

    let globalCounter = 1;

    orders.forEach(order => {
        const row = document.createElement('tr');

        // Populate row with order data
        row.innerHTML = `
            <td>${globalCounter++}</td>
            <td>${order.storeName || 'No store name'}</td>
            <td>${order.agentName || 'No agent name'}</td>
            <td>${order.orderDate
                ? new Date(order.orderDate).toLocaleDateString('en-US', { timeZone: 'Asia/Manila' })
                : 'No date'}</td>
            <td>${order.area || 'No location'}</td>
            <td>${order.totalAmount
                ? `₱ ${order.totalAmount.toFixed(2)}`
                : 'No amount'}</td>
        `;

        // Add click event listener to row
        row.addEventListener('click', () => {
            openModal(order); // Pass the entire order object to the modal
        });

        ordersBody.appendChild(row);
    });
}




document.getElementById('export-btn').addEventListener('click', exportToExcel);

function exportToExcel() {
    const ordersBody = document.querySelector('.orders-body'); // Target the orders table body
    if (!ordersBody) {
        console.log('No orders data found!');
        return;
    }

    const rows = [];
    const headers = ['No.', 'Store Name', 'Agent Name', 'Order Date', 'Area', 'Total Amount']; // Define table headers
    rows.push(headers);

    const orderRows = ordersBody.querySelectorAll('tr'); // Get all rows of orders

    orderRows.forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach(cell => {
            rowData.push(cell.textContent.trim()); // Get the text from each cell
        });
        rows.push(rowData); // Add row data to rows array
    });

    // Create a workbook and sheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Today's Orders");

    // Trigger the download of the Excel file
    XLSX.writeFile(wb, 'Orders_Today.xlsx');
}



const modal = document.getElementById('orderModal');
const closeModal = modal.querySelector('.close');

function openModal(order) {
    // Get the modal and its content area
    const modal = document.getElementById('order-modal');
    const modalContent = modal.querySelector('.modal-content');

    // Populate modal with order data
    let productsHTML = '';
    if (order.products && order.products.length > 0) {
        productsHTML = `
            <h4>Products:</h4>
            <ul>
                ${order.products
                    .map(
                        product => `
                        <li>
                            <strong>${product.name}:</strong> 
                            <br>
                            Price: ₱${product.price.toFixed(2)}<br>
                            Quantity: ${product.quantity}<br>
                            Total: ₱${product.total.toFixed(2)}
                        </li>
                    `
                    )
                    .join('')}
            </ul>
        `;
    } else {
        productsHTML = `<p>No products available.</p>`;
    }

    modalContent.innerHTML = `
        <h3>Order Details</h3>
        <p><strong>Store Name:</strong> ${order.storeName || 'No store name'}</p>
        <p><strong>Agent Name:</strong> ${order.agentName || 'No agent name'}</p>
        <p><strong>Team Leader:</strong> ${order.teamLeaderName || 'No team leader'}</p>
        <p><strong>Order Date:</strong> ${
            order.orderDate
                ? new Date(order.orderDate).toLocaleDateString('en-US', { timeZone: 'Asia/Manila' })
                : 'No date'
        }</p>
        <p><strong>Area:</strong> ${order.area || 'No area'}</p>
        <p><strong>House Address:</strong> ${order.houseAddress || 'No house address'}</p>
        <p><strong>Town/Province:</strong> ${order.townProvince || 'No town/province'}</p>
        <p><strong>Total Items:</strong> ${order.totalItems || 0}</p>
        <p><strong>Total Amount:</strong> ${
            order.totalAmount ? `₱ ${order.totalAmount.toFixed(2)}` : 'No amount'
        }</p>
        <p><strong>Remarks:</strong> ${order.remarks || 'No remarks'}</p>
        ${productsHTML}
        <button id="close-modal">Close</button>
    `;

    // Show the modal
    modal.style.display = 'block';

    // Add event listener to close the modal
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

