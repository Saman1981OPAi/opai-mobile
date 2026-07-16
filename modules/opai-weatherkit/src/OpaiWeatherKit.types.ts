export type CurrentWeatherRequest = {
  latitude: number;
  locale: string;
  longitude: number;
  temperatureUnit: "celsius";
};

export type CurrentWeatherResult = {
  attributionRequired: boolean;
  conditionCode: string;
  conditionLabel: string;
  feelsLikeC: number;
  highC: number;
  lowC: number;
  observedAt: string;
  symbolName: string;
  temperatureC: number;
};

export type WeatherAttributionResult = {
  combinedMarkDarkURL: string;
  combinedMarkLightURL: string;
  legalPageURL: string;
  serviceName: string;
};
