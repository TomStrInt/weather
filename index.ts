import { fetchWeatherApi } from 'openmeteo';
	
const params = {
	"latitude": 52.4069,
	"longitude": 16.9299,
	"current": ["temperature_2m", "rain", "wind_speed_10m"],
	"daily": ["temperature_2m_max", "temperature_2m_min", "rain_sum"],
	"timezone": "Europe/Berlin",
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
const daily = response.daily()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
	current: {
		time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
		temperature2m: current.variables(0)!.value(),
		rain: current.variables(1)!.value(),
		windSpeed10m: current.variables(2)!.value(),
	},
	daily: {
		time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
			(t) => new Date((t + utcOffsetSeconds) * 1000)
		),
		temperature2mMax: daily.variables(0)!.valuesArray()!,
		temperature2mMin: daily.variables(1)!.valuesArray()!,
		rainSum: daily.variables(2)!.valuesArray()!,
	},

};


console.log("Pogoda dla Poznania:  ");
console.log(`
		Czas:  ${weatherData.current.time.toISOString()}
		Temperatura: ${weatherData.current.temperature2m} C \n
        Opady: ${weatherData.current.rain},
        Predkosc wiatru: ${weatherData.current.windSpeed10m} km/h \n`
	);

if(weatherData.current.temperature2m<15){
	console.log("Zimno");
} else if (weatherData.current.temperature2m<25) {console.log("Przyjemnie")}
else {console.log("Upał")}

let opady: string;
if ((current.variables(1)!.value())==0) {opady = "Brak opadów"} else {opady = "pada"};
console.log(opady);

console.log("Pogoda jutro:  ");
for (let i = 0; i < weatherData.daily.time.length; i++) {
	console.log(`
		Temp. maksymalna:  ${weatherData.daily.temperature2mMax[i]},
		Temp. minimalna:   ${weatherData.daily.temperature2mMin[i]},
		Suma opadów:       ${weatherData.daily.rainSum[i]}`
	);
}
if(weatherData.daily.rainSum>0){
	console.log("Weź parasol")
} else {console.log("Idź na spacer!")}