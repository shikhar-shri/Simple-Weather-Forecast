import { getWeather } from "./weather";

getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone)
  .then((resp) => {
    console.log(resp.data);
  })
  .catch((error) => {
    console.error("Error fetching data: ", error);
  });
