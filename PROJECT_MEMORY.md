# Project Memory

## User Preferences

- Default collaboration mode is review-first.
- Before editing files:
  1. inspect and explain the issue,
  2. propose exact files to change and why,
  3. wait for explicit approval.
- Editing is allowed only when the user explicitly authorizes implementation.
- Keep answers direct and practical.

## Environment

- Workspace root: `C:\Users\CHIRAG BAJAJ\OneDrive\AppData\Desktop\Hravinder_Agent`
- Backend: `backend`
- Volunteer frontend: `volunteer-app`
- Admin frontend: `admin-app`
- API base: `http://localhost:5000/api`
- Known frontend ports:
  - `5174`
  - `5175`

## Current Architecture Notes

- Backend is Express + MongoDB.
- Volunteer flow uses:
  - `backend/controllers/volunteerController.js`
  - `backend/routes/volunteer.js`
  - `volunteer-app/src/pages/MyTasksPage.jsx`
  - `volunteer-app/src/pages/SubmitReportPage.jsx`
  - `volunteer-app/src/pages/DashboardPage.jsx`
- Admin report visibility uses:
  - `backend/routes/admin.js`
  - `admin-app/src/services/adminService.js`
  - `admin-app/src/pages/Admin/NeedyPage.jsx`

## Recent Changes

- Fixed `MyTasksPage` task normalization so task ids come from `_id` and list keys are more stable.
- Added backend case accept/reject endpoints for volunteer case actions.
- Fixed report submission enum mismatch for `needy_type`.
- Added admin-side report listing endpoint and UI table.
- Added downloadable report PDF support with:
  - `backend/services/reportPdfService.js`
  - admin download endpoint
  - admin `Download PDF` button
- Styled generated PDF output to be more structured and presentable.
- Fixed local `code-review-graph` integration config:
  - changed MCP launchers from `uvx code-review-graph serve` to `code-review-graph serve`
  - removed unsupported `--json` flag from Claude `SessionStart` hook
- Added backend Socket.IO wiring with JWT-authenticated socket connections and role/user rooms.
- Emitted live update events for:
  - admin volunteer approval/rejection
  - admin needy assignment
  - volunteer case accept/reject
  - volunteer report submission
- Wired volunteer dashboard and my-tasks pages to refetch on live socket events.
- Replaced volunteer dashboard hardcoded `completedCases` with counts derived from live case data.
- Wired admin dashboard and needy/report page to refetch on live socket events.
- Added socket disconnect cleanup during logout/auth reset in both volunteer and admin apps.
- Corrected `volunteer-app` dependency from `socket.io` to `socket.io-client`.
- Locked app login/session handling by client role:
  - `admin-app` now accepts only `admin`
  - `client` now accepts only `user`
  - `volunteer-app` protected areas now accept only `volunteer`
- Preserved volunteer registration flow by allowing temporary login during registration, then re-authenticating after volunteer role upgrade before entering the volunteer dashboard.
- Removed visible `Hravinder` branding from the three websites' user-facing UI text.
- Current replacement labels are:
  - `admin-app`: `Admin Portal`
  - `volunteer-app`: `Volunteer Network` / `Volunteer Portal`
  - `client`: `Community Platform`
- Remaining non-UI references are internal upload-folder defaults (`hravinder`) and one testing guide markdown file.
- Added `vercel.json` SPA rewrites for all three frontend apps so direct/deep links resolve to `index.html` on Vercel:
  - `client/vercel.json`
  - `admin-app/vercel.json`
  - `volunteer-app/vercel.json`

## Known Issues / Pending Work

- Dependency note:
  - `volunteer-app` has an existing Vite / `@vitejs/plugin-react` peer dependency mismatch.
  - `--legacy-peer-deps` may be required for npm installs until dependency versions are aligned.
- Local build verification is partially blocked in this environment by Vite sandbox `spawn EPERM` during config resolution.
- `code-review-graph` is configured locally, but its MCP tools were not exposed through the available tool interface in this session.
- Role-lock fix was verified by code inspection, but not full browser runtime testing in this sandbox.

## Next Recommended Task

- Run the apps together and verify end-to-end live behavior:
  - admin assigns volunteer -> volunteer task list updates without refresh
  - volunteer accepts/rejects -> volunteer/admin screens refresh live
  - volunteer submits report -> admin reports list refreshes live
  - volunteer dashboard `completedCases` increments live after report submission
- Verify role isolation end-to-end:
  - admin credentials are rejected by `client` and `volunteer-app`
  - user credentials are rejected by `admin-app` and `volunteer-app`
  - volunteer credentials are rejected by `admin-app` and `client`
- If any live refresh is still missed, add targeted event payload handling instead of broad refetch-only listeners.

## Maintenance Rule

- Update this file after meaningful architectural, workflow, or user-preference changes.
