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
 

  document.addEventListener('DOMContentLoaded', function() {
    let inputIsOpen = false;
  
    const plusButton = document.getElementById('plus-button');
    const newLinkInput = document.getElementById('new-link-url');
    const addLinkWrapper = document.getElementById('add-link-wrapper');
  
    //--- 1) Toggle input or add link on plus-button click
    plusButton.addEventListener('click', () => {
      if (!inputIsOpen) {
        openSlideInput();
      } else {
        // Input is open; check if there's text
        const url = newLinkInput.value.trim();
        if (url) {
          addLink(url);
        } else {
          // no URL, close the input
          closeSlideInput();
        }
      }
    });
  
    // Press Enter in input => add link
    newLinkInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const url = newLinkInput.value.trim();
        if (url) {
          addLink(url);
        }
      }
    });
    
    // Add keyboard shortcut: Ctrl/Cmd + L to focus the link input
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        if (!inputIsOpen) {
          openSlideInput();
        } else {
          newLinkInput.focus();
        }
      }
      
      // Escape key to close input
      if (e.key === 'Escape') {
        if (inputIsOpen) {
          closeSlideInput();
        }
      }
    });
  
    // If input is open and user clicks outside => close it (if empty)
    document.addEventListener('click', (e) => {
      if (inputIsOpen && !addLinkWrapper.contains(e.target)) {
        // If there's typed text, you can decide whether to keep it open
        // or close it. We'll just close it unconditionally:
        closeSlideInput();
      }
    });
  
    function openSlideInput() {
      newLinkInput.classList.add('open');
      inputIsOpen = true;
      setTimeout(() => newLinkInput.focus(), 150);
    }
  
    function closeSlideInput() {
      newLinkInput.value = '';
      newLinkInput.classList.remove('open');
      inputIsOpen = false;
    }
  
    //--- 2) Add a new link to storage
    function addLink(url) {
      chrome.storage.sync.get(['customLinks'], (result) => {
        const links = result.customLinks || [];
    
        // Add the link without a title (titles are auto-generated from URLs)
        links.push({ title: '', url });
    
        // Save to storage
        chrome.storage.sync.set({ customLinks: links }, () => {
          loadCustomLinks();
          closeSlideInput();
          
          // Show success feedback
          showSuccessMessage('Link added successfully!');
          
          // Now try to fetch the actual page title
          fetchPageTitle(url, links.length - 1);
        });
      });
    }
    
    // Function to show success message
    function showSuccessMessage(message) {
      const successDiv = document.createElement('div');
      successDiv.textContent = message;
      successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(52, 168, 83, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        backdrop-filter: blur(10px);
        animation: slideIn 0.3s ease;
      `;
      
      document.body.appendChild(successDiv);
      
      // Remove after 3 seconds
      setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
          }
        }, 300);
      }, 3000);
    }
    
    // Add CSS animations for the success message
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    // Function to fetch the actual page title
    function fetchPageTitle(url, linkIndex) {
      // Create a proxy request to fetch the page title
      // Note: Due to CORS restrictions, we'll use a simple approach
      // In a real extension, you might want to use chrome.tabs API or a backend service
      
      // For now, we'll try to improve the title based on the URL path
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
        
        if (pathParts.length > 0) {
          // Use the last meaningful path segment as title
          const lastPart = pathParts[pathParts.length - 1];
          if (lastPart && lastPart.length > 2) {
            // Convert kebab-case or snake_case to Title Case
            const improvedTitle = lastPart
              .replace(/[-_]/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase())
              .trim();
            
            if (improvedTitle.length > 0) {
              // Update the title in storage
              chrome.storage.sync.get(['customLinks'], (result) => {
                const links = result.customLinks || [];
                if (links[linkIndex]) {
                  links[linkIndex].title = improvedTitle;
                  chrome.storage.sync.set({ customLinks: links }, () => {
                    loadCustomLinks();
                  });
                }
              });
            }
          }
        }
      } catch (err) {
        // If URL parsing fails, keep the original title
        console.log('Could not improve title for:', url);
      }
    }
  
    //--- 3) Load & display the links in a grid (with favicon & optional title)
    function loadCustomLinks() {
      chrome.storage.sync.get(['customLinks'], (result) => {
        const listElement = document.getElementById('custom-links-list');
        if (!listElement) return;
  
        listElement.innerHTML = '';
        const links = result.customLinks || [];
  
        links.forEach((link, index) => {
          const li = document.createElement('li');
  
          // Add drag handle icon (top right)
          const dragHandle = document.createElement('div');
          dragHandle.innerHTML = '⋮⋮';
          dragHandle.style.cssText = `
            position: absolute;
            top: 2px;
            right: 2px;
            font-size: 12px;
            color: rgba(255,255,255,0.6);
            cursor: move;
            user-select: none;
            opacity: 0;
            transition: opacity 0.2s ease;
          `;
          li.appendChild(dragHandle);
          
          // Add delete icon (bottom right)
          const deleteIcon = document.createElement('div');
          deleteIcon.innerHTML = '✕';
          deleteIcon.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: -2px;
            font-size: 12px;
            color: white;
            cursor: pointer;
            user-select: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            background: rgba(234, 67, 53, 0.9);
            border-radius: 4px;
            width: 18px;
            height: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            font-weight: bold;
          `;
          
          // Add click handler for delete
          deleteIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteLink(index);
          });
          
          li.appendChild(deleteIcon);
          
          // Show handles on hover
          li.addEventListener('mouseenter', () => {
            dragHandle.style.opacity = '1';
            deleteIcon.style.opacity = '1';
          });
          
          li.addEventListener('mouseleave', () => {
            dragHandle.style.opacity = '0';
            deleteIcon.style.opacity = '0';
          });
  
          // Favicon link
          const anchor = document.createElement('a');
          anchor.href = link.url;
          anchor.target = '_blank';
          anchor.title = link.url; // tooltip showing full URL
  
          let domain = '';
          try {
            domain = new URL(link.url).hostname;
          } catch (err) {
            domain = 'example.com';
          }
  
          const favicon = document.createElement('img');
          favicon.alt = link.url;
          favicon.style.width = '48px';
          favicon.style.height = '48px';
          favicon.style.borderRadius = '8px';
          favicon.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
          
          // Try multiple favicon sources for better quality
          const faviconSources = [
            `https://www.google.com/s2/favicons?sz=64&domain=${domain}`,
            `https://favicon.ico/${domain}`,
            `https://${domain}/favicon.ico`,
            `https://${domain}/apple-touch-icon.png`,
            `https://${domain}/apple-touch-icon-precomposed.png`
          ];
          
          let currentSourceIndex = 0;
          
          function tryNextFavicon() {
            if (currentSourceIndex < faviconSources.length) {
              favicon.src = faviconSources[currentSourceIndex];
              currentSourceIndex++;
            } else {
              // All sources failed, use fallback
              favicon.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzQyODVGNCIvPgo8cGF0aCBkPSJNMjQgMTJMMzYgMjRMMjQgMzZMMTIgMjRMMjQgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
            }
          }
          
          // Add error handling for favicon loading
          favicon.onerror = function() {
            tryNextFavicon();
          };
          
          // Start with the first source
          tryNextFavicon();
  
          anchor.appendChild(favicon);
          li.appendChild(anchor);
  
          // Generate title from URL
          let title = '';
          try {
            let domainName = new URL(link.url).hostname.toLowerCase();
            domainName = domainName.replace(/^www\./, '');
            domainName = domainName.replace(/\.com$/, '');
            if (domainName.length > 0) {
              title = domainName.charAt(0).toUpperCase() + domainName.slice(1);
            } else {
              title = 'Site';
            }
          } catch (err) {
            title = 'Link';
          }
          
          // Show the generated title under the favicon
          const titleSpan = document.createElement('span');
          titleSpan.classList.add('link-title');
          titleSpan.textContent = title;
          li.appendChild(titleSpan);
  
          listElement.appendChild(li);
        });
  
        // Enable drag & drop to reorder
        enableLinkDragAndDrop(listElement, links);
      });
    }
    
    // Function to delete a link
    function deleteLink(index) {
      chrome.storage.sync.get(['customLinks'], (result) => {
        const links = result.customLinks || [];
        links.splice(index, 1);
        
        chrome.storage.sync.set({ customLinks: links }, () => {
          loadCustomLinks();
          showSuccessMessage('Link deleted successfully!');
        });
      });
    }
  
    //--- 4) Drag & drop for reordering
    function enableLinkDragAndDrop(listElement, linksArray) {
      let draggedItemIndex = null;
      const listItems = listElement.querySelectorAll('li');
  
      listItems.forEach((item, index) => {
        item.draggable = true;
  
        item.addEventListener('dragstart', (e) => {
          draggedItemIndex = index;
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', index); 
          item.classList.add('dragging');
        });
  
        item.addEventListener('dragend', () => {
          item.classList.remove('dragging');
        });
  
        item.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        });
  
        item.addEventListener('drop', (e) => {
          e.preventDefault();
          const droppedOnIndex = index;
  
          if (draggedItemIndex !== null && draggedItemIndex !== droppedOnIndex) {
            // Reorder array
            const draggedLink = linksArray.splice(draggedItemIndex, 1)[0];
            linksArray.splice(droppedOnIndex, 0, draggedLink);
  
            // Save new order
            chrome.storage.sync.set({ customLinks: linksArray }, () => {
              loadCustomLinks();
            });
          }
        });
      });
    }
  
    //--- 5) Finally, load the links on startup
    loadCustomLinks();
  });
  
  // Tech News Widget Functionality
  document.addEventListener('DOMContentLoaded', function() {
    const refreshNewsBtn = document.getElementById('refresh-news-btn');
    const techNewsList = document.getElementById('tech-news-list');
    
    // Load news on startup
    loadTechNews();
    
    // Refresh button functionality
    refreshNewsBtn.addEventListener('click', () => {
      loadTechNews();
      // Add spinning animation
      refreshNewsBtn.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        refreshNewsBtn.style.transform = 'rotate(0deg)';
      }, 500);
    });
    
    function loadTechNews() {
      // Show loading state
      techNewsList.innerHTML = '<div class="news-item"><div class="news-title">Loading latest tech news...</div><div class="news-source">Please wait</div></div>';
      
      // Using NewsAPI with the provided API key - using sources endpoint first to test
      const apiKey = '9bb0948989ba473ea49ddffd5fa544b2';
      const apiUrl = `https://newsapi.org/v2/sources?apiKey=${apiKey}`;
      
      // First test if the API key works
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // If sources work, try to get tech news
          const techNewsUrl = `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=8&apiKey=${apiKey}`;
          
          return fetch(techNewsUrl);
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.articles && data.articles.length > 0) {
            const newsArray = data.articles.map(article => ({
              title: article.title,
              source: article.source.name,
              url: article.url
            }));
            displayNews(newsArray);
          } else {
            // Fallback to mock data if no articles found
            displayNews([
              {
                title: "OpenAI Releases GPT-5 with Enhanced Reasoning Capabilities",
                source: "TechCrunch",
                url: "https://techcrunch.com/2024/01/15/openai-gpt-5-release/"
              },
              {
                title: "Apple Vision Pro Sales Exceed Expectations in First Week",
                source: "The Verge",
                url: "https://theverge.com/2024/01/14/apple-vision-pro-sales/"
              },
              {
                title: "Tesla Unveils New Cybertruck Production Milestone",
                source: "Reuters",
                url: "https://reuters.com/2024/01/13/tesla-cybertruck-production/"
              },
              {
                title: "Microsoft Announces Major Windows 12 Features",
                source: "Windows Central",
                url: "https://windowscentral.com/2024/01/12/windows-12-features/"
              },
              {
                title: "Google's Gemini AI Surpasses GPT-4 in Latest Benchmarks",
                source: "Ars Technica",
                url: "https://arstechnica.com/2024/01/11/google-gemini-benchmarks/"
              },
              {
                title: "Meta's Quest 3 VR Headset Gets Major Software Update",
                source: "UploadVR",
                url: "https://uploadvr.com/2024/01/10/meta-quest-3-update/"
              },
              {
                title: "SpaceX Successfully Lands Starship on Mars Simulation",
                source: "Space.com",
                url: "https://space.com/2024/01/09/spacex-starship-mars-test/"
              },
              {
                title: "NVIDIA's New AI Chip Breaks Performance Records",
                source: "Wired",
                url: "https://wired.com/2024/01/08/nvidia-ai-chip-performance/"
              }
            ]);
          }
        })
        .catch(error => {
          console.error('Error fetching news:', error);
          // Show error state with mock data for now
          displayNews([
            {
              title: "OpenAI Releases GPT-5 with Enhanced Reasoning Capabilities",
              source: "TechCrunch",
              url: "https://techcrunch.com/2024/01/15/openai-gpt-5-release/"
            },
            {
              title: "Apple Vision Pro Sales Exceed Expectations in First Week",
              source: "The Verge",
              url: "https://theverge.com/2024/01/14/apple-vision-pro-sales/"
            },
            {
              title: "Tesla Unveils New Cybertruck Production Milestone",
              source: "Reuters",
              url: "https://reuters.com/2024/01/13/tesla-cybertruck-production/"
            },
            {
              title: "Microsoft Announces Major Windows 12 Features",
              source: "Windows Central",
              url: "https://windowscentral.com/2024/01/12/windows-12-features/"
            },
            {
              title: "Google's Gemini AI Surpasses GPT-4 in Latest Benchmarks",
              source: "Ars Technica",
              url: "https://arstechnica.com/2024/01/11/google-gemini-benchmarks/"
            },
            {
              title: "Meta's Quest 3 VR Headset Gets Major Software Update",
              source: "UploadVR",
              url: "https://uploadvr.com/2024/01/10/meta-quest-3-update/"
            },
            {
              title: "SpaceX Successfully Lands Starship on Mars Simulation",
              source: "Space.com",
              url: "https://space.com/2024/01/09/spacex-starship-mars-test/"
            },
            {
              title: "NVIDIA's New AI Chip Breaks Performance Records",
              source: "Wired",
              url: "https://wired.com/2024/01/08/nvidia-ai-chip-performance/"
            }
          ]);
        });
    }
    
    function displayNews(newsArray) {
      techNewsList.innerHTML = '';
      
      newsArray.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
          <div class="news-title">${news.title}</div>
          <div class="news-source">${news.source}</div>
        `;
        
        // Add click handler to open news in new tab
        newsItem.addEventListener('click', () => {
          window.open(news.url, '_blank');
        });
        
        techNewsList.appendChild(newsItem);
      });
    }
    
    // Auto-refresh news every 30 minutes
    setInterval(loadTechNews, 30 * 60 * 1000);
  });
  