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
            console.log('Matched User:', matchedUser);

            // Filtering logic based on user role
            if (userRole === 'agent' && userUid) {
                console.log("You're an agent");
                orders = orders.filter(order => order.userUid === userUid);
            } else if (userRole === 'teamLeader') {
                console.log("You're a Team Leader");
                orders = orders.filter(order => order.teamLeaderName === matchedUser.firstName + ' ' + matchedUser.lastName);
            }

            // Sort orders by order date (newest first)
            orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

            // Initialize Pagination
            $('#pagination-container').pagination({
                dataSource: orders,
                pageSize: 10, // Change this to the number of rows per page
                showPageNumbers: true,
                showPrevious: true,
                showNext: true,
                callback: function (data, pagination) {
                    populateOrders(data);
                }
            });

            // Export to Excel
            const exportButton = document.getElementById('export-btn');
            if (exportButton) {
                exportButton.addEventListener('click', () => exportToExcel(orders));
            }
        })
        .catch(error => console.error('Error fetching orders:', error));
});

// Function to populate the orders in the table
function populateOrders(data) {
    const tbody = document.getElementById('data-body');
    tbody.innerHTML = ''; // Clear existing rows

    data.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.uid}</td>
            <td>${order.storeName}</td>
            <td>${order.agentName}</td>
            <td>${order.orderDate}</td>
            <td>${order.area}</td>
            <td>${order.totalItems}</td>
            <td>${order.totalAmount}</td>
            <td>${order.paymentMode}</td>
            <td>${order.status}</td>
            <td>View</td>
        `;
        tbody.appendChild(row);
    });
}