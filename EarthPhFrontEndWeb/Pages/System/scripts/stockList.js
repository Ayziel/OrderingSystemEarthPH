const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
document.addEventListener('DOMContentLoaded', () => {
    const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));
    let userUID = null;

        // Fetch the stock data from the API
    fetch('https://earthph.sdevtech.com.ph/stocks/getStock')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
    
            // Get the matchedUser from local storage
            const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));
            const userUid = matchedUser ? matchedUser.uid : null;
    
            // Get the stocks (adjust this if needed)
            let stocks = data.stocks || data; // Adjust this if the array is inside a property
    
            if (userUid) {
                // Filter stocks based on matching uid
                stocks = stocks.filter(stock => stock.parent_uid === userUid);
            }
    
            // Sort stocks by store_name
            stocks.sort((a, b) => a.store_name.localeCompare(b.store_name));
            stocks.reverse(); // Reverse the order
            
            $('#pagination-container').pagination({
                dataSource: stocks,
                pageSize: 10, // Number of users per page
                showPageNumbers: true,
                showPrevious: true,
                showNext: true,
                callback: function (data, pagination) {
                    populateStocks(data); // Call populateUsers with paginated data
                }
            });
        })
        .catch(error => console.error('Error fetching stocks:', error));
    
    });

    // Access and set the user UID from matchedUser
    if (matchedUser && matchedUser.uid) {
        userUID = matchedUser.uid;
    } else {
        console.warn("No user UID found in the matchedUser.");
    }

    function populateStocks(stocks) {
        const ordersBody = document.querySelector('.orders-body');
        ordersBody.innerHTML = ''; // Clear previous rows
        let globalCounter = 1;

        // Loop through filtered stocks
        stocks.forEach(stock => {
            const row = document.createElement('tr');
            // Populate row with stock data
            row.innerHTML = `
                <td>${globalCounter++}</td>
                <td>${stock.store_name || 'No store name'}</td>
                <td>${stock.product_name || 'No product name'}</td>
                <td>${stock.quantity || '0'}</td>
                <td>${stock.stock || '0'}</td>
                <td class="open">View</td>
            `;

            row.addEventListener('click', () => {
                openStockModal(stock); // Pass the stock object to the modal
            });

            ordersBody.appendChild(row);
        });
    }



function openStockModal(stock) {
    const modal = document.getElementById('stock-modal');
    const modalContent = modal.querySelector('.modal-content');

    // Populate the modal with stock details and include edit functionality
    const stockDetailsHTML = `
        <div class="modal-header">
            <h3>Stock Details</h3>
            <button id="close-modal">&times;</button>
        </div>
        <table>
            <tr>
                <th>Store Name</th>
                <td><input type="text" id="edit-store-name" value="${stock.store_name || ''}" class="modal-input" disabled></td>
            </tr>
            <tr>
                <th>Product Name</th>
                <td><input type="text" id="edit-product-name" value="${stock.product_name || ''}" class="modal-input" disabled></td>
            </tr>
            <tr>
                <th>Quantity</th>
                <td><input type="number" id="edit-quantity" value="${stock.quantity || 0}" class="modal-input" disabled></td>
            </tr>
            <tr>
                <th>Stock</th>
                <td><input type="number" id="edit-stock" value="${stock.stock || 0}" class="modal-input" disabled></td>
            </tr>
        </table>
        <button id="edit-button" class="edit-button">Edit</button>
        <button id="save-button" style="display:none;" class="save-button">Save</button>
    `;

    modalContent.innerHTML = stockDetailsHTML;

    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');

    // Disable Edit button if offline
    function updateEditButtonStatus() {
        if (!navigator.onLine) {
            editButton.disabled = true;
            editButton.classList.add('disabled');
        } else {
            editButton.disabled = false;
            editButton.classList.remove('disabled');
        }
    }

    updateEditButtonStatus(); // Check status when modal opens

    window.addEventListener("online", updateEditButtonStatus);
    window.addEventListener("offline", updateEditButtonStatus);

    // Show the modal
    modal.style.display = 'block';
    document.body.classList.add('modal-open');

    // Close modal
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });

    // Edit button functionality
    editButton.addEventListener('click', () => {
        if (!navigator.onLine) {
            alert("You can't edit stock while offline.");
            return;
        }

        document.getElementById('edit-store-name').disabled = false;
        document.getElementById('edit-product-name').disabled = false;
        document.getElementById('edit-quantity').disabled = false;
        document.getElementById('edit-stock').disabled = false;
        saveButton.style.display = 'inline-block';
    });

    // Save button functionality
    saveButton.addEventListener('click', () => {
        const updatedStock = {
            uid: stock.uid,
            store_name: document.getElementById('edit-store-name').value,
            product_name: document.getElementById('edit-product-name').value,
            quantity: parseInt(document.getElementById('edit-quantity').value, 10),
            stock: parseInt(document.getElementById('edit-stock').value, 10)
        };

        saveStockToDatabase(updatedStock);
    });
}


function saveStockToDatabase(updatedStock) {
    fetch('https://earthph.sdevtech.com.ph/stocks/updateStock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStock)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Stock updated successfully!');
            location.reload(); // Refresh the page
        })
        .catch(error => {
            console.error('Error updating stock:', error);
            alert('Failed to update stock. Please try again later.');
        });
}

// Export stocks to Excel
document.getElementById('export-btn').addEventListener('click', exportStocksToExcel);

function exportStocksToExcel() {
    fetch('https://earthph.sdevtech.com.ph/stocks/getStock')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const stocks = data.stocks || data;

            if (Array.isArray(stocks) && stocks.length > 0) {
                const rows = [];
                const headers = ["No.", "Store Name", "Product Name", "Quantity", "Stock"];
                rows.push(headers);

                stocks.forEach((stock, index) => {
                    rows.push([
                        index + 1,
                        stock.store_name,
                        stock.product_name,
                        stock.quantity,
                        stock.stock
                    ]);
                });

                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(rows);
                XLSX.utils.book_append_sheet(wb, ws, "Stocks Export");
                XLSX.writeFile(wb, 'Stocks_Export.xlsx');
            } else {
                console.log('No stocks to export.');
            }
        })
        .catch(error => {
            console.error('Error exporting stocks:', error);
            alert('Failed to export stocks. Please try again later.');
        });
}
