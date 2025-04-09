let map, marker, geocoder;

document.addEventListener('DOMContentLoaded', function () {
  init_tabs();

});

function initMap() {
  const initialLocation = { lat: 28.6139, lng: 77.2090 }; // Default location (Delhi, India)

  map = new google.maps.Map(document.getElementById('map'), {
    center: initialLocation,
    zoom: 10,
  });

  geocoder = new google.maps.Geocoder();

  marker = new google.maps.Marker({
    position: initialLocation,
    map: map,
    draggable: true,
  });

  marker.addListener('dragend', () => {
    updateAddress(marker.getPosition());
  });

  map.addListener('click', (event) => {
    marker.setPosition(event.latLng);
    updateAddress(event.latLng);
  });

  updateAddress(initialLocation);
}

function updateAddress(latLng) {
  geocoder.geocode({ location: latLng }, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
        document.getElementById('address').value = results[0].formatted_address;
      } else {
        document.getElementById('address').value = "No address found";
      }
    } else {
      console.error("Geocoder failed due to: " + status);
      document.getElementById('address').value = "Error retrieving address";
    }
  });
}

document.getElementById('maps-icon').addEventListener('click', () => {
  document.getElementById('map-modal').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
});

document.getElementById('close-modal').addEventListener('click', (event) => {
  event.preventDefault();
  document.getElementById('map-modal').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
});

window.onload = initMap;

document.getElementById('CreateSiteForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const password = document.querySelector('input[name="password"]').value;
  const checkPassword = document.querySelector('input[name="check_password"]').value;


  if (password !== checkPassword) {
    showMessage("Passwords do not match!", 'red');
    setTimeout(() => {
      messageDiv.textContent = "";
    }, 3000);
    return;
  }

  try {
    const response = await fetch('/site_panel/check_pass/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',  // Important for form data submission
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,  // CSRF token
      },
      body: new URLSearchParams({
        password: password
      })
    });
    const result = await response.json();

    if (result.success) {
      const submitResponse = await fetch('/site_panel/Insert_new_site/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,  // CSRF token
        },
        body: formData,
      });

      const submitResult = await submitResponse.json();
      messageDiv.textContent = submitResult.message;
      messageDiv.style.color = submitResult.success ? "green" : "red";

      if (submitResult.success) {
        showMessage(submitResult.message, 'green');
        setTimeout(() => {
          messageDiv.textContent = '';
        }, 3000);
        setTimeout(() => {
          window.location.reload();
        }, 3500);
      }
      } else {
        showMessage("Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character (@$!%#?&).", 'red');
        setTimeout(() => {
          messageDiv.textContent = '';
        }, 3000);
      }
      } catch (error) {
        console.error('Error during form submission:', error);
        document.getElementById('message').textContent = 'An error occurred. Please try again.';
        document.getElementById('message').style.color = "red";
      }
});

const messageDiv = document.getElementById('message');
const form = document.getElementById('CreateSiteForm');

function showMessage(text, color) {
  if (text.trim() !== "") {
      messageDiv.textContent = text;
      messageDiv.style.color = color;
      messageDiv.style.display = "block"; // Show message
  } else {
      messageDiv.textContent = ""; // Clear content
      messageDiv.style.display = "none"; // Hide message completely
  }

  form.style.height = "auto"; // Let content dictate height
}


function init_tabs() {
  const Settings = document.getElementById("settings-icon");
  const SettingsSubTabs = document.getElementById("Settings-sub-tabs");


  if (Settings) {
      Settings.addEventListener("click", function () {
          SettingsSubTabs.style.display = SettingsSubTabs.style.display === "block" ? "none" : "block";
      });
  }
}