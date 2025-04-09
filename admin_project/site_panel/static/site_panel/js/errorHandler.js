document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("header a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Stop default navigation first

            fetch(link.href, { headers: { "X-Requested-With": "XMLHttpRequest" } }) // Send AJAX request
                .then(async response => {
                    if (!response.ok) {
                        throw new Error("Error loading page: " + response.statusText);
                    }
                    // Clone response to try both JSON and text
                    try {
                        return await response.clone().json();
                    } catch {
                        return await response.text();
                    }
                })
                .then(data => {
                    if (typeof data === "object" && data.success === false) {
                        throw new Error(data.error); // Handle backend JSON error
                    }
                    window.location.href = link.href; // Proceed to page if no error
                })
                .catch(error => {
                    alert("Error: " + error.message);
                });
        });
    });
});