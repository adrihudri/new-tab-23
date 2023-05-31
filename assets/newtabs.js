// Open the settings panel
function openNav() {
    document.getElementById("settingsPanel").style.width = "250px";
  }
  
  // Close the settings panel
  function closeNav() {
    document.getElementById("settingsPanel").style.width = "0";
  }
  
// Save the settings
function saveSettings() {
    let name = document.getElementById("name").value;
    let icons = JSON.parse(document.getElementById("icons").value);
    chrome.storage.local.set({name: name, icons: icons}, function() {
      alert('Settings saved.');
      location.reload();
    });
  }
  
  // Load the settings
  chrome.storage.local.get(['name', 'icons'], function(data) {
    document.getElementById("name").value = data.name || '';
    document.getElementById("icons").value = JSON.stringify(data.icons || {});
    document.getElementById("greeting").innerText = getGreeting() + ', ' + data.name;
    for (var name in data.icons) {
      var link = document.createElement('a');
      link.href = data.icons[name];
      var icon = document.createElement('img');
      icon.src = 'icons/' + name + '.png';
      link.appendChild(icon);
      document.getElementById("icons").appendChild(link);
    }
  });
  
  // Get the greeting based on the time
  function getGreeting() {
    let hour = new Date().getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Hello';
    } else {
      return 'Good Evening';
    }
  }
  

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

// Display weather
fetch('http://api.openweathermap.org/data/2.5/weather?q=YourCity&units=metric&appid=5ffcc3768c02c3d860d1dae86b51a93e')
  .then(response => response.json())
  .then(data => {
    document.getElementById('weather').innerText = data.main.temp + '°C, ' + data.weather[0].description;
  });

  

// Add icons with custom links
var icons = {
  'Google': 'https://www.google.com',
  'Facebook': 'https://www.facebook.com',
  'Twitter': 'https://www.twitter.com',
};
var iconsDiv = document.getElementById('icons');
for (var name in icons) {
  var link = document.createElement('a');
  link.href = icons[name];
  var icon = document.createElement('img');
  icon.src = 'icons/' + name + '.png';
  link.appendChild(icon);
  iconsDiv.appendChild(link);
}
