let currentSiteId = null;

document.addEventListener('DOMContentLoaded', function () {
    init_tabs();
});

// Open the modal
function openModal(siteId) {
    currentSiteId = siteId;
    document.getElementById('passwordModal').style.display = 'block';
}

// Close the modal
function closeModal() {
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('newPasswordInput').value = '';
    currentSiteId = null;
}

function getCSRFToken() {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    return csrfToken;
}

async function loadSites() {
    try {
        const response = await fetch('/site_panel/view_sites/');
        const sites = await response.json();

        const tableBody = document.querySelector('#sitesTable tbody');
        tableBody.innerHTML = '';

        sites.forEach(site => {
            const row = document.createElement('tr');
            if (!site.active) {
                row.classList.add('inactive-row');
            }
            row.innerHTML = `
            <td>${site.id}</td>
            <td>${site.site_name}</td>
            <td>${site.address}</td>
            <td>${site.username}</td>
            <td>${site.password}</td>
            <td>
                <span onclick="openModal(${JSON.stringify(site.id)})" title="Edit Site Data"><i class="fas fa-sync-alt"></i></span>
            </td>
            <td>
                <button onclick="toggleStatus(${site.id},'${site.site_name}',${site.active ? 0 : 1})">
                    ${site.active ? 'Active' : 'Deactive'}
                </button>
            </td>
            <td>
                <button onclick="toggleSuperuser(${site.id}, ${site.superuser ? 0 : 1})">
                    ${site.superuser ? 'Yes' : 'No'}
                </button>
            </td>`;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching site data:', error);
    }
}


async function toggleSuperuser(siteId, NewSup) {
    let confirmMessage = "";

    if (NewSup === 0) { // If changing to 'No' (superuser = 0)
        confirmMessage = "Are you sure you want to remove superuser privileges?";
    } else { // If changing to 'Yes' (superuser = 1)
        confirmMessage = "Are you sure you want to grant superuser privileges?";
    }

    if (confirm(confirmMessage)) {
        try {
            console.log("Toggling Superuser for Site ID:", siteId, "New Status:", NewSup);
            const response = await fetch('/site_panel/update_site_superuser/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({ site_id: siteId, NewSup: NewSup })
            });

            const result = await response.json();
            console.log("Response from server:", result); // Debugging line
            if (result.success) {
                alert(result.message);
                loadSites();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error updating superuser status:', error);
        }
    } else {
        console.log("Superuser change cancelled by user.");
        // Optionally, you can add a message or other UI feedback here.
    }
}

async function toggleStatus(siteId, siteName, newStatus) {
    let confirmMessage = "";

    if (newStatus === 0) {
        confirmMessage = `Are you sure you want to deactivate the site "${siteName}"?`;
    } else {
        confirmMessage = `Are you sure you want to activate the site "${siteName}"?`;
    }

    if (confirm(confirmMessage)) {
        try {
            const response = await fetch('/site_panel/update_site_status/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({ site_id: siteId, new_status: newStatus })
            });

            const result = await response.json();
            if (result.success) {
                alert(result.message);
                loadSites();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error updating site status:', error);
        }
    } else {
        console.log("Site status change cancelled by user.");
    }
}
async function submitPassword() {
    const newPassword = document.getElementById('newPasswordInput').value.trim();
    if (!newPassword) {
        alert('Password cannot be empty.');
        return;
    }

    try {
        const response = await fetch('/site_panel/update_site_password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({ site_id: currentSiteId, new_password: newPassword })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message);
            closeModal();
            loadSites();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error updating password:', error);
    }
}

window.onload = loadSites;

function init_tabs() {
    const Settings = document.getElementById("settings-icon");
    const SettingsSubTabs = document.getElementById("Settings-sub-tabs");
  
  
    if (Settings) {
        Settings.addEventListener("click", function () {
            SettingsSubTabs.style.display = SettingsSubTabs.style.display === "block" ? "none" : "block";
        });
    }
}