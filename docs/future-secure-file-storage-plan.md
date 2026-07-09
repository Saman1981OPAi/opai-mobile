# Future Secure File Storage Plan

Secure file handling is intentionally out of scope for Sprint 013. A production implementation must be designed, reviewed, and approved before real file workflows are enabled.

## Future Requirements

- Explicit user consent before file access.
- Secure backend authentication and authorization.
- Role-based access control.
- Encrypted transport.
- Encryption at rest.
- Secure object storage, such as Cloudflare R2 or an approved Canadian-hosted equivalent.
- File metadata stored separately from encrypted file objects.
- Audit logging for upload, access, download, deletion, and retention actions.
- Retention and deletion policies aligned with Canadian privacy and service requirements.
- Malware scanning and file type validation.
- Size limits and upload progress controls.
- No automatic police-system sync without explicit approved integration.
- Clear separation between notes, operational records, and evidence.

## Review Gates

Before production file storage is built, OPAi should complete security, privacy, legal, records-management, retention, and operational policy review.
