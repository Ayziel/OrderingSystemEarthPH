// On page load, fetch all areas
window.onload = function () {
    fetchAreas();
};

// Fetch areas from the backend
function fetchAreas() {
    fetch('https://earthph.sdevtech.com.ph/area/getAreas')
        .then(response => response.json())
        .then(data => {
            const areaList = document.getElementById("areaList");
            areaList.innerHTML = ''; // Clear current list

            // Loop through the areas and create the list items
            data.areas.forEach(area => {
                const areaItem = document.createElement("p");
                areaItem.textContent = area.area;
                areaItem.classList.add("area-item");

                // Add delete functionality to each area
                areaItem.onclick = function () {
                    if (confirm(`Remove "${area.area}"?`)) {
                        deleteArea(area._id, areaItem);
                    }
                };

                areaList.appendChild(areaItem);
            });
        })
        .catch(error => {
            console.error('Error fetching areas:', error);
        });
}

// Handle creating a new area
document.getElementById("addAreaBtn").addEventListener("click", function () {
    const input = document.getElementById("areaInput");

    if (input.value.trim() !== "") {
        const areaName = input.value.trim();

        // Send new area to the backend
        fetch('https://earthph.sdevtech.com.ph/area/createArea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                area: areaName,
                areaCode: generateAreaCode() // Assuming you want to generate an area code
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Area created:', data);
                if (data.area) {
                    // Create an area item in the list after it's saved
                    const areaItem = document.createElement("p");
                    areaItem.textContent = data.area.area;
                    areaItem.classList.add("area-item");

                    // Make item clickable to delete
                    areaItem.onclick = function () {
                        if (confirm(`Remove "${areaItem.textContent}"?`)) {
                            deleteArea(data.area._id, areaItem);
                        }
                    };

                    const areaList = document.getElementById("areaList");
                    areaList.appendChild(areaItem);

                    // Clear input field
                    input.value = "";
                }
            })
            .catch(error => {
                console.error('Error creating area:', error);
                alert('Error creating area. Please try again.');
            });
    } else {
        alert('Please enter an area name.');
    }
});

// Handle deleting an area
function deleteArea(areaId, areaItem) {
    fetch(`https://earthph.sdevtech.com.ph/area/deleteArea/${areaId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Area deleted successfully') {
                areaItem.remove();
                alert('Area deleted successfully');
            }
        })
        .catch(error => {
            console.error('Error deleting area:', error);
            alert('Error deleting area. Please try again.');
        });
}

// Helper function to generate an area code (you can customize this)
function generateAreaCode() {
    // Example: Generate a random area code (you could improve this logic)
    return Math.random().toString(36).substr(2, 5).toUpperCase();
}
