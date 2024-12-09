// Global variables to track total sales and product sales
let totalSales = 0; // Variable to store the total sales amount
let productSales = {}; // Object to store the quantity sold for each product
let overAllProfit = 0;
let sales = 0;
let stores = 0;
let customers = 0;
let agents = 0;

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

// Example: Dynamically update the progress bars for all 5 items

 

// Dashboard 1 Morris-chart
$(function () {
    "use strict";

    // Extra chart
    Morris.Area({
        element: 'extra-area-chart',
        data: [
            {
                period: '2000',
                iphone: 12,
                imac: 5,
                ibook: 23,
                samsung: 34,
                android: 56
            },
            {
                period: '2002',
                iphone: 25,
                imac: 38,
                ibook: 47,
                samsung: 50,
                android: 62
            },
            {
                period: '2003',
                iphone: 60,
                imac: 55,
                ibook: 75,
                samsung: 65,
                android: 40
            },
            {
                period: '2004',
                iphone: 43,
                imac: 20,
                ibook: 15,
                samsung: 35,
                android: 28
            },
            {
                period: '2005',
                iphone: 70,
                imac: 65,
                ibook: 55,
                samsung: 10,
                android: 90
            },
            {
                period: '2006',
                iphone: 34,
                imac: 50,
                ibook: 40,
                samsung: 60,
                android: 75
            },
            {
                period: '2007',
                iphone: 25,
                imac: 12,
                ibook: 30,
                samsung: 10,
                android: 85
            }
        ],
        lineColors: ['#26DAD2', '#fc6180', '#62d1f3', '#ffb64d', '#4680ff'],
        xkey: 'period',
        ykeys: ['iphone', 'imac', 'ibook', 'samsung', 'android'],
        labels: ['iphone', 'imac', 'ibook', 'samsung', 'android'],
        pointSize: 0,
        lineWidth: 0,
        resize: true,
        fillOpacity: 0.8,
        behaveLikeLine: true,
        gridLineColor: '#e0e0e0',
        hideHover: 'auto'
    });
});

document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
});

// Function to fetch orders and process them
// Main function to fetch orders
function fetchOrders() {
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

            const { totalSales, sales, productSales } = processOrders(orders);

            console.log(`Total Sales: ₱${totalSales.toFixed(2)}`);
            console.log(`Total Quantity Sold: ${sales}`);

            const sortedProducts = sortAndDisplayTopProducts(productSales);

            // Optionally, update the UI with the new data
            updateUI(totalSales, sales);

            // Update the progress bars for top 5 products
            updateProgressBars(sortedProducts, sales);

        })
        .catch(error => console.error('Error fetching orders:', error));
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
    const sortedProducts = Object.entries(productSales)
        .sort((a, b) => b[1].quantity - a[1].quantity)
        .slice(0, 5);

    console.log("Top 5 Products Sold:");
    sortedProducts.forEach(([name, { id, quantity }], index) => {
        console.log(`${index + 1}. ${name} (ID: ${id}) - Quantity Sold: ${quantity}`);
    });

    return sortedProducts;
}

// Function to update the UI with the total sales, quantity sold, and top products
function updateUI(totalSales, sales) {
    document.getElementById("overAllProfit").innerText = totalSales.toFixed(2);
    document.getElementById("sales").innerText = sales;
    document.getElementById("stores").innerText = 0;
    document.getElementById("customers").innerText = agents;
}

// Function to update the progress bars for the top 5 products
// Function to update progress bars and percentage text
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

    console.log("percentage", percentage)
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



// Fetch the users data from the server
// Function to fetch users and log the count
function fetchUsers() {
    fetch('http://localhost:5001/users/getUsers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            agents = data.users.length; // Store the number of agents in the global variable
            console.log(`Number of users: ${agents}`);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Failed to fetch user data. Please check your server.');
        });
}

// Call the fetchUsers function
fetchUsers();

