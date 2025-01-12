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

            // Process orders after fetching them
            const { totalSales, sales, productSales } = processOrders(orders);
            
            // Make sure the UI only updates after data is fully processed
            updateUI(totalSales, sales);

            const sortedProducts = sortAndDisplayTopProducts(productSales);

            // Optionally, update the UI with the new data
            updateProgressBars(sortedProducts, sales);
        })
        .catch(error => console.error('Error fetching orders:', error));
}



// Function to process the orders, calculate total sales and track product sales
function processOrders(orders) {
     totalSales = 0;
     sales = 0;
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
                console.log("product name & quantity",product.name, product.quantity);
            });
        }
    });

    return { totalSales, sales, productSales };
}

// Function to sort products by quantity sold and get the top 5
function sortAndDisplayTopProducts(productSales) {
    const sortedProducts = Object.entries(productSales)
        .sort((a, b) => b[1].quantity - a[1].quantity)
        .slice(0, 5);
    sortedProducts.forEach(([name, { id, quantity }], index) => {
    });
    topSales = sortedProducts;
    chart()
    return sortedProducts;
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
    fetch('https://earthph.sdevtech.com.ph/chartData/getChartData')
        .then(response => {
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(chartData => {
            if (!chartData || chartData.length === 0) {
                console.log('No chart data found.');
                return;
            }

            // Generate labels dynamically for the current month and the last 5 months
            const labels = Array.from({ length: 6 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - (5 - i)); // Get last 6 months including current month
                const month = date.toLocaleString('default', { month: 'long' }); // Get the full month name
                const year = date.getFullYear(); // Get the year
                return `${month} ${year}`; // Month and Year (e.g., December 2024)
            });

            // Collect the items and their corresponding sales data
            const itemSalesData = [];

            chartData.forEach(item => {
                item.itemSales.forEach(sale => {
                    // Parse the saleDate string into a Date object
                    const saleDate = new Date(sale.saleDate);
                    const saleMonth = saleDate.getMonth(); // Get the month index (0-11)
                    const saleYear = saleDate.getFullYear(); // Get the year (e.g., 2024)

                    // Determine the current month and year
                    const currentDate = new Date();
                    const currentMonth = currentDate.getMonth(); // Current month index (0-11)
                    const currentYear = currentDate.getFullYear(); // Current year

                    // Compare the sale's month and year to determine its position in the labels array
                    let monthIndex = -1;
                    for (let i = 0; i < 6; i++) {
                        const targetDate = new Date();
                        targetDate.setMonth(currentMonth - (5 - i)); // Calculate the target month
                        if (saleYear === targetDate.getFullYear() && saleMonth === targetDate.getMonth()) {
                            monthIndex = i;
                            break;
                        }
                    }

                    // Skip sales that are outside of the last 6 months
                    if (monthIndex === -1) return;

                    // Check if the item already exists in the itemSalesData array
                    const existingItem = itemSalesData.find(i => i.label === sale.itemName);
                    if (existingItem) {
                        // Update the existing item data by adding the total quantity for the sale month
                        existingItem.data[monthIndex] += sale.totalQuantity;
                    } else {
                        // Create a new entry for the item with zero values for each month
                        const newItem = {
                            label: sale.itemName,
                            data: Array(6).fill(0), // Initialize all months with 0 sales
                        };
                        // Add the sale quantity for the sale month
                        newItem.data[monthIndex] = sale.totalQuantity;
                        itemSalesData.push(newItem);
                    }
                });
            });
            // Destroy the previous chart if it exists
            if (myLineChart) {
                myLineChart.destroy();
            }

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
            console.error('Error fetching chart data:', error);
        });
}


function getBorderColor(index) {
    const colors = [
        'rgb(23, 162, 184)',   // Light blue
        'rgb(220, 53, 69)', // Red
        'rgb(40, 167, 69)', // Green
        'rgba(153, 102, 255, 1)', // Purple
        'rgb(255, 193, 7)',  // Orange
        'rgb(0, 123, 255)', // Blue
    ];
    return colors[index % colors.length]; // Cycle through colors
}

// Function to generate a light background color (can be cnustomized)
function getBackgroundColor(index) {
    const colors = [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)', 
        'rgba(75, 192, 192, 0.2)', 
        'rgba(153, 102, 255, 0.2)', 
        'rgba(255, 159, 64, 0.2)',
        'rgba(0, 123, 255, 0.2)'

    ];
    return colors[index % colors.length]; // Cycle through colors
}

// Process and send order data function
function processAndSendOrderData() {
    // Fetch orders from the backend
    fetch('https://earthph.sdevtech.com.ph/orders/getOrders')
        .then(response => {
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(orders => {
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
                            return `$${tooltipItem.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

// Add event listener to the button
document.getElementById('updateChart').addEventListener('click', function() {
    processAndSendOrderData();  // Call your function to process the order data

    // Reload the page after 3 seconds (3000 milliseconds)
    setTimeout(function() {
        location.reload();
    }, 3000);  // Delay in milliseconds (3 seconds)
});

//#endregion

function updateUI(totalSales, sales) {
    document.getElementById("overAllProfit").innerText = '₱ ' + totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById("sales").innerText = sales;
    document.getElementById("stores").innerText = 0; // Placeholder if stores isn't yet dynamic
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

        // Populate agent performance table
        agents.forEach(agent => {
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

            // Sales (Random placeholder for now: between 1000 - 5000)
            const sales = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
            const salesCell = document.createElement('td');
            salesCell.textContent = sales;
            row.appendChild(salesCell);

            // Overall Performance (Random placeholder for now)
            const performanceCell = document.createElement('td');
            const performance = ["Excellent", "Good", "Average"][Math.floor(Math.random() * 3)];  // Random performance label
            performanceCell.textContent = performance;
            row.appendChild(performanceCell);

            // Append row to table
            document.getElementById('agent-performance').appendChild(row);
        });
    })
