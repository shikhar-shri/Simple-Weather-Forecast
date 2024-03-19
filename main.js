import { ICON_MAP } from "./iconMapping.js";
import { getWeather } from "./weather.js";

//getting the user's current location
navigator.geolocation.getCurrentPosition(positionSuccess, positionFailure);

function positionSuccess({ coords }) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    .then(renderWeather)
    .catch((error) => {
      console.error(error);
      alert("Error fetching weather");
    });
}

function positionFailure() {
  alert("There was an error fetching your location");
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
  document.body.classList.remove("blurred");
}

function getIconUrl(iconCode) {
  return `./icons/${ICON_MAP.get(iconCode)}.svg`;
}

function renderCurrentWeather(current) {
  document.querySelector("[data-current-icon]").src = getIconUrl(
    current.iconCode
  );

  // document.querySelector("[data-current-temp]").textContent =
  //   current.currentTemp;

  setValue("current-temp", current.currentTemp);

  // document.querySelector("[data-current-high]").textContent = current.HighTemp;

  setValue("current-high", current.HighTemp);

  document.querySelector("[data-current-low]").textContent = current.LowTemp;

  document.querySelector("[data-current-fl-low]").textContent =
    current.feelsLikeLowTemp;

  document.querySelector("[data-current-fl-high]").textContent =
    current.feelsLikeHighTemp;

  document.querySelector("[data-current-wind]").textContent = current.windSpeed;

  document.querySelector("[data-current-precip]").textContent = current.precip;
}

const dailySection = document.querySelector(".days-section");
const dayCardTemplate = document.getElementById("day-card-template");

function renderDailyWeather(daily) {
  dailySection.innerHTML = "";
  daily.forEach((day) => {
    const dayCard = dayCardTemplate.content.cloneNode(true);
    setValue("day", day.day, { parent: dayCard });
    setValue("temp", day.maxTemp, { parent: dayCard });
    dayCard.querySelector("[data-icon]").src = getIconUrl(day.iconCode);

    dailySection.append(dayCard);
  });
}

const hourSection = document.querySelector(".hour-section");
const hourRowTemplate = document.getElementById("hour-row-template");

function renderHourlyWeather(hourly) {
  hourSection.innerHTML = "";

  hourly.forEach((hour) => {
    //creating a cloned row for row template
    const hourRow = hourRowTemplate.content.cloneNode(true);
    hourRow.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
    setValue("day", hour.day, { parent: hourRow });
    setValue("time", hour.time, { parent: hourRow });

    setValue("temp", hour.currTemp, { parent: hourRow });
    setValue("fl-temp", hour.feelsLikeTemp, { parent: hourRow });
    setValue("wind", hour.windSpeed, { parent: hourRow });
    setValue("precip", hour.precipitation, { parent: hourRow });

    hourSection.appendChild(hourRow);
  });
}
