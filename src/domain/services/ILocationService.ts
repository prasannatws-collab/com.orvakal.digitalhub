export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ILocationService {
  getCurrentLocation(): Promise<Coordinates | null>;
  calculateDistance(from: Coordinates, to: Coordinates): number; // distance in km
}
