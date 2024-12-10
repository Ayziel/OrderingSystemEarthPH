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

            // Sort and populate the table with the transaction data
            orders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
            populateTransactions(orders);
        })
        .catch(error => console.error('Error fetching orders:', error));
});

function populateTransactions(orders) {
    const ordersBody = document.querySelector('.orders-body');
    ordersBody.innerHTML = ''; // Clear previous rows

    let globalCounter = 1;

    orders.forEach(order => {
        order.products.forEach(product => {
            const row = document.createElement('tr');

            // Populate row with transaction data
            row.innerHTML = `
                <td>${globalCounter++}</td>
                <td>${order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', { timeZone: 'Asia/Manila' }) : 'No date'}</td>
                <td>${order.agentName || 'No customer'}</td>
                <td>${product.name || 'No item name'}</td>
                <td>${product.quantity || 0}</td>
                <td>${product.price ? `₱ ${product.price.toFixed(2)}` : 'No price'}</td>
                <td>${order.discount ? `${order.discount}%` : 'No discount'}</td>
                <td>${product.total ? `₱ ${product.total.toFixed(2)}` : 'No amount'}</td>
            `;

            // Add row to the table
            ordersBody.appendChild(row);
        });
    });
}

document.getElementById('export-transactions-btn').addEventListener('click', exportToExcel);

function exportToExcel() {
    const ordersData = document.querySelector('.orders-body');
    if (!ordersData) {
        console.log('No transaction data found!');
        return;
    }

    const rows = [];
    const headers = ['#', 'Date', 'Customer', 'Item', 'Qty.', 'Sales Price', 'Discount', 'Amount'];
    rows.push(headers);

    const rowsData = ordersData.querySelectorAll('tr');
    rowsData.forEach(row => {
        const rowData = [];
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => rowData.push(cell.textContent.trim()));
        rows.push(rowData);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    XLSX.writeFile(wb, 'Transactions.xlsx');
}