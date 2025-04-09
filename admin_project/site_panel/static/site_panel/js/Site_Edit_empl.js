document.addEventListener("DOMContentLoaded", function () {
    // Tab navigation functionality
    init_tabs();
    const headerCheckbox = document.querySelector('th input[type="checkbox"]');
    const rowCheckboxes = document.querySelectorAll('td input[type="checkbox"]');

    document.getElementById('NewEmployee-form').style.display = 'block';

    document.getElementById('NewEmployee-form').addEventListener("submit", function (event) {
        submitForm(event, "UpdateEmployee");
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
            const eID = document.getElementById('eid').value;
            const formData = new FormData();
            formData.append('eID', eID); // Add ONLY the eID

            fetch('/site_panel/get_compensation_data/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
                body: formData, // Send ONLY the eID as form data
            })
            .then(response => response.json())
            .then(data => {
                console.log("Response from server:", data); // Log the full response
                if (data.success) {
                    loadPageData();
                } else if (result.errors) {
                    // Display errors below each field
                    displayErrors(result.errors);
                }else {
                    alert(data.message); // Show the error message from the server
                }
            })
            .catch(error => {
                console.error("Fetch Error:", error);
                alert("An error occurred. Please check the console.");
            });
        };
    });

    if (headerCheckbox) {
        headerCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => checkbox.checked = headerCheckbox.checked);
        });
    }

    // Optionally, you can add an event listener to row checkboxes to uncheck the header checkbox
    // when not all checkboxes are selected.
    if (rowCheckboxes) {
        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const allChecked = [...rowCheckboxes].every(cb => cb.checked);
                headerCheckbox.checked = allChecked;
            });
        });
    }
    
    const deleteButton = document.getElementById('Data-Delete');
    
    if (deleteButton) {
        deleteButton.addEventListener('click', async function() {
            const selectedRows = [];
            const checkboxes = document.querySelectorAll('#styled-table input[type="checkbox"]:checked');
    
            console.log("Checkboxes selected:", checkboxes.length); // Debugging
    
            if (checkboxes.length === 0) {
                    alert('No rows selected for deletion');
                    return;
            }
    
            for (const checkbox of checkboxes) {
                    const row = checkbox.closest('tr');
                    const editIcon = row.querySelector('.edit-icon'); // Find the edit icon within the row
    
                    console.log("Row:", row); // Debugging
                    console.log("Edit Icon:", editIcon); // Debugging
    
                    if (!editIcon) {
                        console.error("Edit icon is missing for row:", row);
                        continue;
                    }
    
                    const cid = editIcon.dataset.cid; // Get the cid from the edit icon
    
                    console.log("CID:", cid); // Debugging
    
                    if (!cid) {
                        console.error("CID is missing for row:", row);
                        continue;
                    }
    
                    selectedRows.push({ cid });
            }
    
            if (selectedRows.length === 0) {
                    alert('No rows selected for deletion (due to missing data).');
                    return;
            }
    
            console.log("Selected Rows:", selectedRows); // Debugging
    
            const csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
    
            if (!csrfTokenElement) {
                    console.error('CSRF token element not found');
                    alert('CSRF token not found. Please try again.');
                    return;
            }
    
            const csrfToken = csrfTokenElement.value;
            const url = '/site_panel/Delete_Compensation_Data/';
    
            try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': csrfToken,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ data: selectedRows })
                    });
    
                    const data = await response.json();
    
                    if (response.status === 200 && data.success) {
                        alert('Data deleted successfully.');
                        loadPageData(); // Reload the table data
                    } else {
                        console.error('Deletion failed:', data);
                        alert('Failed to delete data. Please try again.');
                    }
            } catch (error) {
                    console.error('An error occurred:', error);
                    alert('An error occurred during the deletion process.');
            }
        });
    }

    document.addEventListener("click", function(event) {
        if (event.target.closest(".edit-icon")) {  
            event.preventDefault();
    
            const icon = event.target.closest(".edit-icon"); // Get the clicked icon
            const cid = icon.dataset.cid;
            const effectiveDate = icon.dataset.effectiveDate;
            const url = `/site_panel/edit_employees_compensation/?empl_details=${encodeURIComponent(JSON.stringify([{ c_id: cid }, { effectiveDate: effectiveDate }]))}`;
            window.location.href = url;
        }
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

async function submitForm(event, formName) {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("form_name", formName); // Append the form name

    const startDateValue = document.getElementById("Employee_Start_date").value;
    const endDateValue = document.getElementById("Employee_End_date").value;

    if (startDateValue && endDateValue) { // Ensure both values exist
            const StartDate = new Date(startDateValue);
            const endDate = new Date(endDateValue);

            if (endDate <= StartDate) {
                alert("End date cannot be earlier than effective date.");
                return;
            }
            else{
                formData.append("end_date", endDateValue);
                try {
                    const submitResponse = await fetch('/site_panel/Update_Employee_data/', {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,  // CSRF token
                        },
                        body: formData,
                    });
            
                    const result = await submitResponse.json();
            
                    if (result.success) {
                        alert(result.message);
                    } else if (result.errors) {
                        // Display errors below each field
                        displayErrors(result.errors);
                    } else {
                        alert(result.message);
                    }
                    // Enable all forms and buttons after the submission
                } catch (error) {
                    console.error("Error submitting form data:", error);
                }
            }
    }
    else{
        try {
            const submitResponse = await fetch('/site_panel/Update_Employee_data/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,  // CSRF token
                },
                body: formData,
            });
    
            const result = await submitResponse.json();
    
            if (result.success) {
                alert(result.message);
            } else if (result.errors) {
                // Display errors below each field
                displayErrors(result.errors);
            } else {
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
            inputField.parentElement.appendChild(errorElement);
        } else {
            showGeneralError(errors[field]); // Show general error
        }
    });
}

function showGeneralError(message) {
    document.getElementById("general-error").innerText = message;
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

function updateTable(compensation) {
    let tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""; // Clear existing data

    if (compensation.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='9'>No records found.</td></tr>";
        return;
    }

    compensation.forEach(row => {
        let tr = document.createElement("tr");
        tr.dataset.cid = row.cID;
        tr.innerHTML = `
            <td id="edit-delete"><input type="checkbox"></td>
            <td id="edit-delete">
                <a class="edit-icon" id="edit-icon" data-cid="${row.cID}" data-effectiveDate="${row.Effective_Date}">
                    <i class="fas fa-edit"></i>
                </a>
            </td>
            <td>${row.Emp_Name}</td>
            <td>${row.Position}</td>
            <td>${row.Position_Type}</td>
            <td>${row.Rate_Type}</td>
            <td>${row.Rate}</td>
            <td>${row.Effective_Date}</td>
            <td style="text-align:center;">${row.End_Date ?? '-'}</td>
        `;
        tableBody.appendChild(tr);
    });
    
}

function updatePagination(page_obj, page_range, per_page) {
    console.log("Page Object:", page_obj); // Log the page_obj
    console.log("Page Range:", page_range); // Log the page_range

    let paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = ""; // Clear existing pagination

    let paginationHTML = "";

    // Previous page button
    if (page_obj.has_previous) {
        paginationHTML += `<a href="#" class="custom-button nav-button" data-page="${page_obj.previous_page_number}">&lt;</a>`;
    } else {
        paginationHTML += `<button type="button" class="custom-button nav-button" disabled>&lt;</button>`;
    }

    // Page number dropdown
    paginationHTML += `<select id="page-select" class="page-dropdown">`;
    page_range.forEach(page => {
        paginationHTML += `<option value="${page}" ${page === page_obj.number ? "selected" : ""}>${page}</option>`;
    });
    paginationHTML += `</select>`;
    paginationHTML += `<span class="page-info">of ${page_range.length}</span>`;

    // Items per page dropdown
    paginationHTML += `<select id="per-page" class="page-dropdown">`;
    [1, 25, 50, 100, 1000].forEach(num => {
        paginationHTML += `<option value="${num}" ${num === per_page ? "selected" : ""}>${num}/page</option>`;
    });
    paginationHTML += `</select>`;

    // Next page button
    if (page_obj.has_next) {
        paginationHTML += `<a href="#" class="custom-button nav-button" data-page="${page_obj.next_page_number}">&gt;</a>`;
    } else {
        paginationHTML += `<button type="button" class="custom-button nav-button" disabled>&gt;</button>`;
    }

    paginationContainer.innerHTML = paginationHTML;

    attachPaginationEvents();
}

function attachPaginationEvents() {
    document.querySelectorAll(".nav-button").forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            let page = this.getAttribute("data-page");
            let per_page = document.getElementById("per-page").value;
            loadPageData(page, per_page);
        });
    });

    document.getElementById("page-select").addEventListener("change", function () {
        let per_page = document.getElementById("per-page").value;
        loadPageData(this.value, per_page);
    });

    document.getElementById("per-page").addEventListener("change", function () {
        loadPageData(1, this.value);
    });
}


function loadPageData(page = 1, per_page = 1) {
    fetch(`/site_panel/get_compensation_data/?page=${page}&per_page=${per_page}`)
        .then(response => response.json())
        .then(data => {
            updateTable(data.compensation);
            updatePagination(data.page_obj, data.page_range, per_page);
        })
        .catch(error => console.error("Error fetching data:", error));
}

