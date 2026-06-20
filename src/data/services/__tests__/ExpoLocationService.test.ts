jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { Balanced: 2 }
}));

import { ExpoLocationService } from '../ExpoLocationService';

describe('ExpoLocationService Distance Calculations', () => {
  let locationService: ExpoLocationService;

  beforeEach(() => {
    locationService = new ExpoLocationService();
  });

  it('should calculate zero distance for identical coordinates', () => {
    const coords = { latitude: 15.68401, longitude: 78.174366 };
    const dist = locationService.calculateDistance(coords, coords);
    expect(dist).toBe(0);
  });

  it('should calculate accurate distance between two offset coordinates', () => {
    // Orvakal Center: 15.68401, 78.174366
    // Coordinates offset to the north-east
    const start = { latitude: 15.68401, longitude: 78.174366 };
    const end = { latitude: 15.69401, longitude: 78.184366 }; // Offset approx 1.5 km
    const dist = locationService.calculateDistance(start, end);

    expect(dist).toBeGreaterThan(1.0);
    expect(dist).toBeLessThan(2.0);
  });
});
