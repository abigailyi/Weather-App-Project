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
// Function to call weather data from API and update HTML elements
function displayForecastToday(response) {
  console.log(response.data);
  // Update city header with matching city name from API
  let cityDisplay = document.querySelector("#city");
  cityDisplay.innerHTML = response.data.name;
  // Calls general weather description from API
  let weatherMain = response.data.weather[0].main;
  let mainDescription = document.querySelector("#main-desc");
  mainDescription.innerHTML = response.data.weather[0].description;
  // Updates current temperature
  let mainTemp = Math.round(response.data.main.temp);
  let mainTempDisplay = document.querySelector("#main-temp");
  mainTempDisplay.innerHTML = mainTemp;
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
  let apiKey = OW_API_KEY;
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&units=imperial&appid=${apiKey}`;
  axios.get(weatherUrl).then(displayForecastToday);
  document.querySelector("#city-input").value = "";
}
// Function to use GPS location (coords) to call weather data
function retrievePosition(position) {
  console.log(position);
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let apiKey = OW_API_KEY;
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
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
