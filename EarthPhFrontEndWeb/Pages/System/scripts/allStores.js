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

    let addressLabel = '';
    let storeNameLabel = '';
    let phoneLabel = '';

    if (window.innerWidth < 756) {
        addressLabel = 'Address ';
        storeNameLabel = 'Store Name ';
        phoneLabel = 'Phone ';
    } else {
        addressLabel = '';
        storeNameLabel = '';
        phoneLabel = '';
    }

    // Loop through the stores data and create table rows
    for (let i = 0; i < stores.length; i++) {
        const store = stores[i];
        const row = document.createElement('tr');
    
        // Create table cells with both a common and unique class
        const addressCell = document.createElement('td');
        addressCell.classList.add('table-cell', 'address-cell');
        addressCell.innerHTML = `<strong class="label">${addressLabel}</strong><span class="value">${store.address || 'N/A'}</span>`;
        
        const storeNameCell = document.createElement('td');
        storeNameCell.classList.add('table-cell', 'store-name-cell');
        storeNameCell.innerHTML = `<strong class="label">${storeNameLabel}</strong><span class="value">${store.name || 'N/A'}</span>`;
        
        const statusCell = document.createElement('td');
        statusCell.classList.add('table-cell', 'status-cell');
        statusCell.innerHTML = `<strong class="label">${phoneLabel}</strong><span class="value">${store.phone || 'N/A'}</span>`;
        
        const button = document.createElement('td');
        button.classList.add('table-cell', 'button-cell');
        button.textContent = 'Open';
        button.style.padding = '10px';
        button.style.backgroundColor = '#66bb6a';
        button.style.color = 'white';
        button.style.textAlign = 'center';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '5px';
        button.style.transition = 'background-color 0.3s ease';
    
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#28a745';
        });
    
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#66bb6a';
        });
    
        row.appendChild(button);
    
        // Add a click event to open the modal when the row is clicked
        row.addEventListener('click', () => {
            openStoreModal(store);
        });
    
        // Append cells to the row
        row.appendChild(addressCell);
        row.appendChild(storeNameCell);
        row.appendChild(statusCell);
        row.appendChild(button);
    
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
    const deleteButton = document.getElementById('delete-store');
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

    deleteButton.onclick = function () {
        deleteStore(store._id);
    };

    // Show the modal
    modal.style.display = "flex";
}

async function deleteStore(storeId) {
    const confirmDelete = confirm("Are you sure you want to delete this store?");
    if (!confirmDelete) return; // Exit if user cancels

    try {
        const response = await fetch(`https://earthph.sdevtech.com.ph/stores/deleteStore/${storeId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`Failed to delete store: ${response.status}`);
        }

        const data = await response.json();
        console.log("Store deleted:", data);

        // Show success alert
        alert("Store deleted successfully!");

        // Refresh the page after deletion
        location.reload();
    } catch (error) {
        console.error("Error deleting store:", error);
        alert("Error deleting store. Please try again.");
    }
}



// Close the modal when the close button is clicked
document.getElementById('closeModal').addEventListener('click', () => {
    const modal = document.getElementById('storeModal');
    modal.style.display = 'none';
});

getStores();

// Function to handle export to Excel
document.getElementById('export-btn').addEventListener('click', async () => {
    // Fetch the stores data
    const storesData = await fetchStoresData();
    if (!storesData || !Array.isArray(storesData)) {
        alert('No data to export!');
        return;
    }

    // Prepare the data to be written to Excel
    const excelData = storesData.map(store => ({
        "Store Name": store.name || "N/A",
        "First Name": store.firstName || "N/A",
        "Last Name": store.lastName || "N/A",
        "Address": store.address || "N/A",
        "Phone": store.phone || "N/A",
        "Email": store.email || "N/A",
        "Status": store.status || "N/A",
        "UID": store.uid || "N/A",
        "Created At": store.createdAt ? new Date(store.createdAt).toLocaleDateString() : "N/A"
    }));

    // Create a worksheet and a workbook
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stores Data");

    // Generate the Excel file and prompt for download
    XLSX.writeFile(wb, 'stores_data.xlsx');
});

// Function to fetch store data from API
async function fetchStoresData() {
    try {
        const response = await fetch('https://earthph.sdevtech.com.ph/stores/getStores');
        if (response.ok) {
            const storesData = await response.json();
            return storesData.stores; // Return the stores data array
        } else {
            console.error('Error fetching stores data:', response.status);
        }
    } catch (error) {
        console.error('Error fetching stores data:', error);
    }
    return null;
}
