# Weather Provider Licensing

Build 26 replaces the reachable Open-Meteo production path with native Apple WeatherKit on iOS.
The certified Build 25 binary is unchanged.

## Build 26 provider rules

- Weather requests run through Apple's native WeatherKit framework on the iPhone.
- OPAi does not operate a weather endpoint and does not route coordinates through Azure.
- The app does not include WeatherKit private keys or call the WeatherKit REST API.
- The app displays the Apple Weather mark returned by WeatherKit and links to Apple's weather data
  source attribution page in the detail view and Settings > Data Sources.
- The bundled Canadian city catalogue contains only city names, provinces, coordinates, and time
  zones needed for user-selected weather.

## App Store copy guidance

Weather is a convenience preview only. It is not an emergency, dispatch, tactical, road-safety, or
operational weather source. Apple Weather attribution must remain visible wherever detailed weather
data is presented.
