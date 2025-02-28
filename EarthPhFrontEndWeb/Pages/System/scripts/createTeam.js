// On page load, fetch all teams
window.onload = function () {
    fetchTeams();
};

// Fetch teams from the backend
function fetchTeams() {
    fetch('https://earthph.sdevtech.com.ph/team/getTeams')
        .then(response => response.json())
        .then(data => {
            const teamList = document.getElementById("teamList");
            teamList.innerHTML = ''; // Clear current list

            // Loop through the teams and create the list items
            data.teams.forEach(team => {
                const teamItem = document.createElement("p");
                teamItem.textContent = team.team;
                teamItem.classList.add("team-item");

                // Add delete functionality to each team
                teamItem.onclick = function () {
                    if (confirm(`Remove "${team.team}"?`)) {
                        deleteTeam(team._id, teamItem);
                    }
                };

                teamList.appendChild(teamItem);
            });
        })
        .catch(error => {
            console.error('Error fetching teams:', error);
        });
}

// Handle creating a new team
document.getElementById("addTeamBtn").addEventListener("click", function () {
    const input = document.getElementById("teamInput");

    if (input.value.trim() !== "") {
        const teamName = input.value.trim();

        // Send new team to the backend
        fetch('https://earthph.sdevtech.com.ph/team/createTeam', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                team: teamName,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Team created:', data);
                if (data.team) {
                    // Create a team item in the list after it's saved
                    const teamItem = document.createElement("p");
                    teamItem.textContent = data.team.team;
                    teamItem.classList.add("team-item");

                    // Make item clickable to delete
                    teamItem.onclick = function () {
                        if (confirm(`Remove "${teamItem.textContent}"?`)) {
                            deleteTeam(data.team._id, teamItem);
                        }
                    };

                    const teamList = document.getElementById("teamList");
                    teamList.appendChild(teamItem);

                    // Clear input field
                    input.value = "";
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

// Handle deleting a team
function deleteTeam(teamId, teamItem) {
    fetch(`https://earthph.sdevtech.com.ph/team/deleteTeam/${teamId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Team deleted successfully') {
                teamItem.remove();
                alert('Team deleted successfully');
            }
        })
        .catch(error => {
            console.error('Error deleting team:', error);
            alert('Error deleting team. Please try again.');
        });
}
