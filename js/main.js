import LocationAndUnits from './LocationAndUnits.js'
import {
  getDayName
} from "./dataFunctions.js"
const currentLoc = new LocationAndUnits();

let apiKey = 'c2e097d87337bcc7410f885309c63a6e';
let apiKey2 = 'c1c92c1ac752490d9464dbb3bffcad7a';
let locationFlag = 1;

const startApp = () => {
  const locationBtn = document.querySelector('.buttons__location')
  locationBtn.addEventListener('click', geolocationWeather)
  const homeBtn = document.querySelector('.buttons__home')
  homeBtn.addEventListener('click', homeLocation)
  const saveBtn = document.querySelector('.buttons__save')
  saveBtn.addEventListener('click', saveLocation)
  const unitBtn = document.querySelector('.location__units')
  unitBtn.addEventListener('click', switchUnit)
  homeLocation()
  displayWeatherByCity()
}
document.addEventListener("DOMContentLoaded", startApp);
const currentTemp = document.querySelector('.degrees')
const cityInput = document.querySelector('.search-bar__input')
const currentHumidity = document.querySelector('.humidity-span')
const currentConditions = document.querySelector('.conditions')
const currentWind = document.querySelector('.wind-span')
const currentPressure = document.querySelector('.pressure-span')
const currentCity = document.querySelector('.location__city')
const weatherIcon = document.querySelector('.current-forecast__icon')
const futureWeather = document.querySelector('.future-forecast')

// ** FIND CITY COORDINATES **
const displayWeatherByCity = () => {
  locationFlag = 1
  const cityWeatherApiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${currentLoc.getCity()}&language=en&key=${apiKey2}`
  const getCityCoordinates = async () => {
    const response = await fetch(cityWeatherApiUrl)
    if (!response.ok) {
      const message = `Error status: ${response.status}`
      return currentCity.textContent = `Can't find the location`
      throw new Error(message)
    }
    const data = await response.json()
    return setCityCoordinates(data)
  }

  getCityCoordinates();

  const setCityCoordinates = data => {
    if (data.results[0].components.city || data.results[0].components.town || data.results[0].components.village) {
      currentLoc.setLat(data.results[0].geometry.lat)
      currentLoc.setLon(data.results[0].geometry.lng)
      displayCityName(data)
    } else {
      return currentCity.textContent = `Can't find the location`
    }
    getWeatherByCoords()
  }
}

// ** GET FORECAST BY COORDINATES **
const getWeatherByCoords = () => {
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentLoc.getLat()}&lon=${currentLoc.getLon()}&exclude=hourly&units=${currentLoc.getUnit()}&appid=${apiKey}`
  const fetchWeatherByCoords = async () => {
    const response = await fetch(weatherApiUrl)
    if (!response.ok) {
      const message = `Error status: ${response.status}`
      return currentCity.textContent = `Can't find the location`
      throw new Error(message)
    }
    const data = await response.json()
    return displayWeatherByCoords(data)
  }
  fetchWeatherByCoords();
  getCityNameByCoordinates()

  const displayWeatherByCoords = data => {
    const {
      temp,
      humidity,
      wind_speed: windSpeed,
      pressure
    } = data.current
    const [{
      main,
      icon
    }] = data.current.weather
    currentTemp.textContent = `${Math.round(temp)} ${currentLoc.getTempUnit()}`;
    currentHumidity.textContent = `${humidity}%`;
    currentConditions.textContent = main;
    currentPressure.textContent = `${pressure} hPa`;
    currentWind.textContent = `${windSpeed.toFixed(1)} ${currentLoc.getWindUnit()}`;
    weatherIcon.src = `icons/${icon}.png`
    displayFutureWeather(data)
  }
}

// ** GET FORECAST BY CITY INPUT **
document.addEventListener('submit', (e) => {
  e.preventDefault()
  const city = cityInput.value
  const capitalCity = city.replace(/\b\w/g, function (c) {
    return c.toUpperCase();
  });
  currentLoc.setCity(capitalCity)
  cityInput.value = ''
  displayWeatherByCity()
})

// ** DISPLAY CITY NAME **
const displayCityName = data => {
  const {
    city,
    country,
    town,
    village
  } = data.results[0].components

  if (village) {
    currentLoc.setCity(village)
  } else if (town) {
    currentLoc.setCity(town)
  } else if (city) {
    currentLoc.setCity(city)
  } else {
    return currentCity.textContent = `Can't find the location`
  }
  currentCity.textContent = `${currentLoc.getCity()}, ${country}`
}

// ** GET CITY NAME BY COORDINATES **
const getCityNameByCoordinates = () => {
  const cityApiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey2}&language=en&q=${currentLoc.getLat()}%2C${currentLoc.getLon()}&pretty=1`
  const getCityByCoords = async () => {
    const response = await fetch(cityApiUrl)
    if (!response.ok) {
      const message = `Error status: ${response.status}`
      return currentCity.textContent = `Can't find the location`
      throw new Error(message)
    }
    const data = await response.json()
    return displayCityName(data)
  }

  getCityByCoords();
}

// ** FIND CURRENT GEOLOCATION **
const geolocationWeather = () => {
  const geoSuccess = pos => {
    locationFlag = 0
    currentLoc.setLat(pos.coords.latitude)
    currentLoc.setLon(pos.coords.longitude)
    getWeatherByCoords()
  }
  const geoError = () => {
    return currentCity.textContent = `Can't find the location`
  }
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError)
}

// ** DISPLAY FUTURE 4 DAY FORECAST **
const displayFutureWeather = data => {
  futureWeather.innerHTML = ''
  for (let i = 0; i < 4; i++) {
    let {
      max,
      min
    } = data.daily[i].temp
    let [{
      icon
    }] = data.daily[i].weather
    max = Math.round(max)
    min = Math.round(min)
    futureWeather.innerHTML += `
  <div class="future-forecast__day">
    <div class="day">${getDayName(i)}</div>
    <img class="icon" src="icons/${icon}.png" alt="">
    <div class="temperatures">
      <div class="highest">${max}</div>
      <div class="lowest">${min}</div>
    </div>
  </div>`
  }
}

// ** SAVE LOCATION AS HOME LOCATION IN LOCALSTORAGE **
const saveLocation = () => {
  if (locationFlag == 1) {
    const locationObj = {
      city: currentLoc.getCity()
    }
    localStorage.setItem("locationStorage", JSON.stringify(locationObj))
  } else if (locationFlag == 0) {
    const locationObj = {
      lat: currentLoc.getLat(),
      lon: currentLoc.getLon()
    }
    localStorage.setItem("locationStorage", JSON.stringify(locationObj))
  }
}

// ** SHOW HOME LOCATION FORECAST FROM LOCALSTORAGE **
const homeLocation = () => {
  const storage = JSON.parse(localStorage.getItem("locationStorage"))
  if (!storage) return
  if (storage.lat && storage.lon) {
    currentLoc.setLat(storage.lat)
    currentLoc.setLon(storage.lon)
    geolocationWeather()
  } else if (storage.city) {
    currentLoc.setCity(storage.city)
    displayWeatherByCity()
  }
}

// ** SWITCH UNITS METRIC/IMPERIAL **
const switchUnit = () => {
  currentLoc.toggleUnit('imperial')
  locationFlag == 1 ? displayWeatherByCity() : geolocationWeather();
}