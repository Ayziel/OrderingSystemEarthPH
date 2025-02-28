const userRole = localStorage.getItem('userRole');
const usertoken = localStorage.getItem('authToken');
window.onload = function () {
    fetchTeams();
};

// Fetch teams from the backend
// Fetch teams from the backend
// Fetch teams from the backend
// Fetch teams from the backend
// Fetch teams from the backend
function fetchTeams() {
    fetch('https://earthph.sdevtech.com.ph/team/getTeam')
        .then(response => response.json())
        .then(data => {
            const teamList = document.getElementById("teamList");
            teamList.innerHTML = ''; // Clear current list

            if (data.teams && Array.isArray(data.teams)) {
                // Loop through the teams and create the list items
                data.teams.forEach(team => {
                    const teamItem = document.createElement("p");
                    teamItem.textContent = team.teamName; // Display team name
                    teamItem.classList.add("team-item");

                    // Add delete functionality to each team
                    teamItem.onclick = function () {
                        if (confirm(`Remove "${team.teamName}"?`)) {
                            deleteTeam(team._id, teamItem);
                        }
                    };

                    teamList.appendChild(teamItem);
                });
            } else {
                console.error("Teams data is not in expected format: ", data);
            }
        })
        .catch(error => {
            console.error('Error fetching teams:', error);
        });
}





// Handle creating a new team
// Handle creating a new team
document.getElementById("addTeamBtn").addEventListener("click", function () {
    const teamInput = document.getElementById("teamInput");

    const teamName = teamInput.value.trim();

    if (teamName !== "") {
        // Send new team to the backend
        fetch('https://earthph.sdevtech.com.ph/team/createTeam', {  // Changed endpoint to 'createTeam'
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                teamName: teamName,  // Sending the team name
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Team created:', data);

                if (data.message === 'Team created successfully') {
                    // If the response indicates success, create the team item in the list
                    const teamItem = document.createElement("p");
                    teamItem.textContent = data.team.teamName; // Display team name
                    teamItem.classList.add("team-item");

                    // Make item clickable to delete
                    teamItem.onclick = function () {
                        if (confirm(`Remove "${data.team.teamName}"?`)) {
                            deleteTeam(data.team._id, teamItem);
                        }
                    };

                    const teamList = document.getElementById("teamList");
                    teamList.appendChild(teamItem);

                    // Clear input field
                    teamInput.value = "";
                } else {
                    alert('Unexpected message: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error creating team:', error);
                alert('Error creating team. Please try again.');
            });
    } else {
        alert('Please enter a team name.');
    }
});




function deleteTeam(teamId, teamItem) {
    fetch(`https://earthph.sdevtech.com.ph/team/deleteTeam/${teamId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Team deleted successfully') {
                teamItem.remove();
                alert('Team deleted successfully');
            } else {
                alert('Failed to delete team: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting team:', error);
            alert('Error deleting team. Please try again.');
        });
}
