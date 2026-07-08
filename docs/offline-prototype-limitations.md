# Offline Prototype Limitations

The Sprint 007 build is an offline local prototype. It is intended to support product review, UI testing, and local workflow demonstration only.

## Do Not Use For

- Real police records.
- Real evidence.
- Confidential or classified material.
- Sensitive personal information.
- Production authentication.
- Operational decision-making.
- Legal advice.
- Medical advice, therapy, treatment, diagnosis, or crisis intervention.

## Known Limitations

- AsyncStorage is suitable for non-sensitive prototype data, not sensitive operational data.
- Incident drafts are examples only and contain metadata placeholders.
- Notes and files are metadata-only placeholders; no real files are stored or uploaded.
- AI and translation history are mock local entries; no AI or translation engine is connected.
- Calendar, court, training, and requalification data are local examples and do not sync with any external calendar.
- Biometric and notification settings are placeholders only.
- Clear Local Data removes the stored demo state from this app, but it is not a secure wipe mechanism for production evidence handling.

## Production Requirements Before Real Use

- Secure backend authentication.
- Encrypted transport and encrypted storage.
- Secure key management.
- Role-based access control.
- Audit logging.
- Data minimization.
- Explicit user consent and retention controls.
- Canadian privacy compliance review.
- Offline cache encryption strategy.
- Clear operational policy review before police workflow use.
