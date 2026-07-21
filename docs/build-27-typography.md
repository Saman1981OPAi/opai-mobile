# Build 27 Typography

## Native font integration

OPAi embeds four static weights of Inter and Vazirmatn through the Expo Font config plugin:

- Regular 400
- Medium 500
- SemiBold 600
- Bold 700

The files come from the pinned `@expo-google-fonts/inter` and
`@expo-google-fonts/vazirmatn` packages. They are bundled into native iOS and Android builds and
are not downloaded at application startup. Native system text remains available as the fallback.

## Script selection

`src/theme/typography.ts` classifies rendered text locally:

- Latin UI, dates, times, and numerical values use Inter.
- Persian and Arabic-script text use Vazirmatn and right-to-left writing direction.
- Mixed Latin/Arabic and other supported operating-system scripts use the native system fallback
  to avoid missing glyphs.

No text is sent to a server for font selection. The helper does not alter, transliterate, or
normalize user content.

`AppText` and `AppInputText` apply the script-aware family across existing application text while
preserving React Native font scaling. Compact button text may use a conservative maximum
multiplier; chat, reports, translations, and other long-form content remain fully scalable.

## Font licences

Inter and Vazirmatn are distributed under the SIL Open Font License 1.1. Their complete font
licence files remain included in the pinned npm packages:

- `node_modules/@expo-google-fonts/inter/LICENSE_FONT`
- `node_modules/@expo-google-fonts/vazirmatn/LICENSE_FONT`

Official upstream projects:

- Inter: <https://github.com/rsms/inter>
- Vazirmatn: <https://github.com/rastikerdar/vazirmatn>

## Remaining physical checks

A production-signed build must still verify iOS PostScript family resolution and Android family
resolution on physical iPhone, iPad, and Android devices. Manual checks must cover Persian,
Arabic, mixed-language content, Dynamic Type/font scaling, long Assistant responses, Report
Writing, Translation, Calendar editing, Settings, and both portrait and landscape tablet layouts.

This change does not authorize or generate Build 27.
