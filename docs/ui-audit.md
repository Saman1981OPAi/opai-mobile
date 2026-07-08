# OPAi Mobile UI Audit

Status: UI stabilization note
Scope: Chat / AI Assistant screen

## Existing Conflict

The existing Chat / AI Assistant screen had too much text density for iPhone viewports. Several labels and workflow cards wrapped into narrow columns, which conflicted with the OPAi roadmap goal of a fast, police-focused mobile workflow that is readable on iPhone and iPad.

Observed issues:

- Large marketing-style headline consumed too much vertical space.
- AI tool titles and subtitles were long enough to clip or wrap awkwardly.
- Workflow shortcut cards used long labels that broke across multiple lines.
- The PTSD support card used more copy than needed for the mobile context.
- The AI tools list did not include a visible voice-command entry.

## Resolution

The update keeps the current app structure and working navigation intact while simplifying only the presentation layer:

- Replaced the dense Chat header with a compact AI Assistant header.
- Shortened AI tool labels and subtitles.
- Added `Talk to AI` with `Voice command` under AI tools.
- Added a compact `Talk` quick action.
- Shortened workflow shortcut labels to `Incident` and `Translate`.
- Reduced support strip copy to improve mobile fit.
- Preserved backend, AI platform, authentication, database, and production integration scope.

## Build Note

Because this is a native app UI change, it requires a new iOS build upload for TestFlight/App Store review. The iOS build number was incremented to `8`; the app version was not changed.
