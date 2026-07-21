# Build 27 Assistant Reliability

## Scope

This change replaces the categorized Assistant prototype with a focused authenticated chat
surface. It does not generate Build 27, deploy infrastructure, enable streaming, or activate
server-side conversation storage.

## Assistant architecture

- `src/features/assistant/AssistantScreen.tsx` owns thread selection and request lifecycle.
- `AssistantMessageList.tsx` uses a virtualized `FlatList` with stable message identifiers.
- `AssistantComposer.tsx` provides multiline Send and Stop controls plus an explicit microphone
  control for foreground-only voice dictation.
- `assistantTypes.ts` defines ordered thread/message models and bounded context rules.
- `assistantRepository.ts` stores only encrypted per-user history in AsyncStorage.
- `assistantCrypto.ts` uses AES-256-GCM with a random 12-byte nonce and authenticated user/version
  context.
- `assistantVoiceApi.ts` sends user-initiated recordings through the existing authenticated OPAi
  backend transcription route. It never calls OpenAI directly.

The client sends at most 12 completed, error-free recent messages and at most 18,000
characters. The backend independently enforces its own message and input limits. Provider
storage remains disabled with `store=False`.

## Voice prompts

Voice input is optional and explicit. Microphone permission is requested only after the user taps
the microphone. Recording is foreground-only, limited to 60 seconds, and stored as a transient
local file. The authenticated backend returns a transcript, which is inserted into the editable
composer instead of being submitted automatically. The temporary recording is deleted after
success, failure, cancellation, or screen teardown.

## Visual response states

Completed OPAi answers use a translucent police-blue response box with an `OPAi response` label.
Errors and intentional cancellations use a separate amber warning box with an `OPAi warning`
label. User messages remain solid blue. This prevents generated answers from being mistaken for
warnings or system notices.

## Home layout

The former `Ready for duty` panel is removed. The time, date, weather, and time-aware greeting now
appear at the top of Home. The greeting uses the signed-in user's first name and local device time
to select morning, afternoon, evening, or night.

## Protected storage and migration

Each authenticated user receives a random 256-bit key stored in Expo SecureStore. The encrypted
payload is isolated by user and stored in AsyncStorage. Keys are neither hardcoded nor included
in logs.

Legacy prompt/response records are converted to two-message conversations. Migration is:

- versioned;
- idempotent;
- verified by decrypting the encrypted write;
- non-destructive on failure;
- restart-safe.

After verification, the ordinary AsyncStorage history array is cleared. A rollback copy remains
inside the encrypted payload. Sign-out locks history behind the account session; Clear Local
Data removes the current user's ciphertext and encryption key.

## Authentication reliability

- access-token refresh has an eight-second timeout;
- all authenticated requests can be cancelled during sign-out/session expiry;
- sign-out clears local tokens first and treats server revocation as bounded best effort;
- a failed refreshed request clears the local session and returns to Welcome immediately;
- intentional cancellation is distinct from timeout and network failure.

## Markdown and links

Assistant output uses restricted Markdown. Raw HTML and remote images are disabled. Link
activation allows HTTPS only and asks the user before leaving the app.

## Release gate

- Build 26 App Review: **NO-GO**
- Build 27 generation: **NO-GO**
- Public submission: **NO-GO**

Timestamped physical-device reproduction and Assistant connectivity certification remain
required before any release decision changes.
