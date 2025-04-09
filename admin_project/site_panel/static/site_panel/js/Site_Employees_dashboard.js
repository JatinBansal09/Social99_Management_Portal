document.addEventListener("DOMContentLoaded", function () {

    init_tabs();
    const tableBody = document.querySelector('.styled-table tbody'); // Select table body
    
    const perPageSelect = document.getElementById("per-page");

    function loadData(page, perPage) {
        fetch(`/site_panel/employee_management_dashboard/?page=${page}&per_page=${perPage}`)
            .then(response => response.json())
            .then(data => {
                if (data.no_results) { // Handle no results case
                    tableBody.innerHTML = ''; // Clear table
                    return; // Exit early
                }
                
                tableBody.innerHTML = ''; // Clear existing table data

                data.employee_data.forEach(row => {  // Use data.employee_data
                    const newRow = tableBody.insertRow();
                    const checkboxCell = newRow.insertCell();
                    checkboxCell.innerHTML = '<input type="checkbox">';
                    const editCell = newRow.insertCell();
                    editCell.innerHTML = `<a class="edit-icon" ata-empid="${row.EmployeeID}"><i class="fas fa-edit"></i></a>`;
                    newRow.insertCell().textContent = row.Location;
                    newRow.insertCell().textContent = row.Owner;
                    newRow.insertCell().textContent = row.Ename;
                    newRow.insertCell().textContent = row.StartDate;
                    newRow.insertCell().textContent = row.EndDate;
                    newRow.insertCell().textContent = row.Phone1;
                    newRow.insertCell().textContent = row.Phone2;
                    newRow.insertCell().textContent = row.SmartServer;

                    // Update pagination controls (if needed) - but with GET, not needed
                });
        })
        .catch(error => console.error("Error loading data:", error));
}

    perPageSelect.addEventListener("change", function () {
        updateURLParams({ per_page: this.value, page: 1 }); // Update URL with new per_page
    });

    document.getElementById("page-select").addEventListener("change", function () {
        let per_page = document.getElementById("per-page").value;
        updateURLParams({ page: this.value, per_page }); // Update URL with new page
    });

    document.getElementById("Applyfilter-button").addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("storedData");
        storedData = { stored_fieldSelect: [], stored_valueInput: [] };
        console.log("Apply Filter button clicked");
        const selectedField = document.querySelector("#dynamic-inputs select");
        const selectedValueElement = document.querySelector("#dynamic-inputs select:last-child, #dynamic-inputs input");

        

        document.querySelectorAll("#dynamic-inputs .filter-row").forEach(row => {
            const fieldSelect = row.querySelector(".fieldSelect");
            const valueInput = row.querySelector(".valueInput, .location-select");

            if (fieldSelect && valueInput) {
                const fieldValue = fieldSelect.value;
                const inputValue = valueInput.value;

                if (!storedData.stored_fieldSelect.some((storedField, index) => storedField === fieldValue && storedData.stored_valueInput[index] === inputValue)) {
                    storedData.stored_fieldSelect.push(fieldValue);
                    storedData.stored_valueInput.push(inputValue);
                    saveStoredDataToLocalStorage(); // Save here
                    console.log("Stored Data:", storedData);

                }
            }
        });

        if (selectedField && selectedField.value && selectedValueElement) {
            const fieldValue = selectedValueElement.value;
            console.log("Selected Field:", selectedField.value);
            console.log("Selected Value:", fieldValue);

            // Store the filter-section visibility state in localStorage
            localStorage.setItem("filterSectionVisible", "true");

            updateURLParams({ site_selected_location: fieldValue, page: 1 });
        } else {
            console.log("No valid filter selected");
            localStorage.setItem("filterSectionVisible", "true");
            updateURLParams({ site_selected_location: "", page: 1 });
        }
    });

    function updateURLParams(params) {
        const urlParams = new URLSearchParams(window.location.search);
        for (const key in params) {
            if (params[key]) {
                urlParams.set(key, params[key]);
            } else {
                urlParams.delete(key);
            }
        }
        window.location.href = `${window.location.pathname}?${urlParams.toString()}`;
    }

    // Initial data load (Crucial!)
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = urlParams.get('page') || 1;
    const initialPerPage = urlParams.get('per_page') || 25; // Default 25

    loadData(initialPage, initialPerPage);  // Load data on page load

});

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