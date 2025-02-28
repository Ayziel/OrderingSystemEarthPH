document.getElementById("addAreaBtn").addEventListener("click", function () {
    const input = document.getElementById("areaInput");
    const areaList = document.getElementById("areaList");

    if (input.value.trim() !== "") {
        const areaItem = document.createElement("p");
        areaItem.textContent = input.value;
        areaItem.classList.add("area-item");

        // Make item clickable to delete
        areaItem.onclick = function () {
            if (confirm(`Remove "${areaItem.textContent}"?`)) {
                areaItem.remove();
            }
        };

        areaList.appendChild(areaItem);
        input.value = ""; // Clear input after adding
    }
});
