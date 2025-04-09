document.addEventListener("DOMContentLoaded", function () {
    // Tab navigation functionality
    init_tabs();

    document.getElementById('Compensation-form').style.display = 'block';

    const saveButton = document.getElementById("save_button");
    if (saveButton) {
        saveButton.addEventListener("click", function (event) {
            event.preventDefault();
            submitForm(event, "Compensation");
        });
    } else {
        console.error("Save button not found!");
    }
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

async function submitForm(event, formName) {
    event.preventDefault();
    const form = document.querySelector("#Compensation-form form"); // Selects the form inside Compensation-form
    const formData = new FormData(form);
    e_id=formData.get("employee_id")
    formData.append("form_name", formName); // Append the form name
     // Append the page type
     console.log([...formData]); // Debugging output before sending
    if (!e_id) {
        formData.append("page_type", 'main_page');
        console.log("Employee ID is null or empty.");
        return;
    } else {
        formData.append("page_type", 'edit_page');
    }

    const effectiveDateValue = document.getElementById("employee_Effective_Date").value;
        const endDateValue = document.getElementById("employee_compensation_end_date").value;

    if (effectiveDateValue && endDateValue) { // Ensure both values exist
            const effectiveDate = new Date(effectiveDateValue);
            const endDate = new Date(endDateValue);

            if (endDate <= effectiveDate) {
                alert("End date cannot be earlier than effective date.");
                return;
            }
    } else{
        try {

            const submitResponse = await fetch('/site_panel/Save_new_Employee_data/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,  // CSRF token
                },
                body: formData,
            });
    
            const result = await submitResponse.json();
    
            if (result.success) {
                alert(result.message);
                enable_all_forms_and_hover(true);
                const emplDetails = result.empl_details; // Get the empl_details data
                const emplDetailsString = JSON.stringify(emplDetails); // IMPORTANT: Convert to JSON string
    
                const employeesButton = document.getElementById('NewEmployees_button'); // Replace 'employees-button' with the ID of your button
    
                employeesButton.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
    
                const baseUrl = '/site_panel/update_employee_data/'; // Replace with the actual URL of your employee view
                const urlWithParams = `${baseUrl}?empl_details=${encodeURIComponent(emplDetailsString)}`; // Construct the URL with query parameters
    
                window.location.href = urlWithParams; // Navigate to the URL
        });
            } else if (result.errors) {
                // Display errors below each field
                displayErrors(result.errors);
            }         
            else {
                alert(result.message);
            }
            // Enable all forms and buttons after the submission
        } catch (error) {
            console.error("Error submitting form data:", error);
        }
    }
}

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
    // Only initialize if elements exist
    if (activityTab && activitySubTabs) {
        activityTab.addEventListener("click", function () {
            reportsSubTabs.style.display = "none";
            activitySubTabs.style.display = activitySubTabs.style.display === "block" ? "none" : "block";
        });
    }

    if (reportsTab && reportsSubTabs) {
        reportsTab.addEventListener("click", function () {
            if (activitySubTabs) activitySubTabs.style.display = "none";
            reportsSubTabs.style.display = reportsSubTabs.style.display === "block" ? "none" : "block";
        });
    }

    // Initialize hover functionality only for elements that exist
    const dailyReportTab = document.getElementById("Daily-Reports");
    const dailyReportSubTabs = document.getElementById("dailyReport-sub-tabs");
    if (dailyReportTab && dailyReportSubTabs) {
        handleHover(dailyReportTab, dailyReportSubTabs);
    }

    const weeklyReportTab = document.getElementById("Weekly-Reports");
    const weeklyReportSubTabs = document.getElementById("weeklyReport-sub-tabs");
    if (weeklyReportTab && weeklyReportSubTabs) {
        handleHover(weeklyReportTab, weeklyReportSubTabs);
    }

    const biweeklyReportTab = document.getElementById("Biweekly-Reports");
    const biweeklyReportSubTabs = document.getElementById("BiweeklyReport-sub-tabs");
    if (biweeklyReportTab && biweeklyReportSubTabs) {
        handleHover(biweeklyReportTab, biweeklyReportSubTabs);
    }

    const monthlyReportTab = document.getElementById("Monthly-Reports");
    const monthlyReportSubTabs = document.getElementById("Monthly-rollover-sub-tabs");
    if (monthlyReportTab && monthlyReportSubTabs) {
        handleHover(monthlyReportTab, monthlyReportSubTabs);
    }

    const SpecificRangeReportsTab = document.getElementById("Specific-Range-Reports");
    const SummarySubTab = document.getElementById("Summary-sub-tabs");
    if (SpecificRangeReportsTab && SummarySubTab) {
        handleHover(SpecificRangeReportsTab, SummarySubTab);
    }
}

function handleHover(mainTab, subTab) {
    if (!mainTab || !subTab) return;

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

function enable_all_forms_and_hover(enable) {
    const NewEmployeeButton = document.getElementById('NewEmployees_button');

    if (enable) {
        NewEmployeeButton.classList.remove('disabled'); // Enable after first form submission
    } else {
        NewEmployeeButton.classList.add('disabled'); // Keep disabled initially
    }
}