# AGENTS.md

## Build & run
- `npx tsc` compiles `src/*.ts` → `dist/*.js`; there is no bundler, dev server, or test/lint setup.
- `index.html` loads `dist/main.js` directly as `<script type="module">` — you MUST run `npx tsc` after every TS edit, or the browser runs stale code. Never edit `dist/*.js` by hand.
- To preview, serve the folder over HTTP (e.g. `npx serve`); opening `index.html` via `file://` may block ES modules.
- `package.json` has `"type": "module"`; `tsconfig.json` is `strict` + `noEmitOnError`.

## Conventions that will bite you
- Imports between TS files use the `.js` extension (`import ... from "./logica.js"`) — required for native browser ES modules. Keep it.
- All academic rules live in `src/logica.ts`; `src/main.ts` is DOM/events only. Do not move business logic into `main.ts`.
- Numbers are rounded to 2 decimals via `redondear()` before comparisons — always route sums/finals through it so boundary values (17.99, 18.00, 23.99, 24.00, 47.99, 48.00) behave correctly.

## Non-obvious academic constraints (must not be "fixed" accidentally)
- Supletorio < 24 → REPROBADO, even if `sumaBimestres + supletorio >= 48`. The 24 minimum is absolute.
- No supletorio at all when `sumaBimestres < 18` (covers <= 17.99).
- Decision order is intentional in `evaluarBimestres`: >= 28 direct pass, then < 18 direct fail, then supletorio branch.
- `notaNecesariaEnSupletorio` floors at 24, not just `48 - suma`.
