export interface ForecastDay {
  date: string;         // e.g. "Mon, Jun 19"
  maxTemp: number;
  minTemp: number;
  conditionCode: number;
  rainChance: number;
  uvIndex: number;
}

export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  conditionCode: number;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  sunrise: string;
  sunset: string;
  aqi: number;
  uvIndex: number;
  forecast: ForecastDay[];
}

export interface IWeatherService {
  fetchWeather(latitude?: number, longitude?: number): Promise<WeatherData>;
}
