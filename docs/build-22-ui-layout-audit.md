# Build 22 UI Layout Audit

## Build 21 Failure Findings

- Physical iPhone testing showed text overflow outside cards, frames, and screen boundaries.
- Several screens had excessive wording and dense copy.
- Navigation needed to be more icon-first and use shorter labels.
- Home Dashboard was missing time, date, location, and weather context.

## Build 22 Fixes

- Shared cards now use stronger `minWidth`, `minWidth: 0`, `flexShrink`, and multi-line containment rules.
- Event rows reserve a stable date/time column and allow titles/meta to wrap cleanly.
- Workflow cards use two-line titles and fixed status width to avoid narrow stacked words.
- App header and buttons now shrink text safely within available space.
- Home quick actions now use short labels such as Report, AI, Shift, Files, and Settings.
- New Incident was renamed in the UI to Report Writing / Report to reduce ambiguity and match App Store copy.

## Required Retest

- iPhone physical TestFlight test on Build 22.
- iPad compatibility smoke test.
- Dynamic Type check with larger text settings.
- Screen-by-screen check for clipped text, off-screen buttons, and unreadable cards.
