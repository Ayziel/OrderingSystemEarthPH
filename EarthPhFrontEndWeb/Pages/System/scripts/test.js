document.addEventListener('DOMContentLoaded', function () {
    // Static test data (6 items)
    const data = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com' },
        { id: 4, name: 'David', email: 'david@example.com' },
        { id: 5, name: 'Eva', email: 'eva@example.com' },
        { id: 6, name: 'Frank', email: 'frank@example.com' }
    ];

    const tableBody = document.getElementById('tableBody');
    const paginationControls = document.getElementById('paginationControls');

    // Pagination settings
    const itemsPerPage = 2;  // Show 2 items per page
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Function to display data in the table
    function displayData(page) {
        // Clear current table body
        tableBody.innerHTML = '';

        // Get the slice of data for the current page
        const start = (page - 1) * itemsPerPage;
        const end = page * itemsPerPage;
        const currentPageData = data.slice(start, end);

        // Populate the table body
        currentPageData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.id}</td><td>${item.name}</td><td>${item.email}</td>`;
            tableBody.appendChild(row);
        });
    }

    // Function to create pagination controls
    function createPagination() {
        paginationControls.innerHTML = ''; // Clear any existing pagination controls

        // Create previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = function () {
            if (currentPage > 1) {
                currentPage--;
                displayData(currentPage);
            }
        };
        paginationControls.appendChild(prevButton);

        // Create page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.onclick = function () {
                currentPage = i;
                displayData(currentPage);
            };
            paginationControls.appendChild(pageButton);
        }

        // Create next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = function () {
            if (currentPage < totalPages) {
                currentPage++;
                displayData(currentPage);
            }
        };
        paginationControls.appendChild(nextButton);
    }

    let currentPage = 1;
    displayData(currentPage); // Initial display of the first page
    createPagination(); // Create pagination buttons
});
