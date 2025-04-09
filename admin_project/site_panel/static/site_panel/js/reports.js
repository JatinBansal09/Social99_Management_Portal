document.addEventListener('DOMContentLoaded', function () {
        init_tabs();

    });
       

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