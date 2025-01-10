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
        <td>${order.orderDate}</td>
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
    // Get the modal and its content area
    const modal = document.getElementById('order-modal');
    const modalContent = modal.querySelector('.modal-content');

    // Create table rows for order details
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
                <th>House Address</th>
                <td>${order.houseAddress || 'No house address'}</td>
            </tr>
            <tr>
                <th>Town/Province</th>
                <td>${order.townProvince || 'No town/province'}</td>
            </tr>
            <tr>
                <th>Total Items</th>
                <td>${order.totalItems || 0}</td>
            </tr>
            <tr>
                <th>Total Amount</th>
                <td>${order.totalAmount ? `₱ ${order.totalAmount.toFixed(2)}` : 'No amount'}</td>
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
                            product => `
                            <tr>
                                <td>${product.name}</td>
                                <td>₱${product.price.toFixed(2)}</td>
                                <td>${product.quantity}</td>
                                <td>₱${product.total.toFixed(2)}</td>
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

    // Combine order details and products into the modal content
    modalContent.innerHTML = orderDetailsHTML + productsHTML + '<button id="close-modal">Close</button>';

    // Show the modal
    modal.style.display = 'block';

    // Add event listener to close the modal
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// function updateOrder(orderId, updatedStatus) {
//     const uid = orderId;  // You can use _id or another identifier based on your data model
//     const agentName = 'New Agent Name';  // Replace with actual data if needed
//     const teamLeaderName = 'New Team Leader';  // Replace with actual data if needed
//     const area = 'New Area';  // Replace with actual data if needed
//     const products = [];  // Replace with the actual product data
//     const totalAmount = 100.00;  // Replace with the actual total amount

//     // Construct the request body
//     const requestBody = {
//         uid,
//         agentName,
//         teamLeaderName,
//         area,
//         products,
//         totalAmount,
//         status: updatedStatus,  // Include the updated status
//     };

//     // Call the server to update the order (You can change the URL to your server endpoint)
//     fetch('https://earthph.sdevtech.com.ph/orders/updateOrders', {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${usertoken}`,  // Assuming you're using token for authorization
//         },
//         body: JSON.stringify(requestBody)
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then(data => {
//         if (data && data.order) {
//             console.log('Order updated:', data.order);  // Log the updated order
//         } else {
//             console.error('Failed to update the order: No order data returned');
//         }
//     })
//     .catch(error => {
//         console.error('Error updating order:', error);
//         if (error.message.includes("HTTP error!")) {
//             // If the error is an HTTP error, log additional details
//             console.log('Response body:', error.response);
//         }
//     });
// }

