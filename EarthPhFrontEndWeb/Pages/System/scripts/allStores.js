// allStores.js

// Function to fetch the stores data
async function getStores() {
    try {
        const response = await fetch('https://earthph.sdevtech.com.ph/stores/getStores');
        if (response.ok) {
            const storesData = await response.json();
            console.log(storesData); // Add this line to log the response
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
        
        // Create table cells for name, address, and status
        const nameCell = document.createElement('td');
        nameCell.textContent = store.name || 'N/A';  // store.name corresponds to the field in your data
        
        const addressCell = document.createElement('td');
        addressCell.textContent = store.address || 'N/A';  // store.address corresponds to the field in your data
        
        const statusCell = document.createElement('td');
        statusCell.textContent = store.status || 'N/A';  // store.status corresponds to the field in your data
        
        // Append cells to the row
        row.appendChild(nameCell);
        row.appendChild(addressCell);
        row.appendChild(statusCell);
        
        // Append the row to the table body
        tableBody.appendChild(row);
    });
}

// Call the function to fetch and populate the table on page load
getStores();
