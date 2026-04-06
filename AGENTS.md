# Repository Guidelines

## Project Structure & Module Organization
This repository is currently centered on the reference prototype in `refer/prototype/`. The runnable app lives under `refer/prototype/src/`, with UI screens in `src/app/screens/`, shared layout and routing in `src/app/`, and styling in `src/styles/`. Product, UX, and technical reference docs live in `refer/` as versioned Markdown files, and should be treated as the source of truth for scope and terminology.

## Build, Test, and Development Commands
Work inside `refer/prototype/` for local app changes.
- `npm i` installs dependencies.
- `npm run dev` starts the Vite development server.
- `npm run build` creates a production build.

There is no automated test script in the current prototype package. If you add tests, document the command here and keep it in `package.json`.

## Coding Style & Naming Conventions
Use modern React with TypeScript-style module structure and ES modules. Follow the existing file naming pattern: PascalCase for components and screens (`Chat.tsx`, `Layout.tsx`), lowercase or hyphen-free folders, and clear route names such as `sessions` and `memory`. Keep imports organized and prefer small, focused components under `src/app/components/`. Match the local formatting style in the file you touch, including the existing 2-space indentation pattern where present.

## Testing Guidelines
No test framework is configured yet. When adding tests, place them close to the feature or under a dedicated `tests/` or `src/__tests__/` area, and use names that describe behavior, such as `Chat.send-message.spec.tsx`. Prioritize coverage for routing, state flow, and screen-level interactions before visual polish.

## Commit & Pull Request Guidelines
The current history is sparse, with examples like `chore: initialize repository with current workspace snapshot` and `add refer`. Use short, imperative commit messages; conventional commit prefixes such as `feat:`, `fix:`, and `chore:` are a good default. Pull requests should explain what changed, why it changed, and which prototype or reference docs were updated. Include screenshots or screen recordings for UI changes, and note any new scripts or setup steps.

## Agent-Specific Instructions
Do not overwrite the reference docs in `refer/` unless the task explicitly calls for it. Prefer updating the prototype in `refer/prototype/` and keep changes consistent with the product scope defined in `PRDV0.1.md`, `UX_v0.1.md`, `TechStack_v0.1.md`, and `DevDoc_v0.1.md`.
