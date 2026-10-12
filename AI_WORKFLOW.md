# AI workflow note

## Tools used
- ChatGPT: task decomposition, product scope, component structure, implementation drafting, test case design, and documentation review.
- GitHub: source control and commit history.
- Vite and Vitest: build and automated unit-test tooling.

## Where AI accelerated the work
AI helped turn a broad Google Docs-inspired brief into a smaller product slice, identify the key create/edit/import/share flows, and draft a testable separation between document helpers and the UI. It also accelerated the first pass of setup instructions, architecture tradeoffs, and the submission inventory.

## Judgment and tradeoffs
The implementation intentionally uses a browser-local demo store and seeded identities to keep the core workflow testable without requiring reviewers to configure a paid service or credentials. This is a deliberate assessment-scope cut, not a claim of production-grade authentication or cross-device collaboration. Real-time editing, DOCX parsing, and server-backed ACLs are deferred.

## Verification checklist
- Run npm install.
- Run npm test and review each test result.
- Run npm run build and fix any build errors.
- Manually verify create, rename, edit, refresh/reopen, TXT/Markdown import, export, share with Sara, switch to Sara, and revoke access as the owner.
- Test empty states, invalid file type, file size limit, and mobile layout.
- Verify that the README clearly explains the demo-account limitation.

## AI-generated output review
Generated code and text must be treated as a first draft. In particular, verify browser formatting commands, Markdown conversion, localStorage error behavior, and accessibility labels in the running app. Do not claim manual or automated checks passed until they have actually been run. Update this note with the real test/build outcomes before final submission.
