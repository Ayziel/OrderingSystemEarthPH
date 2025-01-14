// Function to open the first modal and show GCash data in a table format
const openGCashModal = () => {
    // Fetch all users and GCash data
    Promise.all([
      fetch('https://earthph.sdevtech.com.ph/users/getUsers').then(response => response.json()),
      fetch('https://earthph.sdevtech.com.ph/gCash/getAllGcash').then(response => response.json())
    ])
    .then(([usersData, gcashData]) => {
      const tableBody = document.getElementById('gcashTableBody');
      tableBody.innerHTML = ''; // Clear any existing rows
  
      // Fetch matched user data from localStorage
      const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));
  
      if (!matchedUser) {
        console.error("Matched user not found in localStorage");
        return;
      }
  
      // Filter GCash data based on user's role
      if (matchedUser.role === "Admin") {
        // Admin: Show their own GCash first
        const adminGCash = gcashData.gcash.find(item => item.userUid === matchedUser.uid);
        const adminUser = usersData.users.find(user => user.uid === matchedUser.uid);
    
        if (adminGCash && adminUser) {
          const adminRow = document.createElement('tr');
          adminRow.innerHTML = `
            <td>Your GCash (${adminUser.firstName} ${adminUser.lastName})</td>
            <td>${adminUser.team}</td>
            <td>${adminUser.role}</td>
            <td>₱${parseFloat(adminGCash.cash || 0).toFixed(2)}</td>
          `;
          tableBody.appendChild(adminRow);
        }
    
        // Show the rest of the GCash data (excluding the Admin's)
        gcashData.gcash.forEach(gcash => {
          if (gcash.userUid !== matchedUser.uid) {
            const user = usersData.users.find(user => user.uid === gcash.userUid);
    
            if (user) {
              const row = document.createElement('tr');
              row.innerHTML = `
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.team}</td>
                <td>${user.role}</td>
                <td>₱${parseFloat(gcash.cash || 0).toFixed(2)}</td>
              `;
              tableBody.appendChild(row);
            }
          }
        });
      } else if (matchedUser.role === "teamLeader" || matchedUser.role === "agent") {
        // If TeamLeader or Agent, show only their own GCash data
        const currentUserGCash = gcashData.gcash.find(item => item.userUid === matchedUser.uid);
        const currentUser = usersData.users.find(user => user.uid === matchedUser.uid);
  
        if (currentUserGCash && currentUser) {
          const currentUserRow = document.createElement('tr');
          currentUserRow.innerHTML = `
            <td>Your GCash (${currentUser.firstName} ${currentUser.lastName})</td>
            <td>${currentUser.team}</td>
            <td>${currentUser.role}</td>
            <td>₱${parseFloat(currentUserGCash.cash).toFixed(2) || '0'}</td>
          `;
          tableBody.appendChild(currentUserRow);
        }
      }
  
      // Show the first modal
      document.getElementById('gcashModal').style.display = 'block';
  
      // Add event listener to the button for opening the second modal
      document.getElementById('openSecondModalBtn').addEventListener('click', openSecondModal);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      document.getElementById('gcashModalContent').textContent = 'Error loading GCash or Users data.';
      document.getElementById('gcashModal').style.display = 'block';
    });
  };
  
  // Function to open the second modal with a welcome message
  const openSecondModal = () => {
    const secondModal = document.getElementById('secondModal');
    secondModal.style.display = 'block';
  };
  
  // Function to close the first modal
  const closeModal = () => {
    document.getElementById('gcashModal').style.display = 'none';
  };
  
  // Function to close the second modal
  const closeSecondModal = () => {
    document.getElementById('secondModal').style.display = 'none';
  };
  
  // Add click event to the GCash card to open the first modal
  document.getElementById('gcashCard').addEventListener('click', openGCashModal);
  