document.addEventListener("DOMContentLoaded", function () {
    // Tab navigation functionality
    
    init_tabs();
    enable_all_forms_and_hover(false);

    const currentDateInput = document.getElementById('Employee_Start_date');

    const today = new Date().toISOString().split('T')[0];
    currentDateInput.value = today;

    document.getElementById('NewEmployee-form').style.display = 'block';

    document.getElementById('NewEmployee-form').addEventListener("submit", function (event) {
        submitForm(event, "NewEmployee");
    });

    

    document.getElementById('NewEmployees_button').addEventListener('click', function () {
        document.getElementById('NewEmployee-form').style.display = 'block';
        document.getElementById('Compensation-form').style.display = 'none';
    });
    // Compensation button: Only allow clicking if enabled
    document.getElementById('Compensation_button').addEventListener('click', function () {
        if (!this.classList.contains("disabled")) {
            document.getElementById('NewEmployee-form').style.display = 'none';
            document.getElementById('Compensation-form').style.display = 'block';
        } else {
            alert("You must submit the New Employee form first!");
        }
    });
});

async function submitForm(event, formName) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(event.target);
    formData.append("form_name", formName); // Append the form nam

    // Remove previous error messages
    form.querySelectorAll(".error-message").forEach(el => el.remove());

    // Get start and end dates
    const startDate = new Date(document.getElementById("Employee_Start_date").value);
    const endDate = new Date(document.getElementById("Employee_End_date").value);

    // Check if end date is before start date
    if (endDate && !isNaN(endDate) && endDate <= startDate) {
        alert("End date cannot be earlier or equal to start date.");
        return;
    }
    else{
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
                if (result.formName=='NewEmployee'){
                    console.log(result.data)
                    localStorage.setItem("emp_id", result.data);  // Store globally
                    console.log("Stored emp_id:", result.data);
                    alert(result.message);
                    enable_all_forms_and_hover(true);
                }
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
    const compensationButton = document.getElementById('Compensation_button');

    if (enable) {
        compensationButton.classList.remove('disabled'); // Enable after first form submission
    } else {
        compensationButton.classList.add('disabled'); // Keep disabled initially
    }
}

async function fetchCompensationData() {
    try {
        const response = await fetch('/site_panel/get_compensation_data/');
        const data = await response.json();

        if (data.success) {
            const compContainer = document.getElementById('Compensation-form');
            compContainer.innerHTML = generateCompensationTable(data.compensation);
        } else {
            alert("Failed to load compensation data.");
        }
    } catch (error) {
        console.error("Error fetching compensation data:", error);
    }
}

function generateCompensationTable(data) {
    let tableHTML = `<table class="styled-table">
        <thead>
            <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Salary</th>
                <th>Bonus</th>
            </tr>
        </thead>
        <tbody>`;

    data.forEach(item => {
        tableHTML += `
            <tr>
                <td>${item.employee_id}</td>
                <td>${item.name}</td>
                <td>${item.salary}</td>
                <td>${item.bonus}</td>
            </tr>`;
    });

    tableHTML += `</tbody></table>`;
    return tableHTML;
}