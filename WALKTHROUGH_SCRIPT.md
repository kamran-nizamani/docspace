# 3–5 minute walkthrough script

Record your screen with the DocSpace live URL open. Speak naturally; show the app working rather than reading the script word for word.

## 0:00–0:30 — Product overview
“This is DocSpace, a focused document workspace built for the Ajaia AI-Native Full Stack Developer assessment. I scoped it around the core document loop instead of attempting a full Google Docs clone.”

## 0:30–1:30 — Create and edit
Click New document, rename it, type a few lines, and demonstrate bold, italic, a heading, and a list. Refresh the page and reopen the document to show local persistence.

## 1:30–2:10 — File workflow
Import a small Markdown or TXT file. Show the imported text in the editor, then export the current document as Markdown.

## 2:10–3:10 — Sharing
Open Share on a document owned by Kamran. Share with sara@example.com. Switch the demo account to Sara, open Shared with me, and show that the document is read-only. Switch back to Kamran and remove Sara's access.

## 3:10–4:00 — Engineering decisions
Explain that React/Vite keeps the app lightweight, document helpers isolate access and import logic, and Vitest covers sharing permissions and conversion helpers. Mention that CI is configured to run tests and a production build.

## 4:00–4:40 — Tradeoffs and AI workflow
Be transparent: demo identities and localStorage are intentional time-boxed tradeoffs, not production authentication or cross-device persistence. Explain how AI helped decompose requirements and draft implementation/tests, then describe the actual checks you ran and any fixes you made.

## Before uploading
- Ensure the browser shows the live app and no private data.
- Upload to Loom, YouTube unlisted, or Google Drive with link access enabled.
- Copy the public/unlisted URL into WALKTHROUGH_VIDEO.txt and SUBMISSION.md.
- Do not claim tests or manual checks passed unless you actually ran them.
