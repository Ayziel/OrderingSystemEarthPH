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
                const surveys = surveyData.surveys.reverse(); // Reverse the survey order

                console.log("Survey Data:", surveys);

                // Initialize pagination
                $('#pagination-container').pagination({
                    dataSource: surveys,
                    pageSize: 10, // Number of surveys per page
                    showPageNumbers: true,
                    showPrevious: true,
                    showNext: true,
                    callback: function (data, pagination) {
                        populateSurveys(data, users);
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

/**
 * Populates the survey table with paginated data
 * @param {Array} surveys - List of surveys to display
 * @param {Array} users - List of users to match surveys with
 */
function populateSurveys(surveys, users) {
    const surveyTableBody = document.getElementById('survey-data');
    surveyTableBody.innerHTML = ''; // Clear previous data

    surveys.forEach(survey => {
        const matchingUser = users.find(user => user.uid === survey.userUid);

        if (matchingUser) {
            const row = document.createElement('tr');

            const userNameCell = document.createElement('td');
            userNameCell.textContent = matchingUser.userName;
            row.appendChild(userNameCell);

            const storeNameCell = document.createElement('td');
            storeNameCell.textContent = survey.storeName;
            row.appendChild(storeNameCell);

            const lionTigerCoilCell = document.createElement('td');
            lionTigerCoilCell.textContent = survey.lionTigerCoil === '1' ? 'Yes' : 'No';
            row.appendChild(lionTigerCoilCell);

            const bayconCoilCell = document.createElement('td');
            bayconCoilCell.textContent = survey.bayconCoil === '1' ? 'Yes' : 'No';
            row.appendChild(bayconCoilCell);

            const otherBrandsCoilCell = document.createElement('td');
            otherBrandsCoilCell.textContent = survey.otherBrandsCoil === '1' ? 'Yes' : 'No';
            row.appendChild(otherBrandsCoilCell);

            const arsCoilCell = document.createElement('td');
            arsCoilCell.textContent = survey.arsCoil === '1' ? 'Yes' : 'No';
            row.appendChild(arsCoilCell);

            const createdAtCell = document.createElement('td');
            const createdAtDate = new Date(survey.createdAt);
            createdAtCell.textContent = createdAtDate.toLocaleDateString(); // Format date
            row.appendChild(createdAtCell);

            surveyTableBody.appendChild(row);
        }
    });
}
