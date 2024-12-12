// Open the receipt modal when the 'Submit Order' button is clicked
document.getElementById("submitOrderBtn").onclick = function() {
    document.getElementById("receiptModal").style.display = "flex";
}

// Open the receipt modal when the 'Print Receipt' button is clicked
document.getElementById("printReceiptBtn").onclick = function() {
    // Open print dialog for the receipt content
    window.print();
}

// Close the receipt modal when the 'Close' button is clicked
document.querySelector(".close-receipt").onclick = function() {
    document.getElementById("receiptModal").style.display = "none";
    window.location.href = 'https://earthph.sdevtech.com.ph/OrderForm/Product-Preference.html'; // Replace with your desired link
}

// Handle the submit action for receipt upload
document.getElementById("submitReceiptBtn").onclick = function() {
    // Capture the input data and handle the submission logic here
    console.log("Receipt submitted!");
  
}
