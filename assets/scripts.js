let isEditMode = false;

document.getElementById('gear-icon').addEventListener('click', toggleEditMode);
document.getElementById('apply-button').addEventListener('click', applyChanges);
document.getElementById('widgets-width-input').addEventListener('input', adjustWidthAndValue);
document.getElementById('time-format-input').addEventListener('change', setTimeAndDate);

document.addEventListener('DOMContentLoaded', function() {
  loadSettings();
  setDynamicWelcomeMessage();
  setTimeAndDate();
  setInterval(setTimeAndDate, 1000); // Update the time and date every second
});

function toggleEditMode() {
  isEditMode = !isEditMode;
  document.getElementById('edit-mode-container').classList.toggle('hidden');
  if (isEditMode) loadEditMode();
}

function loadSettings() {
  chrome.storage.sync.get(['name', 'widgetsWidth', 'is24HourFormat', 'city', 'backgroundKeyword'], function(items) {
    if (items.name) document.getElementById('name').textContent = items.name;
    if (items.widgetsWidth) document.getElementById('container').style.width = items.widgetsWidth + 'px';
    if (items.is24HourFormat != null) document.getElementById('time-format-input').checked = items.is24HourFormat;
    if (items.city) document.getElementById('city-input').value = items.city;
    setWeather(); // Set weather after loading the city
    setTimeAndDate(); // Set time and date after loading the time format

    // Use the saved background keyword or default to 'Nature'
    const backgroundKeyword = items.backgroundKeyword || 'Nature';
    setBackgroundImage(backgroundKeyword);
  });
}


function loadEditMode() {
  chrome.storage.sync.get(['name', 'widgetsWidth', 'is24HourFormat', 'city', 'backgroundKeyword'], function(items) {
    document.getElementById('name-input').value = items.name || '';
    const widgetsWidth = items.widgetsWidth || 1000;
    document.getElementById('widgets-width-input').value = widgetsWidth;
    document.getElementById('widgets-width-value').textContent = widgetsWidth + 'px';
    document.getElementById('time-format-input').checked = items.is24HourFormat || false;
    document.getElementById('city-input').value = items.city || 'London';

    // Background settings
    const backgroundSelect = document.getElementById('background-select');
    const customKeywordInput = document.getElementById('custom-keyword-input');
    const customKeywordContainer = document.getElementById('custom-keyword-container');

    // **Declare 'savedKeyword' before using it**
    const savedKeyword = items.backgroundKeyword || 'Nature';

    // **Declare 'predefinedCategories' before using it**
    const predefinedCategories = ['Nature', 'Cities', 'Animals', 'Space', 'Christmas'];

    // Now use 'savedKeyword' and 'predefinedCategories'
    if (predefinedCategories.includes(savedKeyword)) {
      backgroundSelect.value = savedKeyword;
      customKeywordContainer.style.display = 'none';
    } else {
      backgroundSelect.value = 'Custom';
      customKeywordContainer.style.display = 'block';
      customKeywordInput.value = savedKeyword;
    }
  });
}


function adjustWidthAndValue() {
  const newWidth = this.value;
  document.getElementById('widgets-width-value').textContent = newWidth + 'px';
  document.getElementById('container').style.width = newWidth + 'px';
}

function applyChanges() {
  console.log('applyChanges is called');

  const newName = document.getElementById('name-input').value;
  const newWidgetsWidth = document.getElementById('widgets-width-input').value;
  const is24HourFormat = document.getElementById('time-format-input').checked;
  const newCity = document.getElementById('city-input').value;
  const newUnit = document.getElementById('unit-input').value;

  // Background settings
  const backgroundSelectValue = document.getElementById('background-select').value;
  let backgroundKeyword = backgroundSelectValue;
  if (backgroundSelectValue === 'Custom') {
    backgroundKeyword = document.getElementById('custom-keyword-input').value || 'Nature';
  }

  const nameElement = document.getElementById('name');
  if (nameElement) {
    nameElement.textContent = newName;
  } else {
    console.error('Element with ID "name" is not found in the document.');
  }

  document.getElementById('container').style.width = newWidgetsWidth + 'px';

  chrome.storage.sync.set({
    name: newName,
    widgetsWidth: newWidgetsWidth,
    is24HourFormat: is24HourFormat,
    city: newCity,
    unit: newUnit,
    backgroundKeyword: backgroundKeyword
  }, function() {
    setTimeAndDate();
    setWeather();
    setBackgroundImage(backgroundKeyword);
    toggleEditMode();
  });
}


function setDynamicWelcomeMessage() {
  chrome.storage.sync.get(['name'], function(items) {
    const userName = items.name || 'User';
    const hour = new Date().getHours();
    let greeting;

    if (hour >= 5 && hour < 12) greeting = "Good Morning";
    else if (hour >= 12 && hour < 18) greeting = "Good Afternoon";
    else if (hour >= 18 && hour < 22) greeting = "Good Evening";
    else greeting = "Good Night";

    const specialGreetings = [
      "Rise and Shine",
      "Time to Make the Donuts",
      "Carpe Diem",
      "Looking great",
      "Time to Seize the Day",
      "Let's Roll",
      "Let's Make Today a Great One",
      "Keep Pushing Forward",
      "Your Day Awaits",
      "Embrace the Challenge",
      "You've Got This",
      "Conquer the Day",
      "Brighten Up!",
      "The Future Is Yours",
      "Make It Count",
      "Awake and Achieve",
      "Your Time to Shine",
      "Onward and Upward",
      "Focus and Flourish",
      "Ignite Your Passion",
      "Today's a Gift",
      "Seize Every Moment",
      "Champion Your Goals",
      "Dare to Dream Big",
      "Fuel Your Ambition",
      "Start Strong",
      "Embrace Your Potential",
      "Opportunities Await",
      "Your Journey Begins",
      "Unleash Your Power",
      "Strive for Greatness",
      "Make It Happen",
      "Design Your Destiny",
      "Savor the Possibilities",
      "Innovate and Inspire",
      "Luminaries Lead On",
      "Greatness Beckons",
      "Overcome and Excel",
      "Embrace the New Day",
      "Celebrate Your Strengths",
      "Push Your Boundaries",
      "Rise Beyond Limits",
      "Chase Your Vision",
      "Your Path Is Clear",
      "Unlock Your Potential",
      "Radiate Confidence",
      "Energize and Excel",
      "The Day Is Yours",
      "Shine Your Light",
      "Fuel the Fire Within",
      "Turn Hope into Action",
      "Nurture Your Aspirations",
      "Master Your Mindset",
      "Welcome to Possibility",
      "Embrace the Adventure",
      "Set Your Intentions",
      "Blaze a New Trail",
      "Achieve the Extraordinary",
      "Climb to New Heights",
      "Focus, Flow, Flourish",
      "Celebrate Each Step",
      "Break New Ground",
      "Smile and Succeed",
      "Today Is for You",
      "Let Your Spark Ignite"
    ];
    

    if (Math.random() < 0.5) greeting = specialGreetings[Math.floor(Math.random() * specialGreetings.length)];

    document.getElementById('welcome').textContent = greeting + ', ' + userName;
  });
}

function setTimeAndDate() {
  const now = new Date();
  const is24HourFormat = document.getElementById('time-format-input').checked;
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: !is24HourFormat };
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

  document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', timeOptions);
  document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', dateOptions);
}

function setWeather() {
  const apiKey = '5ffcc3768c02c3d860d1dae86b51a93e';
  
  chrome.storage.sync.get(['city', 'unit'], function(items) {
    const city = items.city || 'London'; // Use stored city or default to London
    const units = items.unit || 'metric'; // Use stored unit or default to 'metric'
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const description = data.weather[0].description;
        const temperature = Math.round(data.main.temp);
        const icon = data.weather[0].icon;
        const unitSymbol = units === 'metric' ? '°C' : '°F';

        document.getElementById('weather-city').textContent = data.name;
        document.getElementById('weather-description').textContent = description;
        document.getElementById('weather-temperature').textContent = `${temperature}${unitSymbol}`;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${icon}.png`;
      })
      .catch(error => console.error('Error fetching the weather data:', error));
  });
}

async function setBackgroundImage(keyword) {
    const apiKey = 'EuPTXNpHrLXxzMl5Dra5oYPPFYfAFjVrxL1khW5gte2ZAUXqGtISzCfL'; // Replace with your Pexels API key
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=80`, {
        headers: {
          Authorization: apiKey
        }
      });
      const data = await response.json();
  
      if (data.photos && data.photos.length > 0) {
        // Filter images with width >= 3840 (4K resolution)
        const images = data.photos.filter(photo => photo.width >= 3840);
  
        if (images.length > 0) {
          const randomImage = images[Math.floor(Math.random() * images.length)];
          // Use the highest resolution available
          const imageUrl = randomImage.src.original;
  
          document.body.style.backgroundImage = `url(${imageUrl})`;

        } else {
          console.error('No 4K images found for this keyword.');
        }
      } else {
        console.error('No images found for this keyword.');
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }



    
  }

  document.addEventListener('DOMContentLoaded', function () {
    const backgroundSelect = document.getElementById('background-select');
    if (backgroundSelect) {
      backgroundSelect.addEventListener('change', function () {
        const customKeywordContainer = document.getElementById('custom-keyword-container');
        if (this.value === 'Custom') {
          customKeywordContainer.style.display = 'block';
        } else {
          customKeywordContainer.style.display = 'none';
        }
      });
    }
  });
  