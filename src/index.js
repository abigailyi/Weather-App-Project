// theme button

const setMode = (mode) => (document.documentElement.className = mode);

//  get date
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

// click on search

function replaceLocation(event) {
  event.preventDefault();
  let searchedLocation = document.querySelector(".search-box");
  let key = "1e900e7a532291ddab0851fd797f7887";
  let unit = "imperial";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchedLocation.value}&units=${unit}&appid=${key}`;
  axios.get(weatherUrl).then(replaceTemp);
  clickTempC.classList.remove("active");
  clickTempF.classList.add("active");
}

let clickSearch = document.querySelector("#search-button");
clickSearch.addEventListener("click", replaceLocation);

//replace current information

function replaceTemp(response) {
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
    dailyForecastAPIMetric(response.data.coord);
  } else {
    dailyForecastAPIImperial(response.data.coord);
  }
}
// click on F or C to change Temp

function converttoImperial(event) {
  event.preventDefault();
  let cityDisplayed = document.querySelector(".city-location");
  let city = cityDisplayed.innerHTML;
  let key = "1e900e7a532291ddab0851fd797f7887";
  let unit = "imperial";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${key}`;
  axios.get(weatherUrl).then(replaceTemp);

  let displayWindUnit = document.querySelector(".wind-unit");
  displayWindUnit.innerHTML = `mi/h`;

  clickTempC.classList.remove("active");
  clickTempF.classList.add("active");
}

function converttoMetric(event) {
  event.preventDefault();
  let cityDisplayed = document.querySelector(".city-location");
  let city = cityDisplayed.innerHTML;
  let key = "1e900e7a532291ddab0851fd797f7887";
  let unit = "metric";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${key}`;
  axios.get(weatherUrl).then(replaceTemp);

  let displayWindUnit = document.querySelector(".wind-unit");
  displayWindUnit.innerHTML = `m/s`;
  clickTempC.classList.add("active");
  clickTempF.classList.remove("active");
}

let clickTempF = document.querySelector("#fahrenheit");
clickTempF.addEventListener("click", converttoImperial);

let clickTempC = document.querySelector("#celsius");
clickTempC.addEventListener("click", converttoMetric);

// click on current to fetch current locations

function displayCurrentLocation(position) {
  let key = "1e900e7a532291ddab0851fd797f7887";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${key}&units=imperial`;
  axios.get(weatherUrl).then(replaceTemp);
  clickTempC.classList.remove("active");
  clickTempF.classList.add("active");
}

function getLocation() {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(displayCurrentLocation);
}
let clickCurrent = document.querySelector("#search-button-location");
clickCurrent.addEventListener("click", getLocation);

// forecast the next few days highest + lowest weather in metric + pop + feel_like
function dailyForecastAPIMetric(response) {
  let key = "1e900e7a532291ddab0851fd797f7887";
  let dailyForcastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.lat}&lon=${response.lon}&exclude=minutely&appid=${key}&units=metric`;
  axios.get(dailyForcastUrl).then(displayForecast);

  feellikeunit = document.querySelector(".feel-unit");
  feellikeunit.innerHTML = `°C`;
}

function dailyForecastAPIImperial(response) {
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

function displayForecast(response) {
  let popElement = document.querySelector(".current-precipitation");
  let popPercentElement = response.data.daily[0].pop * 100;
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
      <span class= "dailyUnit"> ${metricOrNot()} </span>
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

function metricOrNot() {
  let element = document.querySelector("#celsius");
  let result;
  if (element.classList.contains("active")) {
    result = `°C`;
  } else {
    result = `°F`;
  }
  return result;
}

//default: setting default city to Taipei

function defaultCity(city) {
  let key = "1e900e7a532291ddab0851fd797f7887";
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=imperial`;
  axios.get(weatherUrl).then(replaceTemp);
}

defaultCity("Los Angeles");
