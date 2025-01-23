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

                        const br = document.createElement('br');
                        if (window.innerWidth <= 768) {
                            row.appendChild(br); // Add <br> if the screen width is 768px or less
                        }


                        const userNameCell = document.createElement('td');
                        userNameCell.textContent = matchingUser.userName;
                        userNameCell.classList.add('survey-cell');  // Adding common class
                        row.appendChild(userNameCell);
                
                        const storeName = document.createElement('td');
                        storeName.textContent = survey.storeName;
                        storeName.classList.add('survey-cell');  // Adding common class
                        row.appendChild(storeName);
                
                        // Add the insectControl value
                        const insectControlCell = document.createElement('td');
                        insectControlCell.textContent = survey.insectControl;
                        insectControlCell.classList.add('survey-cell');  // Adding common class
                        row.appendChild(insectControlCell);
                
                        // Add the rodentControl value
                        const rodentControlCell = document.createElement('td');
                        rodentControlCell.textContent = survey.rodentControl;
                        rodentControlCell.classList.add('survey-cell');  // Adding common class
                        row.appendChild(rodentControlCell);
                
                        // Add the fabricSpray value
                        const fabricSprayCell = document.createElement('td');
                        fabricSprayCell.textContent = survey.fabricSpray;
                        fabricSprayCell.classList.add('survey-cell');  // Adding common class
                        row.appendChild(fabricSprayCell);
                
                        // Add the airConCleaner value
                        const airConCleanerCell = document.createElement('td');
                        airConCleanerCell.textContent = survey.airConCleaner;
                        airConCleanerCell.classList.add('survey-cell');  // Adding common class
                        row.appendChild(airConCleanerCell);
                
                        // Add the petCare value
                        const petCareCell = document.createElement('td');
                        petCareCell.textContent = survey.petCare;
                        petCareCell.classList.add('survey-cell');  // Adding common class
                        row.appendChild(petCareCell);
                
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
