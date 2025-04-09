document.addEventListener("DOMContentLoaded", function () {
    const newPasswordForm = document.querySelector('form');

    newPasswordForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        const result = validatePassword();
        console.log(result);
        if (!result) return; // Stop if validation fails

        // Create FormData to send data via AJAX
        let formData = new FormData(newPasswordForm);

        try {
            let response = await fetch("/site_panel/change_admin_password/", {
                method: "POST",
                body: formData
            });

            let data = await response.json();
            let messageDiv = document.getElementById("message");

            if (data.success) {
                messageDiv.innerHTML = `<span style="color: green;">${data.message}</span>`;
                setTimeout(() => {
                    window.location.href = "/site_panel/admin"; // Redirect after success
                }, 3000);
            } else {
                messageDiv.innerHTML = `<span style="color: red;">${data.message}</span>`;
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});


function validatePassword() {
    let password = document.getElementById("newPassword").value;
    let confirmPassword = document.getElementById("rePassword").value;
    let messageDiv = document.getElementById("message");

    // Password regex pattern
    let passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    function clearMessage() {
        setTimeout(() => {
            messageDiv.innerHTML = "";
        }, 10000); // 30 seconds
    }

    // Check if password matches regex
    if (!passwordRegex.test(password)) {
        messageDiv.innerHTML = "Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character.";
        clearMessage();
        return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        messageDiv.innerHTML = "Passwords do not match.";
        clearMessage();
        return false;
    }

    // If everything is valid, clear the message and return true
    messageDiv.innerHTML = "";
    return true;
}