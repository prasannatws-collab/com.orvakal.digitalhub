import type { IWeatherService, WeatherData, ForecastDay } from '../../domain/services/IWeatherService';

export const defaultWeatherData: WeatherData = {
  temperature: 36,
  apparentTemperature: 39,
  conditionCode: 0,
  humidity: 48,
  windSpeed: 10,
  rainChance: 5,
  sunrise: "5:48 AM",
  sunset: "6:44 PM",
  aqi: 38,
  uvIndex: 2,
  forecast: [
    { date: 'Tomorrow', maxTemp: 37, minTemp: 28, conditionCode: 2, rainChance: 10, uvIndex: 7 },
    { date: 'Day 2',    maxTemp: 35, minTemp: 27, conditionCode: 61, rainChance: 40, uvIndex: 5 },
    { date: 'Day 3',    maxTemp: 33, minTemp: 26, conditionCode: 80, rainChance: 65, uvIndex: 4 },
  ],
};

export class OpenMeteoWeatherService implements IWeatherService {
  async fetchWeather(latitude = 15.68401, longitude = 78.174366): Promise<WeatherData> {
    try {
      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&hourly=precipitation_probability` +
        `&daily=sunrise,sunset,uv_index_max,temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max` +
        `&timezone=auto&forecast_days=4`;

      const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`;

      const [weatherRes, aqiRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(aqiUrl),
      ]);

      if (!weatherRes.ok || !aqiRes.ok) {
        throw new Error('API request failed');
      }

      const weatherJson = await weatherRes.json();
      const aqiData    = await aqiRes.json();

      const current = weatherJson.current;
      const daily   = weatherJson.daily;
      const hourly  = weatherJson.hourly;

      if (!current || !daily) {
        throw new Error('Invalid response format');
      }

      // Current rain chance
      let rainChance = 0;
      if (hourly?.time && hourly?.precipitation_probability) {
        const currentHourStr = current.time.slice(0, 13) + ':00';
        const index = hourly.time.indexOf(currentHourStr);
        rainChance =
          index !== -1
            ? hourly.precipitation_probability[index]
            : hourly.precipitation_probability[0] || 0;
      }

      const temperature         = Math.round(current.temperature_2m ?? 36);
      const apparentTemperature = Math.round(current.apparent_temperature ?? 39);
      const conditionCode       = current.weather_code ?? 0;
      const humidity            = Math.round(current.relative_humidity_2m ?? 48);
      const windSpeed           = Math.round(current.wind_speed_10m ?? 10);
      const aqi                 = Math.round(aqiData.current?.us_aqi ?? 38);
      const uvIndex             = Math.round(daily.uv_index_max?.[0] ?? 2);

      const formatTimeFromISO = (isoStr: string): string => {
        if (!isoStr) return '';
        const parts    = isoStr.split('T');
        const timePart = parts[1] || parts[0];
        const [hourStr, minStr] = timePart.substring(0, 5).split(':');
        const hour  = parseInt(hourStr, 10);
        const ampm  = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minStr} ${ampm}`;
      };

      const sunrise = formatTimeFromISO(daily.sunrise?.[0] ?? '2026-06-13T05:48');
      const sunset  = formatTimeFromISO(daily.sunset?.[0]  ?? '2026-06-13T18:44');

      // Build 3-day forecast (indices 1..3 — skip today at index 0)
      const forecast: ForecastDay[] = [];
      for (let i = 1; i <= 3; i++) {
        const rawDate: string = daily.time?.[i] ?? '';
        let dateLabel = `Day ${i}`;
        if (rawDate) {
          const d = new Date(rawDate + 'T00:00:00');
          dateLabel = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
        }
        forecast.push({
          date:        dateLabel,
          maxTemp:     Math.round(daily.temperature_2m_max?.[i] ?? 36),
          minTemp:     Math.round(daily.temperature_2m_min?.[i] ?? 26),
          conditionCode: daily.weather_code?.[i] ?? 0,
          rainChance:  Math.round(daily.precipitation_probability_max?.[i] ?? 0),
          uvIndex:     Math.round(daily.uv_index_max?.[i] ?? 2),
        });
      }

      return {
        temperature,
        apparentTemperature,
        conditionCode,
        humidity,
        windSpeed,
        rainChance,
        sunrise,
        sunset,
        aqi,
        uvIndex,
        forecast,
      };
    } catch (error) {
      console.warn('Weather API failed, using fallback static weather.', error);
      return { ...defaultWeatherData };
    }
  }
}

export function getConditionTranslations(code: number): { en: string; te: string; hi: string } {
  const translations: Record<number, { en: string; te: string; hi: string }> = {
    0:  { en: 'Clear sky',           te: 'నిర్మలమైన ఆకాశం',       hi: 'साफ़ आसमान'              },
    1:  { en: 'Mainly clear',        te: 'ఎక్కువగా నిర్మలంగా ఉంది', hi: 'मुख्यतः साफ़'           },
    2:  { en: 'Partly cloudy',       te: 'పాక్షికంగా మేఘావృతం',    hi: 'आंशिक रूप से बादल'     },
    3:  { en: 'Overcast',            te: 'పూర్తిగా మేఘావృతం',       hi: 'बादल छाए रहेंगे'       },
    45: { en: 'Foggy',               te: 'పొగమంచు',               hi: 'कोहरा'                  },
    48: { en: 'Depositing rime fog', te: 'పొగమంచు',               hi: 'कोहरा'                  },
    51: { en: 'Light drizzle',       te: 'చిరుజల్లులు',            hi: 'हल्की बूंदाबांदी'       },
    53: { en: 'Moderate drizzle',    te: 'చిరుజల్లులు',            hi: 'बूंदाबांदी'              },
    55: { en: 'Dense drizzle',       te: 'భారీ చిరుజల్లులు',       hi: 'घनी बूंदाबांदी'         },
    61: { en: 'Slight rain',         te: 'తేలికపాటి వర్షం',        hi: 'हल्की बारिश'            },
    63: { en: 'Moderate rain',       te: 'మధ్యస్థ వర్షం',          hi: 'मध्यम बारिश'            },
    65: { en: 'Heavy rain',          te: 'భారీ వర్షం',             hi: 'भारी बारिश'             },
    71: { en: 'Slight snow',         te: 'తేలికపాటి మంచు',         hi: 'हल्की बर्फबारी'         },
    73: { en: 'Moderate snow',       te: 'మంచు కురిసే అవకాశం',    hi: 'मध्यम बर्फबारी'         },
    75: { en: 'Heavy snow',          te: 'భారీ మంచు',              hi: 'भारी बर्फबारी'          },
    80: { en: 'Slight rain showers', te: 'తేలికపాటి జల్లులు',      hi: 'हल्की बौछारें'          },
    81: { en: 'Moderate rain showers',te:'మధ్యస్థ జల్లులు',        hi: 'मध्यम बौछारें'          },
    82: { en: 'Violent rain showers',te: 'భారీ వర్షపు జల్లులు',    hi: 'भारी बौछारें'           },
    95: { en: 'Thunderstorm',        te: 'ఉరుములతో కూడిన వర్షం',   hi: 'गरज के साथ बौछारें'    },
  };
  return translations[code] || { en: 'Clear', te: 'నిర్మలంగా ఉంది', hi: 'साफ़' };
}

export function getConditionEmoji(code: number): string {
  if (code === 0)                      return '☀️';
  if (code <= 2)                       return '🌤️';
  if (code === 3)                      return '☁️';
  if (code <= 48)                      return '🌫️';
  if (code <= 55)                      return '🌦️';
  if (code <= 65)                      return '🌧️';
  if (code <= 75)                      return '❄️';
  if (code <= 82)                      return '🌦️';
  return '⛈️';
}

export function getAQIStatus(aqi: number): { en: string; te: string; hi: string } {
  if (aqi <= 50)  return { en: 'Good',            te: 'మంచిది',              hi: 'अच्छा'       };
  if (aqi <= 100) return { en: 'Moderate',        te: 'మధ్యస్థం',            hi: 'सामान्य'     };
  if (aqi <= 150) return { en: 'Sensitive Groups', te: 'సున్నితమైన ఆరోగ్యం', hi: 'संवेदनशील'  };
  return           { en: 'Poor',             te: 'ప్రమాదకరం',           hi: 'खराब'        };
}

export function getUVStatus(uv: number): { en: string; te: string; hi: string } {
  if (uv <= 2) return { en: 'Low',      te: 'తక్కువ',    hi: 'निम्न'      };
  if (uv <= 5) return { en: 'Moderate', te: 'మధ్యస్థం',  hi: 'सामान्य'   };
  if (uv <= 7) return { en: 'High',     te: 'ఎక్కువ',    hi: 'उच्च'       };
  return        { en: 'Very High', te: 'అత్యధికం',  hi: 'बहुत उच्च' };
}
