const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");
const locationButton = document.querySelector(".location-btn");
const historyList = document.querySelector(".history-list");

// API key for openweather api
const API_KEY = "baece06b5a7a0a3dd7f97cddef241ed0";

document.addEventListener("DOMContentLoaded", () => {
    updateHistoryList();
});

// Function to save city to search history
const saveToHistory = city => {
    let history = JSON.parse(localStorage.getItem("cityHistory")) || [];
    if (!history.includes(city)) {
        history.unshift(city);
        if (history.length > 5) {
            history.pop();
        }
        localStorage.setItem("cityHistory", JSON.stringify(history));
        updateHistoryList();
    }
};

// Function to update the history list displayed on the page
const updateHistoryList = () => {
    let history = JSON.parse(localStorage.getItem("cityHistory")) || [];
    history = history.slice(0, 8); // Limit the history to only show 8 results
    if (historyList) {
        historyList.innerHTML = "";
        history.forEach(city => {
            const item = document.createElement("li");
            item.textContent = city;
            item.classList.add("history-item");
            item.addEventListener("click", () => {
                cityInput.value = city;
                getCityCoordinates();
            });
            historyList.appendChild(item);
        });
    }
};
const createWeatherCard = (cityName, weatherItem, index) => {
    const kelvinToFahrenheit = kelvin => ((kelvin - 273.15) * 9/5 + 32).toFixed(2);

    const formatDate = date => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    if (index === 0) {
        return `<div class="details">
                     <h2>${cityName}</h2>
                     <header class="current-city-date"><h3>${formatDate(weatherItem.dt_txt)}</h3></header>
                     <h6>Temperature: ${kelvinToFahrenheit(weatherItem.main.temp)}°F</h6>
                     <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                     <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                      </div>
                     <div class="icon">
                      <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                         <h4>${weatherItem.weather[0].description}</h4>
                      </div>`;
    } else {
        return `<li class="card">
         <h3>${formatDate(weatherItem.dt_txt)}</h3>
         <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
         <h6>Temp: ${kelvinToFahrenheit(weatherItem.main.temp)}°F</h6>
         <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
         <h6>Humidity: ${weatherItem.main.humidity}%</h6>
</li>`;
    }
};



const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            // clears the previous weather data
            cityInput.value = "";
            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";

            // creates weather cards and adds them to the DOM
            fiveDaysForecast.forEach((weatherItem, index) => {
                const html = createWeatherCard(cityName, weatherItem, index);
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", html);
                } else {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", html);
                }
            });

        })
        .catch(() => {
            alert("An error occurred while fetching the weather forecast!");
        });
};

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    saveToHistory(cityName);

    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
};

document.addEventListener("DOMContentLoaded", () => {
    updateHistoryList();
    getCurrentLocationWeather();
});

const getCurrentLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;

            // gets the city name from coordinates using the reverse geocoding API
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${API_KEY}`;
            fetch(API_URL)
                .then(response => response.json())
                .then(data => {
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                })
                .catch(() => {
                    alert("An error occurred while fetching the city name!");
                });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        },
        { enableHighAccuracy: true } // Request high accuracy
    );
};


locationButton.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;

            // gets the city name from coordinates using the reverse geocoding API
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${API_KEY}`;
            fetch(API_URL)
                .then(response => response.json())
                .then(data => {
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                })
                .catch(() => {
                    alert("An error occurred while fetching the city name!");
                });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        },
        { enableHighAccuracy: true } // Request high accuracy
    );
});

searchButton.addEventListener("click", getCityCoordinates);
