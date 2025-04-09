document.addEventListener("DOMContentLoaded", function () {
    // Initialize tabs
    init_tabs();

    const tableBody = document.querySelector('.styled-table tbody'); // Select table body
    const perPageSelect = document.getElementById("per-page");

    // Function to load data
    function loadData(page, perPage) {
        fetch(`/site_panel/daily_activity_tracking_dashboard/?page=${page}&per_page=${perPage}`)
            .then(response => response.json())
            .then(data => {
                if (data.no_results) {
                    tableBody.innerHTML = '';
                    return;
                }
    
                tableBody.innerHTML = '';
    
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                oneWeekAgo.setHours(0, 0, 0, 0); // Normalize time
    
                data.activity_data.forEach(row => {
                    const newRow = tableBody.insertRow();
    
                    // Debug log to check date format
                    console.log("Row Date (Raw):", row.Date);
    
                    let rowDate;
                    if (row.Date.includes('/')) { // Handle DD/MM/YYYY format
                        let [day, month, year] = row.Date.split('/');
                        rowDate = new Date(`${year}-${month}-${day}`);
            w        } else { // Assume correct ISO format
                        rowDate = new Date(row.Date);
                    }
    
                    rowDate.setHours(0, 0, 0, 0); // Normalize time
    
                    console.log("Parsed Row Date:", rowDate, "One Week Ago:", oneWeekAgo);
    
                    // Add checkbox only for dates within the last 7 days
                    const checkboxCell = newRow.insertCell();
                    if (rowDate >= oneWeekAgo) {
                        checkboxCell.innerHTML = '<input type="checkbox">';
                    }
    
                    newRow.insertCell().textContent = row.Date;
                    newRow.insertCell().textContent = row.Location;
                    newRow.insertCell().textContent = row.Notes;
                    const editCell = newRow.insertCell();
                    editCell.innerHTML = `<a class="edit-icon" data-siteid="${row.SiteID}" data-date="${row.Date}"><i class="fas fa-edit"></i></a>`;
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

    // Function to update URL parameters
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

    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = urlParams.get('page') || 1;
    const initialPerPage = urlParams.get('per_page') || 25; // Default 25

    loadData(initialPage, initialPerPage);  // Load data on page load

});

// Function to initialize tabs
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