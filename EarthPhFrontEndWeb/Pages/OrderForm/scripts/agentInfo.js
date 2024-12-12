window.addEventListener('load', () => {
    localStorage.removeItem('orderData'); // Remove specific key
    console.log('Local storage cleared for orderData');
});

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format
    document.getElementById('order-date').value = today;
});

document.getElementById('confirm-button').addEventListener('click', () => {
    const orderData = {
        agentName: document.getElementById('agent-name').value,
        teamLeaderName: document.getElementById('team-leader-name').value,
        area: document.getElementById('area').value,
        orderDate: document.getElementById('order-date').value,  // Use the value from the input field
        storeName: document.getElementById('store-name').value,
        houseAddress: document.getElementById('house-street').value,
        townProvince: document.getElementById('barangay').value,
        storeCode: document.getElementById('store-code').value,
        tin: document.getElementById('tin').value,
    };

    // Log the data being saved
    console.log('Order Data to save:', orderData);

    // Save to localStorage
    localStorage.setItem('orderData', JSON.stringify(orderData));

    // Redirect to the next page
    window.location.href = 'https://earthph.sdevtech.com.ph/OrderForm/Order-Info.html'; // Replace with your desired link
});
