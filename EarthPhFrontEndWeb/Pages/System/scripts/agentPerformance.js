// Fetch agent performance data
fetch('https://earthph.sdevtech.com.ph/users/getUsers')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const users = data.users;

        // Filter users with role 'agent'
        const agents = users.filter(user => user.role === "agent");

        // Clear previous data in the table
        document.getElementById('agent-performance').innerHTML = '';

        // Fetch orders data
        fetch('https://earthph.sdevtech.com.ph/orders/getOrders')
            .then(orderResponse => {
                if (!orderResponse.ok) {
                    throw new Error('Orders network response was not ok');
                }
                return orderResponse.json();
            })
            .then(orderData => {
                console.log("Order Data:", orderData); // Log order data for debugging

                // Check if 'orders' exists in the response and handle errors if not
                const orders = orderData || [];
                if (orders.length === 0) {
                    console.log('No orders found.');
                }

                // Populate agent performance table
                agents.forEach(agent => {
                    let totalItems = 0;
                    let totalAmount = 0;

                    // Loop through orders to find matching userUid
                    orders.forEach(order => {
                        if (order.userUid === agent.uid) {
                            totalItems += order.totalItems;
                            totalAmount += order.totalAmount;
                        }
                    });

                    // Create a row for the agent
                    const row = document.createElement('tr');

                    // Image (Random Picsum image)
                    const imageCell = document.createElement('td');
                    const img = document.createElement('img');
                    const randomImageId = Math.floor(Math.random() * 1000) + 1;  // Generate a random image ID
                    img.src = `https://picsum.photos/40/40?random=${randomImageId}`;  // Fetch a random 40x40 image
                    img.classList.add('agent-image');
                    imageCell.appendChild(img);
                    row.appendChild(imageCell);

                    // Agent Name
                    const nameCell = document.createElement('td');
                    const nameWrapper = document.createElement('div');
                    nameWrapper.classList.add('agent-name');
                    nameWrapper.textContent = `${agent.firstName} ${agent.lastName}`;
                    nameCell.appendChild(nameWrapper);
                    row.appendChild(nameCell);

                    // Team
                    const teamCell = document.createElement('td');
                    teamCell.textContent = agent.team;
                    row.appendChild(teamCell);

                    // Total Items
                    const totalItemsCell = document.createElement('td');
                    totalItemsCell.textContent = totalItems;
                    row.appendChild(totalItemsCell);

                    // Total Amount
                    const totalAmountCell = document.createElement('td');
                    // Add dollar sign before the total amount
                    totalAmountCell.textContent = `₱
                    ${totalAmount.toFixed(2)}`;  // toFixed(2) ensures 2 decimal places
                    row.appendChild(totalAmountCell);
                    

                    // Append row to table
                    document.getElementById('agent-performance').appendChild(row);
                });
            })
            .catch(error => {
                console.error('There was an issue with fetching the orders data:', error);
            });
    })
    .catch(error => {
        console.error('There was an issue with fetching the users data:', error);
    });
