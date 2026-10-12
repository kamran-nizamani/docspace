# AI workflow note

## Tools used
- ChatGPT: task decomposition, product scope, implementation drafting, test case design, documentation review, and iteration.
- GitHub: source control and commit history.
- Vite and Vitest: build and automated unit-test tooling.
- Vercel: production deployment.

## Where AI accelerated the work
AI helped turn the broad Google Docs-inspired brief into a small product slice, identify the create/edit/import/share flows, and draft a testable separation between document helpers and UI. It also accelerated setup instructions, architecture tradeoffs, a unit-test suite, and a reviewer walkthrough script.

## Generated output changed or rejected
- Rejected a full Google Docs clone scope and real-time collaboration as unrealistic within the timebox.
- Rejected presenting demo accounts as real authentication; the UI and README disclose that identities are simulated.
- Changed the initial import workflow so file import is always reachable from the sidebar, not only from the empty state.
- Added owner checks to share/revoke helper logic and tests to cover unauthorized share attempts.
- Added file type and 1 MB size validation; unsupported DOCX parsing is stated explicitly rather than implied.
- Added keyboard shortcuts for new document, search, and import, while keeping the UI usable through visible controls.

## Judgment and tradeoffs
The implementation uses a browser-local demo store and seeded identities to keep the core workflow testable without paid services or credentials. This is a deliberate assessment-scope cut, not a claim of production-grade authentication or cross-device collaboration. Real-time editing, DOCX parsing, and server-backed ACLs are deferred.

## Verification
- Vercel reported the deployment build as READY for the source commit shown in the submission document.
- A GitHub Actions workflow is configured to run the Vitest suite and production build on pushes and pull requests.
- The unit tests cover access filtering, sharing grants/revocations, title validation, Markdown conversion, and HTML escaping.
- The candidate should still open the live app in a browser and manually verify create, rename, edit, refresh/reopen, TXT/Markdown import, export, share with Sara, switch to Sara, and revoke access as the owner.
- Do not claim the automated test workflow passed unless its result is confirmed in GitHub Actions.

## Reliability checks to perform before submission
1. Run npm install.
2. Run npm test and review every result.
3. Run npm run build.
4. Manually test empty states, invalid file types, the file-size limit, sharing access, and mobile layout.
5. Confirm the deployed URL opens without login or access protection.
6. Record the walkthrough video and replace the placeholder URL in WALKTHROUGH_VIDEO.txt.
