import CoreLocation
import ExpoModulesCore
import Foundation
import WeatherKit

struct WeatherRequestRecord: Record {
  @Field var latitude: Double = 0
  @Field var longitude: Double = 0
  @Field var locale: String = "en-CA"
  @Field var temperatureUnit: String = "celsius"
}

struct CurrentWeatherRecord: Record {
  @Field var temperatureC: Double = 0
  @Field var feelsLikeC: Double = 0
  @Field var conditionCode: String = "unknown"
  @Field var conditionLabel: String = "Weather"
  @Field var symbolName: String = "cloud"
  @Field var highC: Double = 0
  @Field var lowC: Double = 0
  @Field var observedAt: String = ""
  @Field var attributionRequired: Bool = true
}

struct WeatherAttributionRecord: Record {
  @Field var serviceName: String = "Apple Weather"
  @Field var combinedMarkLightURL: String = ""
  @Field var combinedMarkDarkURL: String = ""
  @Field var legalPageURL: String = ""
}

public class OpaiWeatherKitModule: Module {
  public func definition() -> ModuleDefinition {
    Name("OpaiWeatherKit")

    AsyncFunction("getCurrentWeather") { (request: WeatherRequestRecord) async throws -> CurrentWeatherRecord in
      guard request.latitude >= -90, request.latitude <= 90,
            request.longitude >= -180, request.longitude <= 180 else {
        throw NSError(
          domain: "OpaiWeatherKit",
          code: 1,
          userInfo: [NSLocalizedDescriptionKey: "Weather coordinates are outside the supported range."]
        )
      }

      guard request.temperatureUnit.lowercased() == "celsius" else {
        throw NSError(
          domain: "OpaiWeatherKit",
          code: 2,
          userInfo: [NSLocalizedDescriptionKey: "OPAi WeatherKit currently returns Celsius values only."]
        )
      }

      let location = CLLocation(latitude: request.latitude, longitude: request.longitude)
      let weather = try await WeatherService.shared.weather(for: location)
      let current = weather.currentWeather
      let today = weather.dailyForecast.first
      let conditionCode = String(describing: current.condition)
      var result = CurrentWeatherRecord()

      result.temperatureC = current.temperature.converted(to: .celsius).value
      result.feelsLikeC = current.apparentTemperature.converted(to: .celsius).value
      result.conditionCode = conditionCode
      result.conditionLabel = humanize(conditionCode)
      result.symbolName = current.symbolName
      result.highC = today?.highTemperature.converted(to: .celsius).value ?? result.temperatureC
      result.lowC = today?.lowTemperature.converted(to: .celsius).value ?? result.temperatureC
      result.observedAt = ISO8601DateFormatter().string(from: current.date)
      result.attributionRequired = true
      return result
    }

    AsyncFunction("getAttribution") { () async throws -> WeatherAttributionRecord in
      let attribution = try await WeatherService.shared.attribution
      var result = WeatherAttributionRecord()

      result.serviceName = attribution.serviceName
      result.combinedMarkLightURL = attribution.combinedMarkLightURL.absoluteString
      result.combinedMarkDarkURL = attribution.combinedMarkDarkURL.absoluteString
      result.legalPageURL = attribution.legalPageURL.absoluteString
      return result
    }
  }
}

private func humanize(_ value: String) -> String {
  let spaced = value
    .replacingOccurrences(of: "([a-z0-9])([A-Z])", with: "$1 $2", options: .regularExpression)
    .replacingOccurrences(of: "_", with: " ")
  return spaced.prefix(1).uppercased() + spaced.dropFirst()
}
