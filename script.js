let searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', () => {
  let cityInput = document.querySelector('.search-input');
  let city = cityInput.value;
  getWeather(city);
});

async function getWeather(city) {
  const apiKey = secrets.API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    let weatherResponse = await axios.get(apiUrl);
    let data = weatherResponse.data;

    notErrorVisibility();

    let cityElement = document.querySelector('.city');
    cityElement.innerHTML = data.name;

    let dateElement = document.querySelector('.date');
    dateElement.innerHTML = formatDate(new Date());

    let mainTypeWeather = document.querySelector('.type-weather-header');
    mainTypeWeather.innerHTML = formatString(data.weather[0].description);

    let mainIcon = document.querySelector('.type-weather-img');
    mainIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    let mainTemperature = document.querySelector('.temperature-main');
    mainTemperature.innerHTML = kelvinToCelsius(data.main.temp) + '°C';

    let minTemperature = document.querySelector('.min-temperature');
    minTemperature.innerHTML = kelvinToCelsius(data.main.temp_min) + '°C';

    let maxTemperature = document.querySelector('.max-temperature');
    maxTemperature.innerHTML = kelvinToCelsius(data.main.temp_max) + '°C';

    let windSpeedMain = document.querySelector('.wind-speed-main');
    windSpeedMain.innerHTML = data.wind.speed.toFixed(1);

    // запит прогнозу
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    let forecastResponse = await axios.get(forecastUrl);
    let forecastData = forecastResponse.data;

    let dayOfWeek = document.querySelector('.day');
    dayOfWeek.innerHTML = getDayOfWeek();

    let options = {
      hour: 'numeric',
      minute: 'numeric',
    };

    let hourlyWeatherSection = document.querySelector('.flex-container');

    let elements = document.querySelectorAll('.hourly-data-block');
    elements.forEach((element) => {
      element.remove();
    });

    for (let i = 0; i < 7; i++) {
      let forecast = forecastData.list[i];

      let hourlyBlock = document.createElement('div');
      hourlyBlock.classList.add('hourly-data-block');
      hourlyBlock.innerHTML =
        '<p class="time bold">' +
        new Date(forecast.dt * 1000).toLocaleTimeString(undefined, options) +
        '</p>' +
        '<img src="http://openweathermap.org/img/wn/' +
        forecast.weather[0].icon +
        '.png" alt="Weather Icon" class="small-img">' +
        '<p class="type-weather">' +
        formatString(forecast.weather[0].description) +
        '</p>' +
        '<p class="temperature">' +
        kelvinToCelsius(forecast.main.temp) +
        '°С</p>' +
        '<p class="wind-speed">' +
        forecast.wind.speed.toFixed(1) +
        '</p>';
      hourlyWeatherSection.appendChild(hourlyBlock);
    }
  } catch (error) {
    errorVisibility();
  }
}


function formatDate(date) {
    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
  
    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
  
    let yyyy = date.getFullYear();

    return dd + '.' + mm + '.' + yyyy;
}

function formatString(string) {
    let words = string.split(" ");

    let changedFirstLetter = words.map((word) => {
        return word[0].toUpperCase() + word.slice(1);
    });
    
    return changedFirstLetter.join(" ");
}

function kelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

function errorVisibility() {
    let weatherMain = document.querySelector(".weather-main");
    weatherMain.classList.add('invisible');
    let hourlyWeather = document.querySelector(".hourly-weather");
    hourlyWeather.classList.add('invisible');
    let errorBlock = document.querySelector(".errorBlock");
    errorBlock.classList.remove('invisible');
}

function notErrorVisibility() {
    let weatherMain = document.querySelector(".weather-main");
    weatherMain.classList.remove('invisible');
    let hourlyWeather = document.querySelector(".hourly-weather");
    hourlyWeather.classList.remove('invisible');
    let errorBlock = document.querySelector(".errorBlock");
    errorBlock.classList.add('invisible');
}

function getDayOfWeek() {
    let date = new Date();
    let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
}
