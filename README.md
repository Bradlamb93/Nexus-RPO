# Nexus RPO

A neutral-vendor workforce platform for healthcare staffing. It connects care
homes, staffing agencies and workers around one shift pipeline, with compliance
tracking, rate cards, timesheets and invoicing.

The app ships five role portals, each with its own navigation and permissions:

| Portal | Who it is for |
| --- | --- |
| Neutral Vendor Admin | Runs the platform — shifts, agencies, clients, rates, billing |
| Client Admin | Oversees a care group across all of its locations |
| Site Manager | Runs a single care home |
| Agency | Fills shifts, manages workers, submits timesheets |
| Bank Staff | Internal workers claiming shifts and tracking earnings |

## Getting started

```bash
npm install
npm run dev      # development server
npm run build    # production bundle into dist/
npm run preview  # serve the production bundle
```

React 18 + Vite, with Recharts for charts. There is no backend — every portal
runs on in-memory fixture data under `src/data/`, so the whole app is
explorable from the sign-in screen's demo role buttons.

## Design language

The interface follows a restrained, system-native visual language:

- **Type** — San Francisco on Apple platforms, Inter as a metric-compatible
  fallback elsewhere. Weights sit at 450–600; nothing is heavier.
- **Colour** — a neutral greyscale base carrying a single action colour
  (`#0071E3`, taken from the logo's outer ring). Amber, green, red, teal and
  indigo are reserved for status and categories, never for actions.
- **Surface** — hairline borders and diffuse, low-contrast elevation rather
  than hard shadows. One radius ladder, one motion curve.
- **Icons** — a monoline SVG set on a single 24×24 grid, inheriting
  `currentColor`. No emoji.
- **Chrome** — the sidebar and top bar render in a light or dark appearance,
  toggleable from the top bar and remembered per browser. Content stays light
  in both.

Everything lives in `src/theme/tokens.js`. Change a token there and it
propagates across the app.

## Project layout

```
src/
  main.jsx              entry point
  App.jsx               auth gate — sign-in screen or the app shell
  app/
    AppShell.jsx        sidebar + top bar + active view, and shared app state
    routes.js           role → view-key → component map
  theme/
    tokens.js           colour, type, spacing, elevation, motion, chrome
    charts.js           categorical series palette and tooltip styling
  components/
    Icon.jsx            monoline icon set and the emoji→icon resolver
    Logo.jsx            wordmark
    Sidebar.jsx         navigation model and the sidebar itself
    NotificationPanel.jsx
    ExportMenu.jsx
    ui/                 Badge, Button, Card, Table, Form, Feedback, Page
  lib/
    format.js           label and status formatting helpers
    pricing.js          client rate, margin and platform-fee maths
    export.js           CSV and printable-HTML export
  data/                 fixture data, one module per domain
  features/             one folder per domain, one module per screen
    agencies/ analytics/ auth/ bank/ clients/ compliance/
    dashboards/ finance/ rates/ shifts/ timesheets/ users/ workers/
```

Dependencies run in one direction: `theme` → `lib` → `data` → `components` →
`features` → `app`. There are no import cycles.

## Conventions

- Styling is inline, driven by the token object. There is no CSS framework and
  no stylesheet beyond the reset in `theme/tokens.js`.
- Shared primitives own their own look. Reach for `Card`, `Btn`, `Table`,
  `Stat` and friends rather than restyling from scratch — a change there is
  meant to land everywhere.
- Icons are referenced by name (`<Icon name="clipboard"/>`, or `icon="clipboard"`
  on the primitives that accept one). Add new glyphs to `ICON_PATHS`.
