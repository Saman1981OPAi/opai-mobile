# Build 22 Home Time Date Weather

The Home Dashboard now includes a Today context card.

## Shows

- Current local time.
- Current local date and weekday.
- Weather condition, temperature, feels-like value, and high/low.
- Current weather city/source status.

## Weather Behavior

- Defaults to Toronto, Ontario if no permission is granted.
- Allows manual city selection from a small Canadian city list.
- Allows foreground location weather only after the user taps Local and accepts the iOS permission prompt.
- Caches weather locally for a short period to reduce repeat requests.
- Uses Open-Meteo and does not require an API key.

## Limits

- Weather is an informational beta convenience feature only.
- It is not an operational safety, road, dispatch, or emergency weather source.
- Build 22 must be physically tested to confirm the card renders correctly on real iPhone and iPad screens.
