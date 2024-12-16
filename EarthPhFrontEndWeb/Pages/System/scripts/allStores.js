// Function to fetch the stores data
async function getStores() {
    try {
        const response = await fetch('https://earthph.sdevtech.com.ph/stores/getStores');
        if (response.ok) {
            const storesData = await response.json();  // assuming the data is in JSON format
            console.log(storesData); // Log the data for debugging
            if (Array.isArray(storesData.stores)) {  // Ensure stores is an array
                populateStoresTable(storesData.stores);  // Pass the stores array
            } else {
                console.error('stores is not an array:', storesData.stores);
            }
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
    for (let i = 0; i < stores.length; i++) {
        const store = stores[i];
        const row = document.createElement('tr');
        
        // Create table cells for address, store name, and status
        const addressCell = document.createElement('td');
        addressCell.textContent = store.address || 'N/A';
        
        const storeNameCell = document.createElement('td');
        storeNameCell.textContent = store.name || 'N/A';  // Update from 'storeName' to 'name'
        
        const statusCell = document.createElement('td');
        statusCell.textContent = store.status || 'N/A';
        
        // Add a click event to open the modal when the row is clicked
        row.addEventListener('click', () => {
            openStoreModal(store);
        });

        // Append cells to the row
        row.appendChild(addressCell);
        row.appendChild(storeNameCell);
        row.appendChild(statusCell);
        
        // Append the row to the table body
        tableBody.appendChild(row);
    }
}

// Function to open the modal and show store details
// Function to open the modal and show store details
function openStoreModal(store) {
    // Get modal elements
    const modal = document.getElementById('storeModal');
    const modalTableBody = document.getElementById('modalTableBody');

    // Prepare the store data
    const storeData = [
        { label: "Store Name", value: store.name || "Unknown" },
        { label: "Address", value: store.address || "No Address" },
        { label: "Status", value: store.status || "Unknown" },
        { label: "Owner", value: `${store.firstName || ""} ${store.lastName || ""}`.trim() || "Unknown" },
        { label: "Established", value: store.createdAt ? new Date(store.createdAt).toLocaleDateString() : "Not Available" },
        { label: "Contact Number", value: store.phone || "No Data" },
        { label: "Operating Hours", value: store.operatingHours || "Not Provided" }
    ];

    // Clear previous table data
    modalTableBody.innerHTML = "";

    // Populate the table with store data
    storeData.forEach(item => {
        const row = document.createElement("tr");

        const labelCell = document.createElement("td");
        labelCell.textContent = item.label;
        row.appendChild(labelCell);

        const valueCell = document.createElement("td");
        valueCell.textContent = item.value;
        row.appendChild(valueCell);

        modalTableBody.appendChild(row);
    });

    // Show the modal
    modal.style.display = "flex";
}

// Close the modal when the close button is clicked
document.getElementById('closeModal').addEventListener('click', () => {
    const modal = document.getElementById('storeModal');
    modal.style.display = 'none';
});



// Call the function to fetch and populate the table on page load
getStores();


// Call the function to fetch and populate the table on page load
getStores();


