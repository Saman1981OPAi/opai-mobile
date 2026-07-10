# Build 22 Weather Provider

## Provider

Build 22 uses Open-Meteo for the Home Dashboard weather preview.

## Configuration

- No API key.
- No production secret.
- HTTPS requests only.
- Coordinates are rounded before weather requests.
- Weather is cached locally for approximately 30 minutes.
- Default city fallback is Toronto, Ontario.
- Manual city selection supports selected Canadian cities.

## Runtime Use

Weather requests are made only for the Home Dashboard Today context card.

## Limitations

- Weather is not a certified operational source.
- Weather may be unavailable offline.
- If Open-Meteo fails, the app shows an unavailable state and continues to function.
