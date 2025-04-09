document.addEventListener('DOMContentLoaded', function () {
    init_tabs();

    document.getElementById("CreateSite").addEventListener("click", function () {
        window.location.href = "/site_panel/create_site/"; // Flask route for Create Site
    });
    
    document.getElementById("ViewSites").addEventListener("click", function () {
        window.location.href = "/site_panel/viewSites/"; // Flask route for View Sites
    });

});

function init_tabs() {
    const Settings = document.getElementById("settings-icon");
    const SettingsSubTabs = document.getElementById("Settings-sub-tabs");


    if (Settings) {
        Settings.addEventListener("click", function () {
            SettingsSubTabs.style.display = SettingsSubTabs.style.display === "block" ? "none" : "block";
        });
    }
}