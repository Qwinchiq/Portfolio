// Weather API configuration
const BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const WEATHER_URL = 'https://api.open-meteo.com/v1';

// DOM elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const currentTemp = document.getElementById('current-temp');
const weatherDesc = document.getElementById('weather-desc');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const updateTime = document.getElementById('update-time');
const forecastCards = document.getElementById('forecast-cards');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');

// Current view state
let currentView = 'daily';

// Search button click handler
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

// Enter key handler for input
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

// Get weather data from API
async function getWeatherData(city) {
    try {
        // Show loading state
        searchBtn.innerHTML = '<div class="loading"></div>';
        
        // Get coordinates for the city
        const geoResponse = await fetch(
            `${BASE_URL}/search?name=${encodeURIComponent(city)}&language=pl&count=1`
        );
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('Nie znaleziono miasta');
        }

        const { latitude, longitude } = geoData.results[0];

        // Get current weather and forecast in one call
        const weatherResponse = await fetch(
            `${WEATHER_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,pressure_msl,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&timezone=auto`
        );
        const weatherData = await weatherResponse.json();

        // Update UI with weather data
        updateCurrentWeather(weatherData, geoData.results[0].name);
        updateForecast(weatherData);
    } catch (error) {
        showError(error.message);
    } finally {
        // Reset search button
        searchBtn.innerHTML = '<i class="fas fa-search"></i><span>Szukaj</span>';
    }
}

// Update current weather display
function updateCurrentWeather(data, city) {
    cityName.textContent = city;
    currentTemp.textContent = Math.round(data.current.temperature_2m);
    weatherDesc.innerHTML = `
        <i class="fas ${getWeatherIcon(data.current.weather_code)}"></i>
        <span>${getWeatherDescription(data.current.weather_code)}</span>
    `;
    windSpeed.textContent = `${Math.round(data.current.wind_speed_10m * 3.6)} km/h`;
    humidity.textContent = `${Math.round(data.current.relative_humidity_2m)}%`;
    pressure.textContent = `${Math.round(data.current.pressure_msl)} hPa`;
    
    // Update sunrise and sunset times
    const sunriseTime = new Date(data.current.sunrise * 1000);
    const sunsetTime = new Date(data.current.sunset * 1000);
    sunrise.textContent = sunriseTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    sunset.textContent = sunsetTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    
    // Update last update time
    updateTime.textContent = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

// Update forecast display
function updateForecast(data) {
    forecastCards.innerHTML = '';
    
    if (!data.daily || !data.daily.time) {
        return;
    }

    // Create forecast cards for each day
    data.daily.time.forEach((time, index) => {
        const forecast = {
            date: time, // pass full date string (YYYY-MM-DD)
            weekday: new Date(time).toLocaleDateString('pl-PL', { weekday: 'long' }),
            icon: data.daily.weather_code[index],
            max: data.daily.temperature_2m_max[index],
            min: data.daily.temperature_2m_min[index],
            hourlyData: {
                time: data.hourly.time,
                temperature_2m: data.hourly.temperature_2m,
                weather_code: data.hourly.weather_code
            }
        };
        const card = createForecastCard(forecast);
        forecastCards.appendChild(card);
    });
}

// Create forecast card element
function createForecastCard(forecast) {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
        <div class="forecast-date">${forecast.weekday}</div>
        <i class="fas ${getWeatherIcon(forecast.icon)}"></i>
        <div class="forecast-temp">
            <span class="max">${Math.round(forecast.max)}°</span>
            <span class="min">${Math.round(forecast.min)}°</span>
        </div>
    `;

    // Add click event to show hourly forecast
    card.addEventListener('click', () => {
        showHourlyForecast(forecast.date, forecast.weekday, forecast.hourlyData);
    });

    return card;
}

// Show hourly forecast for selected day
function showHourlyForecast(selectedDate, weekdayName, hourlyData) {
    // Remove any existing hourly forecast and overlay
    const existingForecast = document.querySelector('.hourly-forecast');
    const existingOverlay = document.querySelector('.hourly-overlay');
    if (existingForecast) existingForecast.remove();
    if (existingOverlay) existingOverlay.remove();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'hourly-overlay';

    // Create hourly forecast container
    const hourlyContainer = document.createElement('div');
    hourlyContainer.className = 'hourly-forecast';

    // Add header
    const header = document.createElement('div');
    header.className = 'hourly-header';
    header.innerHTML = `
        <h3>Prognoza godzinowa - ${weekdayName}</h3>
    `;
    hourlyContainer.appendChild(header);

    // Create cards container
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'hourly-cards';

    // Process hourly data
    if (hourlyData && hourlyData.time) {
        // Debug: log selectedDate and available times
        console.log('Selected date:', selectedDate);
        console.log('Hourly times:', hourlyData.time);
        const dayHours = hourlyData.time
            .map((time, index) => ({
                time: new Date(time),
                dateString: time.substring(0, 10),
                temp: hourlyData.temperature_2m[index],
                code: hourlyData.weather_code[index]
            }))
            .filter(item => item.dateString === selectedDate);

        console.log('Filtered hours:', dayHours);

        if (dayHours.length === 0) {
            const noData = document.createElement('div');
            noData.style.textAlign = 'center';
            noData.style.padding = '2rem';
            noData.textContent = 'Brak danych godzinowych dla wybranego dnia.';
            cardsContainer.appendChild(noData);
        } else {
            dayHours.forEach(hour => {
                const hourCard = document.createElement('div');
                hourCard.className = 'hourly-card';
                hourCard.innerHTML = `
                    <div class="hour">${hour.time.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</div>
                    <i class="fas ${getWeatherIcon(hour.code)}"></i>
                    <div class="temp">${Math.round(hour.temp)}°</div>
                `;
                cardsContainer.appendChild(hourCard);
            });
        }
    }

    hourlyContainer.appendChild(cardsContainer);

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-hourly';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.addEventListener('click', () => {
        hourlyContainer.remove();
        overlay.remove();
    });

    hourlyContainer.appendChild(closeButton);

    // Add overlay click handler
    overlay.addEventListener('click', () => {
        hourlyContainer.remove();
        overlay.remove();
    });

    // Add to the body
    document.body.appendChild(overlay);
    document.body.appendChild(hourlyContainer);
}

// Get weather icon based on weather condition code
function getWeatherIcon(code) {
    if (code >= 0 && code < 3) return 'fa-sun';
    if (code >= 3 && code < 50) return 'fa-cloud';
    if (code >= 50 && code < 70) return 'fa-cloud-rain';
    if (code >= 70 && code < 80) return 'fa-snowflake';
    if (code >= 80 && code < 90) return 'fa-cloud-showers-heavy';
    if (code >= 90 && code < 100) return 'fa-bolt';
    return 'fa-cloud';
}

// Get weather description based on weather condition code
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Czyste niebo',
        1: 'Głównie bezchmurnie',
        2: 'Częściowo zachmurzone',
        3: 'Zachmurzone',
        45: 'Mgliście',
        48: 'Mgliście z szronem',
        51: 'Lekka mżawka',
        53: 'Umiarkowana mżawka',
        55: 'Gęsta mżawka',
        61: 'Lekki deszcz',
        63: 'Umiarkowany deszcz',
        65: 'Silny deszcz',
        71: 'Lekki śnieg',
        73: 'Umiarkowany śnieg',
        75: 'Intensywny śnieg',
        77: 'Ziarna śniegu',
        80: 'Lekkie opady deszczu',
        81: 'Umiarkowane opady deszczu',
        82: 'Silne opady deszczu',
        85: 'Lekkie opady śniegu',
        86: 'Silne opady śniegu',
        95: 'Burza',
        96: 'Burza z lekkim gradem',
        99: 'Burza z silnym gradem'
    };
    return descriptions[code] || 'Nieznana pogoda';
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `Błąd: ${message}`;
    document.querySelector('.weather-dashboard').insertBefore(errorDiv, document.querySelector('.weather-container'));
    setTimeout(() => errorDiv.remove(), 5000);
} 