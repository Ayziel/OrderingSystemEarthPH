fetch('https://earthph.sdevtech.com.ph/viewStoreRoutes/getStores')
    .then(response => {
        if (response.status === 404) {
            console.error("GET Request failed: Endpoint not found (404).");
        } else if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
            console.log("GET Request successful:", response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("GET Response Data:", data);
        populateStores(data.stores || data);  // Pass the stores array to the function
    })
    .catch(error => console.error('Error during GET request:', error));

    function populateStores(stores) {
        const tableBody = document.querySelector('.orders-body'); // Select the table body where stores will be displayed
        tableBody.innerHTML = ''; // Clear previous rows
    
        stores.forEach((store, index) => {
            const row = document.createElement('tr');
    
            // Random image URL from Picsum (or your source)
            const randomImageUrl = `https://picsum.photos/200/300?random=${index}`;
    
            // Format createdAt date (day/month/year)
            const formattedDate = store.createdAt ? new Date(store.createdAt).toLocaleDateString('en-GB') : 'No creation date';
    
            // Populate the row with store data
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${store.storeName || 'No store name'}</td>
                <td>${store.agentName || 'No agent name'}</td>
                <td>${store.Location || 'No location'}</td>
                <td>${formattedDate}</td>
            `;
            tableBody.appendChild(row); // Append the row to the table body
    
            // Add event listener for when the row is clicked
            row.addEventListener('click', (e) => {
                // Toggle row background and set the modal image
                toggleRowClick(row, store, randomImageUrl);
            });
        });
    }
    

function toggleRowClick(row, store, imageUrl) {
    // Add 'clicked' class to highlight the row and show the modal
    row.classList.toggle('clicked'); // Highlight the clicked row

    // Open the modal and set the image
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    modalImage.src = imageUrl; // Set the random image URL to the modal image
    modal.style.display = 'block'; // Show the modal

    // Close the modal when clicking the close button
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    // Also close the modal if the user clicks anywhere outside of the image
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}
