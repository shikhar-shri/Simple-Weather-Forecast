import axios from "axios";

//https://api.open-meteo.com/v1/forecast?current=temperature_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min&wind_speed_unit=mph&precipitation_unit=inch&timeformat=unixtime&start_date=2024-03-14&end_date=2024-03-14

export function getWeather(lat, lon, timezone) {
  return axios.get(
    "https://api.open-meteo.com/v1/forecast?current=temperature_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min&wind_speed_unit=mph&precipitation_unit=inch&timeformat=unixtime&start_date=2024-03-14&end_date=2024-03-14",
    {
      params: {
        latitude: lat,
        longitude: lon,
        timezone,
      },
    }
  );
}
