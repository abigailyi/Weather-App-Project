// Light/Dark Mode
const setMode = (mode) => (document.documentElement.className = mode);

//  Display current date and time
let now = new Date();

function displayCurrentTime() {
  let day = now.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  let dates = now.getDate();
  let month = now.getMonth();
  let months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let minute = now.getMinutes();
  let hour = now.getHours();
  let pmtime = hour - 12;

  if (minute < 10) {
    minute = `0${minute}`;
  }

  let currentTimePM = `${months[month]} ${dates} ${days[day]}, 0${pmtime}:${minute} PM`;
  let currentTimeAM = `${months[month]} ${dates} ${days[day]}, 0${hour}:${minute} AM`;
  let current = document.querySelector(".date-time");

  if (hour >= 13) {
    current.innerHTML = `${currentTimePM}`;
  } else {
    current.innerHTML = `${currentTimeAM}`;
  }
  console.log(hour);
}
displayCurrentTime(now);

// Display temperature triggered by search event
function replaceLocation(event) {
  event.preventDefault();
  let searchInput = document.querySelector(".search-box");
  let key = "1e900e7a532291ddab0851fd797f7887";
  let unit = "imperial";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&units=${unit}&appid=${key}`;
  axios.get(weatherUrl).then(displayTemp);

  document.getElementById("searchForm").value = ``;

  clickCelsius.classList.remove("active");
  clickFahrenheit.classList.add("active");
}

let clickSearch = document.querySelector("#search-button");
clickSearch.addEventListener("click", replaceLocation);

// Fetch GPS position for current location temperatures
function displayCurrentLocation(position) {
  console.log(position);
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let key = "1e900e7a532291ddab0851fd797f7887";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`;
  axios.get(weatherUrl).then(displayTemp);
  clickCelsius.classList.remove("active");
  clickFahrenheit.classList.add("active");
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(displayCurrentLocation);
}
let clickLocation = document.querySelector("#search-button-location");
clickLocation.addEventListener("click", getLocation);

// Display current temperature and weather stats
function displayTemp(response) {
  console.log(response.data);
  let temp = Math.round(response.data.main.temp);
  let temperatureDisplay = document.querySelector(".current-temp");

  temperatureDisplay.innerHTML = `${temp}`;

  let weather = response.data.weather[0].description;

  let weatherDisplay = document.querySelector(".current-weather-looks");
  weatherDisplay.innerHTML = `${weather}`;

  let currentLocation = document.querySelector(".city-location");
  let name = response.data.name;

  currentLocation.innerHTML = `${name}`;

  let currentHumidity = document.querySelector(".current-humidity");
  let humidity = response.data.main.humidity;
  currentHumidity.innerHTML = `${humidity} %`;

  let currentWindSpeed = document.querySelector(".wind-speed");
  let windSpeed = Math.round(response.data.wind.speed);
  currentWindSpeed.innerHTML = `${windSpeed}`;

  let currentWeatherIcon = document.querySelector("#weather-icon");
  currentWeatherIcon.setAttribute(
    "src",
    `image/${response.data.weather[0].icon}.png`
  );

  currentWeatherIcon.setAttribute("alt", response.data.weather[0].description);

  let element = document.querySelector("#celsius");
  if (element.classList.contains("active")) {
    dailyForecastMetric(response.data.coord);
  } else {
    dailyForecastImperial(response.data.coord);
  }
}

// Conversion from C to F
function converttoImperial(event) {
  event.preventDefault();
  let cityDisplayed = document.querySelector(".city-location");
  let city = cityDisplayed.innerHTML;
  let key = "1e900e7a532291ddab0851fd797f7887";
  let unit = "imperial";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${key}`;
  axios.get(weatherUrl).then(displayTemp);

  let displayWindUnit = document.querySelector(".wind-unit");
  displayWindUnit.innerHTML = `mi/h`;

  clickCelsius.classList.remove("active");
  clickFahrenheit.classList.add("active");
}

// Conversion from F to C
function converttoMetric(event) {
  event.preventDefault();
  let cityDisplayed = document.querySelector(".city-location");
  let city = cityDisplayed.innerHTML;
  let key = "1e900e7a532291ddab0851fd797f7887";
  let unit = "metric";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${key}`;
  axios.get(weatherUrl).then(displayTemp);

  let displayWindUnit = document.querySelector(".wind-unit");
  displayWindUnit.innerHTML = `m/s`;
  clickCelsius.classList.add("active");
  clickFahrenheit.classList.remove("active");
}

let clickFahrenheit = document.querySelector("#fahrenheit");
clickFahrenheit.addEventListener("click", converttoImperial);

let clickCelsius = document.querySelector("#celsius");
clickCelsius.addEventListener("click", converttoMetric);

// Displays weekly forecast in C
function dailyForecastMetric(response) {
  let key = "1e900e7a532291ddab0851fd797f7887";
  let dailyForcastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.lat}&lon=${response.lon}&exclude=minutely&appid=${key}&units=metric`;
  axios.get(dailyForcastUrl).then(displayForecast);

  feellikeunit = document.querySelector(".feel-unit");
  feellikeunit.innerHTML = `°C`;
}

// Displays weekly forecast in F
function dailyForecastImperial(response) {
  let key = "1e900e7a532291ddab0851fd797f7887";
  let dailyForcastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.lat}&lon=${response.lon}&exclude=minutely&appid=${key}&units=imperial`;
  axios.get(dailyForcastUrl).then(displayForecast);
  feellikeunit = document.querySelector(".feel-unit");
  feellikeunit.innerHTML = `°F`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let dates = date.getDate();
  let month = date.getMonth();
  let months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${months[month]}  ${dates} <br/><strong> ${days[day]}</strong>`;
}

// Displays a week forecast
function displayForecast(response) {
  console.log(response.data.daily[0]);
  let popElement = document.querySelector(".current-precipitation");
  let popPercentElement = Math.round(response.data.daily[0].pop * 100);
  popElement.innerHTML = `${popPercentElement}`;
  let forecastElement = document.querySelector(".week-forecast-row");
  forecastRow = `<div class="row">`;
  let daily = response.data.daily;
  daily.forEach(function (forecastDays, index) {
    if (index < 6) {
      forecastRow =
        forecastRow +
        `
      <div class="col-2 row-width week-forecast">
      <div class="tmr">
      ${formatDay(forecastDays.dt)}
      </div>
      <img 
      src="image/${forecastDays.weather[0].icon}.png"
      alt = "" class="forecast-weather-icon" width="80px"/>
      <div class="forecast-temperatures" id="weekly-temperatures">
      <span class="tempHigh">${Math.round(forecastDays.temp.max)}</span>
      |
      <span class="tempLow">${Math.round(forecastDays.temp.min)}</span>
      <span class= "dailyUnit"> ${unitChecker()} </span>
      </div>
      </div>
      `;
    }
  });

  forecastRow = forecastRow + `</div>`;
  forecastElement.innerHTML = forecastRow;

  let feelingtemp = document.querySelector(".feel-degree");
  let feelTempRound = Math.round(response.data.current.feels_like);
  feelingtemp.innerHTML = `${feelTempRound}`;
}

// Checks which unit of temperature measurement is active to populate a field
function unitChecker() {
  let element = document.querySelector("#celsius");
  let result;
  if (element.classList.contains("active")) {
    result = `°C`;
  } else {
    result = `°F`;
  }
  return result;
}

// Defaults weather app with weather from Los Angeles
let key = "1e900e7a532291ddab0851fd797f7887";
let city = "Los Angeles";
let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=imperial`;

axios.get(weatherUrl).then(displayTemp);

replaceLocation("Los Angeles");
