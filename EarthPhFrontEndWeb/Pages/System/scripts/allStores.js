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
        statusCell.textContent = store.phone || 'N/A';
        
            const button = document.createElement('td');
            button.textContent = 'Open';
            button.style.padding = '10px';
            button.style.backgroundColor = '#66bb6a';
            button.style.color = 'white';
            button.style.textAlign = 'center';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '5px';
            button.style.transition = 'background-color 0.3s ease';
            button.style.backgroundColor = 'green !important'; // Apply background color with !important

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
