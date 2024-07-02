"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const openmeteo_1 = require("openmeteo");
const params = {
    "latitude": 52.4069,
    "longitude": 16.9299,
    "hourly": ["temperature_2m", "wind_speed_10m"],
    "timezone": "Europe/Berlin"
};
const url = "https://api.open-meteo.com/v1/forecast";
const responses = (strin, num) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, openmeteo_1.fetchWeatherApi)(url, params);
});
// Helper function to form time ranges
const range = (start, stop, step) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[1];
// Attributes for timezone and location
const utcOffsetSeconds = response.utcOffsetSeconds();
const timezone = response.timezone();
const timezoneAbbreviation = response.timezoneAbbreviation();
const latitude = response.latitude();
const longitude = response.longitude();
const hourly = response.hourly();
// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
    hourly: {
        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: hourly.variables(0).valuesArray(),
        windSpeed10m: hourly.variables(1).valuesArray(),
    },
};
// `weatherData` now contains a simple structure with arrays for datetime and weather data
for (let i = 0; i < weatherData.hourly.time.length; i++) {
    console.log(weatherData.hourly.time[i].toISOString(), weatherData.hourly.temperature2m[i], weatherData.hourly.windSpeed10m[i]);
}
//# sourceMappingURL=index.js.map