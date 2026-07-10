export type WeatherSnapshot = {
  city: string;
  condition: string;
  feelsLikeC: number;
  fetchedAt: string;
  highC: number;
  isApproximate: boolean;
  lowC: number;
  source: "Open-Meteo" | "Unavailable";
  temperatureC: number;
};

export type WeatherCity = {
  latitude: number;
  longitude: number;
  name: string;
  province?: string;
};
