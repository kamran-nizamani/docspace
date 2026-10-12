# DocSpace

A lightweight collaborative document workspace built for the Ajaia AI-Native Full Stack Developer assessment.

**Live app:** https://docspace-kamrans-projects-4c60ae36.vercel.app

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

1. Install dependencies: npm install
2. Start development server: npm run dev
3. Open the URL printed by Vite.
4. Run tests: npm test
5. Create a production build: npm run build (the prebuild hook runs the test suite first)

## Demo walkthrough
The app seeds three demo identities on first launch:
- Kamran Khan — kamran@example.com
- Sara Ahmed — sara@example.com
- Alex Morgan — alex@example.com

Create a document as Kamran, open Share, and grant access to sara@example.com. Use the account switcher to change to Sara; the document appears in Shared with me. All demo users share this browser's localStorage, so this demonstrates the product flow in one browser. It is not secure authentication and does not synchronize across devices.

## File support
TXT and Markdown (.txt, .md, .markdown) files are supported. Files are read in the browser and imported as editable text. Images and DOCX parsing are intentionally out of scope.

## Persistence and security note
This time-boxed MVP persists documents and sharing metadata in browser localStorage. Demo account switching is simulated, not authentication. Do not store confidential information. For production, replace the local adapter with a server-side database (e.g. Postgres/Supabase), authenticated sessions, server-enforced document ACLs, and storage-backed uploads.

## Architecture and submission
See ARCHITECTURE.md for scope decisions and tradeoffs. See AI_WORKFLOW.md for AI usage and verification. See SUBMISSION.md for the deliverables inventory. Use WALKTHROUGH_SCRIPT.md to record the required 3–5 minute video.
