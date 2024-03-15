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

// function to save city to search history
const saveToHistory = city => {
    
    // retrieves that search history from localStorage or initialize it as an empty array 
    let history = JSON.parse(localStorage.getItem("cityHistory")) || [];
    
    // checks if the city is not already in the history
    if (!history.includes(city)) {
      
        // add the city to only 8 entries
        history.unshift(city);
        if (history.length > 8) {
       
            // this removes the last entry
            history.pop();
        }
        // saves the updated history back to localStorage
        localStorage.setItem("cityHistory", JSON.stringify(history));

        // updates the displayed history list
        updateHistoryList();
    }
};

// function to update the history list displayed on the page
const updateHistoryList = () => {

    // retrieves the search history from localStorage or initialize it as an empty array
    let history = JSON.parse(localStorage.getItem("cityHistory")) || [];
    
    // limit the history to only show 8 results
    history = history.slice(0, 8);
    if (historyList) {
        
        // clears the existing content of the history list
        historyList.innerHTML = "";

        // iterates over each city in the history
        history.forEach(city => {

            // creates a new list form element
            const item = document.createElement("li");

            // sets the text content of the list item to the city name
            item.textContent = city;

            // adds a css class to the list item for styling
            item.classList.add("history-item");

            // adds a click event listener to the list item
            item.addEventListener("click", () => {

                // sets the city input value to the selected city
                cityInput.value = city;

                // triggers a search for the selected city
                getCityCoordinates();
            });

            // appends the list item to the history list
            historyList.appendChild(item);
        });
    }
};

// function to create HTML for a weather card
const createWeatherCard = (cityName, weatherItem, index) => {

    // function to convert temp from kelvin to fahrenheit
    const kelvinToFahrenheit = kelvin => ((kelvin - 273.15) * 9/5 + 32).toFixed(2);

    // function to format a date
    const formatDate = date => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    // checks if it is the first weather card (current weather)
    if (index === 0) {

        // returns HTML for current weather card
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

        // returns HTML for daily weather card
        return `<li class="card">
         <h3>${formatDate(weatherItem.dt_txt)}</h3>
         <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
         <h6>Temp: ${kelvinToFahrenheit(weatherItem.main.temp)}°F</h6>
         <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
         <h6>Humidity: ${weatherItem.main.humidity}%</h6>
</li>`;
    }
};

// function to fetch weather details from the API
const getWeatherDetails = (cityName, latitude, longitude) => {

    // construct the API URL using latitude and longitude
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    // fetch weather data from the API
    fetch(WEATHER_API_URL)

    // converts the response to JSON
        .then(response => response.json())
        .then(data => {

            // logs the received data to the console
            console.log(data);

            // array to store unique forecast days
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                
                // get the day of the forecast
                const forecastDate = new Date(forecast.dt_txt).getDate();

                // checks if the day is unique
                if (!uniqueForecastDays.includes(forecastDate)) {

                    // adds the day to the unique days array
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            // clears the previous weather data
            cityInput.value = "";
            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";

            // creates weather cards and adds them to the DOM
            // loops through the five days forecast data
            fiveDaysForecast.forEach((weatherItem, index) => {

                // creates HTML for the weather card using the creatWeatherCard function
                const html = createWeatherCard(cityName, weatherItem, index);
                if (index === 0) {

                    // inserts the HTML into the appropriate container based on the inex
                    currentWeatherDiv.insertAdjacentHTML("beforeend", html);
                } else {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", html);
                }
            });

        })

        // shows an alert if there's an error fetching the weather forecast
        .catch(() => {
            alert("An error occurred while fetching the weather forecast!");
        });
};

// city coordinates
const getCityCoordinates = () => {

    // gets the trimmed value from the city input field
    const input = cityInput.value.trim();

    let queryParam = "";
    if (!input) {

        // shows an alert if input is empty
        alert("Please enter a city name, zip code, or state name.");
        return;
    } else if (!isNaN(input)) {

        // if input is a number, treat it as a zip code
        queryParam = input;
    } else if (input.includes(",")) {

        // if input contains a comma, treat it as a city name and state code combination
        const parts = input.split(",");
        const city = parts[0].trim();
        let stateCode = parts[1].trim();
        
        // checks if the state code is an abbreviation, if so, convert it to full state name
        const stateAbbreviations = {
            AL: " Alabama ", 
            AK: " Alaska ",
            AZ: " Arizona",
            AR: " Arkansas",
            CA: " California",
            CO: " Colorado",
            CT: " Connecticut",
            DE: " Delaware",
            FL: " Florida",
            GA: " Georgia",
            HI: " Hawaii",
            ID: " Idaho",
            IL: " Illinois",
            IN: " Indiana",
            IA: " Iowa",
            KS: " Kansas",
            KY: " Kentucky",
            LA: " Louisiana",
            ME: " Maine",
            MD: " Maryland",
            MA: " Massachusetts",
            MI: " Michigan",
            MN: " Minnesota",
            MS: " Mississippi",
            MO: " Missouri",
            MT: " Montana",
            NE: " Nebraska",
            NV: " Nevada",
            NH: " New Hampshire",
            NJ: " New Jersey",
            NM: " New Mexico",
            NY: " New York",
            NC: " North Carolina",
            ND: " North Dakota",
            OH: " Ohio",
            OK: " Oklahoma",
            OR: " Oregon",
            PA: " Pennsylvania",
            RI: " Rhode Island",
            SC: " South Carolina",
            SD: " South Dakota",
            TN: " Tennessee",
            TX: " Texas",
            UT: " Utah",
            VT: " Vermont",
            VA: " Virginia",
            WA: " Washington",
            WV: " West Virginia",
            WI: " Wisconsin",
            WY: " Wyoming"
        };
        stateCode = stateAbbreviations[stateCode.toUpperCase()] || stateCode;
        queryParam = `${city},${stateCode}`;

    } else {
        // otherwise, treat it as a city name or state name
        queryParam = input;
    }

    // saves the input to search history
    saveToHistory(input);

    let API_URL = `https://api.zippopotam.us/us/${queryParam}`;
    let isZipCode = false;

    // checks if input is a zip code
    if (!isNaN(input) && input.length === 5) {
        isZipCode = true;
    }

    // if input is not a zip code, use the city name
    if (!isZipCode) {
        API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${queryParam}&limit=5&appid=${API_KEY}`;
    }

    // fetches the coordinates for the city/zip code
    fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        if (isZipCode) {
            // handles the zip code search
            const { latitude, longitude } = data.places[0];
            getWeatherDetails(queryParam, latitude, longitude);
        } else {
            // handles the city name or state name search
            const { lat, lon } = data[0];
            getWeatherDetails(queryParam, lat, lon);
        }
    })
    .catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });

};


// event listener to run when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {

    // updates the history list
    updateHistoryList();

    // gets the weather for the current location
    getCurrentLocationWeather();
});

// function to get the weather for the current location
const getCurrentLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(

        // success callback function
        position => {
            // gets the latitude and longitude
            const { latitude, longitude } = position.coords;

            // gets the weather details for the current location
            getWeatherDetails("Your Location", latitude, longitude);
        },

        // error callback function
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        },
        { enableHighAccuracy: true } // requests high accuracy for the location
    );
};

// event listener for the location button click
document.addEventListener("DOMContentLoaded", () => {
    updateHistoryList();
    getCurrentLocationWeather(); // automatically fetches current location weather
});

// event listener for the location button click
locationButton.addEventListener("click", getCurrentLocationWeather);

// event listener for the location button click with geolocation handling
locationButton.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(

        // success callback function
        position => {

            // gets the latitude and longitude
            const { latitude, longitude } = position.coords;

            // gets the weather details for the current location
            getWeatherDetails("Your Location", latitude, longitude);
        },

        // error callback function
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        },
        { enableHighAccuracy: true } // requests high accuracy for location
    );
});

// event listener to run when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    updateHistoryList();

    cityInput.addEventListener("keypress", event => {
        if (event.key === "Enter") {
            event.preventDefault(); // prevents the default form submission behavior
            searchButton.click(); // simulates a click on the search button
        }
    });
    
// event listener for the search button click
    searchButton.addEventListener("click", getCityCoordinates);

    // automatically fetches current location weather
    getCurrentLocationWeather(); 
});
