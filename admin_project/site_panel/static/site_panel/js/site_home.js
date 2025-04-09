document.addEventListener("DOMContentLoaded", function () {
    // Handle Activity tab click
    init_tabs();

    if (window.location.pathname.includes("way_to_logout")) {
        document.getElementById("settingsPageIcon").classList.add("rotate");
    }
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