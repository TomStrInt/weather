import { fetchWeatherApi } from 'openmeteo';
	
const params = {
	"latitude": 52.4069,
	"longitude": 16.9299,
	"current": ["temperature_2m", "rain", "wind_speed_10m"],
	"forecast_days": 1
};
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
const utcOffsetSeconds = response.utcOffsetSeconds();
const timezone = response.timezone();
const timezoneAbbreviation = response.timezoneAbbreviation();
const latitude = response.latitude();
const longitude = response.longitude();

const current = response.current()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
	current: {
		time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
		temperature2m: current.variables(0)!.value(),
		rain: current.variables(1)!.value(),
		windSpeed10m: current.variables(2)!.value(),
	},

};


console.log("Pogoda dla Poznania:  ")
	console.log(`
		Czas  ${weatherData.current.time.toISOString()},
		Temperatura ${weatherData.current.temperature2m} \n
        Opady ${weatherData.current.rain},
        Predkosc wiatru ${weatherData.current.windSpeed10m} \n`
	);

if(weatherData.current.temperature2m<15){
	console.log("Zimno");
} else if (weatherData.current.temperature2m<25) {console.log("Przyjemnie")}
else {console.log("Upał")}

let opady: string;
if ((current.variables(1)!.value())==0) {opady = "Brak"} else {opady = "pada"};
console.log(`Opady:   ${opady}`);