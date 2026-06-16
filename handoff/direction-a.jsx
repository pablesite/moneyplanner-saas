// direction-a.jsx — "Surface Reset"
// Refinement of the current dark Moneyplanner aesthetic.
// Key moves:
//   • ONE elevation. No nested cards. Sections separate by spacing + hairline.
//   • Unified header DSL: eyebrow • title • meta • actions (right). Always.
//   • Modals as full-page sheets that re-use the same header DSL.
//   • Numbers in Geist Mono. Body in Geist. Tabular-nums on every figure.

const { useState } = React;

// ── Scoped CSS for Direction A ───────────────────────────────────────────────
if (!document.getElementById("dir-a-styles")) {
  const s = document.createElement("style");
  s.id = "dir-a-styles";
  s.textContent = `
  .dir-a {
    --accent: oklch(0.72 0.12 var(--accent-h, 178));
    --accent-strong: oklch(0.78 0.14 var(--accent-h, 178));
    --accent-soft: oklch(0.72 0.12 var(--accent-h, 178) / 0.16);
    --accent-line: oklch(0.72 0.12 var(--accent-h, 178) / 0.52);
    --accent-glow: oklch(0.72 0.12 var(--accent-h, 178) / 0.08);

    /* dark by default */
    --bg: #0c0d10;
    --surface: #0c0d10;
    --text: rgba(255,255,255,0.94);
    --muted: rgba(255,255,255,0.58);
    --faint: rgba(255,255,255,0.32);
    --line: rgba(255,255,255,0.09);
    --line-strong: rgba(255,255,255,0.16);
    --hover: rgba(255,255,255,0.04);
    /* Semantic colours — single canonical pos/neg used everywhere */
    --pos: oklch(0.74 0.13 148);
    --neg: oklch(0.72 0.16 24);
    --pos-soft: oklch(0.74 0.13 148 / 0.14);
    --neg-soft: oklch(0.72 0.16 24 / 0.14);

    --u: calc(1px * var(--density-scale, 1));
    --pad-x: calc(40px * var(--density-scale, 1));
    --pad-y: calc(28px * var(--density-scale, 1));
    --row-y: calc(14px * var(--density-scale, 1));

    background: var(--bg);
    color: var(--text);
    font-family: "Geist", "Segoe UI", system-ui, sans-serif;
    font-feature-settings: "ss01", "cv11";
    font-variant-numeric: tabular-nums;
    width: 100%;
    height: 100%;
    container-type: inline-size;
    container-name: page;
  }
  .dir-a.theme-light {
    --bg: #faf9f7;
    --surface: #faf9f7;
    --text: #18181b;
    --muted: rgba(0,0,0,0.55);
    --faint: rgba(0,0,0,0.32);
    --line: rgba(0,0,0,0.08);
    --line-strong: rgba(0,0,0,0.14);
    --hover: rgba(0,0,0,0.03);
  }
  .dir-a .mono { font-family: "Geist Mono", ui-monospace, monospace; font-variant-numeric: tabular-nums; }

  /* Page header DSL (works for the entire app) */
  .dir-a .page {
    padding: var(--pad-y) var(--pad-x);
    display: grid; gap: calc(28px * var(--density-scale, 1));
    max-width: 1480px;
    margin: 0 auto;
  }
  .dir-a .page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--line); }
  .dir-a .eyebrow { font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); font-weight: 700; margin: 0; }
  .dir-a .page-title { margin: 0; font-size: 32px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.1; }
  .dir-a .page-meta { margin: 6px 0 0; font-size: 12.5px; color: var(--muted); display:flex; gap: 12px; flex-wrap: wrap; align-items: center; }
  .dir-a .page-meta .dot { width: 4px; height: 4px; border-radius: 50%; background: var(--faint); display:inline-block; }
  .dir-a .meta-picker { font: inherit; font-size: 12.5px; padding: 2px 8px; background: transparent; border: 1px solid var(--line); border-radius: 999px; color: var(--text); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: border-color .15s, background .15s; }
  .dir-a .meta-picker:hover { border-color: var(--line-strong); background: var(--hover); }
  .dir-a .meta-picker[aria-expanded="true"] { border-color: var(--accent-line); background: var(--accent-soft); }
  .dir-a .meta-picker .caret { color: var(--faint); font-size: 9px; }
  .dir-a .meta-picker-wrap { position: relative; display: inline-flex; }

  /* Section header (same DSL, lighter weight) */
  .dir-a .sect { display: grid; gap: calc(14px * var(--density-scale, 1)); }
  .dir-a .sect-head { display:flex; align-items:flex-end; justify-content: space-between; gap: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--line); }
  .dir-a .sect-title { margin: 0; font-size: 14px; letter-spacing: 0.02em; font-weight: 600; }
  .dir-a .sect-count { color: var(--faint); font-weight: 500; margin-left: 6px; }
  .dir-a .sect-sub { font-size: 12px; color: var(--muted); margin: 0; }

  /* Actions */
  .dir-a .actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .dir-a .btn { font: inherit; font-size: 13px; padding: 8px 14px; border-radius: 8px; border: 1px solid var(--line-strong); background: transparent; color: var(--text); cursor: pointer; line-height: 1; display:inline-flex; align-items:center; gap: 6px; transition: background .15s, border-color .15s; }
  .dir-a .btn:hover { background: var(--hover); border-color: var(--text); }
  .dir-a .btn-primary { background: var(--accent-soft); border-color: var(--accent-line); color: var(--text); }
  .dir-a .btn-primary:hover { background: var(--accent-soft); border-color: var(--accent); }
  .dir-a .btn-ghost { border-color: transparent; color: var(--muted); padding: 6px 10px; }
  .dir-a .btn-ghost:hover { color: var(--text); background: var(--hover); }
  .dir-a .btn-icon { width: 32px; height: 32px; padding: 0; justify-content: center; border-color: var(--line); color: var(--muted); }
  .dir-a .btn-icon:hover { color: var(--text); }

  .dir-a .chip { font-size: 11.5px; padding: 4px 10px; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); display:inline-flex; align-items:center; gap:6px; }
  .dir-a .chip.active { color: var(--text); background: var(--hover); border-color: var(--line-strong); }
  .dir-a .seg { display:inline-flex; border:1px solid var(--line); border-radius: 8px; padding: 2px; gap: 0; }
  .dir-a .seg button { font: inherit; font-size: 12px; padding: 5px 10px; border: 0; background: transparent; color: var(--muted); border-radius: 6px; cursor:pointer; }
  .dir-a .seg button.on { color: var(--text); background: var(--hover); }

  /* Context bar — page-level filters (titularidad, moneda, valoración, etc.)
     Lives between page-head and content. Same look as filter-bar but with
     small labels in front of each control. */
  .dir-a .context-bar { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; padding: 12px 0 4px; }
  .dir-a .context-field { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); }
  .dir-a .context-field-label { font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--faint); font-weight: 600; }
  .dir-a .context-bar .seg { padding: 1px; }
  .dir-a .context-bar .seg button { padding: 4px 10px; font-size: 12px; }
  .dir-a .context-divider { width: 1px; height: 18px; background: var(--line); }

  /* Hero — single flex row: headline + donut + Activos/Pasivos breakdown.
     Wraps when there isn't room. */
  .dir-a .hero { padding: 8px 0 4px; }
  .dir-a .hero-top { display: flex; align-items: center; gap: 40px; flex-wrap: wrap; row-gap: 28px; }
  .dir-a .hero-headline { display: grid; gap: 14px; flex: 0 1 auto; min-width: 0; }
  .dir-a .hero-value { font-family: "Geist", system-ui; font-size: 72px; line-height: 0.96; letter-spacing: -0.035em; font-weight: 600; margin: 4px 0 0; font-variant-numeric: tabular-nums; }
  .dir-a .hero-delta { display:flex; flex-wrap: wrap; gap: 10px 16px; font-size: 13.5px; color: var(--muted); align-items: baseline; }
  .dir-a .hero-delta .pos { color: var(--pos); }
  .dir-a .hero-delta .neg { color: var(--neg); }
  .dir-a .hero-donut { width: 200px; flex-shrink: 0; color: var(--text); }

  /* Compact breakdown block — sits to the right of the donut when there's room. */
  .dir-a .hero-breakdown {
    flex: 1 1 360px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    align-items: start;
    min-width: 0;
  }
  .dir-a .hero-comp-side { display: grid; gap: 4px; min-width: 0; }
  .dir-a .hero-comp-title { font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--faint); font-weight: 600; display:flex; align-items:baseline; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--line); }
  .dir-a .hero-comp-title b { font-size: 13px; letter-spacing: 0; text-transform: none; color: var(--text); font-weight: 500; font-family: "Geist Mono", ui-monospace, monospace; font-variant-numeric: tabular-nums; }
  .dir-a .hero-comp-side .comp-row { padding: 5px 8px; margin: 0 -8px; }
  .dir-a .hero-comp-side .comp-label { font-size: 12.5px; }
  .dir-a .hero-comp-side .comp-val { font-size: 12px; }
  .dir-a .hero-comp-side .comp-dot { width: 8px; height: 8px; }

  /* KPI utility classes kept for screens that still use them (Budget, Guide, Monthly close). */
  .dir-a .kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; margin-top: 24px; border-top: 1px solid var(--line); }
  .dir-a .kpi { padding: 14px 0 0; border-right: 1px solid var(--line); padding-right: 14px; }
  .dir-a .kpi:last-child { border-right: 0; }
  .dir-a .kpi:not(:first-child) { padding-left: 14px; }
  .dir-a .kpi-label { font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--faint); margin: 0 0 6px; }
  .dir-a .kpi-value { font-size: 20px; font-weight: 500; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; }
  .dir-a .kpi-meta { font-size: 11.5px; color: var(--muted); margin-top: 2px; }

  /* Donut composition list */
  .dir-a .side-toggle { display: inline-flex; gap: 4px; margin-bottom: 6px; }
  .dir-a .side-toggle button { font: inherit; font-size: 11px; padding: 4px 10px; border: 1px solid var(--line); background: transparent; color: var(--muted); border-radius: 999px; cursor: pointer; letter-spacing: 0.04em; }
  .dir-a .side-toggle button.on { color: var(--text); background: var(--hover); border-color: var(--line-strong); }
  .dir-a .side-toggle button:hover:not(.on) { color: var(--text); }

  /* Row kebab menu (used by table row ⋯ buttons) */
  .dir-a .row-menu-wrap { position: relative; display: inline-flex; }
  .dir-a .row-menu { position: absolute; top: calc(100% + 4px); right: 0; min-width: 200px; z-index: 4;
    background: var(--surface); border: 1px solid var(--line-strong); border-radius: 10px;
    box-shadow: 0 18px 48px -10px rgba(0,0,0,0.55);
    padding: 4px; display: grid; gap: 1px;
  }
  .dir-a .row-menu button { font: inherit; font-size: 13px; padding: 8px 10px; border: 0; background: transparent; color: var(--text); text-align: left; cursor: pointer; border-radius: 6px; display: flex; align-items: center; gap: 8px; }
  .dir-a .row-menu button:hover { background: var(--hover); }
  .dir-a .row-menu button.danger { color: var(--neg); }
  .dir-a .row-menu button.danger:hover { background: oklch(0.72 0.18 25 / 0.10); }
  .dir-a .row-menu hr { border: 0; height: 1px; background: var(--line); margin: 4px 0; }
  .dir-a .row-menu kbd { margin-left: auto; font-size: 10px; color: var(--faint); font-family: "Geist Mono", monospace; letter-spacing: 0.02em; }
  .dir-a .comp { display:grid; grid-template-columns: 200px 1fr; gap: 32px; align-items: center; }
  .dir-a .comp-donut { width: 100%; max-width: 200px; aspect-ratio: 1; align-self: start; }
  .dir-a .comp-donut svg { width: 100%; height: 100%; display: block; }
  .dir-a .comp-list { display: grid; gap: 4px; }
  .dir-a .comp-row { display: grid; grid-template-columns: 14px 1fr auto; gap: 10px; align-items: center; padding: 8px 10px; margin: 0 -10px; border-radius: 8px; font: inherit; border: 0; background: transparent; color: var(--text); text-align: left; cursor: pointer; transition: background .15s; }
  .dir-a .comp-row:hover { background: var(--hover); }
  .dir-a .comp-row.row-active { background: var(--accent-soft); }
  .dir-a .comp-dot { width: 10px; height: 10px; border-radius: 3px; }
  .dir-a .comp-label { font-size: 13px; }
  .dir-a .comp-val { font-size: 13px; font-variant-numeric: tabular-nums; color: var(--muted); }
  .dir-a .comp-row.row-active .comp-val { color: var(--text); }
  .dir-a .comp-bar { grid-column: 1 / -1; height: 2px; background: var(--line); border-radius: 2px; overflow: hidden; margin-top: 2px; }
  .dir-a .comp-bar > i { display:block; height: 100%; }

  /* Table */
  .dir-a .tbl { width: 100%; border-collapse: collapse; }
  .dir-a .tbl th { text-align: left; font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--faint); font-weight: 500; padding: 8px 12px; border-bottom: 1px solid var(--line); }
  .dir-a .tbl th.num, .dir-a .tbl td.num { text-align: right; font-variant-numeric: tabular-nums; }
  .dir-a .tbl td { padding: var(--row-y) 12px; border-bottom: 1px solid var(--line); font-size: 13.5px; vertical-align: middle; }
  .dir-a .tbl .account-value { font-weight: 400; color: var(--muted); }
  .dir-a .tbl .account-value-neg { color: oklch(0.72 0.16 24 / 0.82); }
  .dir-a .tbl tr:hover td { background: var(--hover); }
  .dir-a .tbl tr.row-active td { background: var(--accent-soft); }
  .dir-a .tbl tr.row-active .nameMain { color: var(--text); }
  .dir-a .tbl tr.clickable { cursor: pointer; }
  .dir-a .tbl tr:last-child td { border-bottom: 0; }

  /* Filter bar (used in Movimientos and similar list views) */
  .dir-a .filter-bar { display:flex; align-items:center; gap: 8px; padding: 12px 0; flex-wrap: wrap; }
  .dir-a .filter-ctrl {
    font: inherit; font-size: 13px;
    padding: 7px 12px;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--text);
    border-radius: 8px;
    outline: none;
    appearance: none; -webkit-appearance: none;
    line-height: 1.2;
    transition: border-color .15s;
    color-scheme: dark;
  }
  .dir-a.theme-light .filter-ctrl { color-scheme: light; }
  .dir-a .filter-ctrl:hover { border-color: var(--line-strong); }
  .dir-a .filter-ctrl:focus { border-color: var(--accent); }
  .dir-a .filter-ctrl::placeholder { color: var(--muted); }
  .dir-a select.filter-ctrl,
  .dir-a button.filter-ctrl {
    padding-right: 30px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none' stroke='rgba(255,255,255,0.45)' stroke-width='1.5'%3E%3Cpath d='M1 1.5 6 6.5l5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 10px;
    cursor: pointer;
  }
  .dir-a.theme-light select.filter-ctrl,
  .dir-a.theme-light button.filter-ctrl {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none' stroke='rgba(0,0,0,0.45)' stroke-width='1.5'%3E%3Cpath d='M1 1.5 6 6.5l5-5'/%3E%3C/svg%3E");
  }
  .dir-a .filter-ctrl[data-disabled] { opacity: 0.45; pointer-events: none; }
  .dir-a .filter-count { font-size: 12px; color: var(--muted); margin-left: auto; }
  .dir-a .filter-count strong { color: var(--text); font-weight: 500; }
  .dir-a .filter-popover {
    position: absolute; top: calc(100% + 4px); left: 0;
    background: var(--surface);
    border: 1px solid var(--line-strong);
    border-radius: 10px;
    padding: 4px;
    min-width: 200px;
    box-shadow: 0 16px 40px -8px rgba(0,0,0,0.5);
    z-index: 4;
    display: grid; gap: 1px;
  }
  .dir-a .filter-popover button {
    font: inherit; font-size: 13px; padding: 8px 12px; border: 0; background: transparent;
    color: var(--text); text-align: left; cursor: pointer; border-radius: 6px;
  }
  .dir-a .filter-popover button:hover { background: var(--hover); }
  .dir-a .filter-popover button.on { background: var(--accent-soft); color: var(--text); }
  .dir-a .filter-popover hr { border: 0; height: 1px; background: var(--line); margin: 4px 0; }
  .dir-a .filter-popover-custom { padding: 8px; display: grid; gap: 6px; }
  .dir-a .chart-wrap { position: relative; color: var(--accent); }
  .dir-a .chart-tip {
    position: absolute; pointer-events: none;
    padding: 8px 12px;
    background: var(--surface); color: var(--text);
    border: 1px solid var(--line-strong); border-radius: 8px;
    font-size: 12px; white-space: nowrap;
    box-shadow: 0 12px 32px -8px rgba(0,0,0,0.5);
    transform: translate(-50%, -110%);
  }
  .dir-a .chart-tip-label { color: var(--muted); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 2px; }
  .dir-a .chart-tip-value { font-family: "Geist Mono", monospace; font-weight: 600; font-variant-numeric: tabular-nums; }
  .dir-a .tbl .name { display:flex; align-items:center; gap: 10px; }
  .dir-a .tbl .swatch { width: 4px; height: 20px; border-radius: 2px; background: var(--pos); flex-shrink: 0; }
  .dir-a .tbl .swatch.lia { background: var(--neg); }
  .dir-a .tbl .nameMain { font-weight: 500; }
  .dir-a .tbl .nameSub { color: var(--muted); font-size: 11.5px; margin-top: 1px; }
  .dir-a .tbl td.num.neg { color: var(--neg); }
  .dir-a .tbl-foot td { font-weight: 600; border-top: 1px solid var(--line-strong); border-bottom: 0; }

  /* ── Budget progress bars ─────────────────────────────────────────────── */
  .dir-a .prog { position: relative; width: 100%; height: 6px; background: var(--line); border-radius: 3px; overflow: hidden; }
  .dir-a .prog > i { display: block; height: 100%; border-radius: inherit; transition: width .3s ease; }
  .dir-a .prog-good > i  { background: var(--pos); }
  .dir-a .prog-warn > i  { background: oklch(0.78 0.13 80); }   /* grade C */
  .dir-a .prog-danger > i{ background: var(--neg); }
  .dir-a .prog-neutral > i{ background: var(--muted); opacity: 0.6; }
  .dir-a .prog-over { box-shadow: inset 0 0 0 1px var(--neg-soft); }
  /* Tick marking 100% — only meaningful when bar can exceed 100% */
  .dir-a .prog-tick { position: absolute; top: -2px; bottom: -2px; width: 1px; background: var(--text); opacity: 0.55; }

  /* Compact budget row */
  .dir-a .bdg-row { display: grid; grid-template-columns: minmax(0,1fr) 110px minmax(140px, 1.4fr) 70px 110px 28px; gap: 16px; align-items: center; padding: 10px 6px; border-bottom: 1px solid var(--line); cursor: pointer; }
  .dir-a .bdg-row:hover { background: var(--hover); }
  .dir-a .bdg-row.bdg-row-cat { padding: 16px 6px 10px; border-bottom: 1px solid var(--line-strong); cursor: default; background: transparent; }
  .dir-a .bdg-row.bdg-row-cat:hover { background: transparent; }
  .dir-a .bdg-row.bdg-row-sub { padding-left: 24px; }
  .dir-a .bdg-row.bdg-row-item { padding-left: 44px; background: rgba(255,255,255,0.015); }
  .dir-a.theme-light .bdg-row.bdg-row-item { background: rgba(0,0,0,0.015); }
  .dir-a .bdg-row-item .bdg-name { font-size: 12.5px; color: var(--muted); }
  .dir-a .bdg-name { font-size: 13.5px; }
  .dir-a .bdg-row-cat .bdg-name { font-size: 14px; font-weight: 500; }
  .dir-a .bdg-row-cat .bdg-kind { font-size: 10.5px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--faint); margin-right: 10px; }
  .dir-a .bdg-row-cat .bdg-kind-asset { color: var(--pos); }
  .dir-a .bdg-row-cat .bdg-kind-liability { color: var(--neg); }
  .dir-a .bdg-row .bdg-chev { color: var(--faint); font-size: 12px; width: 18px; display: inline-flex; justify-content: center; }
  .dir-a .bdg-row .bdg-chev-cat { color: var(--text); }
  .dir-a .bdg-num { font-family: "Geist Mono", ui-monospace, monospace; font-variant-numeric: tabular-nums; font-size: 13px; text-align: right; }
  .dir-a .bdg-num-strong { font-weight: 500; color: var(--text); }
  .dir-a .bdg-num-muted  { color: var(--muted); font-weight: 400; }
  .dir-a .bdg-pct { font-size: 11px; color: var(--muted); margin-top: 2px; font-family: "Geist Mono", monospace; }
  .dir-a .bdg-diff-pos { color: var(--pos); }
  .dir-a .bdg-diff-neg { color: var(--neg); }
  .dir-a .bdg-input {
    font: inherit;
    background: transparent;
    border: 0; border-bottom: 1px dashed transparent;
    padding: 2px 0;
    color: var(--text);
    font-family: "Geist Mono", ui-monospace, monospace;
    font-variant-numeric: tabular-nums;
    text-align: right;
    width: 100%;
    outline: none;
  }
  .dir-a .bdg-input:hover { border-bottom-color: var(--line-strong); }
  .dir-a .bdg-input:focus { border-bottom-color: var(--accent); }
  .dir-a .bdg-bar-cell { display: grid; gap: 4px; }
  .dir-a .bdg-bar-meta { display: flex; justify-content: space-between; font-size: 10.5px; color: var(--muted); font-family: "Geist Mono", monospace; }

  /* Sparkline + unbudgeted pill + month stepper */
  .dir-a .sparkline { width: 64px; height: 18px; display: block; color: var(--muted); }
  .dir-a .sparkline path { fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linejoin: round; }
  .dir-a .sparkline .dot-now { fill: var(--text); }
  .dir-a .bdg-row-cat .sparkline { color: var(--text); }
  .dir-a .pill-unbudgeted {
    display: inline-flex; align-items: center; gap: 4px;
    margin-left: 8px;
    padding: 1px 7px; border-radius: 999px;
    background: oklch(0.78 0.13 80 / 0.14);
    border: 1px solid oklch(0.78 0.13 80 / 0.42);
    color: oklch(0.78 0.13 80);
    font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
    font-family: "Geist Mono", ui-monospace, monospace;
    cursor: help;
  }
  .dir-a .month-step { display: inline-flex; align-items: center; gap: 0; }
  .dir-a .month-step button { font: inherit; font-size: 12px; width: 24px; height: 28px; border: 1px solid var(--line); background: transparent; color: var(--muted); cursor: pointer; }
  .dir-a .month-step button:hover:not(:disabled) { color: var(--text); background: var(--hover); }
  .dir-a .month-step button:disabled { opacity: 0.4; cursor: not-allowed; }
  .dir-a .month-step button:first-child { border-radius: 8px 0 0 8px; }
  .dir-a .month-step button:last-child  { border-radius: 0 8px 8px 0; }
  .dir-a .month-step .month-label {
    border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
    padding: 0 12px; height: 28px; display: inline-flex; align-items: center;
    font-size: 12.5px; color: var(--text); min-width: 96px; justify-content: center;
    cursor: pointer;
  }
  .dir-a .month-step .month-label:hover { color: var(--text); background: var(--hover); }
  .dir-a .tbl .grp-row td {
    background: transparent;
    border-bottom: 1px solid var(--line-strong);
    padding-top: 24px;
    padding-bottom: 10px;
  }
  .dir-a .tbl .grp-row:first-child td { padding-top: 12px; }
  .dir-a .tbl .grp-row .grp-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    letter-spacing: -0.005em;
  }
  .dir-a .tbl .grp-row .grp-name .grp-kind {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--faint);
    margin-right: 10px;
  }
  .dir-a .tbl .grp-row .grp-name .grp-kind-asset { color: var(--pos); }
  .dir-a .tbl .grp-row .grp-name .grp-kind-liability { color: var(--neg); }
  .dir-a .tbl .grp-row .grp-total {
    font-size: 14px;
    color: var(--text);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    font-family: "Geist Mono", ui-monospace, monospace;
  }

  /* Tabs / view toggle on hero */
  .dir-a .tabs { display: flex; gap: 18px; border-bottom: 1px solid var(--line); }
  .dir-a .tab { font: inherit; font-size: 13px; padding: 10px 0; border:0; background:transparent; color: var(--muted); cursor:pointer; border-bottom: 1.5px solid transparent; margin-bottom: -1px; }
  .dir-a .tab.on { color: var(--text); border-bottom-color: var(--accent); }

  /* Modal — compact centered dialog. Same header DSL inside. */
  .dir-a .sheet-scrim { position: absolute; inset: 0; background: rgba(8,8,10,0.55); backdrop-filter: blur(2px); z-index: 5; }
  .dir-a.theme-light .sheet-scrim { background: rgba(20,20,22,0.20); }
  .dir-a .sheet-wrap { position: absolute; inset: 0; z-index: 6; display: flex; align-items: flex-start; justify-content: center; padding: 64px 24px 24px; pointer-events: none; }
  .dir-a .sheet { width: min(100%, 640px); max-height: calc(100% - 88px); pointer-events: auto;
    background: var(--surface); color: var(--text);
    border: 1px solid var(--line-strong); border-radius: 14px;
    box-shadow: 0 24px 64px -16px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02) inset;
    display: grid; grid-template-rows: auto 1fr auto; overflow: hidden;
  }
  .dir-a.theme-light .sheet { box-shadow: 0 24px 64px -16px rgba(20,20,22,0.18); }
  .dir-a .sheet-head { padding: 22px 24px 18px; border-bottom: 1px solid var(--line); display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
  .dir-a .sheet-body { padding: 8px 24px 20px; overflow: auto; }
  .dir-a .sheet-foot { display:flex; justify-content: space-between; align-items:center; padding: 14px 24px; border-top: 1px solid var(--line); background: var(--surface); }

  /* Form rows: NO inner cards. Underline labels. */
  .dir-a .form { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0 32px; }
  .dir-a .field { display: grid; gap: 6px; padding: 14px 0; border-bottom: 1px solid var(--line); }
  .dir-a .field.full { grid-column: 1 / -1; }
  .dir-a .field-label { font-size: 11px; letter-spacing: 0.10em; text-transform: uppercase; color: var(--faint); font-weight: 500; }
  .dir-a .field-hint { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
  .dir-a .input { font: inherit; font-size: 15px; background: transparent; border: 0; padding: 4px 0; color: var(--text); outline: none; border-radius: 0; }
  .dir-a .input:focus { box-shadow: 0 1px 0 0 var(--accent); }
  .dir-a .field-row { display: flex; align-items: center; gap: 8px; }
  .dir-a .field-row .input { flex: 1; }
  .dir-a .picker { display:inline-flex; align-items:center; gap: 6px; font-size: 12.5px; color: var(--muted); padding: 6px 8px; border: 1px solid var(--line); border-radius: 6px; cursor:pointer; }

  /* Topbar / app shell head — primary horizontal navigation */
  .dir-a .topbar { display: flex; align-items: stretch; justify-content: space-between; padding: 0 var(--pad-x); border-bottom: 1px solid var(--line); gap: 24px; min-height: 56px; }
  .dir-a .topnav-brand { display: flex; align-items: center; gap: 10px; padding: 12px 0; }
  .dir-a .topnav-brand-mark { display: inline-flex; width: 26px; height: 26px; border-radius: 7px; background: var(--accent-soft); border: 1px solid var(--accent-line); align-items: center; justify-content: center; font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; }
  .dir-a .topnav-brand-text { display: grid; line-height: 1.1; gap: 2px; }
  .dir-a .topnav-brand-title { font-size: 13.5px; font-weight: 600; letter-spacing: -0.005em; }
  .dir-a .topnav-brand-sub { font-size: 10.5px; color: var(--muted); letter-spacing: 0.04em; }
  .dir-a .topnav-divider { width: 1px; background: var(--line); margin: 12px 4px; }
  .dir-a .topnav-list { display: flex; align-items: stretch; gap: 0; flex: 1; min-width: 0; overflow-x: auto; scrollbar-width: none; }
  .dir-a .topnav-list::-webkit-scrollbar { display: none; }
  .dir-a .topnav-item { font: inherit; font-size: 13px; padding: 0 14px; display: inline-flex; align-items: center; color: var(--muted); cursor: pointer; border: 0; background: transparent; border-bottom: 1.5px solid transparent; margin-bottom: -1px; white-space: nowrap; transition: color .15s, border-color .15s; }
  .dir-a .topnav-item:hover { color: var(--text); }
  .dir-a .topnav-item.on { color: var(--text); border-bottom-color: var(--accent); font-weight: 500; }
  .dir-a .topnav-right { display: flex; align-items: center; gap: 8px; padding: 10px 0; }
  .dir-a .avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--accent-soft); border: 1px solid var(--accent-line); color: var(--text); font-size: 11px; display:flex; align-items:center; justify-content:center; font-weight:600; }

  /* ── Container queries: page reflows by ITS OWN inline size, not the viewport.
     Each artboard is a separate container, so the Resolución section actually
     demonstrates per-viewport behaviour. ── */

  /* Utility grid classes used by Budget / Guide / shell so they reflow too */
  .dir-a .cols-2       { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: flex-start; }
  .dir-a .cols-2-tight { display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px; align-items: flex-start; }
  .dir-a .cols-2-wide  { display: grid; grid-template-columns: 1fr 1.5fr; gap: 48px; align-items: flex-start; }
  .dir-a .shell-grid   { display: grid; grid-template-columns: 244px 1fr; height: 100%; }
  .dir-a .phase-strip  { display: grid; grid-template-columns: repeat(var(--n, 6), 1fr); gap: 8px; }

  @container page (max-width: 1280px) {
    .dir-a { --pad-x: calc(32px * var(--density-scale, 1)); --pad-y: calc(24px * var(--density-scale, 1)); }
    .dir-a .hero-donut { width: 180px; }
    .dir-a .hero-top { gap: 32px; }
    .dir-a .hero-breakdown { gap: 20px; }
  }
  @container page (max-width: 1024px) {
    .dir-a { --pad-x: calc(24px * var(--density-scale, 1)); --pad-y: calc(20px * var(--density-scale, 1)); }
    .dir-a .hero-top { gap: 24px; }
    .dir-a .hero-donut { width: 180px; }
    .dir-a .hero-breakdown { flex-basis: 100%; grid-template-columns: 1fr 1fr; gap: 32px; }
    .dir-a .hero-value { font-size: 52px; }
    .dir-a .page-title { font-size: 24px; }
    .dir-a .cols-2,
    .dir-a .cols-2-tight,
    .dir-a .cols-2-wide { grid-template-columns: 1fr; gap: 32px; }
    .dir-a .phase-strip { grid-template-columns: repeat(3, 1fr); }
    .dir-a .shell-grid  { grid-template-columns: 200px 1fr; }
  }
  @container page (max-width: 820px) {
    .dir-a { --pad-x: 18px; --pad-y: 16px; }
    .dir-a .hero-breakdown { grid-template-columns: 1fr; gap: 24px; }
    .dir-a .page-head { flex-wrap: wrap; }
    .dir-a .page-head .actions { width: 100%; }
    .dir-a .hero-value { font-size: 44px; }
    .dir-a .tbl th:nth-child(3), .dir-a .tbl td:nth-child(3) { display: none; }
    .dir-a .phase-strip { grid-template-columns: repeat(2, 1fr); }
    .dir-a .shell-grid  { grid-template-columns: 1fr; }
    .dir-a .shell-aside { display: none; }
  }
  `;
  document.head.appendChild(s);
}

// ── Topbar / app shell head ──────────────────────────────────────────────────
const A_NAV_ITEMS = [
  { id: "guide",  label: "Guía" },
  { id: "nw",     label: "Patrimonio" },
  { id: "budget", label: "Presupuesto" },
  { id: "close",  label: "Cierre mensual" },
  { id: "mov",    label: "Movimientos" },
];

function ATopbar({ active = "nw" }) {
  return (
    <div className="topbar">
      <div className="topnav-brand">
        <span className="topnav-brand-mark">MP</span>
        <div className="topnav-brand-text">
          <span className="topnav-brand-title">Moneyplanner</span>
          <span className="topnav-brand-sub">Coach financiero</span>
        </div>
      </div>
      <div className="topnav-divider" />
      <nav className="topnav-list" aria-label="Navegación principal">
        {A_NAV_ITEMS.map((it) => (
          <button key={it.id} className={"topnav-item " + (active === it.id ? "on" : "")}>{it.label}</button>
        ))}
      </nav>
      <div className="topnav-right">
        <button className="btn-ghost btn" style={{ fontSize: 12 }}>⌘K Buscar</button>
        <button className="btn btn-icon" aria-label="Notificaciones">◔</button>
        <div className="avatar">M</div>
      </div>
    </div>);

}

// ── Page header (eyebrow / title / meta / actions) ───────────────────────────
function APageHead({ eyebrow, title, meta = [], actions }) {
  return (
    <header className="page-head">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="page-title">{title}</h1>
        {meta.length > 0 &&
        <div className="page-meta">
            {meta.map((m, i) =>
          <React.Fragment key={i}>
                {i > 0 && <span className="dot" />}
                <span>{m}</span>
              </React.Fragment>
          )}
          </div>
        }
      </div>
      <div className="actions">{actions}</div>
    </header>);

}

function ASectHead({ title, count, sub, actions }) {
  return (
    <header className="sect-head">
      <div>
        <h2 className="sect-title">
          {title}
          {count !== undefined && <span className="sect-count"> · {count}</span>}
        </h2>
        {sub && <p className="sect-sub">{sub}</p>}
      </div>
      <div className="actions">{actions}</div>
    </header>);

}

// ── Page-level filters (titularidad / moneda / valoración / …) ──────────────
// Sits between page-head and content. Canonical place for "lenses" that change
// what the page is looking at, as opposed to actions which change/save data.
function AContextBar({ children }) {
  return <div className="context-bar">{children}</div>;
}
function AContextField({ label, children }) {
  return (
    <div className="context-field">
      <span className="context-field-label">{label}</span>
      {children}
    </div>
  );
}

// ── Inline date selector for the page-head meta ─────────────────────────────
// Lets the user "rewind" the page to a past date. Visually subtle (lives among
// the meta chips), but discoverable thanks to the caret.
const DATE_PRESETS = [
  { id: "today",    label: "Hoy",            days: 0 },
  { id: "yesterday",label: "Ayer",           days: 1 },
  { id: "1w",       label: "Hace 1 semana",  days: 7 },
  { id: "1m",       label: "Hace 1 mes",     days: 30 },
  { id: "3m",       label: "Hace 3 meses",   days: 90 },
  { id: "6m",       label: "Hace 6 meses",   days: 182 },
  { id: "1y",       label: "Hace 1 año",     days: 365 },
];
function ADateSelector({ value, onChange }) {
  // value: { presetId, customDate?: 'YYYY-MM-DD' }
  const [open, setOpen] = React.useState(false);
  const [custom, setCustom] = React.useState(value?.customDate ?? "");
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const off = (e) => { if (!ref.current || !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", off, true);
    return () => document.removeEventListener("pointerdown", off, true);
  }, [open]);
  const preset = DATE_PRESETS.find((p) => p.id === value?.presetId) ?? DATE_PRESETS[0];
  const label = value?.presetId === "custom"
    ? (value?.customDate ? new Date(value.customDate).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }) : "Fecha…")
    : preset.id === "today"
      ? "Hoy · 09:42"
      : preset.label;
  return (
    <span ref={ref} className="meta-picker-wrap">
      <button
        className="meta-picker"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{label}</span>
        <span className="caret">▾</span>
      </button>
      {open && (
        <div className="filter-popover" style={{ left: 0, minWidth: 220, marginTop: 6 }}>
          {DATE_PRESETS.map((p) => (
            <button
              key={p.id}
              className={(value?.presetId === p.id ? "on" : "")}
              onClick={() => { onChange({ presetId: p.id }); setOpen(false); }}
            >
              {p.label}
            </button>
          ))}
          <hr />
          <button className={value?.presetId === "custom" ? "on" : ""} onClick={() => onChange({ presetId: "custom", customDate: custom })}>
            Fecha personalizada…
          </button>
          {value?.presetId === "custom" && (
            <div className="filter-popover-custom">
              <input
                className="filter-ctrl"
                type="date"
                value={custom}
                onChange={(e) => { setCustom(e.target.value); onChange({ presetId: "custom", customDate: e.target.value }); }}
              />
            </div>
          )}
        </div>
      )}
    </span>
  );
}

// ── Net Worth view ───────────────────────────────────────────────────────────
// ── CompList — drillable list of categories (Activos or Pasivos) ─────────────
function CompList({ title, total, items, selectedCat, onCompClick }) {
  const sum = items.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div className="hero-comp-side">
      <div className="hero-comp-title">
        <span>{title}</span>
        <b>{fmtEUR(total ?? sum)}</b>
      </div>
      <div className="comp-list">
        {items.map((c, i) => {
          const pct = (c.value / sum) * 100;
          const isActive = c.label === selectedCat;
          return (
            <button key={i} type="button" className={"comp-row" + (isActive ? " row-active" : "")} onClick={() => onCompClick(c.label)}>
              <span className="comp-dot" style={{ background: `oklch(0.72 0.12 ${c.hue})` }} />
              <span className="comp-label">{c.label}</span>
              <span className="comp-val mono">{fmtEUR(c.value)} <span style={{ opacity: .5 }}>· {pct.toFixed(0)}%</span></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Interactive timeline (line + Y-axis + monthly delta bars + hover marker)
// Smooth-curve line via Catmull-Rom → cubic bezier so the timeline reads as a
// continuous trend rather than zig-zag.
function smoothLinePath(points, tension = 0.22) {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function AInteractiveChart({ data, h = 280, deltaH = 72 }) {
  const ref = React.useRef(null);
  const [hover, setHover] = React.useState(null);
  // Wider viewBox so when the SVG fills the container (~1200 px) the glyphs
  // and stroke widths don't end up stretched horizontally.
  const W = 1280, padL = 56, padR = 16, padT = 12, padB = 18, gap = 12;
  const lineH = h;
  const totalH = h + gap + deltaH;
  const vs = data.map((d) => d.v);
  const min = Math.min(...vs), max = Math.max(...vs);
  const range = max - min || 1;
  // Pretty-rounded Y ticks — 8 stops for denser horizontal grid
  const stops = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => min + range * (i / 7));
  const px = (i) => padL + (i / (data.length - 1)) * (W - padL - padR);
  const py = (v) => padT + (1 - (v - min) / range) * (lineH - padT - padB);
  const pts = data.map((d, i) => ({ x: px(i), y: py(d.v) }));

  // Monthly deltas: v[i] - v[i-1] ; first one is 0 (no previous)
  const deltas = data.map((d, i) => i === 0 ? 0 : d.v - data[i - 1].v);
  const maxDelta = Math.max(1, ...deltas.map(Math.abs));
  const dCenter = lineH + gap + deltaH / 2;
  const dyFor = (delta) => (delta / maxDelta) * ((deltaH / 2) - 4);

  const fmtCompact = (v) => {
    const abs = Math.abs(v);
    if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(".", ",")} M €`;
    if (abs >= 1_000) return `${(v / 1_000).toFixed(0)}k €`;
    return `${v.toFixed(0)} €`;
  };

  const linePath = smoothLinePath(pts);
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${lineH - padB} L ${pts[0].x} ${lineH - padB} Z`;

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round(((x - padL) / (W - padL - padR)) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, idx)));
  };
  const handleLeave = () => setHover(null);
  const hp = hover != null ? data[hover] : null;
  const hd = hover != null ? deltas[hover] : null;

  return (
    <div ref={ref} className="chart-wrap" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <svg width="100%" viewBox={`0 0 ${W} ${totalH}`} style={{ display: "block", height: "auto" }}>
        <defs>
          <linearGradient id="ac-grad-i" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis: 4 ticks with compact labels on the left gutter */}
        {stops.map((v, i) => {
          const y = py(v);
          return (
            <g key={i}>
              <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="currentColor" strokeOpacity={i === 0 ? 0.14 : 0.07} />
              <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="10" fill="currentColor" fillOpacity="0.45" fontFamily='"Geist Mono", monospace'>{fmtCompact(v)}</text>
            </g>
          );
        })}

        {/* Area + smoothed line */}
        <path d={areaPath} fill="url(#ac-grad-i)" />
        <path d={linePath} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Subtle dots at each data point */}
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x} cy={p.y} r={hover === i ? 0 : 2}
            fill="currentColor"
            fillOpacity="0.7"
          />
        ))}

        {/* Hover crosshair + emphasised marker */}
        {hp && (
          <g>
            <line x1={px(hover)} x2={px(hover)} y1={padT} y2={lineH + gap + deltaH - 4} stroke="currentColor" strokeOpacity="0.42" strokeDasharray="3 3" />
            <circle cx={px(hover)} cy={py(hp.v)} r={6} fill="var(--bg)" stroke="currentColor" strokeWidth="2.5" />
          </g>
        )}

        {/* Zero baseline of delta region */}
        <line x1={padL} x2={W - padR} y1={dCenter} y2={dCenter} stroke="currentColor" strokeOpacity="0.18" />

        {/* Monthly delta bars */}
        {deltas.map((delta, i) => {
          if (i === 0) return null;
          const x = px(i);
          const barW = (W - padL - padR) / data.length * 0.4;
          const dy = dyFor(delta);
          const isPos = delta >= 0;
          const color = isPos ? "var(--pos)" : "var(--neg)";
          return (
            <rect
              key={i}
              x={x - barW / 2}
              y={isPos ? dCenter - dy : dCenter}
              width={barW}
              height={Math.abs(dy) || 1}
              fill={color}
              fillOpacity={hover === i ? 1 : 0.62}
              rx={1.5}
            />
          );
        })}

        {/* X-axis labels at the very bottom */}
        {data.map((d, i) => (
          <text
            key={i}
            x={px(i)}
            y={totalH - 2}
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            fillOpacity={hover === i ? 0.95 : 0.5}
          >{d.m}</text>
        ))}
      </svg>

      {/* Tooltip — net worth + monthly delta */}
      {hp && (
        <div className="chart-tip" style={{ left: `${(px(hover) / W) * 100}%`, top: 0 }}>
          <div className="chart-tip-label">{hp.m} 2026</div>
          <div className="chart-tip-value">{fmtEUR(hp.v)}</div>
          {hover > 0 && (
            <div style={{ marginTop: 4, fontSize: 11, color: hd >= 0 ? "var(--pos)" : "var(--neg)", fontFamily: '"Geist Mono", monospace' }}>
              {hd >= 0 ? "+" : ""}{fmtEUR(hd)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Row kebab menu — contextual actions for a balance table row ─────────────
function ARowMenu({ name }) {
  const [open, setOpen] = React.useState(false);
  const [confirmingDelete, setConfirmingDelete] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) { setConfirmingDelete(false); return; }
    const off = (e) => { if (!ref.current || !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", off, true);
    return () => document.removeEventListener("pointerdown", off, true);
  }, [open]);
  return (
    <span ref={ref} className="row-menu-wrap" onClick={(e) => e.stopPropagation()}>
      <button
        className="btn-ghost btn"
        style={{ padding: "4px 6px" }}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Acciones · ${name}`}
      >⋯</button>
      {open && (
        <div className="row-menu" role="menu">
          <button onClick={() => setOpen(false)}>✎ Editar<kbd>E</kbd></button>
          <button onClick={() => setOpen(false)}>⎘ Duplicar</button>
          <button onClick={() => setOpen(false)}>↗ Ver movimientos</button>
          <button onClick={() => setOpen(false)}>📁 Archivar</button>
          <hr />
          <button
            className="danger"
            onClick={() => {
              if (confirmingDelete) { setOpen(false); }
              else setConfirmingDelete(true);
            }}
          >
            {confirmingDelete ? "⚠ Confirmar eliminación" : "🗑 Eliminar…"}
          </button>
        </div>
      )}
    </span>
  );
}

// ── Net Worth view ──────────────────────────────────────────────────────────
// ── Archived accounts popover — opens from the page-head meta link ──────────
const ARCHIVED_ACCOUNTS = [
  { id: 101, name: "Cuenta antigua ING",   subtype: "Liquidez · cerrada en 2024", archivedOn: "12 mar 2024" },
  { id: 102, name: "Depósito a plazo Bankia", subtype: "Inversión · vencido", archivedOn: "08 ene 2024" },
  { id: 103, name: "Préstamo personal",    subtype: "Pasivo · saldado", archivedOn: "22 nov 2023" },
];
function AArchivedLink() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const off = (e) => { if (!ref.current || !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", off, true);
    return () => document.removeEventListener("pointerdown", off, true);
  }, [open]);
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button
        className="btn btn-ghost"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{ fontSize: 12, gap: 6 }}
      >
        <span>Archivadas</span>
        <span style={{ color: "var(--faint)", fontFamily: '"Geist Mono", monospace' }}>{ARCHIVED_ACCOUNTS.length}</span>
      </button>
      {open && (
        <div className="row-menu" style={{ minWidth: 320, right: 0, left: "auto" }}>
          <div style={{ padding: "8px 10px 6px", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--faint)", fontWeight: 600 }}>
            Cuentas archivadas
          </div>
          {ARCHIVED_ACCOUNTS.map((acc) => (
            <div key={acc.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "var(--text)" }}>{acc.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{acc.subtype} · {acc.archivedOn}</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ font: "inherit", fontSize: 11.5, padding: "4px 10px", borderRadius: 999, border: "1px solid var(--accent-line)", background: "var(--accent-soft)", color: "var(--text)", cursor: "pointer" }}
              >
                Restaurar
              </button>
            </div>
          ))}
        </div>
      )}
    </span>
  );
}

function ANetWorthView({ onAdd }) {
  const [period, setPeriod] = useState("12m");
  const [side, setSide] = useState("assets"); // 'assets' | 'liabilities'
  const [ownership, setOwnership] = useState("all");
  const [currency, setCurrency] = useState("EUR");
  const [valueMode, setValueMode] = useState("nominal");
  const [asOf, setAsOf] = useState({ presetId: "today" });
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const a = NW_DATA;

  const assetCats = a.categories.filter((c) => c.kind === "asset");
  const liaCats = a.categories.filter((c) => c.kind === "liability");

  // Structural donut slices: capital propio + deuda respaldada + deuda no respaldada.
  // Together they sum to total assets.
  const structureSlices = NW_STRUCTURE;
  const compList = side === "assets" ? NW_COMPOSITION_ASSETS : NW_COMPOSITION_LIABILITIES;
  const compTotal = compList.reduce((s, d) => s + d.value, 0);
  const compActiveIdx = compList.findIndex((c) => c.label === selectedCat);

  // Reset selection when toggling sides
  const switchSide = (next) => {
    if (next === side) return;
    setSide(next);
    setSelectedCat(null);
  };

  // Demo "drill-down" timeline: when an item or category is selected, show a
  // synthesized history scaled from net worth. In the Vue codebase this maps
  // to useNetWorthPositionActivity / useNetWorthTimeline filtered selectors.
  const allItems = a.categories.flatMap((c) => c.items);
  const focusedItem = selectedItem != null ? allItems.find((i) => i.id === selectedItem) : null;
  // Reset selection across both lists; lookup goes in both.
  const allCats = [...NW_COMPOSITION_ASSETS, ...NW_COMPOSITION_LIABILITIES];
  const focusedCat = selectedCat != null ? allCats.find((c) => c.label === selectedCat) : null;
  const filterLabel = focusedItem ? focusedItem.name : focusedCat ? focusedCat.label : null;

  const timelineData = React.useMemo(() => {
    if (focusedItem) {
      const scale = Math.abs(focusedItem.value) / a.netWorth;
      const wiggle = 0.92 + ((focusedItem.id * 7) % 16) / 100;
      return NW_TIMELINE.map((p, i) => ({ m: p.m, v: Math.round(p.v * scale * (wiggle + i * 0.004)) }));
    }
    if (focusedCat) {
      const scale = focusedCat.value / a.netWorth;
      return NW_TIMELINE.map((p, i) => ({ m: p.m, v: Math.round(p.v * scale * (0.94 + i * 0.005)) }));
    }
    return NW_TIMELINE;
  }, [selectedItem, selectedCat]);

  const clearFilter = () => { setSelectedItem(null); setSelectedCat(null); };
  const onCompClick = (label) => {
    setSelectedItem(null);
    setSelectedCat(selectedCat === label ? null : label);
  };
  const onRowClick = (id) => {
    setSelectedCat(null);
    setSelectedItem(selectedItem === id ? null : id);
  };

  // When the user selects a category or a row, bring the chart into view so
  // they can see the filtered timeline. Use a fixed 80px headroom from the
  // top of the scroller — predictable result whether scrolling up or down.
  const chartRef = React.useRef(null);
  React.useEffect(() => {
    if (selectedItem == null && selectedCat == null) return;
    const el = chartRef.current;
    if (!el) return;
    // The .dir-a stage is the authoritative scroller for this design.
    const scroller = el.closest(".dir-a");
    if (!scroller) return;
    const sRect = scroller.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    // Target: chart-section top sits 80px below the top of the viewport.
    const top = scroller.scrollTop + (eRect.top - sRect.top) - 80;
    scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [selectedItem, selectedCat]);

  return (
    <>
      <ATopbar active="nw" />

      <div className="page">
        <APageHead
          title="Patrimonio"
          meta={[
            <ADateSelector value={asOf} onChange={setAsOf} />,
            "Base EUR",
          ]}
          actions={
          <>
              <AArchivedLink />
              <button className="btn btn-primary" onClick={onAdd}>+ Añadir cuenta</button>
            </>
          } />

        {/* Page-level filters — what the page is looking at */}
        <AContextBar>
          <AContextField label="Titularidad">
            <ASelectCtrl value={ownership} onChange={(v) => setOwnership(v)} options={[{ value: "all", label: "Todos" }, { value: "shared", label: "Compartida" }, { value: "marta", label: "Marta" }, { value: "alex", label: "Alex" }]} />
          </AContextField>
          <span className="context-divider" />
          <AContextField label="Moneda">
            <ASelectCtrl value={currency} onChange={(v) => setCurrency(v)} options={[{ value: "EUR", label: "EUR (€)" }, { value: "USD", label: "USD ($)" }, { value: "GBP", label: "GBP (£)" }]} />
          </AContextField>
          <span className="context-divider" />
          <AContextField label="Valoración">
            <div className="seg">
              <button className={valueMode === "nominal" ? "on" : ""} onClick={() => setValueMode("nominal")}>Nominal</button>
              <button className={valueMode === "real" ? "on" : ""} onClick={() => setValueMode("real")}>Real (inflación)</button>
            </div>
          </AContextField>
        </AContextBar>

        {/* Hero — net worth narrative + composition (Activos | Donut | Pasivos) */}
        <section className="sect">
          <div className="hero">
            <div className="hero-top">
              <div className="hero-headline">
                <p className="eyebrow" style={{ color: "var(--muted)", margin: 0 }}>Patrimonio neto</p>
                <div className="hero-value mono" style={{ fontFamily: "Geist" }}>{fmtEUR(a.netWorth)}</div>
                <div className="hero-delta">
                  <span>
                    <span className="pos mono">{fmtEUR(a.monthlyDelta.value, { signed: true })}</span>
                    <span className="pos mono" style={{ marginLeft: 6 }}>({fmtPct(a.monthlyDelta.pct)})</span>
                    <span style={{ marginLeft: 6 }}>este mes</span>
                  </span>
                  <span style={{ color: "var(--faint)" }}>·</span>
                  <span>
                    <span className="pos mono">{fmtEUR(a.ytdDelta.value, { signed: true })}</span>
                    <span className="pos mono" style={{ marginLeft: 6 }}>({fmtPct(a.ytdDelta.pct)})</span>
                    <span style={{ marginLeft: 6 }}>YTD</span>
                  </span>
                </div>
              </div>
              <div className="hero-donut">
                <Donut
                  data={structureSlices}
                  size={200}
                  thickness={14}
                  centerLabel="Capital propio"
                  centerValue={`${Math.round((a.netWorth / a.assets) * 100)}%`}
                />
              </div>
              <div className="hero-breakdown">
                <CompList
                  title="Activos"
                  total={a.assets}
                  items={NW_COMPOSITION_ASSETS}
                  selectedCat={selectedCat}
                  onCompClick={onCompClick}
                />
                <CompList
                  title="Pasivos"
                  total={a.liabilities}
                  items={NW_COMPOSITION_LIABILITIES}
                  selectedCat={selectedCat}
                  onCompClick={onCompClick}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Timeline — interactive (hover marker + tooltip; reflects filter) */}
        <section className="sect" ref={chartRef}>
          <ASectHead
            title="Evolución"
            sub={filterLabel ? `Filtrando: ${filterLabel}` : "Patrimonio neto en el tiempo"}
            actions={
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {filterLabel &&
              <button className="btn btn-ghost" onClick={clearFilter} style={{ fontSize: 12 }}>✕ Quitar filtro</button>
              }
                <div className="seg">
                  {["3m", "12m", "3a", "Todo"].map((p) =>
                <button key={p} className={period === p ? "on" : ""} onClick={() => setPeriod(p)}>{p}</button>
                )}
                </div>
              </div>
            } />

          <AInteractiveChart data={timelineData} />
        </section>

        {/* Balance — assets and liabilities, grouped by category */}
        <section className="sect">
          <ASectHead
            title="Balance"
            count={`${assetCats.length + liaCats.length} categorías`}
            sub="Activos y pasivos por categoría"
          />

          {/* Combined balance table — rows are clickable; selected row drives the chart above */}
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: "42%" }}>Cuenta</th>
                <th>Subcategoría</th>
                <th>Titular</th>
                <th className="num">Valor</th>
                <th style={{ width: 36 }}></th>
              </tr>
            </thead>
            <tbody>
              {assetCats.map((cat) =>
              <React.Fragment key={cat.id}>
                  <tr className="grp-row">
                    <td colSpan={3}><span className="grp-name"><span className="grp-kind grp-kind-asset">Activos</span>{cat.label}</span></td>
                    <td className="num"><span className="grp-total">{fmtEUR(cat.total)}</span></td>
                    <td></td>
                  </tr>
                  {cat.items.map((it) => {
                    const isActive = selectedItem === it.id;
                    return (
                      <tr key={it.id} className={"clickable" + (isActive ? " row-active" : "")} onClick={() => onRowClick(it.id)}>
                        <td>
                          <div className="name">
                            <div className="swatch" />
                            <div className="nameMain">{it.name}</div>
                          </div>
                        </td>
                        <td style={{ color: "var(--muted)" }}>{it.subcat}</td>
                        <td style={{ color: "var(--muted)" }}>{it.owner}</td>
                        <td className="num mono account-value">
                          {it.currencyOriginal && (
                            <span style={{ color: "var(--faint)", fontSize: 11.5, marginRight: 8 }}>
                              ({new Intl.NumberFormat("es-ES").format(it.valueOriginal)} {it.currencyOriginal})
                            </span>
                          )}
                          {fmtEUR(it.value)}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}><ARowMenu name={it.name} /></td>
                      </tr>);
                  })}
                </React.Fragment>
              )}
              {liaCats.map((cat) =>
              <React.Fragment key={cat.id}>
                  <tr className="grp-row">
                    <td colSpan={3}><span className="grp-name"><span className="grp-kind grp-kind-liability">Pasivos</span>{cat.label}</span></td>
                    <td className="num"><span className="grp-total">−{fmtEUR(cat.total)}</span></td>
                    <td></td>
                  </tr>
                  {cat.items.map((it) => {
                    const isActive = selectedItem === it.id;
                    return (
                      <tr key={it.id} className={"clickable" + (isActive ? " row-active" : "")} onClick={() => onRowClick(it.id)}>
                        <td>
                          <div className="name">
                            <div className="swatch lia" />
                            <div className="nameMain">{it.name}</div>
                          </div>
                        </td>
                        <td style={{ color: "var(--muted)" }}>{it.subcat}</td>
                        <td style={{ color: "var(--muted)" }}>{it.owner}</td>
                        <td className="num mono account-value account-value-neg">
                          {it.currencyOriginal && (
                            <span style={{ color: "var(--faint)", fontSize: 11.5, marginRight: 8 }}>
                              ({new Intl.NumberFormat("es-ES").format(it.valueOriginal)} {it.currencyOriginal})
                            </span>
                          )}
                          {fmtEUR(it.value)}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}><ARowMenu name={it.name} /></td>
                      </tr>);
                  })}
                </React.Fragment>
              )}
            </tbody>
            <tfoot>
              <tr className="tbl-foot">
                <td colSpan={3}>Patrimonio neto</td>
                <td className="num mono">{fmtEUR(a.netWorth)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </section>
      </div>
    </>);

}

// ── Add-asset modal (compact centered dialog) ────────────────────────────────
function AAddAssetSheet({ onClose }) {
  return (
    <>
      <ATopbar active="nw" />
      <div className="page" aria-hidden="true" style={{ opacity: 0.45 }}>
        <APageHead title="Patrimonio" meta={["Hoy · 09:42", "Base EUR"]} actions={<button className="btn btn-primary">+ Añadir cuenta</button>} />
        <div style={{ height: 280, background: "repeating-linear-gradient(180deg, var(--line) 0 1px, transparent 1px 14px)", opacity: .5 }} />
      </div>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="sheet-wrap">
        <div className="sheet">
          <div className="sheet-head">
            <div>
              <p className="eyebrow">Nuevo · Cuenta</p>
              <h2 className="page-title" style={{ fontSize: 22, marginTop: 4 }}>Añadir cuenta</h2>
              <div className="page-meta" style={{ marginTop: 6 }}>
                <span>Borrador automático</span>
                <span className="dot" />
                <span>Visible para Marta · Alex</span>
              </div>
            </div>
            <button className="btn btn-icon" onClick={onClose} aria-label="Cerrar">✕</button>
          </div>

          <div className="sheet-body">
            <div className="form" style={{ gridTemplateColumns: "1fr" }}>
              <div className="field">
                <span className="field-label">Nombre</span>
                <input className="input" defaultValue="Plan de pensiones MyInvestor" />
              </div>
              <div className="field">
                <span className="field-label">Categoría</span>
                <input className="input" defaultValue="Inversiones · Plan de pensiones" />
              </div>
            </div>
            <div className="form" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="field">
                <span className="field-label">Titular</span>
                <input className="input" defaultValue="Compartida" />
              </div>
              <div className="field">
                <span className="field-label">Valoración</span>
                <div className="field-row">
                  <input className="input mono" defaultValue="14.800,00" />
                  <span className="picker">EUR ▾</span>
                </div>
              </div>
            </div>
            <div className="form" style={{ gridTemplateColumns: "1fr" }}>
              <div className="field">
                <span className="field-label">Nota</span>
                <input className="input" defaultValue="Aportación mensual de 200 € · Renta variable global indexada" />
              </div>
              <div className="field">
                <span className="field-label">Movimiento contable</span>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <span className="chip active">Vincular a "Aportaciones"</span>
                  <span className="chip">No vincular</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sheet-foot">
            <button className="btn btn-ghost" onClick={onClose}>Descartar</button>
            <div className="actions">
              <button className="btn" onClick={onClose}>Guardar borrador</button>
              <button className="btn btn-primary" onClick={onClose}>Añadir al patrimonio</button>
            </div>
          </div>
        </div>
      </div>
    </>);

}

// ── System primitives: Hero, KPI, Stepper, KindChip ─────────────────────────
// Patterns abstracted from repeated inline JSX so each view consumes the same
// canonical building block. The bare visual is in CSS; these components are
// purely structural shells.

function AHero({ eyebrow, value, delta, children }) {
  return (
    <div className="hero-headline">
      {eyebrow && <p className="eyebrow" style={{ color: "var(--muted)", margin: 0 }}>{eyebrow}</p>}
      {value !== undefined && (
        <div className="hero-value mono" style={{ fontFamily: "Geist" }}>{value}</div>
      )}
      {delta && delta.length > 0 && (
        <div className="hero-delta">
          {delta.map((d, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: "var(--faint)" }}>·</span>}
              <span>
                <span className={`mono ${d.tone || "neutral"}`} style={{ color: d.tone === "pos" ? "var(--pos)" : d.tone === "neg" ? "var(--neg)" : undefined }}>{d.value}</span>
                {d.label && <span style={{ marginLeft: 6 }}>{d.label}</span>}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

function AKPI({ label, value, meta, tone }) {
  const color = tone === "pos" ? "var(--pos)" : tone === "neg" ? "var(--neg)" : undefined;
  return (
    <div className="kpi">
      <p className="kpi-label">{label}</p>
      <div className="kpi-value mono" style={color ? { color } : undefined}>{value}</div>
      {meta && <div className="kpi-meta">{meta}</div>}
    </div>
  );
}

// Tones for chips: 'pos' | 'neg' | 'neutral' | 'grade-A'..'grade-E'
const KIND_CHIP_TONE = {
  pos: { color: "var(--pos)",  border: "var(--pos-soft)" },
  neg: { color: "var(--neg)",  border: "var(--neg-soft)" },
  neutral: { color: "var(--muted)", border: "var(--line)" },
};
function AKindChip({ tone = "neutral", children, style, ...rest }) {
  const t = KIND_CHIP_TONE[tone] || KIND_CHIP_TONE.neutral;
  return (
    <span className="chip" style={{ color: t.color, borderColor: t.border, ...style }} {...rest}>
      {children}
    </span>
  );
}

// Generic stepper / phase strip. Each step: { id, label, status, meta?, grade?, accent? }
// status: 'done' | 'current' | 'pending'
function AStepper({ steps, activeId, onChange, eyebrowPrefix = "Paso" }) {
  return (
    <div className="phase-strip" style={{ "--n": steps.length }}>
      {steps.map((s, i) => {
        const isCurrent = activeId ? s.id === activeId : s.status === "current";
        const isDone = s.status === "done";
        const accent = s.accent || (isDone || isCurrent ? "var(--accent)" : "var(--line)");
        const opacity = isDone || isCurrent ? 1 : 0.55;
        const inner = (
          <div style={{ paddingBottom: 14, borderTop: `2px solid ${accent}`, paddingTop: 14, opacity, textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: isCurrent ? accent : "var(--faint)", fontWeight: 600 }}>
                {eyebrowPrefix} {i + 1}
              </span>
              {s.badge}
            </div>
            <div style={{ fontSize: 13, fontWeight: isCurrent ? 600 : 400, marginBottom: 2 }}>{s.label}</div>
            {s.meta && <div style={{ fontSize: 11, color: "var(--faint)", fontFamily: '"Geist Mono", monospace' }}>{s.meta}</div>}
          </div>
        );
        return onChange ? (
          <button key={s.id} type="button" style={{ font: "inherit", border: 0, background: "transparent", padding: 0, color: "var(--text)", cursor: "pointer" }} onClick={() => onChange(s.id)}>
            {inner}
          </button>
        ) : (
          <div key={s.id}>{inner}</div>
        );
      })}
    </div>
  );
}

// ── ASelectCtrl — custom select that respects dark mode ─────────────────────
// Drop-in for <select className="filter-ctrl"> in the filter bar and context bar.
// Renders a button that opens a styled popover (no native OS dropdown).
function ASelectCtrl({ value, onChange, options, style }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const off = (e) => { if (!ref.current || !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", off, true);
    return () => document.removeEventListener("pointerdown", off, true);
  }, [open]);
  const selected = options.find((o) => (o.value ?? o) === value) ?? options[0];
  const label = selected?.label ?? selected?.value ?? selected;
  return (
    <span ref={ref} style={{ position:"relative", display:"inline-flex", ...style }}>
      <button
        type="button"
        className="filter-ctrl"
        style={{ paddingRight:28 }}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {label}
      </button>
      {open && (
        <div className="filter-popover" style={{ top:"calc(100% + 4px)", left:0, minWidth:"100%" }} role="listbox">
          {options.map((o) => {
            const v = o.value ?? o;
            const l = o.label ?? o.value ?? o;
            return (
              <button
                key={v}
                className={value === v ? "on" : ""}
                role="option"
                aria-selected={value === v}
                onClick={() => { onChange(v); setOpen(false); }}
              >{l}</button>
            );
          })}
        </div>
      )}
    </span>
  );
}

Object.assign(window, { ANetWorthView, AAddAssetSheet, ATopbar, APageHead, ASectHead, AContextBar, AContextField, AHero, AKPI, AKindChip, AStepper, ASelectCtrl });