// Fetch the users data from the server
fetch('https://earthph.sdevtech.com.ph/users/getUsers')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(userData => {
        const users = userData.users;
        console.log("Users Data:", users);

        // Fetch the survey data from the server
        fetch('https://earthph.sdevtech.com.ph/survey/getSurveys')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(surveyData => {
                const surveys = surveyData.surveys;
                console.log("Survey Data:", surveys);

                // Loop through each survey and match with the user UID
                surveys.forEach(survey => {
                    // Find the user that matches the survey's userUid
                    const matchingUser = users.find(user => user.uid === survey.userUid);
                
                    if (matchingUser) {
                        // Create a new row for each survey and append user details
                        const row = document.createElement('tr');
                
                        // Add the userName value
                        const userNameCell = document.createElement('td');
                        userNameCell.textContent = matchingUser.userName;
                        userNameCell.classList.add('survey-cell');  // Adding common class
                        row.appendChild(userNameCell);
                
                        const storeName = document.createElement('td');
                        storeName.textContent = survey.storeName;
                        storeName.classList.add('survey-cell');  // Adding common class
                        row.appendChild(storeName);
                
                        // Add the lionTigerCoil value
                        const lionTigerCoilCell = document.createElement('td');
                        lionTigerCoilCell.textContent = survey.lionTigerCoil === '1' ? 'Yes' : 'No';  // Check for 1 or 0
                        lionTigerCoilCell.classList.add('survey-cell');  // Adding common class
                        row.appendChild(lionTigerCoilCell);
                
                        // Add the bayconCoil value
                        const bayconCoilCell = document.createElement('td');
                        bayconCoilCell.textContent = survey.bayconCoil === '1' ? 'Yes' : 'No';  // Check for 1 or 0
                        bayconCoilCell.classList.add('survey-cell');  // Adding common class
                        row.appendChild(bayconCoilCell);
                
                        // Add the otherBrandsCoil value
                        const otherBrandsCoilCell = document.createElement('td');
                        otherBrandsCoilCell.textContent = survey.otherBrandsCoil === '1' ? 'Yes' : 'No';  // Check for 1 or 0
                        otherBrandsCoilCell.classList.add('survey-cell');  // Adding common class
                        row.appendChild(otherBrandsCoilCell);
                
                        // Add the arsCoil value
                        const arsCoilCell = document.createElement('td');
                        arsCoilCell.textContent = survey.arsCoil === '1' ? 'Yes' : 'No';  // Check for 1 or 0
                        arsCoilCell.classList.add('survey-cell');  // Adding common class
                        row.appendChild(arsCoilCell);
                
                        // Add the createdAt value
                        const createdAtCell = document.createElement('td');
                        const createdAtDate = new Date(survey.createdAt);  // Convert the date to a Date object
                
                        // Format the date to "YYYY-MM-DD" format
                        const formattedDate = createdAtDate.toLocaleDateString();  // This gives you the date in a human-readable format without time
                        
                        createdAtCell.textContent = formattedDate;
                        createdAtCell.classList.add('survey-cell');  // Adding common class
                        row.appendChild(createdAtCell);
                
                        // Append the row to the table body
                        document.getElementById('survey-data').appendChild(row);
                    }
                });
                
            })
            .catch(error => {
                console.error('Error fetching survey data:', error);
                alert('Failed to fetch survey data. Please check your server.');
            });
    })
    .catch(error => {
        console.error('Error fetching users data:', error);
        alert('Failed to fetch users data. Please check your server.');
    });
