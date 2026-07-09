# Notes and Files Workflow

The Notes & Files module is a local/offline workspace for organizing prototype information during testing. It is designed to support future incident, AI, translation, court, training, and calendar workflows without connecting to production systems yet.

## Notes

Local notes include:

- `id`
- `title`
- `body`
- `category`
- `tags`
- optional workflow link IDs
- `pinned`
- `archived`
- `createdAt`
- `updatedAt`

Supported note categories are General Note, Incident Note, Court Note, Training Note, Follow-Up Note, AI Assistant Note, Translation Note, Start My Shift Note, and Other.

Users can create, edit, delete, archive, pin, search, filter, and view linked workflow references. Notes are saved only in local prototype storage.

## Folders

Local folders include:

- General Notes
- Incident Drafts
- Court Preparation
- Training
- Translation
- AI Assistant
- Follow-Ups
- Archived

Users can create, rename, archive, delete, and assign notes to folders. Deleting a folder removes the folder assignment from local notes but does not delete the notes.

## File Metadata Placeholders

File metadata placeholders include file name, file type, description, category, optional workflow links, timestamps, and `metadataOnly: true`.

Supported categories are Photo Metadata, Video Metadata, Audio Metadata, Document Metadata, Court Document Placeholder, Training Document Placeholder, Translation Document Placeholder, and Other.

These records do not represent real files. They are labels for future workflow design and App Store review safety.

## Linked Items

Notes can reference local placeholder records from:

- Incident drafts
- AI history
- Translation history
- Calendar events
- Court events
- Training events
- Requalification reminders
- Follow-up reminders

Links are local IDs only. They do not sync or resolve through external systems.
