# Salario en Oro

Salario en Oro is a lightweight static Astro site for understanding salaries in Spain through inflation-adjusted purchasing power and a historical gold coin abstraction.

The current MVP compares an annual income or salary from the past with a current annual income or salary, using Spanish CPI and annual gold prices to express both figures as inflation-adjusted euros and gold coins.

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

## Current State

- The homepage compares a past annual amount and a current annual amount through CPI-adjusted euros and gold coins.
- The current UI uses historical rows and the latest complete annual row from `public/data/calculation-data.json`.
- Core calculation helpers for CPI adjustment, gold grams, gold coins, EUR/ESP conversion, and historical salary/gold comparison live in `src/lib/calculate.ts`.
- Static datasets are generated and validated under `public/data/`.
- The homepage includes an embedded trust section with methodology, formulas, data facts, source links (INE, World Bank, ECB, Banco de España), a link to the GitHub source code, a privacy note, and a limitations/disclaimer block.

## Local Setup

Prerequisites:

```text
Node.js >=22.12.0
pnpm
```

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
pnpm coverage
pnpm data:update
pnpm data:validate
pnpm build
```

Recommended broad verification sequence:

```sh
pnpm check
pnpm lint
pnpm format:check
pnpm test:run
pnpm build
```

For data pipeline changes, also run:

```sh
pnpm data:validate
pnpm coverage
```

## Project Structure

```text
src/
  pages/
    index.astro
  lib/
    constants.ts
    types.ts
    calculate.ts
    data.ts
    format.ts
    *.test.ts
  styles/
    tokens.css
    global.css
scripts/
  data/
    build-calculation-data.ts
    normalize-cpi.ts
    normalize-exchange-rates.ts
    normalize-gold.ts
    update-data.ts
    validate-data.ts
    validate-data-files.ts
    *.test.ts
public/
  data/
    cpi-spain-annual.json
    gold-annual.json
    eur-usd-annual.json
    esp-usd-annual.json
    calculation-data.json
    metadata.json
.github/
  workflows/
    ci.yml
    update-data.yml
DESIGN.md
ROADMAP.md
```

## Data Pipeline

The site is static-first. It does not fetch external economic data from the browser during normal page loads.

Generated datasets live in `public/data/` and are committed to the repository. The browser and Astro pages consume those static JSON files.

Current data sources:

- Spanish CPI: Instituto Nacional de Estadistica
- Gold prices: World Bank Commodity Markets
- EUR/USD exchange rates: European Central Bank
- ESP/USD exchange rates: Banco de Espana

Update all generated datasets:

```sh
pnpm data:update
```

Validate committed datasets:

```sh
pnpm data:validate
```

The monthly GitHub Actions workflow in `.github/workflows/update-data.yml` runs the data update, validates the generated files, runs project checks, and opens an automatic pull request if data changed.

## Design System

`DESIGN.md` documents the visual direction and design tokens. `src/styles/tokens.css` implements the current CSS custom properties, and `src/styles/global.css` uses layered CSS with `@layer tokens, base, components`.

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

The product and development roadmap lives in [`ROADMAP.md`](./ROADMAP.md). It describes the intended historical salary comparison product, including features that may not be implemented yet.

## License

The application code is licensed under the MIT License. Generated datasets are derived from public third-party sources and remain subject to their original source terms.
