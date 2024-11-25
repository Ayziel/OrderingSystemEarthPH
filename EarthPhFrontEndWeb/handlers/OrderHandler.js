document.getElementById('submitOrderBtn').addEventListener('click', async function() {
    // Collect all the values from the input fields
    const orderData = {
        agentName: document.getElementById("agent-name").value,
        teamLeaderName: document.getElementById("team-leader").value,
        area: document.getElementById("area").value,
        orderDate: document.getElementById("order-date").value,
        storeName: document.getElementById("store-name").value,
        houseAddress: document.getElementById("house-address").value,
        townProvince: document.getElementById("town-province").value,
        storeCode: document.getElementById("store-code").value,
        tin: document.getElementById("tin").value,
        listPrice: document.getElementById("list-price").value,
        discount: document.getElementById("discount").value,
        totalItems: document.getElementById("total-items").value,
        totalAmount: document.getElementById("total-amount").value,
        paymentMode: document.getElementById("payment-mode").value,
        paymentImage: document.getElementById("payment-image").value,
        remarks: document.getElementById("remarks").value,
        products: [] // Initialize products array
    };

    // Get all checked products (checkboxes) and product quantity
    const checkboxes = document.querySelectorAll(".product-checkbox:checked");
    checkboxes.forEach(function(checkbox) {
        const sku = checkbox.getAttribute("data-sku");
        const name = checkbox.getAttribute("data-name");
        const description = checkbox.getAttribute("data-description");
        const price = parseFloat(checkbox.getAttribute("data-price"));
        const quantityInput = document.querySelector(`.product-quantity[data-sku="${sku}"]`);
        const quantity = parseInt(quantityInput.value);

        // Add product details to the products array
        orderData.products.push({
            name: name,
            description: description,
            price: price,
            quantity: quantity,
            total: price * quantity
        });
    });

    // Check if there are any products selected
    if (orderData.products.length === 0) {
        alert('Please select at least one product.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5001/orders/createOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData) // Sending data as JSON
        });

        const result = await response.json();

        if (response.ok) {
            alert('Order created successfully');
        } else {
            alert('Error creating order: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error with the request.');
    }
});
