document.addEventListener("DOMContentLoaded", function () {
    const saveUserBtn = document.querySelector(".save-user-btn");
    const enable2faBtn = document.querySelector(".toggle-2fa-btn");
    const verifyOtpBtn = document.querySelector(".verify-otp-btn");
    const changePasswordBtn = document.querySelector(".change-password-btn");
    
    const matchedUser = JSON.parse(localStorage.getItem('matchedUser'));
    const userId = matchedUser ? matchedUser._id : null;
    const apiUrl = "https://earthph.sdevtech.com.ph/users";

    if (!userId) {
        console.error("User ID not found in localStorage");
        return;
    }

    async function fetchUserData() {
        try {
            const response = await fetch(`${apiUrl}/getUsers`);
            if (!response.ok) throw new Error("Failed to fetch users");

            const data = await response.json();
            const user = data.users.find(user => user._id === userId);

            if (!user) {
                console.error("User not found in database");
                return;
            }

            console.log("Fetched User Data:", user);

            document.querySelector(".user-firstname").value = user.firstName || "";
            document.querySelector(".user-lastname").value = user.lastName || "";
            document.querySelector(".user-email").value = user.email || "";
            document.querySelector(".user-phone").value = user.phoneNumber || "";
            document.querySelector(".user-address").value = user.address || "";
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    async function updateUser() {
        const updatedUser = {
            firstName: document.querySelector(".user-firstname").value,
            lastName: document.querySelector(".user-lastname").value,
            email: document.querySelector(".user-email").value,
            phoneNumber: document.querySelector(".user-phone").value,
            address: document.querySelector(".user-address").value,
            password: document.querySelector(".user-password").value,
        };

        try {
            const response = await fetch(`${apiUrl}/updateUsers/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }

    async function enable2FA() {
        try {
            const response = await fetch(`${apiUrl}/enable2FA/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            document.getElementById("qrCode").src = data.qrCode;
            document.querySelector(".qr-code-container").style.display = "block";
        } catch (error) {
            console.error("Error enabling 2FA:", error);
        }
    }

    async function verifyOTP() {
        const otpCode = document.querySelector(".otp-input").value;
        try {
            const response = await fetch(`${apiUrl}/verifyOTP/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp: otpCode }),
            });
            const data = await response.json();
            document.querySelector(".otp-message").textContent = data.message;
        } catch (error) {
            console.error("Error verifying OTP:", error);
        }
    }

    async function changePassword() {
        const oldPassword = document.querySelector(".old-password").value;
        const newPassword = document.querySelector(".new-password").value;
        const confirmPassword = document.querySelector(".confirm-password").value;

        if (newPassword !== confirmPassword) {
            document.querySelector(".password-message").textContent = "Passwords do not match.";
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/changePassword/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            const data = await response.json();
            document.querySelector(".password-message").textContent = data.message;
        } catch (error) {
            console.error("Error changing password:", error);
        }
    }

    fetchUserData();
    saveUserBtn.addEventListener("click", updateUser);
    enable2faBtn.addEventListener("click", enable2FA);
    verifyOtpBtn.addEventListener("click", verifyOTP);
    changePasswordBtn.addEventListener("click", changePassword);
});
