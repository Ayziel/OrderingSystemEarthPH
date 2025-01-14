// Global variables to track total sales and product sales
let totalSales = 0; // Variable to store the total sales amount
let productSales = {}; // Object to store the quantity sold for each product
let overAllProfit = 0;
let sales = 0;
let stores = 0;
let customers = 0;
let agents = 0;
let topSales = [];
let myLineChart= null;


const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
console.log("userRole", userRole);
console.log("usertoken", usertoken);

// function logAllLocalStorageItems() {
//     console.log("Items in localStorage:");
//     for (let i = 0; i < localStorage.length; i++) {
//         const key = localStorage.key(i); // Get the key at index `i`
//         const value = localStorage.getItem(key); // Get the value associated with the key
//         console.log(`${key}: ${value}`);
//     }
// }

// // Call the function
// logAllLocalStorageItems();


document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    console.log("token", token);
    if (!token) {
        window.location.href = 'https://earthhomecareph.astute.services/System/login.html';  // Redirect to login page if no token
    }
});

// Function to update the progress bar, percentage, and item name dynamically
// Function to update the progress bar, percentage, and item name dynamically
function updateProgress(index, itemName, percentage) {
    const itemId = `top${index}`;
    const itemElement = document.getElementById(itemId + "Item");
    const percentageElement = document.getElementById(itemId + "Percentage");
    const progressBar = document.getElementById(itemId + "Progress");

    // Ensure the elements exist before trying to update them
    if (itemElement && percentageElement && progressBar) {
        // Update the name of the item (e.g., "Item One")
        itemElement.innerHTML = `${itemName} <span id="${itemId}Percentage" class="pull-right">${percentage.toFixed(2)}%</span>`;
        
        // Update the width of the progress bar
        progressBar.style.width = percentage + "%";
        
        // Update the percentage text
        percentageElement.innerText = percentage.toFixed(2) + "%";
    } else {
        console.error(`Element with id ${itemId} not found.`);
    }
}
// Function to fetch orders and process them
// Main function to fetch orders
function fetchOrders() {
    // Step 1: Fetch the logged-in user's data from local storage
    const currentUserRole = localStorage.getItem('userRole');
    const currentUserTeam = localStorage.getItem('userTeam');
    
    // Fetching the matchedUser object from localStorage
    const matchedUserData = localStorage.getItem('matchedUser'); // Assuming the object is stored under the 'matchedUser' key
    let currentUserUid = null;
    
    if (matchedUserData) {
        try {
            // Parse the matchedUser data
            const parsedData = JSON.parse(matchedUserData);
            // Access the userUid from the matchedUser object
            currentUserUid = parsedData.uid; // Corrected line
        } catch (error) {
            console.error("Error parsing matchedUser data:", error);
        }
    }
    
    // Step 2: Fetch the list of users
    fetch('https://earthph.sdevtech.com.ph/users/getUsers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users.');
            }
            return response.json();
        })
        .then(userData => {
            const users = userData.users; // All users fetched

            // Step 3: Fetch orders
            return fetch('https://earthph.sdevtech.com.ph/orders/getOrders')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch orders.');
                    }
                    return response.json();
                })
                .then(orders => {
                    if (!orders || orders.length === 0) {
                        console.log('No orders found.');
                        return;
                    }

                    // Step 4: If the user is an agent, apply the filter by userUid
                    let filteredOrders = orders;

                    if (currentUserRole === 'agent' && currentUserUid) {
                        // Filter orders only for the logged-in agent's UID
                        filteredOrders = orders.filter(order => order.userUid === currentUserUid);
                    }

                    // Step 5: If the user is a team leader, filter orders by team; otherwise, no filter is applied
                    if (currentUserRole === 'teamLeader') {
                        filteredOrders = orders.filter(order => {
                            const user = users.find(user => user.uid === order.userUid);
                            return user && user.team === currentUserTeam;
                        });
                    }

                    if (filteredOrders.length === 0) {
                        console.log('No orders match the current user role or team.');
                        return;
                    }

                    // Step 6: Process and display the filtered orders
                    const { totalSales, sales, productSales } = processOrders(filteredOrders);

                    updateUI(totalSales, sales);

                    const sortedProducts = sortAndDisplayTopProducts(productSales);

                    updateProgressBars(sortedProducts, sales);
                });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data. Please check your server.');
        });
}

// Function to process the orders, calculate total sales and track product sales
function processOrders(orders) {
    let totalSales = 0; 
    let sales = 0;
    const productSales = {}; 

    orders.forEach(order => {
        if (order.products && order.products.length > 0) {
            order.products.forEach(product => {
                const productTotal = product.price * product.quantity;
                totalSales += productTotal;

                if (!productSales[product.name]) {
                    productSales[product.name] = { id: product._id, quantity: 0 };
                }
                productSales[product.name].quantity += product.quantity;

                sales += product.quantity;
            });
        }
    });

    return { totalSales, sales, productSales };
}

// Function to sort products by quantity sold and get the top 5
function sortAndDisplayTopProducts(productSales) {
    const sortedProducts = Object.entries(productSales) // CHANGE: Convert productSales object to an array of entries
        .sort((a, b) => b[1].quantity - a[1].quantity) // CHANGE: Sort the products by quantity sold in descending order
        .slice(0, 5); // CHANGE: Get the top 5 products

    sortedProducts.forEach(([name, { id, quantity }], index) => {
        // Currently does nothing inside the loop
    });

    topSales = sortedProducts; // CHANGE: Assign the sorted top 5 products to topSales
    chart(); // CHANGE: Call the chart function to update the chart
    return sortedProducts; // CHANGE: Return the sorted top 5 products
}


// Function to update the UI with the total sales, quantity sold, and top products




// Function to update the progress bars for the top 5 products
// Function to update progress bars and percentage text
function updateProgress(id, productName, percentage) {
    const progressBar = document.getElementById("top" + id + "Progress");
    const percentageElement = document.getElementById("top" + id + "Percentage");
    const itemElement = document.getElementById("top" + id + "Item");

    // Update progress bar width
    if (progressBar) {
        progressBar.style.width = percentage + "%"; // Update progress bar width
    } else {
        console.error(`Progress Bar element for top${id} not found.`);
    }

    // Update percentage text in the span
    if (percentageElement) {
        percentageElement.innerText = `${percentage.toFixed(2)}%`; // Display percentage in the span
    } else {
        console.error(`Percentage element for top${id} not found.`);
    }

    // Update product name in the item element
    if (itemElement) {
        itemElement.innerText = productName; // Set the product name
    } else {
        console.error(`Item element for top${id} not found.`);
    }
}

// Function to update progress bars for sorted products
function updateProgressBars(sortedProducts, sales) {
    sortedProducts.forEach(([, { quantity }], index) => {
        const percentage = (quantity / sales) * 100; // Calculate percentage of total sales
        updateProgress(index + 1, sortedProducts[index][0], percentage);
    });
}


// Function to update progress bars for sorted products
function updateProgressBars(sortedProducts, sales) {
    sortedProducts.forEach(([, { quantity }], index) => {
        const percentage = (quantity / sales) * 100; // Calculate percentage of total sales
        updateProgress(index + 1, sortedProducts[index][0], percentage);
    });
}


// Function to fetch users and log the count
function fetchUsers() {
    fetch('https://earthph.sdevtech.com.ph/users/getUsers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            agents = data.users.length; // Update the global `agents` variable

            // Call `updateUI` after updating `agents`
            updateUI(totalSales, sales);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Failed to fetch user data. Please check your server.');
        });
}


// Function to fetch chart data and generate a chart
function chart() {
    const currentUserRole = localStorage.getItem('userRole'); // Get the current user's role from local storage
    const currentUserTeam = localStorage.getItem('userTeam'); // Get the current user's team from local storage

    // Fetching the matchedUser object from localStorage
    const matchedUserData = localStorage.getItem('matchedUser'); // Assuming the object is stored under the 'matchedUser' key
    let currentUserUid = null;

    if (matchedUserData) {
        try {
            // Parse the matchedUser data
            const parsedData = JSON.parse(matchedUserData);
            // Access the userUid from the matchedUser object
            currentUserUid = parsedData.uid; // Correctly accessing the uid
        } catch (error) {
            console.error("Error parsing matchedUser data:", error);
        }
    }

    // Step 1: Fetch the list of users
    fetch('https://earthph.sdevtech.com.ph/users/getUsers')
        .then(response => {
            if (!response.ok) {
                console.error('Failed to fetch users.');
                throw new Error('Failed to fetch users.');
            }
            return response.json(); // Convert the response to JSON format
        })
        .then(userData => {
            const users = userData.users; // All users fetched

            // Step 2: Fetch orders
            fetch('https://earthph.sdevtech.com.ph/orders/getOrders')
                .then(response => {
                    if (!response.ok) {
                        console.error(`HTTP error! status: ${response.status}`);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // Convert the response to JSON format
                })
                .then(orderData => {
                    if (!orderData || orderData.length === 0) {
                        console.log('No order data found.');
                        return;
                    }

                    // Step 3: If the user is an agent, apply the filter by userUid
                    let filteredOrders = orderData;

                    if (currentUserRole === 'agent' && currentUserUid) {
                        // Filter orders only for the logged-in agent's UID
                        filteredOrders = orderData.filter(order => order.userUid === currentUserUid);
                    }

                    // Step 4: If the user is a team leader, filter orders by team; otherwise, no filter is applied
                    if (currentUserRole === 'teamLeader') {
                        filteredOrders = orderData.filter(order => {
                            const user = users.find(user => user.uid === order.userUid); // Find the user for this order
                            return user && user.team === currentUserTeam; // Filter by team if it's a team leader
                        });
                    }

                    // If no orders match the filter criteria
                    if (filteredOrders.length === 0) {
                        console.log('No orders match the current user role or team.');
                        return;
                    }

                    // Step 5: Generate labels dynamically for the current month and the last 5 months
                    const labels = Array.from({ length: 6 }, (_, i) => {
                        const date = new Date();
                        date.setMonth(date.getMonth() - (5 - i)); // Get last 6 months including current month
                        const month = date.toLocaleString('default', { month: 'long' }); // Get the full month name
                        const year = date.getFullYear(); // Get the year
                        return `${month} ${year}`; // Month and Year (e.g., December 2024)
                    });

                    // Step 6: Aggregate sales data by item name using a Map
                    const aggregatedSalesData = new Map();

                    filteredOrders.forEach(order => {
                        order.products.forEach(product => {
                            if (!aggregatedSalesData.has(product.name)) {
                                aggregatedSalesData.set(product.name, Array(6).fill(0));
                            }
                            const saleDate = new Date(order.orderDate);
                            const saleMonth = saleDate.getMonth();
                            const saleYear = saleDate.getFullYear();
                            const currentDate = new Date();
                            const currentMonth = currentDate.getMonth();
                            const currentYear = currentDate.getFullYear();

                            let monthIndex = -1;
                            for (let i = 0; i < 6; i++) {
                                const targetDate = new Date();
                                targetDate.setMonth(currentMonth - (5 - i));
                                if (saleYear === targetDate.getFullYear() && saleMonth === targetDate.getMonth()) {
                                    monthIndex = i;
                                    break;
                                }
                            }

                            if (monthIndex !== -1) {
                                aggregatedSalesData.get(product.name)[monthIndex] += product.quantity;
                            }
                        });
                    });

                    // Convert the Map to an array of objects
                    let itemSalesData = Array.from(aggregatedSalesData, ([label, data]) => ({ label, data }));



                    // Step 7: Sort the itemSalesData array by total quantity in descending order
                    itemSalesData.sort((a, b) => {
                        const totalA = a.data.reduce((sum, value) => sum + value, 0);
                        const totalB = b.data.reduce((sum, value) => sum + value, 0);
                        return totalB - totalA;
                    });


                    // Step 8: Limit to top 5 items
                    itemSalesData = itemSalesData.slice(0, 5); // Limit to top 5 items

                    // Step 9: Destroy the previous chart if it exists
                    if (myLineChart) {
                        myLineChart.destroy();
                    }

                    // Step 10: Create a new chart with the filtered and processed data
                    var ctx = document.getElementById('myLineChart').getContext('2d');
                    myLineChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels, // Use dynamically generated labels (months)
                            datasets: itemSalesData.map((item, index) => ({
                                label: item.label,
                                data: item.data,
                                borderColor: getBorderColor(index),
                                backgroundColor: getBackgroundColor(index),
                                borderWidth: 2,
                                tension: 0.4
                            }))
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top'
                                },
                                tooltip: {
                                    enabled: true
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching order data:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

function getBorderColor(index) {
    const colors = [
        'rgb(220, 53, 69)',   // Red
        'rgb(23, 162, 184)',  // Light blue
        'rgb(40, 167, 69)',   // Green
        'rgb(255, 193, 7)',   // Yellow
        'rgb(0, 123, 255)'    // Blue
    ];
    return colors[index % colors.length]; // Cycle through colors
}

// Function to generate a light background color (can be customized)
function getBackgroundColor(index) {
    const colors = [
        'rgba(255, 99, 132, 0.2)',   // Red
        'rgba(54, 162, 235, 0.2)',   // Light blue
        'rgba(75, 192, 192, 0.2)',   // Green
        'rgba(255, 206, 86, 0.2)',   // Yellow
        'rgba(0, 123, 255, 0.2)'     // Blue
    ];
    return colors[index % colors.length]; // Cycle through colors
}

// Process and send order data function
function processAndSendOrderData() {
    console.log('Fetching orders from the backend...');
    fetch('https://earthph.sdevtech.com.ph/orders/getOrders')
        .then(response => {
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(orders => {
            console.log('Orders fetched:', orders);
            if (!orders || orders.length === 0) {
                console.log('No orders found.');
                return;
            }

            // Process orders
            const today = new Date().toISOString().split('T')[0];
            const todaysOrders = orders.filter(order => {
                const orderDate = new Date(order.orderDate).toISOString().split('T')[0];
                return orderDate === today;
            });


            if (todaysOrders.length === 0) {
                console.log('No orders from today.');
                return;
            }

            // Aggregate data
            const aggregatedData = todaysOrders.reduce((acc, order) => {
                acc.totalSales += order.totalAmount;
                acc.totalAmount += order.totalAmount;
                acc.totalItems += order.totalItems;
                acc.totalDiscount += order.discount;
                acc.totalOrders += 1;

                // Aggregate item data (if any)
                order.products.forEach(product => {
                    const totalProductAmount = product.price * product.quantity;

                    // Add item sales to itemSales array
                    acc.itemSales.push({
                        itemName: product.name,
                        saleDate: today,
                        totalAmount: totalProductAmount,
                        Quantity: product.quantity,
                        totalQuantity: product.quantity  // Add the totalQuantity field here
                    });
                });

                return acc;
            }, {
                totalSales: 0,
                totalAmount: 0,
                totalItems: 0,
                totalDiscount: 0,
                totalOrders: 0,
                itemSales: []
            });

            // Sort the item sales array by totalAmount and get the top 5
            const top5Items = aggregatedData.itemSales
                .sort((a, b) => b.totalAmount - a.totalAmount) // Sort by total amount in descending order
                .slice(0, 5);  // Take top 5 items

            const chartData = {
                date: today,
                totalSales: aggregatedData.totalSales,
                totalAmount: aggregatedData.totalAmount,
                totalItems: aggregatedData.totalItems,
                totalDiscount: aggregatedData.totalDiscount,
                totalOrders: aggregatedData.totalOrders,
                itemSales: top5Items // Only send the top 5 items
            };


            // First, delete existing chart data
            fetch('https://earthph.sdevtech.com.ph/chartData/deleteAll', {
                method: 'DELETE'
            })
            .then(() => {
                console.log('Existing chart data deleted.');
                // Send aggregated data to backend
                return fetch('https://earthph.sdevtech.com.ph/chartData/createChartData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(chartData)  // Send the full chart data, including item sales
                });
            })
            .then(response => response.json())
            .then(data => {
        
                updateUI(totalSales, sales);
                // Reload the window to reflect the updates
                window.location.reload();
            })
            .catch(error => console.error('Error saving chart data:', error));
        })
        .catch(error => console.error('Error fetching orders:', error));
}
// Update chart with new data
function updateChart(aggregatedData) {
    // Check if the chart exists and update it
    if (myLineChart) {
        myLineChart.data.labels.push(aggregatedData.date); // Add the new date to the chart labels

        // Update the chart with new total sales data
        myLineChart.data.datasets[0].data.push(aggregatedData.totalSales);

        // Update the item sales dataset
        myLineChart.data.datasets[1] = {
            label: 'Top 5 Item Sales', // Adding new dataset for top 5 item sales
            data: aggregatedData.itemSales.map(item => item.totalAmount), // Use the top 5 item sales
            borderColor: 'rgba(153, 102, 255, 1)',
            tension: 0.1,
            fill: false
        };

        myLineChart.update(); // Update the chart to reflect changes
    } else {
        // If chart does not exist, create a new chart
        createChart(aggregatedData);
    }
}
// Create a new chart (if not already created)
function createChart(aggregatedData) {
    // Destroy the previous chart if it exists
    if (window.myLineChart) {
        window.myLineChart.destroy();
    }

    const ctx = document.getElementById('myLineChart').getContext('2d');
    window.myLineChart = new Chart(ctx, { // Create the chart
        type: 'line', // Example chart type
        data: {
            labels: [aggregatedData.date], // Date labels
            datasets: [{
                label: 'Total Sales',
                data: [aggregatedData.totalSales],
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            },
            {
                label: 'Top 5 Item Sales',
                data: aggregatedData.itemSales.map(item => item.totalAmount), // Use the top 5 item sales
                borderColor: 'rgba(153, 102, 255, 1)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `₱${tooltipItem.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

// Add event listener to the button
//#endregion


async function fetchStoreCount() {
    try {
        const response = await fetch('https://earthph.sdevtech.com.ph/stores/getStores');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();


        // Access the stores key and check its length
        if (data.stores && Array.isArray(data.stores)) {
            return data.stores.length;
        } else {
            console.error("Unexpected response structure. 'stores' key not found or not an array.");
            return 0;
        }
    } catch (error) {
        console.error("Error fetching stores:", error);
        return 0; // Fallback to 0 if there is an error
    }
}

async function updateUI(totalSales, sales) {
    const storeCount = await fetchStoreCount(); // Fetch the dynamic store count
    document.getElementById("overAllProfit").innerText = '₱ ' + totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById("sales").innerText = sales;
    document.getElementById("stores").innerText = storeCount || "Unavailable"; // Use the dynamic count, or show fallback
    // document.getElementById("customers").innerText = agents; // Reference the global variable directly
}

document.addEventListener('DOMContentLoaded', () => {
    chart(); // Call the chart function
    fetchUsers();
    updateUI(totalSales, sales, agents);
    fetchOrders()
});

// Call updateUI with the correct value




// Fetch agent performance data


        // Get the user role from localStorage
        const currentUserRole = localStorage.getItem('userRole');

        // Get the text elements by their IDs
        const overAllProfitText = document.getElementById('overAllProfitText');
        const salesText = document.getElementById('salesText');
    
        // Change text based on the user role
        if (currentUserRole === 'agent') {
            // If the user is an agent, change the text accordingly
            overAllProfitText.textContent = 'Total Purchases'; // Change "Overall Sales" to "Total Purchases"
            salesText.textContent = 'Items Bought';           // Change "Sales" to "Items Bought"
        } else {
            // If the user is not an agent, keep the text as is
            overAllProfitText.textContent = 'Overall Sales';
            salesText.textContent = 'Sales';
        }


