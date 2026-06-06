# Agent Instructions

Use this file for persistent project instructions. Keep it concise and update it only for rules that should apply to most future coding sessions.

See `README.md` for setup commands and `ROADMAP.md` for product decisions.

## Project Context

- Salario en Oro is a lightweight static Astro site for salary comparisons in Spain.
- The app should remain static-first and fast; do not add a backend, database, authentication, or live browser-side calls to external data sources unless explicitly requested.
- Target deployment is Cloudflare Pages with `pnpm build` and output directory `dist`.
- The code is MIT licensed. Future generated datasets may be subject to their original third-party source terms.

## Package Manager And Commands

- Use `pnpm`, not npm or yarn.
- Install dependencies with `pnpm install`.
- Start development with `pnpm dev`.
- Build with `pnpm build`.
- Preview builds with `pnpm preview`.

Before considering code changes complete, run the relevant checks. For broad changes, run all of them:

```sh
pnpm check
pnpm lint
pnpm format:check
pnpm test:run
pnpm build
```

If a check fails, fix the root cause instead of weakening the check.

## Tech Stack

- Astro.
- TypeScript in strict mode.
- ESLint.
- Prettier.
- Vitest.

## Code Style

- Use ES modules with `import` and `export`.
- Keep TypeScript strict-compatible; avoid `any` unless there is a concrete reason.
- Prefer small pure functions for calculation logic in `src/lib/`.
- Keep UI pages/components lightweight and accessible.
- Use semantic HTML and native form controls where possible.
- Do not add large UI, charting, state-management, or CSS frameworks without explicit approval.

## Project Constants

Use the shared constants in `src/lib/constants.ts`; do not duplicate these values inline:

```ts
GOLD_COIN_FINE_GOLD_GRAMS = 5.81;
TROY_OUNCE_GRAMS = 31.1035;
EUR_TO_ESP = 166.386;
```

The project standard is:

```text
1 gold coin = 5.81 grams of fine gold
```

## Data Rules

- Use real, reputable sources for inflation, gold prices, and exchange rates.
- Do not fetch external data directly from the browser for normal page loads.
- Prefer static JSON files under `public/data/` generated or validated by scripts.
- Include source name, source URL, units, and last updated date in datasets.
- Keep calculations transparent and document assumptions in methodology content.

## Workflow

- Explore existing files before editing when the task is not trivial.
- For multi-file or ambiguous tasks, plan first, then implement.
- Keep changes minimal and scoped to the request.
- Do not rename or reorganize files unless it directly supports the task.
- Do not commit, amend, push, or create pull requests unless explicitly asked.
- If unexpected unrelated worktree changes exist, leave them alone.

## Testing Guidance

- Use Vitest for unit tests, especially `src/lib/` calculation and formatting logic.
- Add or update tests when changing calculation behavior.
- For UI-only placeholder changes, `pnpm check`, `pnpm lint`, `pnpm format:check`, and `pnpm build` may be enough.

## Documentation

- Update `README.md` when setup commands, dependencies, or deployment instructions change.
- Update `ROADMAP.md` when product assumptions, data strategy, or major technical decisions change.
- Keep `AGENTS.md` short. Do not duplicate long explanations from `README.md` or `ROADMAP.md`.
