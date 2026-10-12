# DocSpace

A lightweight collaborative document workspace built for the Ajaia AI-Native Full Stack Developer assessment.

**Live app:** https://docspace-8m5a.vercel.app/
**GitHub source:** https://github.com/kamran-nizamani/docspace

## Features
- Create, rename, edit, reopen, and delete documents.
- Rich-text toolbar: bold, italic, underline, headings, bullet and numbered lists.
- Import plain text and Markdown files into editable documents.
- Export a document as Markdown.
- Demo user switching with owner/shared document views and email-based sharing.
- Browser persistence using localStorage, including document content and sharing records.
- Responsive layout, validation, empty states, and automated unit tests.

## Run locally
Requirements: Node.js 20+ and npm.

1. Run `npm install`.
2. Run `npm run dev` and open the URL printed by Vite.
3. Run tests with `npm test`.
4. Create a production build with `npm run build` (the prebuild hook runs the test suite first).

## Demo workflow
The app seeds three demo identities on first launch:
- Kamran Khan — kamran@example.com
- Sara Ahmed — sara@example.com
- Alex Morgan — alex@example.com

Create a document as Kamran, open Share, and grant access to `sara@example.com`. Use the account switcher to change to Sara; the document appears in Shared with me. All demo users share this browser's localStorage, so this demonstrates the product flow in one browser. It is not secure authentication and does not synchronize across devices.

## File support
TXT and Markdown (`.txt`, `.md`, `.markdown`) files are supported. Files are read in the browser and imported as editable text. Images and DOCX parsing are out of scope.

## Persistence and security note
This time-boxed MVP persists documents and sharing metadata in browser localStorage. Demo account switching is simulated, not authentication. Do not store confidential information. For production, replace the local adapter with a server-side database (e.g. Postgres/Supabase), authenticated sessions, server-enforced document ACLs, and storage-backed uploads.

## Supporting documents
- `ARCHITECTURE.md` — architecture and tradeoffs
- `AI_WORKFLOW.md` — AI usage and verification
- `SUBMISSION.md` — submission inventory and status
- `WALKTHROUGH_SCRIPT.md` — 3–5 minute demo script
- `WALKTHROUGH_VIDEO.txt` — replace placeholder with the final video URL
- `GOOGLE_DRIVE_UPLOAD_CHECKLIST.md` — final upload steps
