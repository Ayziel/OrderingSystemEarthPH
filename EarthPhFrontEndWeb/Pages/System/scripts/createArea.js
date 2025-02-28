const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
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
                areaItem.textContent = `${area.area} [${area.areaCode}]`; // Display area and area code inside []
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
    const areaInput = document.getElementById("areaInput");
    const areaCodeInput = document.getElementById("areaCode");

    const areaName = areaInput.value.trim();
    const areaCode = areaCodeInput.value.trim();

    if (areaName !== "" && areaCode !== "") {
        // Send new area to the backend
        fetch('https://earthph.sdevtech.com.ph/area/createArea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                area: areaName,
                areaCode: areaCode, // Use the user-provided area code
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Area created:', data);
                if (data.area) {
                    // Create an area item in the list after it's saved
                    const areaItem = document.createElement("p");
                    areaItem.textContent = `${data.area.area} [${data.area.areaCode}]`; // Display area and code inside []
                    areaItem.classList.add("area-item");

                    // Make item clickable to delete
                    areaItem.onclick = function () {
                        if (confirm(`Remove "${data.area.area}"?`)) {
                            deleteArea(data.area._id, areaItem);
                        }
                    };

                    const areaList = document.getElementById("areaList");
                    areaList.appendChild(areaItem);

                    // Clear input fields
                    areaInput.value = "";
                    areaCodeInput.value = "";
                }
            })
            .catch(error => {
                console.error('Error creating area:', error);
                alert('Error creating area. Please try again.');
            });
    } else {
        alert('Please enter both area name and area code.');
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
