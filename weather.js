//import axios from "./node_modules/axios/index.js";

//https://api.open-meteo.com/v1/forecast?current=temperature_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min&wind_speed_unit=mph&precipitation_unit=inch&timeformat=unixtime&start_date=2024-03-14&end_date=2024-03-14

export function getWeather(lat, lon, timezone) {
  return axios
    .get(
      "https://api.open-meteo.com/v1/forecast?current=temperature_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min&wind_speed_unit=mph&precipitation_unit=inch",
      {
        params: {
          latitude: lat,
          longitude: lon,
          timezone,
          start_date: getCurrentDate().slice(0, 10),
          end_date: getEndDate(),
        },
      }
    )
    .then(({ data }) => {
      //return data;
      return {
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
        hourly: parseHourlyWeather(data),
      };
    });
}

function parseCurrentWeather({ current, daily }) {
  const {
    precipitation: precip,
    wind_speed_10m: windSpeed,
    weather_code: iconCode,
    temperature_2m: currentTemp,
  } = current;

  const {
    apparent_temperature_max: [feelsLikeHighTemp],
    apparent_temperature_min: [feelsLikeLowTemp],
    temperature_2m_max: [HighTemp],
    temperature_2m_min: [LowTemp],
  } = daily;

  return {
    iconCode,
    currentTemp: Math.round(currentTemp),
    HighTemp: Math.round(HighTemp),
    LowTemp: Math.round(LowTemp),
    feelsLikeHighTemp: Math.round(feelsLikeHighTemp),
    feelsLikeLowTemp: Math.round(feelsLikeLowTemp),
    windSpeed: Math.round(windSpeed),
    precip: Math.round(precip * 100) / 100,
  };
}

function parseDailyWeather({ daily }) {
  return daily.time.map((date, index) => {
    return {
      day: getDayString(date),
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      iconCode: daily.weather_code[index],
    };
  });
}

function parseHourlyWeather({ hourly }) {
  return hourly.time
    .map((dateTime, index) => {
      return {
        day: getDayString(dateTime),
        time: getTimeHour(dateTime),
        timeSinceEpoch: new Date(dateTime).getTime(), //time in ms since epoch
        iconCode: hourly.weather_code[index],
        currTemp: Math.round(hourly.temperature_2m[index]),
        feelsLikeTemp: hourly.apparent_temperature[index],
        windSpeed: Math.round(hourly.wind_speed_10m[index]),
        precipitation: Math.round(hourly.precipitation[index] * 100) / 100,
      };
    })
    .filter(({ timeSinceEpoch }) => {
      return timeSinceEpoch >= new Date().getTime();
    });
}

function getCurrentDate() {
  return new Date().toISOString();
}

function getEndDate() {
  const currentDate = new Date();
  const futureDate = new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000);
  return futureDate.toISOString().slice(0, 10);
}

function getDayString(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[new Date(date).getDay()];
}

function getTimeHour(dateTime) {
  return new Date(dateTime).toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
  });
}
