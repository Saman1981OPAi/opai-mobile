# Build 22 Location Privacy

Build 22 adds optional foreground location for local weather on the Home Dashboard.

## Permission Model

- Location is requested only when the user taps Local in the Today context card.
- The app requests foreground location only.
- The app does not request background location.
- The app does not track officer movement.
- The app does not upload location to a backend.
- The app does not store exact location history.

## Permission Text

`OPAi Police uses your approximate foreground location only when you choose local weather for the Home Dashboard. Location is not tracked in the background.`

## Fallback

If the user denies permission, the app keeps working and can use manual city weather.

## App Store Privacy Impact

Location may be used only for the user-facing weather feature. It is not linked to identity in this prototype and is not sent to OPAi servers because no backend is connected.
