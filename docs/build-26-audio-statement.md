# Build 26 Audio Statement

## Scope

Audio Statement is a cross-platform, local-first recording and transcription aid. It replaces
Device Testing as a visible Home action. Device Testing source remains dormant and is not exposed
in the public Build 26 navigation.

## Local data flow

1. The user reads the microphone explanation and taps Record.
2. OPAi requests microphone access and records for up to two minutes.
3. Background recording is disabled.
4. The recording is copied into the application document directory and its metadata is persisted
   with the existing local application data.
5. Playback, rename, notes, and deletion work without backend access.
6. Deleting an Audio Statement removes its file and metadata together. Clear Local Data and Reset
   Demo Data also remove Audio Statement files.

## Optional AI actions

Transcription occurs only after the user selects Transcribe. The recording is uploaded to the
authenticated OPAi backend using a persisted idempotency key. The OpenAI credential remains on the
backend. The mobile app stores the returned AI transcript locally and clearly distinguishes it from
the editable user transcript.

Translation is a separate action. It sends the reviewed transcript as text through the existing
authenticated translation endpoint; the recording is not uploaded again.

## Permissions and privacy

- Microphone: user initiated, foreground only.
- Files: app-private local document storage; no broad photo or media permission.
- Network: used only after explicit Transcribe or Translate actions.
- No background recording, automatic upload, automatic cloud sync, content analytics, or recording
  filenames in logs.

Audio Statement is not an official evidence-recording system, records-management system, certified
transcript service, or replacement for service-approved equipment and procedures. Users must record
only when legally authorized and in accordance with law, consent requirements, training, and policy.

## Release gates

- Backend Audio Statement PR must be reviewed and merged.
- Production backend must be deployed and certified.
- Microphone allow/deny, recording, playback, persistence, deletion, transcription, translation,
  iPhone, iPad, and Android compatibility must pass before Build 26 generation.
- Build 26 remains NO-GO and has not been generated or submitted.
