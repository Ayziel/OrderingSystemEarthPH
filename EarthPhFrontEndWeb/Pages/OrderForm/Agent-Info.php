<?php
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./styles/agentInfo.css">
    <title>Earthph-New-Order</title>
</head>
<body>
    <div class="form-container">
        <h1>New Order</h1>
        <form>
            <div class="form-group">
                <label for="agent-name">Agent Name</label>
                <input type="text" id="agent-name" name="agent-name" placeholder="Enter area" readonly>
            </div>
            <div class="form-group">
                <label for="team-leader-name">Team Leader Name</label>
                <input type="text" id="team-leader-name" name="team-leader-name" placeholder="Enter area" readonly>
            </div>
            <div class="form-group">
                <label for="area">Area</label>
                <input type="text" id="area" name="area" placeholder="Enter area">
            </div>
            <div class="form-group">
                <label for="order-date">Order Date</label>
                <input type="date" id="order-date" name="order-date" readonly>
            </div>
            <div class="form-group">
                <label for="store-name">Store Name</label>
                <input type="text" id="store-name" name="store-name" placeholder="Enter store name">
            </div>
            <div class="form-group">
                <label for="house-street">House Number and Street</label>
                <input type="text" id="house-street" name="house-street" placeholder="Enter house number and street">
            </div>
            <div class="form-group">
                <label for="barangay">Barangay</label>
                <input type="text" id="barangay" name="barangay" placeholder="Enter barangay">
            </div>
            <div class="form-group">
                <label for="store-code">Store Code</label>
                <input type="text" id="store-code" name="store-code" placeholder="Enter store code">
            </div>
            <div class="form-group">
                <label for="tin">TIN</label>
                <input type="text" id="tin" name="tin" placeholder="Enter TIN">
            </div>
            <button id="confirm-button" type="button">Next</button>
        </form>
    </div>
    <script src="./scripts/agentInfo.js"></script>
    <script>
        document.getElementById('confirm-button').addEventListener('click', () => {
            // Placeholder for handling data and creating the second HTML file.
            alert('Data confirmed. Process the filtered data as required.');
        });
    </script>
</body>
</html>
