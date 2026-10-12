# Submission inventory

Project: DocSpace — AI-Native Full Stack Developer Assignment

## Source and live product
- GitHub source repository: https://github.com/kamran-nizamani/docspace
- Live product URL: https://docspace-8m5a.vercel.app/
- To include source code in Google Drive, download the repository ZIP from GitHub using **Code → Download ZIP** and upload it alongside these documents.

## Included in the repository
- React/Vite app source in `src/`
- Local setup and run instructions: `README.md`
- Architecture decisions and scope tradeoffs: `ARCHITECTURE.md`
- AI tools, usage, and verification plan: `AI_WORKFLOW.md`
- Automated unit tests: `src/lib/documents.test.js`
- TXT/Markdown import and Markdown export
- Responsive editor and demo sharing workflow
- Walkthrough recording guide: `WALKTHROUGH_SCRIPT.md`

## Reviewer walkthrough
Video URL: PENDING — record a 3–5 minute walkthrough using `WALKTHROUGH_SCRIPT.md`, upload it to Loom/YouTube/Google Drive with public or unlisted access, then replace this line and update `WALKTHROUGH_VIDEO.txt`.

## Reviewer demo accounts
- Kamran Khan: `kamran@example.com`
- Sara Ahmed: `sara@example.com`
- Alex Morgan: `alex@example.com`

Use the account switcher in the upper-right corner. Create or select a document as Kamran, share it with Sara, then switch to Sara and open Shared with me. Demo state is stored in the current browser's localStorage.

## Known limitations
- Demo accounts are simulated and are not secure authentication.
- Persistence is local to the current browser and does not sync across devices.
- Only TXT and Markdown files are imported; DOCX and images are not supported.
- Shared users have view access; real-time collaborative editing is not implemented.

## Verification status
- Live URL provided: verify the current deployment opens without login or access protection.
- Automated tests: Vitest suite runs before the production build; confirm GitHub Actions separately.
- Manual browser smoke test: verify create/edit/refresh/import/share/revoke before final submission.
- Walkthrough video: pending candidate recording.
