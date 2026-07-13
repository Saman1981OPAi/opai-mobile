# Build 25 Mobile API Contract

The client reads `EXPO_PUBLIC_OPAI_API_BASE_URL` and appends `/api/v1`. Local, preview, and future production values remain separate.

Protected routes use a dynamically retrieved bearer token: `/ai/chat`, `/ai/report`, `/ai/usage`, `/ai/conversations/{id}`, `/translation/text`, `/translation/audio`, `/translation/image`, `/translation/document`, translation history routes, and `/device-testing/explain`.

Multipart limits mirror the backend: 10 MB uploads and 120-second audio. The client never calls OpenAI directly.
