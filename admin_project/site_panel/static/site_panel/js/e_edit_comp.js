document.addEventListener("DOMContentLoaded", function () {
    // Tab navigation functionality
    init_tabs();

    document.getElementById('Compensation-form').style.display = 'block';  

    document.getElementById('Compensation-form').addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission
        
        const formData = new FormData(event.target);
        const compensation_id = document.getElementById('compensation_id').value;
        formData.append('compensation_id', compensation_id); // Ensure compensation_id is appended

        const effectiveDateValue = document.getElementById("e_compensation_effective_date").value;
        const endDateValue = document.getElementById("employee_compensation_end_date").value;
    
        if (effectiveDateValue && endDateValue) { // Ensure both values exist
                const EffectiveDate = new Date(effectiveDateValue);
                const endDate = new Date(endDateValue);
    
                if (endDate <= EffectiveDate) {
                    alert("End date cannot be earlier than effective date.");
                    return;
                }
                else{
                    fetch('/site_panel/edit_compensation_data/', {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                        },
                        body: formData, // Send form data including compensation_id
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Response from server:", data); // Log the full response
                        if (data.success) {
                            alert(data.message); // Success message
                        } else if (data.errors) {
                            // Display errors below each field
                            displayErrors(data.errors);
                        } else {
                            alert(data.message); // Error message from the server
                        }
                    })
                    .catch(error => {
                        console.error("Fetch Error:", error);
                        alert("An error occurred. Please check the console.");
                    });
                }
        }
        
        fetch('/site_panel/edit_compensation_data/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: formData, // Send form data including compensation_id
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response from server:", data); // Log the full response
            if (data.success) {
                alert(data.message); // Success message
            } else if (data.errors) {
                // Display errors below each field
                displayErrors(data.errors);
            } else {
                alert(data.message); // Error message from the server
            }
        })
        .catch(error => {
            console.error("Fetch Error:", error);
            alert("An error occurred. Please check the console.");
        });
    });
    
    function displayErrors(errors) {
        Object.keys(errors).forEach(field => {
            let inputField = document.getElementById(field);
            if (inputField) {
                const errorElement = document.createElement("div");
                errorElement.className = "error-message";
                errorElement.style.color = "red";
                errorElement.style.fontSize = "12px";
                errorElement.textContent = errors[field];
    
                // Remove existing error message if present
                let existingError = inputField.parentElement.querySelector(".error-message");
                if (existingError) {
                    existingError.remove();
                }
    
                inputField.parentElement.appendChild(errorElement);
    
                // Remove error after 20 seconds (changed from 30)
                setTimeout(() => {
                    if (errorElement) {
                        errorElement.remove();
                    }
                }, 20000); // Changed to 20 seconds (20000 milliseconds)
            } else {
                showGeneralError(errors[field]); // Show general error
            }
        });
    }
    
    function showGeneralError(message) {
        const errorElement = document.getElementById("general-error");
        errorElement.innerText = message;
        
        // Also hide general error after 20 seconds
        setTimeout(() => {
            errorElement.innerText = "";
        }, 20000); // 20 seconds
    }

    const employeesButton = document.getElementById('NewEmployees_button');

    employeesButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default button behavior

        // Ensure e_id exists before using it
        const e_id_element = document.getElementById('e_id');
        if (!e_id_element) {
            console.error("Element with ID 'e_id' not found!");
            return;
        }
        const e_id = e_id_element.value; // Get the empl_details data

        // Construct URL with only e_id
        const baseUrl = '/site_panel/update_employee_data/';
        const emplDetails = JSON.stringify([{ e_id: e_id }]);
        const urlWithParams = `${baseUrl}?empl_details=${encodeURIComponent(emplDetails)}`;

        window.location.href = urlWithParams; // Navigate to the URL
    });
}); 

function enable_all_forms_and_hover(enable) {
    const compensationButton = document.getElementById('Compensation_button');

    if (enable) {
        compensationButton.classList.remove('disabled'); // Enable after first form submission
    } else {
        compensationButton.classList.add('disabled'); // Keep disabled initially
    }
}

function init_tabs() {
    const activityTab = document.getElementById("activity-tab");
    const reportsTab = document.getElementById("reports-tab");
    const activitySubTabs = document.getElementById("activity-sub-tabs");
    const reportsSubTabs = document.getElementById("reports-sub-tabs");

    const dailyReportTab = document.getElementById("Daily-Reports");
    const dailyReportSubTabs = document.getElementById("dailyReport-sub-tabs");
    const weeklyReportTab = document.getElementById("Weekly-Reports");
    const weeklyReportSubTabs = document.getElementById("weeklyReport-sub-tabs");
    const biweeklyReportTab = document.getElementById("Biweekly-Reports");
    const biweeklyReportSubTabs = document.getElementById("BiweeklyReport-sub-tabs");
    const monthlyReportTab = document.getElementById("Monthly-Reports");
    const monthlyReportSubTabs = document.getElementById("Monthly-rollover-sub-tabs");
    const SpecificRangeReportsTab = document.getElementById("Specific-Range-Reports");
    const SummarySubTab = document.getElementById("Summary-sub-tabs");
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            // If already active, remove it
            if (this.classList.contains("active")) {
                this.classList.remove("active");
            } else {
                // Remove active from all and set on current
                navLinks.forEach(l => l.classList.remove("active"));
                this.classList.add("active");
            }
        });
    });

    activityTab.addEventListener("click", function () {
        reportsSubTabs.style.display = "none";
        activitySubTabs.style.display = activitySubTabs.style.display === "block" ? "none" : "block";
    });

    if (reportsTab) {
        reportsTab.addEventListener("click", function () {
            activitySubTabs.style.display = "none";
            reportsSubTabs.style.display = reportsSubTabs.style.display === "block" ? "none" : "block";
        });
    }

    // Function to handle hover and keep sub-tabs visible
    function handleHover(mainTab, subTab) {
        let timeout;

        function showSubTab() {
            clearTimeout(timeout);
            subTab.style.display = "block";
        }

        function hideSubTab() {
            timeout = setTimeout(() => {
                subTab.style.display = "none";
            }, 0); // Short delay to prevent flickering when moving between elements
        }

        mainTab.addEventListener("mouseenter", showSubTab);
        mainTab.addEventListener("mouseleave", hideSubTab);

        subTab.addEventListener("mouseenter", showSubTab);
        subTab.addEventListener("mouseleave", hideSubTab);
    }

    handleHover(dailyReportTab, dailyReportSubTabs);
    handleHover(weeklyReportTab, weeklyReportSubTabs);
    handleHover(biweeklyReportTab, biweeklyReportSubTabs);
    handleHover(monthlyReportTab, monthlyReportSubTabs);
    handleHover(SpecificRangeReportsTab, SummarySubTab);
}

function enable_all_forms_and_hover(enable) {
    const NewEmployeeButton = document.getElementById('NewEmployees_button');

    if (enable) {
        NewEmployeeButton.classList.remove('disabled'); // Enable after first form submission
    } else {
        NewEmployeeButton.classList.add('disabled'); // Keep disabled initially
    }
}