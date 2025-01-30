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
    })
    .catch(error => console.error('Error during GET request:', error));


fetch('https://earthph.sdevtech.com.ph/viewStoreRoutes/createStore', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({}) // Sending an empty body
})
    .then(response => {
        if (response.status === 404) {
            console.error("POST Request failed: Endpoint not found (404).");
        } else if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
            console.log("POST Request successful:", response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("POST Response Data:", data);
    })
    .catch(error => console.error('Error during POST request:', error));


fetch('https://earthph.sdevtech.com.ph/viewStoreRoutes/deleteStore/12345', {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then(response => {
        if (response.status === 404) {
            console.error("DELETE Request failed: Endpoint not found (404).");
        } else if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
            console.log("DELETE Request successful:", response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("DELETE Response Data:", data);
    })
    .catch(error => console.error('Error during DELETE request:', error));
