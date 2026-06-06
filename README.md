# Salario en Oro

Salario en Oro is a lightweight web project for understanding salaries in Spain through inflation-adjusted purchasing power and a historical gold coin abstraction.

The project standard is:

```text
1 gold coin = 5.81 grams of fine gold
```

This unit is inspired by historical European gold coins such as Spanish 20 pesetas, French 20 francs, Italian 20 lire, and Swiss 20 francs.

## Tech Stack

- Astro
- TypeScript in strict mode
- pnpm
- ESLint
- Prettier
- Vitest
- Static deployment target: Cloudflare Pages

## Local Setup

Install dependencies:

```sh
pnpm install
```

Start the local development server:

```sh
pnpm dev
```

Build the static site:

```sh
pnpm build
```

Preview the production build locally:

```sh
pnpm preview
```

## Available Commands

```sh
pnpm check
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:write
pnpm format:check
pnpm test
pnpm test:run
pnpm build
```

## Project Structure

```text
src/
  pages/
    index.astro
    metodologia.astro
    fuentes.astro
    privacidad.astro
  styles/
    global.css
  lib/
    constants.ts
    types.ts
    calculate.ts
    format.ts
public/
  data/
    .gitkeep
```

## Deployment

The selected deployment target is Cloudflare Pages.

Recommended Cloudflare Pages settings:

```text
Framework preset: Astro
Build command: pnpm build
Build output directory: dist
Production branch: main
Package manager: pnpm
```

## Roadmap

The product and development roadmap lives in [`ROADMAP.md`](./ROADMAP.md).

## License

The application code is licensed under the MIT License. Future generated datasets may be derived from public third-party sources and remain subject to their original source terms.
