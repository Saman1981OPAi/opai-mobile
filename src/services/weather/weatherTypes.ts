export type WeatherSnapshot = {
  city: string;
  condition: string;
  conditionCode: string;
  feelsLikeC: number;
  fetchedAt: string;
  highC: number;
  isApproximate: boolean;
  isStale: boolean;
  lowC: number;
  observedAt: string;
  source: "Apple Weather" | "Unavailable";
  symbolName: string;
  temperatureC: number;
};

export type WeatherCity = {
  city: string;
  latitude: number;
  longitude: number;
  province: string;
  timezone: string;
};

export type WeatherAttribution = {
  combinedMarkDarkURL: string;
  combinedMarkLightURL: string;
  legalPageURL: string;
  serviceName: string;
};
