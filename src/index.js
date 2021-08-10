//Updates date and time to current
function displayLocalTime() {
  let today = new Date();
  console.log(today);

  let date = today.getDate();
  let year = today.getFullYear();
  let hour = today.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let mins = today.getMinutes();
  if (mins < 10) {
    mins = `0${mins}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = days[today.getDay()];
  let month = months[today.getMonth()];
  let currentTime = document.querySelector("#currentTime");

  currentTime.innerHTML = `${day}, ${month} ${date}, ${year} | ${hour}:${mins}`;
}
displayLocalTime();

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

// Repeating individual forecast days of the week
function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img class="weather-icons" id="main-icon" src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" alt="" width="40" />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = `1e900e7a532291ddab0851fd797f7887`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

// Function to call weather data from API and update HTML elements
function displayForecastToday(response) {
  // Update city header with matching city name from API
  let cityDisplay = document.querySelector("#city");
  cityDisplay.innerHTML = response.data.name;

  // Calls general weather description from API
  let weatherMain = response.data.weather[0].main;
  let mainDescription = document.querySelector("#main-desc");
  mainDescription.innerHTML = response.data.weather[0].description;

  celsiusTemperature = response.data.main.temp;

  // Updates current temperature
  let mainTemp = Math.round(response.data.main.temp);
  let mainTempDisplay = document.querySelector("#main-temp");
  mainTempDisplay.innerHTML = Math.round(response.data.main.temp);

  // Displays high and low temperature forecasts
  let mainHigh = Math.round(response.data.main.temp_max);
  let mainLow = Math.round(response.data.main.temp_min);
  let highLow = document.querySelector("#high-low");
  highLow.innerHTML = `H <strong>${mainHigh}</strong>° | L <strong>${mainLow}</strong>°`;
  let feelsTemp = Math.round(response.data.main.feels_like);
  let feelsLike = document.querySelector("#feels-temp");
  feelsLike.innerHTML = `${feelsTemp}`;

  // Displays additional weather information
  let humidity = Math.round(response.data.main.humidity);
  let wind = Math.round(response.data.wind.speed);
  let details = document.querySelector("#details");
  details.innerHTML = `Humidity: ${humidity}% <br> Wind: ${wind} mph`;

  getForecast(response.data.coord);

  // Changes the weather icon according to general weather category
  let mainIcon = document.querySelector("#todayIcon");
  if (weatherMain === `Clear`) {
    mainIcon.innerHTML = `<img src="image/01-clear.png" class="todayIcon" />`;
  } else {
    if (weatherMain === `Clouds`) {
      mainIcon.innerHTML = `<img src="image/02-clouds.png" class="todayIcon" />`;
    } else {
      if (weatherMain === `Rain` || weatherMain === `Drizzle`) {
        mainIcon.innerHTML = `<img src="image/03-rain.png" class="todayIcon" />`;
      } else {
        if (weatherMain === `Thunderstorm`) {
          mainIcon.innerHTML = `<img src="image/04-thunderstorm.png" class="todayIcon" />`;
        } else {
          if (weatherMain === `Atmosphere`) {
            mainIcon.innerHTML = `<img src="image/05-atmosphere.png" class="todayIcon" />`;
          } else {
            if (weatherMain === `Snow`) {
              mainIcon.innerHTML = `<img src="image/06-snow.png" class="todayIcon" />`;
            }
          }
        }
      }
    }
  }
}
// Function to use search input (city) to call weather data
function citySearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let apiKey = "1e900e7a532291ddab0851fd797f7887";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&units=metric&appid=${apiKey}`;
  axios.get(weatherUrl).then(displayForecastToday);
  document.querySelector("#city-input").value = "";
}
// Function to use GPS location (coords) to call weather data
function retrievePosition(position) {
  console.log(position);
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let apiKey = "1e900e7a532291ddab0851fd797f7887";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(weatherUrl).then(displayForecastToday);
  document.querySelector("#city-input").value = "";
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(retrievePosition);
}
let localSearch = document.querySelector("#currentLocation");
localSearch.addEventListener("click", getCurrentPosition);

let cityForm = document.querySelector("#city-search");
cityForm.addEventListener("submit", citySearch);

// Convert from C to F
function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#main-temp");
  // Remove and add active class to C and F
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

// Convert from F to C
function displayCelsiusTemp(event) {
  event.preventDefault();
  // Remove and add active class to C and F
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#main-temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);

let apiKey = "1e900e7a532291ddab0851fd797f7887";
let city = "Los Angeles";
let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

axios.get(weatherUrl).then(displayForecastToday);
