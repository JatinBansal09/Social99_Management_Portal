document.addEventListener("DOMContentLoaded", function() 
    {
        // Handle reset password form submission
        const resetPasswordForm = document.getElementById('resetPasswordForm');
        if (resetPasswordForm) 
        {
            resetPasswordForm.addEventListener('submit', async function(event) 
            {
                event.preventDefault();  // Prevent default form submission
    
                const formData = new FormData(resetPasswordForm);  // Collect form data
    
                // Submit the reset password request form using fetch API
                const response = await fetch('/site_panel/send_reset_email/', {
                    method: 'POST',
                    headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,  // CSRF token
                    },
                    body: formData,
                });
    
                const result = await response.json();
                const messageDiv = document.getElementById('message');
                // Show the message
                messageDiv.textContent = result.message;
                messageDiv.style.color = result.success ? "green" : "red";
                messageDiv.style.marginTop = "10px";

                // Auto-dismiss message after 5 seconds
                setTimeout(() => {
                    messageDiv.textContent = ""; // Clear the message
                                }, 2000); // 5000ms = 5 seconds
                if (result.success) {
                    setTimeout(() => {
                    document.getElementById('resetPasswordForm').style.display = 'none'; // Hide resetPasswordForm
                    document.getElementById('verifyCodeForm').style.display = 'block'; // Show verifyCodeForm
                }, 5000);
                } else {
                    alert(result.message);
                }
            });
        }

const verifyForm = document.getElementById('verifyForm');
if (verifyForm) {
            verifyForm.addEventListener('submit', async function(event) {
                event.preventDefault();  // Prevent default form submission

                const formData = new FormData(verifyForm);
                const response = await fetch('/site_panel/verify_reset_code/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,  // CSRF token
                      },
                      body: formData,
                });

                const result = await response.json();

                const resetMessage = document.getElementById('resetMessage');

                resetMessage.textContent = result.message;
                resetMessage.style.color = result.success ? "green" : "red";

                setTimeout(() => {
                    resetMessage.textContent = ""; // Clear the message
                                }, 3000); // 5000ms = 5 seconds

                if (result.success) {
                    setTimeout(() => {
                    // Show the new password form after successful verification
                    window.location.href = '/site_panel/new_pass/';
                    }, 3000);
                } else {
                    setTimeout(() => {
                    resetMessage.textContent = result.message;
                    resetMessage.style.color = "red";
                    }, 3000);
                }
            });
        }
});