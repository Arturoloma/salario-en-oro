---
version: 'alpha'
name: 'Salario en Oro'
description: 'Civic, editorial, transparent design system for a public salary purchasing-power calculator in Spain.'
colors:
  primary: '#1F4E79'
  primary-hover: '#173E62'
  secondary: '#2A7F7F'
  text: '#2F3540'
  text-strong: '#3A3F45'
  text-muted: '#6B7280'
  accent-gold: '#C9A44A'
  accent-gold-muted: '#FBF4DD'
  accent-terracotta: '#C75D45'
  background: '#FAF8F5'
  surface: '#FFFFFF'
  surface-muted: '#F1F5F9'
  surface-neutral: '#F4F2EE'
  border-subtle: '#E6E2DA'
  border-strong: '#D2D7DF'
  positive: '#2E7D5B'
  positive-muted: '#EAF5EE'
  negative: '#C23B3B'
  negative-muted: '#FBEAEA'
  warning: '#E3A008'
  warning-muted: '#FFF7E0'
  info: '#2563EB'
  info-muted: '#EEF4F6'
  result-summary: '#E8F2F7'
  methodology: '#F7F3E6'
  disabled: '#B8BDC6'
  background-dark: '#12171C'
  surface-dark: '#1A222A'
  surface-muted-dark: '#202A33'
  text-dark: '#F4F2EE'
  text-muted-dark: '#B8BDC6'
  primary-dark: '#6EA8D7'
  accent-gold-dark: '#D9B85C'
  on-primary: '#FFFFFF'
  on-surface: '#2F3540'
  on-muted: '#3A3F45'
typography:
  h1:
    fontFamily: 'Fraunces, Georgia, serif'
    fontSize: '40px'
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: '-0.03em'
  h2:
    fontFamily: 'Fraunces, Georgia, serif'
    fontSize: '28px'
    fontWeight: '650'
    lineHeight: '1.18'
    letterSpacing: '-0.02em'
  h3:
    fontFamily: 'Fraunces, Georgia, serif'
    fontSize: '20px'
    fontWeight: '650'
    lineHeight: '1.25'
  body:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: '16px'
    fontWeight: '400'
    lineHeight: '1.6'
  small:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: '13px'
    fontWeight: '400'
    lineHeight: '1.45'
  caption:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: '12px'
    fontWeight: '400'
    lineHeight: '1.4'
  label:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: '13px'
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: '0.04em'
  number-lg:
    fontFamily: 'IBM Plex Mono, ui-monospace, monospace'
    fontSize: '32px'
    fontWeight: '650'
    lineHeight: '1.1'
    fontFeature: 'tnum'
  number-md:
    fontFamily: 'IBM Plex Mono, ui-monospace, monospace'
    fontSize: '24px'
    fontWeight: '650'
    lineHeight: '1.15'
    fontFeature: 'tnum'
  number-sm:
    fontFamily: 'IBM Plex Mono, ui-monospace, monospace'
    fontSize: '16px'
    fontWeight: '500'
    lineHeight: '1.3'
    fontFeature: 'tnum'
rounded:
  sm: '4px'
  md: '8px'
  lg: '16px'
  xl: '24px'
spacing:
  1: '4px'
  2: '8px'
  3: '16px'
  4: '24px'
  5: '32px'
  6: '48px'
  7: '64px'
  8: '96px'
components:
  page:
    backgroundColor: '{colors.background}'
    textColor: '{colors.text}'
    typography: '{typography.body}'
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.text}'
    rounded: '{rounded.md}'
    padding: '24px'
  card-result:
    backgroundColor: '{colors.result-summary}'
    textColor: '{colors.text}'
    rounded: '{rounded.lg}'
    padding: '24px'
  card-gold:
    backgroundColor: '{colors.accent-gold-muted}'
    textColor: '{colors.text}'
    rounded: '{rounded.lg}'
    padding: '24px'
  card-positive:
    backgroundColor: '{colors.positive-muted}'
    textColor: '{colors.text}'
    rounded: '{rounded.lg}'
    padding: '24px'
  card-methodology:
    backgroundColor: '{colors.methodology}'
    textColor: '{colors.text}'
    rounded: '{rounded.md}'
    padding: '24px'
  card-source:
    backgroundColor: '{colors.info-muted}'
    textColor: '{colors.text}'
    rounded: '{rounded.md}'
    padding: '24px'
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '12px 18px'
    height: '44px'
  button-primary-hover:
    backgroundColor: '{colors.primary-hover}'
    textColor: '{colors.on-primary}'
    rounded: '{rounded.md}'
    padding: '12px 18px'
    height: '44px'
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.primary}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '12px 18px'
    height: '44px'
  input:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.text}'
    typography: '{typography.number-sm}'
    rounded: '{rounded.sm}'
    padding: '10px 12px'
    height: '44px'
  input-error:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.negative}'
    typography: '{typography.number-sm}'
    rounded: '{rounded.sm}'
    padding: '10px 12px'
    height: '44px'
  segmented-control:
    backgroundColor: '{colors.surface-neutral}'
    textColor: '{colors.text}'
    rounded: '{rounded.md}'
    padding: '4px'
    height: '44px'
  chip:
    backgroundColor: '{colors.surface-neutral}'
    textColor: '{colors.text}'
    typography: '{typography.small}'
    rounded: '{rounded.xl}'
    padding: '6px 10px'
  disclaimer:
    backgroundColor: '{colors.warning-muted}'
    textColor: '{colors.text}'
    rounded: '{rounded.md}'
    padding: '16px'
  metadata-text:
    textColor: '{colors.text-muted}'
    typography: '{typography.caption}'
  strong-text:
    textColor: '{colors.text-strong}'
    typography: '{typography.body}'
  coin-mark:
    backgroundColor: '{colors.accent-gold}'
    rounded: '{rounded.xl}'
    size: '32px'
  caveat-marker:
    backgroundColor: '{colors.accent-terracotta}'
    rounded: '{rounded.sm}'
    size: '8px'
  panel-muted:
    backgroundColor: '{colors.surface-muted}'
    textColor: '{colors.text}'
    rounded: '{rounded.md}'
    padding: '16px'
  divider-subtle:
    backgroundColor: '{colors.border-subtle}'
    height: '1px'
  divider-strong:
    backgroundColor: '{colors.border-strong}'
    height: '1px'
  error-surface:
    backgroundColor: '{colors.negative-muted}'
    textColor: '{colors.text}'
    rounded: '{rounded.md}'
    padding: '16px'
  positive-text:
    textColor: '{colors.positive}'
    typography: '{typography.number-md}'
  warning-marker:
    backgroundColor: '{colors.warning}'
    rounded: '{rounded.sm}'
    size: '8px'
  info-link:
    textColor: '{colors.info}'
    typography: '{typography.small}'
  disabled-control:
    backgroundColor: '{colors.disabled}'
    textColor: '{colors.text}'
    rounded: '{rounded.sm}'
    height: '44px'
  muted-inverse:
    backgroundColor: '{colors.on-muted}'
    textColor: '{colors.surface}'
    rounded: '{rounded.md}'
    padding: '12px'
  dark-page:
    backgroundColor: '{colors.background-dark}'
    textColor: '{colors.text-dark}'
    typography: '{typography.body}'
  dark-card:
    backgroundColor: '{colors.surface-dark}'
    textColor: '{colors.text-dark}'
    rounded: '{rounded.md}'
    padding: '24px'
  dark-panel-muted:
    backgroundColor: '{colors.surface-muted-dark}'
    textColor: '{colors.text-muted-dark}'
    rounded: '{rounded.md}'
    padding: '16px'
  dark-button-primary:
    backgroundColor: '{colors.primary-dark}'
    textColor: '{colors.background-dark}'
    rounded: '{rounded.md}'
    padding: '12px 18px'
    height: '44px'
  dark-gold-mark:
    backgroundColor: '{colors.accent-gold-dark}'
    textColor: '{colors.background-dark}'
    rounded: '{rounded.xl}'
    size: '32px'
---

## Overview

Salario en Oro is a public-interest civic tool for understanding salary purchasing power in Spain over time. It should feel clear, serious, transparent, educational, and calm. It is not a finance product, investment product, luxury brand, trading terminal, or speculative tool.

The visual language combines civic credibility, editorial clarity, historical awareness, numerical precision, warmth without decoration, and transparency over persuasion. Gold is a measured comparison unit, not a status signal.

Design principles:

- Put clarity before ornamentation.
- Make calculations, sources, dates, units, and assumptions visible.
- Explain results in plain Spanish without talking down to users.
- Pair every number with context: year, unit, source, caveat, or comparison.
- Use gold as information, not luxury.
- Keep interaction calm; avoid urgency, gamification, and trading-dashboard patterns.

Tone words:

- Creible.
- Claro.
- Preciso.
- Transparente.
- Educativo.
- Historico.
- Sereno.
- Ligero.
- Publico.
- No especulativo.

Avoid:

- Luxury finance, crypto aesthetics, casino cues, and fake wealth imagery.
- Candlestick charts, stock tickers, trading red/green volatility patterns.
- Excessive metallic gradients or overdone gold branding.
- Generic SaaS gradients.
- Nostalgic kitsch.

Visual metaphors:

| Concept     | Visual metaphor                                           |
| ----------- | --------------------------------------------------------- |
| Salary      | Nomina, recibo, current income, household economy         |
| Inflation   | Measured comparison, calibrated bars, adjusted value      |
| Time        | Timeline, selected year, historical marker                |
| Gold        | Small coin, material reference, weight in grams           |
| Pesetas     | Archival currency notation, historical unit               |
| Sources     | Stamped citation, verified data row, institutional record |
| Methodology | Transparent formula card, calculation trail               |

## Colors

The palette is led by civic blues, warm neutrals, graphite text, and restrained gold accents. Gold should appear mainly in coin-related components, highlights, and small informational accents. It must never dominate the interface.

Primary palette:

| Token               | Role                           | Value     |
| ------------------- | ------------------------------ | --------- |
| `primary`           | Civic brand and primary action | `#1F4E79` |
| `secondary`         | Secondary civic accent         | `#2A7F7F` |
| `text`              | Main text and dark UI          | `#2F3540` |
| `accent-gold`       | Gold comparison accent         | `#C9A44A` |
| `accent-terracotta` | Historical or caveat accent    | `#C75D45` |

Neutrals:

| Token             | Role                 | Value     |
| ----------------- | -------------------- | --------- |
| `surface`         | Pure card surface    | `#FFFFFF` |
| `background`      | Warm page background | `#FAF8F5` |
| `surface-neutral` | Muted warm surface   | `#F4F2EE` |
| `border-subtle`   | Subtle dividers      | `#E6E2DA` |
| `disabled`        | Inactive controls    | `#B8BDC6` |
| `text-strong`     | Strong text          | `#3A3F45` |

Semantic colors:

| Token      | Role                                 | Value     |
| ---------- | ------------------------------------ | --------- |
| `positive` | Purchasing-power gain or valid input | `#2E7D5B` |
| `negative` | Loss or error                        | `#C23B3B` |
| `warning`  | Caveat or assumption                 | `#E3A008` |
| `info`     | Source or methodology information    | `#2563EB` |
| `disabled` | Inactive controls                    | `#B8BDC6` |

Context surfaces:

| Token               | Use                        | Value     |
| ------------------- | -------------------------- | --------- |
| `background`        | Main app canvas            | `#FAF8F5` |
| `surface`           | Standard cards             | `#FFFFFF` |
| `surface-muted`     | Secondary panels           | `#F1F5F9` |
| `methodology`       | Formula explanation        | `#F7F3E6` |
| `info-muted`        | Dataset/source information | `#EEF4F6` |
| `result-summary`    | Key result area            | `#E8F2F7` |
| `accent-gold-muted` | Gold coin and grams result | `#FBF4DD` |
| `positive-muted`    | Purchasing-power gain      | `#EAF5EE` |
| `warning-muted`     | Caveat or disclaimer       | `#FFF7E0` |

Dark mode is an adaptation, not the primary identity. Use `background-dark`, `surface-dark`, `surface-muted-dark`, `text-dark`, `text-muted-dark`, `primary-dark`, and `accent-gold-dark`. Preserve readability with softer contrast, and avoid making dark mode feel like a trading terminal.

## Typography

Typography should feel editorial, serious, and readable, with enough personality to be distinctive but never decorative.

Font roles:

| Role                 | Token                                 | Suggested family                                   |
| -------------------- | ------------------------------------- | -------------------------------------------------- |
| Display and headings | `h1`, `h2`, `h3`                      | Fraunces, Source Serif, or refined serif           |
| Body text            | `body`, `small`, `caption`, `label`   | Inter, Source Sans 3, or clear humanist sans       |
| Numeric data         | `number-lg`, `number-md`, `number-sm` | IBM Plex Mono, Roboto Mono, or tabular-number font |

Typographic hierarchy:

| Style   | Use                                | Example                                                         |
| ------- | ---------------------------------- | --------------------------------------------------------------- |
| H1      | Main page titles                   | Comprender el poder adquisitivo del salario                     |
| H2      | Section titles                     | Poder adquisitivo                                               |
| H3      | Card and subsection titles         | Equivalencia en oro                                             |
| Body    | Explanatory content                | Compara tu salario actual con el de cualquier ano desde 1975... |
| Label   | Form labels and metadata           | SALARIO ACTUAL                                                  |
| Numeric | Salaries, years, CPI, grams, coins | 35.000 EUR, 2025, 45,23 g                                       |
| Caption | Sources, formulas, caveats         | Fuente: INE · Ultima actualizacion: 10/05/2025                  |

Use tabular numbers for salaries, percentages, CPI values, years, grams, and coins. Numeric blocks can be compact, with line-height around `1.3`. Explanatory prose should use more air, with line-height around `1.55` to `1.65`.

Typography examples:

```text
H1
Comprender el poder adquisitivo del salario

H2
Poder adquisitivo

H3
Equivalencia en oro

Body
En Salario en Oro puedes comparar tu salario actual con el de cualquier ano desde 1975, ajustado por inflacion y expresado en euros, pesetas, gramos de oro y monedas historicas.

Label
SALARIO ACTUAL

Numeric
35.000 EUR
2025 / 1980
CPI 112,4
45,23 g
7,79 monedas

Caption
Fuente: INE · Ultima actualizacion: 10/05/2025
```

## Layout

The layout should be generous for explanatory content and more compact for dense data. Preserve readability before density, especially on mobile.

Grid tokens:

| Breakpoint | Columns | Gap    | Page padding |
| ---------- | ------- | ------ | ------------ |
| Desktop    | 12      | `24px` | `32px`       |
| Tablet     | 8       | `24px` | `24px`       |
| Mobile     | 4       | `16px` | `16px`       |

Use a maximum container width of `1200px`. Page sections usually use `spacing.7` or `spacing.8`. Cards usually use `spacing.4` or `spacing.5` internally. Form groups use `spacing.3` between label, input, and help text.

Desktop behavior:

- Hero and calculator may sit in a wide layout.
- Results may appear in a four-column card grid.
- Methodology and source panels can sit beneath results.

Mobile behavior:

- Stack inputs vertically.
- Show results one card per row.
- Make timelines horizontally scrollable or simplified.
- Collapse methodology blocks into accordions when needed.
- Keep the key result close to the calculator.

Recommended mobile order:

1. Header and app name.
2. Hero explanation.
3. Salary input.
4. Year selectors.
5. Currency selector.
6. Primary action.
7. Main equivalent result.
8. Gold and inflation result cards.
9. Methodology summary.
10. Sources and disclaimer.

## Elevation & Depth

Surfaces should feel trustworthy and light. Prefer subtle borders over shadows. Shadows are functional separators, not decorative effects.

Elevation tokens:

| Token           | Value                               | Use                         |
| --------------- | ----------------------------------- | --------------------------- |
| `shadow-sm`     | `0 1px 2px rgba(0, 0, 0, 0.06)`     | Small card lift             |
| `shadow-md`     | `0 4px 12px rgba(0, 0, 0, 0.08)`    | Rare raised panels          |
| `border-subtle` | `1px solid #E6E2DA`                 | Standard cards and dividers |
| `border-strong` | `1px solid #D2D7DF`                 | Stronger separation         |
| `focus-ring`    | `0 0 0 3px rgba(31, 78, 121, 0.25)` | Accessible focus            |

Optional texture: a very subtle ruled-paper or archive-line motif may be used inside methodology or source areas. It should be barely visible and must never interfere with legibility.

## Shapes

Use small to medium radii. The interface should feel modern and approachable without becoming bubbly or playful.

Radius tokens:

| Token        | Value  | Use                                |
| ------------ | ------ | ---------------------------------- |
| `rounded.sm` | `4px`  | Inputs and compact controls        |
| `rounded.md` | `8px`  | Buttons, standard cards, panels    |
| `rounded.lg` | `16px` | Result cards and highlighted cards |
| `rounded.xl` | `24px` | Chips and soft badges              |

Surface rules:

| Surface           | Treatment                                             |
| ----------------- | ----------------------------------------------------- |
| Standard card     | White background, subtle border, small radius         |
| Result card       | Slightly tinted background, stronger number hierarchy |
| Gold card         | Warm pale-gold background, small coin motif only      |
| Methodology panel | Muted background, formula emphasis, clear links       |
| Source panel      | Blue-grey tint, verification badges                   |
| Disclaimer block  | Warm warning tint, icon plus plain-language text      |

## Components

### Salary Input Field

Label: `Salario actual`. Example value: `35.000 EUR`.

Requirements:

- Always show the label.
- Allow thousands separators.
- Show a currency suffix.
- Use numeric-friendly typography for the value.
- Include a text explanation for invalid formats.
- Minimum mobile tap height is `44px`.

### Year Selector

Labels: `Ano actual` and `Ano a comparar`. Example values: `2025` and `1980`.

Rules:

- Use a dropdown or searchable select.
- Make the selected year visually clear.
- Support the range from 1975 onward.
- Pair with a timeline selector when useful.

### Currency Selector

Options: `EUR` and `ESP`. Labels: `EUR` and `ESP`.

Rules:

- Use a segmented control.
- Clearly indicate the active option.
- Treat pesetas as historical context, not as a modern currency.

### Buttons

Primary button text: `Calcular equivalencia`. Use civic blue background, white text, medium radius, accessible hover/focus/active states, and an optional arrow icon.

Secondary button text: `Ver metodologia`. Use transparent or white background, subtle border, civic blue text, and reserve it for educational secondary actions.

### Result Card

Example:

```text
Equivalente en 1980
1.200.000 pesetas
≈ 7.207,89 EUR
Ver detalle
```

Rules:

- Make the main number dominant.
- Show year and unit.
- Include secondary conversion when relevant.
- Avoid decorative excess.

### Gold Coin Card

Example:

```text
Monedas de oro
7,79 monedas

1 moneda = 5,81 g de oro fino
```

Rules:

- Use antique gold as an accent.
- Include a coin icon or small visual mark.
- Always explain the coin definition.
- Do not make it feel like a wealth or investment card.

### Inflation Comparison Card

Example:

```text
Poder adquisitivo
+42 %

Comparado con 1980
```

Rules:

- Use positive or negative semantic color.
- Add a text label; never rely only on color.
- Include the comparison year.
- Use compact bar visualization if useful.

### Gold Comparison Card

Example:

```text
Equivalencia en oro
45,23 g

Gramos de oro fino
```

Rules:

- Use grams as the primary unit.
- Use gold coins as secondary context.
- Prefer measured, physical comparison language.

### Data Transparency Panel

Example:

```text
Datos utilizados

✓ IPC - INE
✓ Precio del oro - World Bank
✓ Tipo de cambio USD/EUR - BCE
✓ Conversion EUR/ESP - historica

Ir a Transparencia del calculo (#transparencia-titulo)
```

Rules:

- Show source names.
- Show dataset units.
- Show update date.
- Use verification badges where appropriate.

### Formula Block

Example:

```text
Formula principal

salario_historico =
salario_actual × IPC_ano_historico / IPC_ano_actual
```

Rules:

- Use monospaced or numeric style.
- Keep formulas readable.
- Include a link to explanation.
- Avoid hiding assumptions.

### Source Citation Row

Example:

```text
Fuente: INE
Ultima actualizacion: 10/05/2025
Dato verificado
```

Rules:

- Use a compact row format.
- Include source, date, and verification status.
- Use icon plus text.

### Disclaimer Block

Example:

```text
No es asesoramiento financiero.
Informacion educativa y de interes publico.
Los resultados pueden contener estimaciones.
```

Rules:

- Use calm tone.
- Avoid alarmist styling.
- Use warning or info color gently.

### FAQ Item

Use an accordion pattern with a clear plain-language answer. Link to methodology when useful.

Example:

```text
¿Por que los resultados son estimaciones?

Usamos datos historicos disponibles y metodos estandar.
Revisa los supuestos y fuentes de cada calculo.
```

### Timeline Selector

Example labels: `1975 · 1980 · 1990 · 2000 · 2010 · 2020 · 2025`.

Rules:

- Show the selected year clearly.
- Avoid dense stock-chart behavior.
- Use as contextual navigation, not market analysis.

### Example Scenario Chip

Examples: `Profesional junior · 2025`, `Salario medio · 1980`, `Nomina mensual · 1995`.

Rules:

- Use small rounded chips.
- Help users explore plausible cases.
- Do not imply financial advice.

### Footer Navigation

Suggested links: `Sobre el proyecto`, `FAQ`, `Blog`, `Contacto`. The MVP is single-page; methodology, sources, privacy, and disclaimer are embedded on the homepage.

## Do's and Don'ts

Do:

- Use civic blue for primary actions and source/methodology navigation.
- Use restrained gold only for measured gold comparisons.
- Keep labels visible on all controls.
- Put methodology and source access near result cards.
- Pair color with labels, icons, or explanatory text.
- Use tabular numbers for data-heavy UI.
- Preserve mobile readability and `44px` touch targets.
- Use calm, brief, functional motion.

Don't:

- Make gold feel luxurious, speculative, or investment-oriented.
- Use candlesticks, tickers, trading dashboards, or market volatility visuals.
- Hide formulas, caveats, source dates, or units.
- Communicate gain/loss only through red or green.
- Use placeholder-only labels.
- Add fast decorative motion.
- Add large UI, charting, or CSS frameworks without explicit approval.

## States

Interactive states must be calm, accessible, and clear.

| State                 | Treatment                                                         |
| --------------------- | ----------------------------------------------------------------- |
| Default               | Neutral, calm, ready for interaction                              |
| Hover                 | Subtle background `#F8FAFC` or border change to `#D2D7DF`         |
| Focus                 | Strong accessible focus ring: `0 0 0 3px rgba(31, 78, 121, 0.25)` |
| Active                | Slightly darker primary state or pressed surface                  |
| Disabled              | Muted text and background, `cursor: not-allowed`                  |
| Error                 | Red border plus text explanation, never color alone               |
| Loading               | Calm spinner or skeleton, preserving layout size                  |
| Valid input           | Green plus text or icon such as `Dato valido`                     |
| Empty result          | Explain what to enter next                                        |
| Estimated value       | Warning/caption style with reason for estimation                  |
| Source-verified value | Source badge with source name and date                            |

State copy examples:

```text
Error de formato
Calculando...
Dato valido
Sin resultados
Introduce un salario y selecciona un ano para calcular.
Por estimacion
Fuente: INE
Dato verificado
```

## Data Visualization

Visualizations should be compact, annotated, and explanatory. They should help people understand differences without looking like investment charts.

Prefer:

- Comparison bars.
- Annotated number blocks.
- Timelines.
- Small multiples.
- Clear conversion cards.
- Formula trails.

Avoid:

- Candlestick charts.
- Stock tickers.
- Trading dashboards.
- Market-style red/green volatility charts.
- Complex multi-axis graphs.
- Unexplained percentages.

Recommended patterns:

```text
2025
35.000 EUR

↓ equivalente ajustado

1980
1.200.000 pesetas
≈ 7.207,89 EUR
```

```text
Equivalencia en oro
45,23 g de oro fino

0 g ━━━━━━━━━━━━━━━●━━━━ 100 g
```

```text
Poder adquisitivo
+42 %
vs 1980

-100% ━━━━━━━●━━━━━━ +100%
```

Peseta/euro conversion must show the official fixed conversion clearly:

```text
1 EUR = 166,386 ESP

1.200.000 pesetas
≈ 7.207,89 EUR
```

Timeline selections should be educational and prominent:

```text
1975 ─ 1980 ─ 1990 ─ 2000 ─ 2010 ─ 2020 ─ 2025
       ●
```

## Methodology And Trust

The methodology layer is central to the product. Do not hide it at the bottom; make it accessible from result cards and source rows.

Formula references:

```text
historical_salary =
current_salary × CPI_historical_year / CPI_current_year
```

```text
gold_grams =
salary_eur / gold_price_eur_per_gram_for_year
```

```text
gold_price_eur_per_gram =
gold_price_usd_per_oz / USD_EUR_rate / 31.1035
```

```text
gold_coins =
gold_grams / 5.81
```

```text
1 EUR = 166.386 ESP
```

Spanish formula labels:

```text
Salario historico =
salario actual × IPC del ano historico / IPC del ano actual
```

```text
Gramos de oro =
salario en euros / precio del oro por gramo en ese ano
```

```text
Precio del oro por gramo =
precio del oro en USD por onza / tipo USD-EUR / 31,1035
```

```text
Monedas de oro =
gramos de oro / 5,81
```

Required source attribution:

```text
Fuentes de datos

INE - Indice de Precios al Consumo
World Bank Commodity Markets - Pink Sheet (precio del oro)
BCE - Tipo de cambio USD/EUR
Conversion historica EUR/ESP
```

Required dataset metadata:

```text
Ultima actualizacion del conjunto de datos: 10/05/2025

Unidades

Salario: euros o pesetas
IPC: indice base
Oro: gramos y onzas troy
Moneda de oro: 5,81 g de oro fino
```

Caveat copy:

```text
Algunos valores historicos pueden ser aproximaciones segun disponibilidad de datos, cambios de base del IPC o medias anuales de tipo de cambio.
```

Disclaimer copy:

```text
No es asesoramiento financiero.
Esta herramienta tiene fines educativos y de interes publico.
Los resultados son estimaciones basadas en fuentes historicas.
```

Recommended methodology links (as in-page anchors to the `Transparencia del cálculo` section):

- `Ver metodologia` → scroll to the methodology card.
- `Ver fuentes de datos` → scroll to the sources card.
- `Como se calcula` → scroll to the methodology card.
- `Revisar supuestos` → scroll to the disclaimer card.

## Accessibility

Accessibility is part of the design language, not an afterthought.

Core rules:

- Maintain high contrast for text and numbers.
- Use clear focus states on every interactive element.
- Use minimum touch targets of `44px`.
- Do not communicate meaning only through color.
- Pair semantic color with icon, label, or text.
- Use tabular numbers for financial and historical values.
- Keep labels visible; do not rely only on placeholders.
- Prioritize mobile readability.
- Avoid fast or decorative motion.
- Keep charts simple and annotated.
- Use plain Spanish explanations.

Motion should be calm, brief, functional, and respectful of reduced-motion preferences.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none;
    transition: none;
  }
}
```

## Example UI Application

Hero intro:

```text
Salario en Oro

Comprender el poder adquisitivo del salario

Compara tu salario actual con el de cualquier ano desde 1975 en Espana.
Inflacion, pesetas y euros, gramos de oro y monedas historicas.

Fuente: INE
Ultima actualizacion: 10/05/2025
```

Calculator form:

```text
Salario actual
35.000 EUR

Ano actual
2025

Ano a comparar
1980

Moneda objetivo
EUR / ESP

[Calcular equivalencia]
[Ver metodologia]
```

Result summary:

```text
Equivalente en 1980

1.200.000 pesetas
≈ 7.207,89 EUR

Ver detalle
```

Methodology/source snippet:

```text
Datos utilizados

✓ IPC - INE
✓ Precio del oro - World Bank Commodity Markets (Pink Sheet)
✓ Tipo de cambio USD/EUR - BCE
✓ Conversion EUR/ESP - historica

Formula principal

salario_historico =
salario_actual × IPC_ano_historico / IPC_ano_actual

No es asesoramiento financiero.
Informacion educativa y de interes publico.
```
