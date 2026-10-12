# DocSpace — Architecture and tradeoffs

## Product slice
DocSpace focuses on one high-value loop: create a document, edit it with basic rich text, keep it after refresh, and share read access with a teammate. The interface separates navigation, editor controls, content canvas, and sharing dialog.

## Implementation
- React + Vite: lightweight SPA with fast local development and a static deployment target.
- Rich text: browser contentEditable with formatting commands for bold, italic, underline, headings, and lists. The editor stores its HTML structure so formatting survives reloads.
- Persistence: a versioned localStorage key stores documents and share lists. Writes occur when document state changes.
- Demo identity: three seeded users (Kamran, Sara, Alex) can be switched from the account menu. Sharing resolves the recipient against those seeded identities.
- File handling: browser File API reads TXT and Markdown files, validates type and size, converts them to editor HTML, and creates a new document.
- Export: current document HTML is converted to Markdown and downloaded client-side.
- Tests: Vitest checks access filtering, sharing grants/revocations, title validation, and import conversion.

## Security boundary
This is a timed assessment MVP, not a production multi-user service. Demo identity is not authentication; localStorage is editable by the user and is not shared across browsers or devices. The UI demonstrates ownership and sharing behavior in one browser only. A production version should use authenticated server sessions, database-backed documents, row-level security/ACL checks on every read and write, server-side validation, audit events, and object storage for attachments.

## Prioritization
1. Complete the document create/edit/reopen path.
2. Preserve formatting, import common text formats, and make sharing behavior visible.
3. Add meaningful unit tests and reviewer instructions.
4. Defer real-time co-editing, comments, DOCX parsing, rich permission roles, and cross-device persistence to avoid shallow implementations under the timebox.

## Next 2–4 hours
Integrate Supabase Auth and Postgres with owner and document_shares tables, enforce row-level security, move persistence behind a repository adapter, add Playwright end-to-end tests, and deploy with environment variables. Then add a real shared link flow and collaborative presence if time permits.
