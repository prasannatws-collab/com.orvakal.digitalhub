import { ExpoLocationService } from '../data/services/ExpoLocationService';
import { ExpoSpeechService } from '../data/services/ExpoSpeechService';
import { OpenMeteoWeatherService } from '../data/services/OpenMeteoWeatherService';
import type { ILocationService } from '../domain/services/ILocationService';
import type { ISpeechService } from '../domain/services/ISpeechService';
import type { IWeatherService } from '../domain/services/IWeatherService';

class DependencyContainer {
  private locationService: ILocationService;
  private speechService: ISpeechService;
  private weatherService: IWeatherService;

  constructor() {
    // Bind implementations. We can swap them out easily for testing.
    this.locationService = new ExpoLocationService();
    this.speechService = new ExpoSpeechService();
    this.weatherService = new OpenMeteoWeatherService();
  }

  getLocationService(): ILocationService {
    return this.locationService;
  }

  getSpeechService(): ISpeechService {
    return this.speechService;
  }

  getWeatherService(): IWeatherService {
    return this.weatherService;
  }
}

export const DI = new DependencyContainer();
