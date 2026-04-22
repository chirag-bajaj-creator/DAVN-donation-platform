# Project Memory

## User Preferences

- Default collaboration mode is review-first.
- Before editing files:
  1. inspect and explain the issue,
  2. propose exact files to change and why,
  3. wait for explicit approval.
- Editing is allowed only when the user explicitly authorizes implementation.
- Exception: `PROJECT_MEMORY.md` may be updated without asking first.
- For `PROJECT_MEMORY.md`, save meaningful user prompts/instructions and session milestones proactively.
- Prefer `cmd`-style command invocations when practical if that reduces tool overhead/tokens in this workspace.
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

- Redesigned the three public landing pages with a bold minimalist glassmorphism system:
  - `admin-app/src/pages/Home/AdminHomePage.jsx` now uses an executive navy/cyan/amber admin command-center design.
  - `volunteer-app/src/pages/HomePage.jsx` now uses a forest/emerald/teal volunteer field-verification design.
  - `client/src/pages/Home/HomePage.jsx` now uses a warm plum/rose/orange community-giving design.
  - added isolated landing styles in each frontend at `src/styles/landing.css`.
  - preserved existing auth modal behavior and CTA routes.
- Verified landing redesign builds with elevated `npm.cmd run build` for `admin-app`, `volunteer-app`, and `client`.
  - Initial non-elevated builds were blocked by Vite `spawn EPERM` in this sandbox.
  - Admin build completed with existing Tailwind `@tailwind`/`@apply` minifier warnings.
  - Client build completed with a plugin timing warning.
- Extended the glassmorphism redesign beyond landing pages:
  - admin protected layout/pages now match the navy/cyan/amber command-center theme.
  - volunteer layout, login/register pages, and restored specialized/general registration pages now match the forest/emerald/teal field-verification theme.
  - client app shell/common UI now uses the warm plum/rose/orange community-giving theme via `client/src/styles/client-shell.css`.
  - restored `volunteer-app/src/pages/SpecializedRegisterPage.jsx` after an interrupted agent run had deleted it while `App.jsx` still imported it.
- Final frontend verification after direct cleanup:
  - elevated `npm.cmd run build` passed for `admin-app`, `volunteer-app`, and `client`.
  - non-elevated builds still hit sandbox/Vite `spawn EPERM`.
  - admin build still emits existing Tailwind `@tailwind`/`@apply` minifier warnings, but succeeds.
- Converted volunteer authentication/registration entry points to popup-only behavior:
  - homepage sign-in/register CTAs now open `volunteer-app/src/components/LoginModal.jsx`.
  - the modal supports login, role choice, specialized registration, and general registration modes.
  - `/login`, `/register-type`, `/register/specialized`, and `/register/unspecialized` now redirect to `/` instead of rendering standalone auth pages.
  - unauthenticated protected volunteer routes now redirect to `/`.
  - elevated `npm.cmd run build` passed for `volunteer-app`.
- Added Step 15 basic backend monitoring/logging:
  - installed `pino` and `pino-http` in `backend`
  - added shared logger module at `backend/config/logger.js`
  - wired request logging middleware into `backend/server.js`
  - replaced central runtime `console.*` logging in backend startup, env validation, DB connection, error handling, and email-related operational paths
  - kept `/health` in place for UptimeRobot and suppressed noisy auto-request logs for that path
  - made Razorpay/UPI env vars optional in `backend/config/env.js` because payment features are not currently active
- Fixed admin auth modal visibility in `admin-app`:
  - rewrote `admin-app/src/components/Common/LoginModal.jsx` to use dedicated app CSS classes for popup rendering
  - added explicit auth modal shell/form styling in `admin-app/src/styles/admin.css`
  - reduced shared auth popup width further with a fixed narrower card width and viewport clamping
  - added internal scrolling to the auth modal body so long signup content stays inside the popup
  - fixed auth modal close/toggle buttons to use explicit `type="button"` and layered the close button above header effects
  - avoids relying on utility-class compilation for the open/visible state of the login popup
- Restyled `admin-app` auth popup UI:
  - widened `admin-app/src/components/Common/LoginModal.jsx`
  - added modal height/scroll handling for long signup content
  - refreshed login/register form field styling in `admin-app/src/components/Auth/LoginForm.jsx` and `admin-app/src/components/Auth/RegisterForm.jsx`
  - changed address fields to stack on narrow widths and fixed broken auth text glyphs/placeholders
- Added GitHub Actions backend auto-deploy workflow in `.github/workflows/deploy.yml`:
  - triggers on successful completion of `CI Pipeline` for `master`
  - deploys to Azure VM over SSH using `appleboy/ssh-action`
  - runs in `/home/azureuser/DAVN-donation-platform`
  - restarts backend with `sudo docker-compose down` and `sudo docker-compose up -d --build`
  - verifies deployment with `curl -f http://127.0.0.1:5001/health`
- Updated GitHub Actions backend test step in `.github/workflows/ci.yml`:
  - replaced `npm run test --if-present` with `npm test -- --passWithNoTests`
  - CI now passes when Jest finds zero test files, while still running tests once they exist
- Updated all three Vite frontends to use Vercel-relative API access:
  - `admin-app`, `client`, and `volunteer-app` now use `VITE_API_URL=/api`
  - each frontend `vercel.json` now rewrites `/api/*` to `http://135.119.93.20/dawn/api/*`
  - each frontend `vercel.json` now rewrites `/health` to `http://135.119.93.20/dawn/health`
  - shared axios/fetch API bases now default to `/api` instead of `http://localhost:5000/api`
  - admin/volunteer socket URLs now derive from shared config and default to same-origin unless `VITE_SOCKET_URL` is set
- Updated backend CORS allowlist in `backend/server.js` to include these Vercel origins:
  - `https://davn-donation-platform.vercel.app`
  - `https://davn-donation-platform-hadr.vercel.app`
  - `https://davn-donation-platform-ac79.vercel.app`
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
- Reached deployment stage, but memory had not been updated to reflect that milestone.
- Cron job setup was completed/handled in a prior session, but the exact schedule, provider, and task details still need to be recorded here if required later.
- Fixed local client registration 404 by adding a Vite dev proxy in `client/vite.config.js`:
  - `/api` now proxies to `http://localhost:5000` during local development.
  - production still uses relative `/api` for Vercel rewrites.
- Fixed local volunteer specialized registration 404 by adding a Vite dev proxy in `volunteer-app/vite.config.js`:
  - `/api` now proxies to `http://localhost:5000` during local development.
  - this covers `/api/auth/register` and `/api/volunteers/register/specialized` from the volunteer app.
- Cleaned up post-login styling and contrast in volunteer/client apps:
  - replaced old blue/purple inline volunteer protected pages with the forest/matte glass system for dashboard, tasks, and report submission.
  - added client-shell contrast overrides so gray/black utility text remains readable on crimson/matte surfaces.
  - moved the client donation form page into `MainLayout` and the client matte glass system.
  - elevated `npm.cmd run build` passed for `volunteer-app` and `client`; non-elevated builds still hit Vite sandbox `spawn EPERM`.
- Changed auth behavior across all three frontends so saved localStorage sessions are not silently restored:
  - `client`, `volunteer-app`, and `admin-app` clear stored auth state on app startup and require explicit sign-in.
  - protected routes now redirect unauthenticated users to `/login`.
  - client/admin `/login` routes open the existing login modal on the landing page; volunteer `/login` renders `LoginPage`.
  - elevated `npm.cmd run build` passed for `client`, `volunteer-app`, and `admin-app`.
- Tightened auth redirect behavior after dashboards were still opening without login:
  - added refresh/close auth clearing in all three auth providers.
  - removed admin landing auto-redirect to `/panel`.
  - removed volunteer landing auto-redirect to `/dashboard`.
  - removed client/admin login-form auto-redirect effects based only on `isAuthenticated`.
  - only successful login form submission now redirects to dashboard/panel.
  - elevated `npm.cmd run build` passed again for `client`, `volunteer-app`, and `admin-app`.

## Known Issues / Pending Work

- The new Vercel rewrite files now match the requested API proxy config exactly, but they no longer include the previous SPA catch-all rewrite. If direct client-side deep links fail on Vercel, add an SPA fallback after the API/health rewrites.
- Admin and volunteer Socket.IO clients no longer point at the raw backend host. If live sockets are required through Vercel, verify whether same-origin socket proxying is configured or set `VITE_SOCKET_URL` appropriately.
- Dependency note:
  - `volunteer-app` has an existing Vite / `@vitejs/plugin-react` peer dependency mismatch.
  - `--legacy-peer-deps` may be required for npm installs until dependency versions are aligned.
- Local build verification is partially blocked in this environment by Vite sandbox `spawn EPERM` during config resolution.
- `code-review-graph` is configured locally, but its MCP tools were not exposed through the available tool interface in this session.
- Role-lock fix was verified by code inspection, but not full browser runtime testing in this sandbox.
- Admin auth modal restyle was applied, but local `npm run build` verification is still blocked here by the same Vite `spawn EPERM` config-resolution issue.

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
- This file is the one exception to review-first approval: keep it current without asking first.
