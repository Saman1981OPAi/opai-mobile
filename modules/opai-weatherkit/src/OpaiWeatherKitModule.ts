import { NativeModule, requireOptionalNativeModule } from "expo";
import type {
  CurrentWeatherRequest,
  CurrentWeatherResult,
  WeatherAttributionResult
} from "./OpaiWeatherKit.types";

declare class OpaiWeatherKitNativeModule extends NativeModule {
  getAttribution(): Promise<WeatherAttributionResult>;
  getCurrentWeather(request: CurrentWeatherRequest): Promise<CurrentWeatherResult>;
}

const nativeModule = requireOptionalNativeModule<OpaiWeatherKitNativeModule>("OpaiWeatherKit");

export function isNativeWeatherKitAvailable() {
  return nativeModule !== null;
}

export async function getCurrentWeather(request: CurrentWeatherRequest) {
  if (!nativeModule) {
    throw new Error("Apple WeatherKit is available only in the native iOS build.");
  }
  return nativeModule.getCurrentWeather(request);
}

export async function getWeatherAttribution() {
  if (!nativeModule) {
    throw new Error("Apple WeatherKit attribution is available only in the native iOS build.");
  }
  return nativeModule.getAttribution();
}
