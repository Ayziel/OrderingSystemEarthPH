document.addEventListener('DOMContentLoaded', () => {

    // Retrieve the saved data from localStorage
    const localStorageData = localStorage.getItem('orderData');
    let userUID = null; // Declare a global variable

    if (localStorageData) {
        try {
            // Parse the JSON string from localStorage
            const orderData = JSON.parse(localStorageData);

            // Access and set the user UID
            if (orderData.matchedUser && orderData.matchedUser.uid) {
                userUID = orderData.matchedUser.uid;
                console.log("User UID from orderData:", userUID);
            } else {
                console.warn("No user UID found in the orderData.");
            }
        } catch (error) {
            console.error("Error parsing localStorage data:", error);
        }
    } else {
        console.warn("No 'orderData' found in localStorage.");
    }

    function populateStocks(stocks) {
        const ordersBody = document.querySelector('.orders-body');
        ordersBody.innerHTML = ''; // Clear previous rows
        console.log("Stocks:", stocks);
        console.log("UserUID", userUID);
        let globalCounter = 1;
    
        // Filter stocks based on parent_uid
        const filteredStocks = stocks.filter(stock => stock.parent_uid === userUID); // CHANGE
    
        filteredStocks.forEach(stock => {
            const row = document.createElement('tr');
            console.log("Stock parent_uid:", stock.parent_uid);
            // Populate row with stock data
            row.innerHTML = `
                <td>${globalCounter++}</td>
                <td>${stock.store_name || 'No store name'}</td>
                <td>${stock.product_name || 'No product name'}</td>
                <td>${stock.quantity || '0'}</td>
            `;
    
            row.addEventListener('click', () => {
                openStockModal(stock); // Pass the stock object to the modal
            });
    
            ordersBody.appendChild(row);
        });
    }


    // Fetch the stock data from the API
    fetch('https://earthph.sdevtech.com.ph/stocks/getStock')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Full Response:", data);

        const stocks = data.stocks || data; // Adjust this if the array is inside a property


        if (!Array.isArray(stocks)) {
            console.error("The response is not an array");
            return;
        }

        if (stocks.length === 0) {
            console.log('No stocks found.');
            return;
        }

        // Log each item in the stocks array
         stocks.forEach(stock => {
            console.log("Stock parent_uid:", stock.parent_uid); // CHANGE
         });

        stocks.sort((a, b) => a.store_name.localeCompare(b.store_name));
        populateStocks(stocks);
    })
    .catch(error => console.error('Error fetching stocks:', error));

});




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
        </table>
        <button id="edit-button" class="edit-button">Edit</button>
        <button id="save-button" style="display:none;" class="save-button">Save</button>
    `;

    modalContent.innerHTML = stockDetailsHTML;

    // Show the modal
    modal.style.display = 'block';
    document.body.classList.add('modal-open');

    // Close modal
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });

    // Edit button functionality
    document.getElementById('edit-button').addEventListener('click', () => {
        document.getElementById('edit-store-name').disabled = false;
        document.getElementById('edit-product-name').disabled = false;
        document.getElementById('edit-quantity').disabled = false;
        document.getElementById('save-button').style.display = 'inline-block';
    });

    // Save button functionality
    document.getElementById('save-button').addEventListener('click', () => {
        const updatedStock = {
            uid: stock.uid,
            store_name: document.getElementById('edit-store-name').value,
            product_name: document.getElementById('edit-product-name').value,
            quantity: parseInt(document.getElementById('edit-quantity').value, 10)
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
            console.log("Updated Stock:", data);
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
                const headers = ["No.", "Store Name", "Product Name", "Quantity"];
                rows.push(headers);

                stocks.forEach((stock, index) => {
                    rows.push([
                        index + 1,
                        stock.store_name,
                        stock.product_name,
                        stock.quantity
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
