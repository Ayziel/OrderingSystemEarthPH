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

        // Populate row with order data and add the button for 'Status' after the totalAmount
        row.innerHTML = `
        <td>${globalCounter++}</td>
        <td>${order.storeName || 'No store name'}</td>
        <td>${order.agentName || 'No agent name'}</td>
        <td>${order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', { timeZone: 'Asia/Manila' }) : 'No date'}</td>
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
    // Mocked database for demonstration (replace with your real database fetch logic)
    const ordersData = [
        {
            _id: "675f84f0d5910ae36aece7fa",
            agentName: "sdevName SdevSurname",
            teamLeaderName: "Aljhon Franco",
            area: "TANAY RIZAL",
            orderDate: "2024-12-16T00:00:00.000+00:00",
            storeName: "Inasal",
            houseAddress: "# 54, Lapu Lapu",
            townProvince: "lourdess",
            storeCode: "code2d",
            tin: "54768d",
            listPrice: 1000,
            discount: 0,
            totalItems: 3,
            totalAmount: 1500,
            paymentMode: "credit",
            paymentImage: "",
            remarks: "",
            products: [
                {
                    name: "Aerosol Multi-Insect Killer",
                    description: "Advanced® Aerosol Multi-Insect Killer knocks out and kills mosquitoes,…",
                    price: 215,
                    quantity: 1,
                    total: 215,
                    _id: "675f84f0d5910ae36aece7fb"
                },
                {
                    name: "Aerosol Mosquito Killer",
                    description: "Advanced® Aerosol Mosquito Killer has a breakthrough formula with Fast…",
                    price: 95,
                    quantity: 1,
                    total: 95,
                    _id: "675f84f0d5910ae36aece7fc"
                },
                {
                    name: "Pest Catch Sheet",
                    description: "Banzai® Pest Catch Sheet contains a super-strong adhesive that is sure…",
                    price: 120,
                    quantity: 1,
                    total: 120,
                    _id: "675f84f0d5910ae36aece7fd"
                }
            ],
            __v: 0
        }
    ];

    const rows = [];
    const headers = [
        "No.",
        "Agent Name",
        "Store Name",
        "Order Date",
        "Area",
        "Total Amount",
        "Payment Mode",
        "Products"
    ];
    rows.push(headers);

    ordersData.forEach((order, index) => {
        const rowData = [
            index + 1,
            order.agentName,
            order.storeName,
            new Date(order.orderDate).toLocaleString(), // Format date
            order.area,
            order.totalAmount,
            order.paymentMode,
            order.products.map(product => `${product.name} (Qty: ${product.quantity}, Price: ${product.price})`).join("; ") // Format product details
        ];
        rows.push(rowData);
    });

    // Create a workbook and sheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Orders Export");

    // Trigger the download of the Excel file
    XLSX.writeFile(wb, 'Orders_Export.xlsx');
}

const modal = document.getElementById('orderModal');
const closeModal = modal.querySelector('.close');

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

