// allStores.js

// Function to fetch the stores data
async function getStores() {
    try {
        const response = await fetch('https://earthph.sdevtech.com.ph/users/getStores');
        if (response.ok) {
            const storesData = await response.json();  // assuming the data is in JSON format
            populateStoresTable(storesData);
        } else {
            console.error('Error fetching stores data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching stores data:', error);
    }
}

// Function to populate the table with stores data
function populateStoresTable(stores) {
    const tableBody = document.querySelector('#storesTable tbody');
    tableBody.innerHTML = '';  // Clear any existing rows

    // Loop through the stores data and create table rows
    stores.forEach(store => {
        const row = document.createElement('tr');
        
        // Create table cells for address, store name, and status
        const addressCell = document.createElement('td');
        addressCell.textContent = store.address || 'N/A';
        
        const storeNameCell = document.createElement('td');
        storeNameCell.textContent = store.storeName || 'N/A';
        
        const statusCell = document.createElement('td');
        statusCell.textContent = store.status || 'N/A';
        
        // Append cells to the row
        row.appendChild(addressCell);
        row.appendChild(storeNameCell);
        row.appendChild(statusCell);
        
        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

// Call the function to fetch and populate the table on page load
getStores();
