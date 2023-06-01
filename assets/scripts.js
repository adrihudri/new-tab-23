

// Rest of the code...



// List all icons from the "brands" folder
var iconFiles = [
  "google",
  "facebook",
  "twitter",
  "amazon",
  "apple",
  "facebook",
  "twitter",
  "amazon",
  "apple",
  "facebook",
  "twitter",
  "amazon",
  "apple",
  "facebook",
  "twitter",
  "amazon",
  "apple",
  "facebook",
  "twitter",
  "amazon",
  "apple",
  "android"
  // Add more icon filenames as needed
];

// Toggle accordion panel visibility
function toggleAccordion() {
  this.classList.toggle("active");
  var panel = this.nextElementSibling;
  panel.classList.toggle("show");
}

// Attach event listeners to accordion buttons
var accordionButtons = document.querySelectorAll(".accordion-btn");
accordionButtons.forEach(function (button) {
  button.addEventListener("click", toggleAccordion);
});

// Populate the icon dropdown with the available icons
var iconSelect = document.getElementById("iconSelect");
var dropdownContainer = document.getElementById("dropdownContainer");
var selectedIconInput = document.getElementById("selectedIcon");

iconFiles.forEach(function (filename) {
  var iconPath = `assets/brands/${filename}.svg`;

  var optionElement = document.createElement("div");
  optionElement.classList.add("icon-option");
  optionElement.innerHTML = `<img src="${iconPath}">`;

  optionElement.addEventListener("click", function () {
    selectedIconInput.style.backgroundImage = `url(${iconPath})`;
    selectedIconInput.dataset.iconPath = iconPath; // Store the icon path as a data attribute
    selectedIconInput.value = filename; // Display the filename in the input field
    closeDropdown();
  });

  dropdownContainer.appendChild(optionElement);
});

// Add an icon
function addIcon() {
  var iconValue = selectedIconInput.dataset.iconPath;
  var urlValue = document.getElementById("url").value;

  if (!iconValue || !urlValue.trim()) {
    alert("Please select an icon and provide a URL.");
    return;
  }

  savedIcons.push({ icon: iconValue, url: urlValue });

  // Clear the input fields
  document.getElementById("url").value = "";
  selectedIconInput.style.backgroundImage = "none";
  selectedIconInput.dataset.iconPath = "";
  selectedIconInput.value = "";

  // Refresh the displayed icons
  displaySavedIcons();
}



// Open the dropdown
function openDropdown() {
  dropdownContainer.classList.add("show");
}

// Close the dropdown
function closeDropdown() {
  dropdownContainer.classList.remove("show");
}

// Attach event listeners to show/hide the dropdown
iconSelect.addEventListener("click", openDropdown);
document.addEventListener("click", function (event) {
  if (!iconSelect.contains(event.target) && !dropdownContainer.contains(event.target)) {
    closeDropdown();
  }
});



// Initialize savedIcons with an empty array
var savedIcons = [];


// Remove an icon
function removeIcon(index) {
  savedIcons.splice(index, 1);
  displaySavedIcons();
}

// Edit the URL of an icon
function editIcon(index) {
  var newURL = prompt("Enter the new URL for the icon:", savedIcons[index].url);
  if (newURL !== null) {
    savedIcons[index].url = newURL;
    displaySavedIcons();
  }
}

// Display the saved icons
function displaySavedIcons() {
  var savedIconsContainer = document.getElementById("savedIcons");
  savedIconsContainer.innerHTML = "";

  savedIcons.forEach(function (savedIcon, index) {
    var iconContainer = document.createElement("div");
    iconContainer.classList.add("saved-icon");

    var iconLink = document.createElement("a");
    iconLink.href = savedIcon.url;
    iconLink.target = "_blank";

    var iconImage = document.createElement("img");
    iconImage.src = savedIcon.icon;

    iconLink.appendChild(iconImage);
    iconContainer.appendChild(iconLink);

    var editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.innerHTML = '<img class="icon-btns" src="assets/img/edit.svg">';
    editButton.addEventListener("click", function () {
      editIcon(index);
    });
    iconContainer.appendChild(editButton);

    var removeButton = document.createElement("button");
    removeButton.classList.add("remove-button");
    removeButton.innerHTML = '<img class="icon-btns" src="assets/img/remove.svg">';
    removeButton.addEventListener("click", function () {
      removeIcon(index);
    });
    iconContainer.appendChild(removeButton);

    savedIconsContainer.appendChild(iconContainer);
  });
}



function displaySavedIconsContent() {
  var savedIconsContainer = document.getElementById("icons");
  savedIconsContainer.innerHTML = "";

  savedIcons.forEach(function (savedIcon, index) {
    var iconContainer = document.createElement("div");
    iconContainer.classList.add("saved-icon");

    var iconLink = document.createElement("a");
    iconLink.href = savedIcon.url;
    iconLink.target = "_blank";

    var iconImage = document.createElement("img");
    iconImage.src = savedIcon.icon;

    iconLink.appendChild(iconImage);
    iconContainer.appendChild(iconLink);

    savedIconsContainer.appendChild(iconContainer);
  });
}

// Open the settings panel
document.getElementById("openBtn").addEventListener("click", function () {
  document.getElementById("settingsPanel").style.width = "250px";
  document.getElementById("settingsPanel").style.padding = "60px 20px 20px 20px";
});

// Close the settings panel
document.getElementById("closeBtn").addEventListener("click", function () {
  document.getElementById("settingsPanel").style.width = "0";
  document.getElementById("settingsPanel").style.padding = "0px";
});

// Save the settings
document.getElementById("saveBtn").addEventListener("click", function () {
  let name = document.getElementById("name").value;
  chrome.storage.local.set({ name: name, icons: savedIcons }, function () {
    alert("Settings saved.");
    location.reload();
  });
});

// Load the settings
chrome.storage.local.get(["name", "icons"], function (data) {
  document.getElementById("name").value = data.name || "";
  if (Array.isArray(data.icons)) {
    savedIcons = data.icons;
  }
  displaySavedIcons();
  displaySavedIconsContent();
  document.getElementById("greeting").innerText = getGreeting() + ", " + data.name;
});

// Get the greeting based on the time
function getGreeting() {
  let hour = new Date().getHours();
  if (hour < 12) {
    return "Good Morning";
  } else if (hour < 18) {
    return "Hello";
  } else {
    return "Good Evening";
  }
}

// Attach event listener to add icon button
document.getElementById("addIcon").addEventListener("click", addIcon);



/* Update background randomly
var backgrounds = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
document.body.style.backgroundImage = 'url(' + backgrounds[Math.floor(Math.random() * backgrounds.length)] + ')';
*/

// Display time and date
setInterval(() => {
  let date = new Date();
  document.getElementById('time').innerText = date.toLocaleTimeString();
  document.getElementById('date').innerText = date.toLocaleDateString();
}, 1000);


