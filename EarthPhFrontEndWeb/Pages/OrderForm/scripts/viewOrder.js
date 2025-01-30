// let applybtnLabel = document.querySelector('.apply-label');
// const uploadFeedback = document.getElementById('upload-feedback');

// // Event listener for the Apply button
// applybtnLabel.addEventListener('click', (event) => {
//     event.preventDefault(); // Prevent the page from reloading

//     // Static data that you want to submit
//     const agentName = 'John Doe';
//     const agentUid = 'agent-123';
//     const location = 'New York'; // Make sure it's 'Location' on the backend
//     const storeName = 'ABC Store';
//     const storeUid = 'store-456';
//     const uid = 'unique-store-issd';
//     const createdAt = new Date().toISOString();

//     // Prepare the data to be sent to the server
//     const storeData = {
//         agentName,
//         agentUid,
//         Location: location, // Correct field name 'Location'
//         storeName,
//         storeUid,
//         uid,
//         createdAt
//     };

//     // Log the data to be sent to the server
//     console.log('Data to be sent:', storeData);

//     // Send the data to the server using fetch
//     fetch('https://earthph.sdevtech.com.ph/viewStoreRoutes/createStore', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(storeData), // Sending data as JSON
//     })
//     .then(response => {
//         if (!response.ok) {
//             return response.json().then(errorData => {
//                 throw new Error(errorData.message || 'Failed to submit data');
//             });
//         }
//         return response.json();  // Parse the response JSON
//     })
//     .then(result => {
//         console.log('Success:', result);
//         alert('Data uploaded successfully!');
        
//         // Update the feedback message (check if the element exists first)
//         if (uploadFeedback) {
//             uploadFeedback.textContent = 'Data uploaded successfully!';
//             uploadFeedback.style.display = 'block';
//         }
//     })
//     .catch(error => {
//         console.error('Error uploading data:', error);
//         alert('Failed to upload data: ' + error.message);
        
//         // Update the feedback message (check if the element exists first)
//         if (uploadFeedback) {
//             uploadFeedback.textContent = 'Failed to upload data.';
//             uploadFeedback.style.display = 'block';
//         }
//     });
// });
