# Submission inventory

Project: DocSpace — AI-Native Full Stack Developer Assignment

## Included
- Source code: React/Vite app in src/
- Local setup and run instructions: README.md
- Architecture decisions and scope tradeoffs: ARCHITECTURE.md
- AI tools, usage, and verification plan: AI_WORKFLOW.md
- Automated unit tests: src/lib/documents.test.js
- TXT/Markdown import and Markdown export
- Responsive editor and demo sharing workflow
- Walkthrough recording guide: WALKTHROUGH_SCRIPT.md

## Live product
Production deployment: https://docspace-rosy.vercel.app

Vercel reports deployment state READY for commit 5dff2aa3385ebedaa571006a7ac532e1b620974a. Verify the URL in a normal browser before submitting.

## Reviewer walkthrough
Video URL: NOT RECORDED YET — record a 3–5 minute walkthrough using WALKTHROUGH_SCRIPT.md, upload it to Loom/YouTube/Google Drive with public or unlisted access, then replace this line and update WALKTHROUGH_VIDEO.txt.

## Reviewer demo accounts
- Kamran Khan: kamran@example.com
- Sara Ahmed: sara@example.com
- Alex Morgan: alex@example.com

Use the account switcher in the upper-right corner. Create or select a document as Kamran, share it with Sara, then switch to Sara and open Shared with me. Demo state is stored in the current browser's localStorage.

## Known limitations
- Demo accounts are simulated and are not secure authentication.
- Persistence is local to the current browser and does not sync across devices.
- Only TXT and Markdown files are imported; DOCX and images are not supported.
- Shared users have view access; real-time collaborative editing is not implemented.

## Verification status
- Vercel production build: READY.
- Automated tests: included; latest GitHub Actions test result still needs confirmation.
- Manual browser smoke test: candidate should verify create/edit/refresh/import/share/revoke before final submission.
- Walkthrough video: pending candidate recording.
