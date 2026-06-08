# Salario en Oro: Step-by-Step Development Plan

## 1. Product Vision

Build a lightweight web app that helps people in Spain understand their salary against inflation by translating it into historical purchasing power and gold value.

The app should answer questions like:

- What would my current salary have been worth in 1975?
- How much gold does my salary buy today?
- How much gold would the inflation-adjusted equivalent have bought in the past?
- Has my salary gained or lost value when measured against gold?

The product should be fun, simple, transparent, and based on real public data sources.

## 2. Target Scope

Initial target:

- Country: Spain only.
- Currency: euros, with peseta support for pre-euro years.
- Years: from 1975 to the latest available year.
- Salary input: annual gross salary first.
- Main outputs: inflation-adjusted salary, historical equivalent, gold grams, and gold coins.

Avoid in the MVP:

- User accounts.
- Backend database.
- Tax calculations.
- Multi-country support.
- Real-time API calls from the browser.
- Complex investment comparisons.

## 2.1 Current Technical Setup

The initial project setup uses:

- Astro.
- TypeScript in strict mode.
- pnpm.
- ESLint.
- Prettier.
- Vitest.
- Cloudflare Pages as the selected deployment target.

Basic source scaffold:

```text
src/
  pages/
    index.astro
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

The MVP is a single-page application. Methodology, source links, privacy note, disclaimer, and source-code link are embedded directly on the homepage rather than living on separate pages.

Core constants:

```text
GOLD_COIN_FINE_GOLD_GRAMS = 5.81
TROY_OUNCE_GRAMS = 31.1035
EUR_TO_ESP = 166.386
```

Cloudflare Pages build settings:

```text
Framework preset: Astro
Build command: pnpm build
Build output directory: dist
Production branch: main
Package manager: pnpm
```

## 3. Core Calculation Model

### 3.1 Inflation-Adjusted Salary

Use Spanish CPI data to calculate the equivalent salary in a historical year.

```text
historical_salary = current_salary * CPI_historical_year / CPI_current_year
```

Example:

```text
If salary today is 35,000 EUR, calculate what amount in 1975 had similar purchasing power.
```

### 3.2 Gold Conversion

Convert salary into gold using annual average gold prices.

```text
gold_grams = salary_eur / gold_price_eur_per_gram_for_year
```

Gold data is usually published as USD per troy ounce, so normalize it:

```text
1 troy ounce = 31.1035 grams
gold_price_eur_per_gram = gold_price_usd_per_oz / USD_EUR_rate / 31.1035
```

For pre-euro years, use historical peseta exchange rates and then display values in both pesetas and euros using the fixed conversion rate.

```text
1 EUR = 166.386 ESP
```

### 3.3 Gold Coins

Define the default gold coin clearly.

Recommended MVP definition:

```text
1 gold coin = 5.81 grams of fine gold
```

This is inspired by common historical European gold coins such as:

- Spanish 20 pesetas.
- French 20 francs.
- Italian 20 lire.
- Swiss 20 francs.

These coins contained approximately 5.81 grams of fine gold. In this project, a "gold coin" is an abstract standard unit based on that historical reference. It does not represent a current legal coin, a specific collectible coin, or a promise of physical mint equivalence.

Gold coin formula:

```text
gold_coins = gold_grams / 5.81
```

Spanish explanation for the product:

```text
En Salario en Oro, una "moneda de oro" equivale a 5,81 gramos de oro fino. Es una unidad inspirada en monedas historicas europeas como las 20 pesetas espanolas, los 20 francos franceses, las 20 liras italianas y los 20 francos suizos. No representa una moneda legal actual ni una pieza concreta de coleccionismo.
```

Possible future display options:

- Show raw grams of gold alongside gold coins.
- Show equivalent troy ounces.
- Let users switch to modern bullion units.
- Let users enter a custom grams-per-coin value.

## 4. Data Sources

Use reputable sources and document them clearly in the app.

### 4.1 Spanish Inflation

Source:

- Instituto Nacional de Estadistica, INE.
- Website: https://www.ine.es/

Use:

- Annual average CPI for Spain.
- National CPI index.

### 4.2 Gold Prices

Source:

- World Gold Council / GoldHub.
- Website: https://www.gold.org/goldhub/data/gold-prices

Use:

- Annual average gold price.
- Usually USD per troy ounce.

### 4.3 Exchange Rates

Sources:

- European Central Bank for EUR/USD reference rates.
- Banco de Espana for historical peseta exchange rates.

Websites:

- https://www.ecb.europa.eu/
- https://www.bde.es/

Use:

- EUR/USD annual average after euro adoption.
- ESP/USD historical average before euro adoption, if needed.

### 4.4 Data Attribution

Every generated dataset should include:

- Source name.
- Source URL.
- Date downloaded.
- Units.
- Methodology notes.

## 5. Data Storage Strategy

Do not fetch external data directly from the browser on every page load.

Instead:

1. Fetch official data using local scripts or CI scripts.
2. Normalize the data into small JSON files.
3. Commit the generated JSON files to the repository.
4. Serve them as static assets.
5. Load them from the browser when the app starts.

Suggested files:

```text
public/data/cpi-spain-annual.json
public/data/gold-eur-annual.json
public/data/exchange-rates-annual.json
public/data/metadata.json
```

Example format:

```json
{
  "source": "INE",
  "sourceUrl": "https://www.ine.es/",
  "lastUpdated": "2026-06-06",
  "units": "index",
  "data": [
    { "year": 1975, "value": 12.34 },
    { "year": 1976, "value": 14.01 }
  ]
}
```

## 6. Automatic Data Updates

Use GitHub Actions to keep the data current.

Recommended schedule:

```text
Run monthly.
Allow manual runs.
```

Workflow:

1. Checkout repository.
2. Install dependencies.
3. Run data update scripts.
4. Validate generated JSON files.
5. If data changed, open an automatic pull request.
6. Review and merge the pull request.
7. Deployment updates automatically after merge.

Validation rules:

- No missing years in supported range.
- No duplicate years.
- No negative values.
- No null values.
- Source URL exists in metadata.
- Last updated date exists.
- EUR/ESP conversion is fixed at 166.386.

## 7. Recommended Tech Stack

Use:

```text
Astro + TypeScript + static JSON data
```

Reasons:

- Lightweight by default.
- Static output.
- Good SEO.
- Easy deployment.
- Minimal JavaScript.
- Good fit for a calculator plus documentation pages.

Optional libraries:

- A small charting library only if needed.
- Prefer SVG or simple custom charts first.
- Avoid large UI frameworks in the MVP.

Avoid initially:

- Full backend.
- Database.
- Authentication.
- Heavy frontend state management.
- Large charting/dashboard packages.

## 8. Suggested Project Structure

```text
src/
  pages/
    index.astro
  components/
    SalaryCalculator.ts
    ResultsSummary.astro
    TimelineChart.astro
  lib/
    calculate.ts
    data.ts
    format.ts
    types.ts
scripts/
  update-cpi.ts
  update-gold.ts
  update-exchange-rates.ts
  validate-data.ts
public/
  data/
    cpi-spain-annual.json
    gold-eur-annual.json
    exchange-rates-annual.json
    metadata.json
```

## 9. UX and UI Direction

The design should feel playful but trustworthy.

Recommended visual direction:

```text
Medieval treasury meets Spanish economic dashboard.
```

Design qualities:

- Warm parchment tones.
- Deep burgundy or oxblood accents.
- Gold highlights.
- Coin-like result cards.
- Elegant typography.
- Clear data-source links.
- Fast mobile-first layout.

Avoid:

- Crypto aesthetics.
- Generic SaaS dashboard styling.
- Overly complex charts.
- Fake precision.
- Too many controls on first load.

Homepage structure:

1. Hero section.
2. Calculator.
3. Results cards.
4. Historical chart.
5. Methodology summary.
6. Source links.
7. Disclaimer.

Suggested hero copy:

```text
Cuanto cobras en oro?
Tu salario contra la inflacion, contado en piezas de oro.
```

## 10. Accessibility and Performance

Requirements:

- Use semantic HTML.
- Use native form inputs.
- Make labels clear and visible.
- Support keyboard navigation.
- Ensure strong color contrast.
- Keep JavaScript small.
- Avoid blocking third-party scripts.
- Optimize fonts.
- Make the calculator usable on mobile.

Performance goals:

- Static page load.
- Small JSON data files.
- No live API dependency for the user.
- No heavy client-side framework unless needed.

## 11. Pages to Build

### 11.1 Home

Contains:

- Product explanation.
- Salary calculator.
- Results.
- Chart.
- Methodology summary with formulas.
- Data facts (latest year, gold price, dataset date, methodology version).
- Source links (World Bank Commodity Markets, European Central Bank).
- Source code link (GitHub).
- Privacy note.
- Limitations and disclaimer.

The MVP is single-page. Methodology, sources, privacy, and disclaimer content is embedded directly on the homepage instead of on separate pages.

## 12. Licensing

Recommended license for code:

```text
MIT License
```

Important distinction:

- Code can be MIT licensed.
- Data files are derived from their respective sources and remain subject to each source's terms.

Recommended files:

```text
LICENSE
NOTICE.md
README.md
```

Add this clarification to the README:

```text
The application code is licensed under the MIT License.
Generated data files are derived from public third-party sources and are subject to the terms of those sources.
```

## 13. Deployment Plan

Recommended hosting:

```text
Cloudflare Pages
```

Reasons:

- Free or cheap.
- Static hosting.
- Fast CDN.
- GitHub integration.
- Preview deployments.

Alternative options:

- Netlify.
- Vercel.
- GitHub Pages.

Deployment flow:

```text
main branch -> production deployment
pull request -> preview deployment
merged data update -> automatic redeploy
```

## 14. Version Management

Use Git from the start.

Recommended branches:

```text
main
feature/calculator
feature/data-pipeline
feature/design
```

Recommended tags:

```text
v0.1.0 - first calculator prototype
v0.2.0 - real data loaded from JSON
v0.3.0 - automated data updates
v1.0.0 - public launch
```

Track both:

- App version.
- Data version or data update date.

Show in the footer:

```text
Datos actualizados: 2026-06-06
Metodologia: v1.0
```

## 15. Analytics

Use privacy-friendly analytics only if needed.

Recommended options:

- Cloudflare Web Analytics.
- Plausible.
- Umami.

Track:

- Page views.
- Calculator usage count.
- Selected comparison years.

Do not track:

- Raw salary values.
- Personal identifiers.
- Exact user input unless explicitly anonymized and disclosed.

## 16. Branding

Recommended name:

```text
Salario en Oro
```

Alternative names:

- Tu Sueldo en Oro.
- Nomina Aurea.
- Oro o Nomina.
- El Patron Nomina.

Recommended tagline:

```text
Tu salario contra la inflacion, contado en piezas de oro.
```

Tone:

- Curious.
- Playful.
- Transparent.
- Not alarmist.
- Not investment advice.

## 17. MVP Roadmap

### Phase 1: Foundation

Tasks:

- Choose final name.
- Choose domain.
- Create Git repository.
- Add MIT license.
- Write README.
- Write methodology draft.
- Set up Astro + TypeScript.

Output:

- Empty static site deployed.
- Project structure ready.

### Phase 2: Manual Data MVP

Tasks:

- Collect initial CPI data manually.
- Collect initial annual gold data manually.
- Normalize data into JSON.
- Add data validation script.
- Add source metadata.

Output:

- App can calculate using real static data.

### Phase 3: Calculator MVP

Tasks:

- Build salary input form.
- Add year selectors.
- Implement CPI adjustment.
- Implement gold conversion.
- Add result cards.
- Add basic chart.
- Add mobile styling.

Output:

- First usable calculator.

### Phase 4: Trust and Documentation

Tasks:

- Add methodology, formulas, and assumptions to the homepage.
- Add source links and data freshness indicator to the homepage.
- Add privacy note and disclaimer to the homepage.
- Add source code link.

Output:

- Product is understandable and credible from a single page.

### Phase 5: Automated Updates

Tasks:

- Write data update scripts.
- Add GitHub Action schedule.
- Add automatic PR creation.
- Add validation checks to CI.
- Document update process.

Output:

- Data stays current without manual work.

### Phase 6: Polish

Tasks:

- Improve visual design.
- Add shareable result URLs.
- Add gold-piece definition toggle.
- Add better explanatory copy.
- Add accessibility review.
- Add performance review.

Output:

- Launch-ready product.

### Phase 7: Launch

Tasks:

- Buy domain.
- Configure production deployment.
- Add analytics if desired.
- Write launch post.
- Share with a small test group.
- Fix confusing UX.
- Announce publicly.

Output:

- Public launch.

## 18. Launch Checklist

Before launch:

- Calculator works on desktop and mobile.
- Methodology is clear.
- Source links are visible.
- Data update date is visible.
- Salary values are not tracked.
- Disclaimer is present.
- Open Graph image exists.
- Favicon exists.
- Domain is configured.
- Analytics are privacy-friendly or omitted.
- README explains the project.
- License and data notices are present.

## 19. Announcement Plan

Soft launch:

- Share with friends.
- Share with developers.
- Ask if the result is understandable.
- Ask if the methodology feels trustworthy.

Public launch channels:

- LinkedIn.
- Twitter/X.
- Mastodon.
- Reddit Spain communities.
- Personal finance communities.
- Hacker News Show HN.

Suggested announcement:

```text
He creado Salario en Oro: una calculadora para ver cuanto vale tu sueldo medido en oro y compararlo con su poder adquisitivo historico en Espana desde 1975.

Usa datos publicos de inflacion, oro y tipos de cambio, y explica la metodologia completa.
```

## 20. Main Risks

Risks to handle early:

- Historical gold prices in EUR before 1999 require careful exchange-rate handling.
- INE data formats may be difficult to automate.
- Users may confuse inflation-adjusted salary with actual average salary of the past.
- Gold coin definition can be ambiguous, so the 5.81 g historical standard must be visible in the UI and methodology.
- Gross salary and net salary mean different things.
- Data source licenses and terms must be respected.

Mitigations:

- Start with annual gross salary only.
- Explain every formula.
- Show data sources near results.
- Keep methodology public.
- Add caveats in plain language.
- Validate datasets automatically.

## 21. First Concrete Tasks

Start with these tasks in order:

1. Create `README.md` with project description.
2. Create `LICENSE` using MIT.
3. Create `NOTICE.md` for data-source attribution.
4. Create `METHODOLOGY.md` with formulas and assumptions.
5. Initialize Astro + TypeScript.
6. Add first manually curated JSON datasets.
7. Implement the calculator logic in TypeScript.
8. Build the homepage.
9. Deploy a private preview.
10. Add automated data updates.
