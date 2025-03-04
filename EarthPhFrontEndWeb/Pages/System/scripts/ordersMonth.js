const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');

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

            // Get user details from localStorage
            const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));
            const userUid = matchedUser?.uid || null;
            const userRole = matchedUser?.role || null;
            const fullName = matchedUser?.firstName + ' ' + matchedUser?.lastName;

            // Get the first and last day of the current month in UTC
            const now = new Date();
            const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
            const lastDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

            console.log("Filtering from:", firstDayOfMonth.toISOString(), "to:", lastDayOfMonth.toISOString());

            // Ensure orderDate is valid before filtering
            const isValidDate = (date) => date && !isNaN(new Date(date).getTime());

            // Filtering orders for the current month
            orders = orders.filter(order => {
                const orderDate = isValidDate(order.orderDate) ? new Date(order.orderDate) : null;
                if (!orderDate) return false; // Skip invalid dates

                return orderDate >= firstDayOfMonth && orderDate <= lastDayOfMonth &&
                    (userRole === 'agent' && order.userUid === userUid || 
                     userRole === 'teamLeader' && order.teamLeaderName === fullName || 
                     userRole !== 'agent' && userRole !== 'teamLeader'); 
            });

            console.log("Filtered orders:", orders.length);

            // Sort orders by date (latest first)
            orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            orders.reverse();
            // Ensure pagination only runs if orders exist
            if (orders.length > 0) {
                $('#pagination-container').pagination({
                    dataSource: orders,
                    pageSize: 10,
                    showPageNumbers: true,
                    showPrevious: true,
                    showNext: true,
                    callback: function (data) {
                        populateOrders(data);
                    }
                });
            } else {
                console.log('No orders found for this month.');
                document.querySelector('.orders-body').innerHTML = `<tr><td colspan="10">No orders available for this month.</td></tr>`;
            }

            // Export to Excel button
            const exportButton = document.getElementById('export-btn');
            if (exportButton) {
                exportButton.addEventListener('click', () => exportToExcel(orders));
            }
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
            <td class="table-data">${order.guid || 'No GUID'}</td>
            <td class="table-data">${order.storeName || 'No store name'}</td>
            <td class="table-data">${order.agentName || 'No agent name'}</td>
            <td class="table-data">${new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            <td class="table-data">${order.area || 'No location'}</td>
            <td class="table-data">${order.totalItems || 'No items'}</td>
            <td class="table-data">${order.totalAmount ? '₱ ' + order.totalAmount.toFixed(2) : 'No amount'}</td>
               <td class="table-data">
                    ${
                        order.paymentMode
                            ? order.paymentMode === 'credit'
                                ? 'GCash'
                                : order.paymentMode.charAt(0).toUpperCase() + order.paymentMode.slice(1)
                            : 'No method'
                    }
                </td>

            <td class="open-button table-data">Open</td>
        `;

        //     <td class="table-data">
        //     <select class="status-dropdown" data-order-id="${order._id}" ${userRole === 'agent' ? 'disabled' : ''}>
        //         <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
        //         <option value="paid" ${order.status === 'paid' ? 'selected' : ''}>Paid</option>
        //         <option value="received" ${order.status === 'received' ? 'selected' : ''}>Received</option>
        //     </select>
        // </td>
    
        // Add change event listener to status dropdown (inside the loop)
        // row.querySelector('.status-dropdown').addEventListener('change', (e) => {
        //     const updatedStatus = e.target.value;
        //     const orderId = e.target.getAttribute('data-order-id');
        
        //     // Call the updateOrderStatus function
        //     updateOrderStatus(orderId, updatedStatus);
        // });
    
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
        if (window.innerWidth < 768) {
            productsHTML = `
            <h4>Products:</h4>
            <table>
                <thead>
                </thead>
                <tbody>
                    ${order.products
                        .map(
                            (product, index) => `
                        <tr>
                            <th>Product Name</th>
                            <td>${product.name}</td>
                            <th>Price</th>
                            <td>₱${product.price.toFixed(2)}</td>
                            <th>Quantity</th>
                            <td>${product.quantity}</td>
                            <th>Total</th>
                            <td>₱${(product.price * product.quantity).toFixed(2)}</td>
                        </tr>
                        `)
                        .join('')}
                </tbody>
            </table>
            <button id="save-button" style="display: none;">Save</button>
        `;
        }
        else {
        productsHTML = `
            <h4>Products:</h4>
            <table>
                <thead>
                    <tr>
                        <th class:"th-desktop-product">Product Name</th>
                        <th class:"th-desktop-product">Price</th>
                        <th class:"th-desktop-product">Quantity</th>
                        <th class:"th-desktop-product">Total</th>
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
        }
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

async function exportToExcel(orders) {
    try {
        // Fetch users
        const usersResponse = await fetch('https://earthph.sdevtech.com.ph/users/getUsers');
        const usersData = await usersResponse.json();
        const users = Array.isArray(usersData) ? usersData : usersData.users;
        if (!Array.isArray(users)) {
            console.error('Users data is not an array:', users);
            return;
        }

        // Fetch products
        const productsResponse = await fetch('https://earthph.sdevtech.com.ph/products/getProduct');
        const productsData = await productsResponse.json();
        const products = Array.isArray(productsData) ? productsData : productsData.products;
        if (!Array.isArray(products)) {
            console.error('Products data is not an array:', products);
            return;
        }

        // Fetch areas
        const areasResponse = await fetch('https://earthph.sdevtech.com.ph/area/getAreas');
        const areasData = await areasResponse.json();
        const areas = Array.isArray(areasData) ? areasData : areasData.areas;
        if (!Array.isArray(areas)) {
            console.error('Areas data is not an array:', areas);
            return;
        }

        // Convert orders to worksheet format
        const data = orders.flatMap(order => {
            const matchedUser = users.find(user => user.uid === order.userUid);
            const userID = matchedUser ? matchedUser.id || 'Not Found' : 'Not Found';

            const matchedArea = areas.find(area => area.name === order.area);
            const areaCode = matchedArea ? matchedArea.areaCode : 'No Area Assigned';

            return order.products.map(product => {
                const matchedProduct = products.find(prod => prod.uid === product.product_uid);
                const productDescription = matchedProduct ? matchedProduct.productDescription : 'No Description';

                return {
                    OrderID: order.guid ? order.guid : order._id,
                    CustomerID: userID,
                    TranDate: new Date(order.orderDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
                    Location: order.area,
                    AreaCode: areaCode, // Added AreaCode
                    ItemCode: productDescription,
                    QTYSold: product.quantity,
                    UnitPrice: product.price,
                    SalesAmt: product.quantity * product.price,
                };
            });
        });

        // Create a new workbook and add the data
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'OrdersWithProducts');

        // Export the workbook
        XLSX.writeFile(wb, 'Orders_With_Products.xlsx');
    } catch (error) {
        console.error('Error exporting orders:', error);
    }
}

