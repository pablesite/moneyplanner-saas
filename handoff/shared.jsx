// shared.jsx — sample data, formatters, shared CSS that both directions key off of

const fmtEUR = (n, opts = {}) => {
  const { decimals = 0, signed = false } = opts;
  const sign = signed && n > 0 ? "+" : "";
  return sign + new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n) + " €";
};

const fmtPct = (n, opts = {}) => {
  const { decimals = 1, signed = true } = opts;
  const sign = signed && n > 0 ? "+" : "";
  return sign + new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n) + "%";
};

// Realistic Net Worth data — household balance sheet, EUR
const NW_DATA = {
  updatedAt: "Hoy · 09:42",
  baseCurrency: "EUR",
  netWorth: 287_420,
  assets: 384_180,
  liabilities: 96_760,
  monthlyDelta: { value: 2_840, pct: 1.0 },
  ytdDelta: { value: 18_640, pct: 6.9 },
  categories: [
    {
      id: "liquidity",
      label: "Liquidez",
      kind: "asset",
      total: 28_640,
      items: [
        { id: 1, name: "Cuenta corriente BBVA",  owner: "Compartida", subcat: "Cuenta corriente", value: 8_240,  currency: "EUR" },
        { id: 2, name: "Ahorro Trade Republic",  owner: "Marta",      subcat: "Ahorro remunerado", value: 14_400, currency: "EUR" },
        { id: 3, name: "Cuenta dólares Wise",    owner: "Alex",       subcat: "Multimoneda",       value: 5_600,  currency: "EUR", valueOriginal: 6_000, currencyOriginal: "USD" },
      ],
    },
    {
      id: "investments",
      label: "Inversiones",
      kind: "asset",
      total: 142_540,
      items: [
        { id: 4, name: "Cartera indexada MyInvestor", owner: "Compartida", subcat: "Fondos indexados",   value: 88_120, currency: "EUR" },
        { id: 5, name: "Plan de pensiones Indexa",    owner: "Marta",      subcat: "Plan de pensiones",   value: 32_180, currency: "EUR" },
        { id: 6, name: "Acciones individuales",       owner: "Alex",       subcat: "Renta variable",      value: 22_240, currency: "EUR" },
      ],
    },
    {
      id: "realestate",
      label: "Inmobiliario",
      kind: "asset",
      total: 198_000,
      items: [
        { id: 7, name: "Vivienda habitual", owner: "Compartida", subcat: "Vivienda habitual", value: 198_000, currency: "EUR" },
      ],
    },
    {
      id: "furniture",
      label: "Mobiliario",
      kind: "asset",
      total: 15_000,
      items: [
        { id: 8, name: "Renault Captur 2022", owner: "Compartida", subcat: "Vehículo", value: 15_000, currency: "EUR" },
      ],
    },
    {
      id: "mortgage",
      label: "Hipoteca",
      kind: "liability",
      total: 84_320,
      items: [
        { id: 9, name: "Hipoteca vivienda habitual", owner: "Compartida", subcat: "Hipoteca vivienda habitual", value: -84_320, currency: "EUR" },
      ],
    },
    {
      id: "loans",
      label: "Préstamos",
      kind: "liability",
      total: 12_440,
      items: [
        { id: 10, name: "Préstamo coche",  owner: "Compartida", subcat: "Préstamo personal", value: -8_240, currency: "EUR" },
        { id: 11, name: "Tarjeta revolving", owner: "Alex",     subcat: "Crédito revolving", value: -4_200, currency: "EUR" },
      ],
    },
  ],
};

// Structural slices of assets: equity + backed debt + unbacked debt. Sum = total assets.
// Hues align with the unified semantic palette:
//   equity   148 (--pos) · backed 45 (grade D) · unbacked 24 (--neg)
const NW_STRUCTURE = [
  { key: "equity",   label: "Capital propio",      value: 287_420, hue: 148 },
  { key: "backed",   label: "Deuda respaldada",    value: 84_320,  hue: 45  },
  { key: "unbacked", label: "Deuda no respaldada", value: 12_440,  hue: 24  },
];

// Asset categories (sum = total assets)
const NW_COMPOSITION_ASSETS = [
  { label: "Inmobiliario",  value: 198_000, hue: 178 },
  { label: "Inversiones",   value: 142_540, hue: 220 },
  { label: "Liquidez",      value: 28_640,  hue: 264 },
  { label: "Mobiliario",    value: 15_000,  hue: 30 },
];

// Liability categories (sum = total liabilities)
const NW_COMPOSITION_LIABILITIES = [
  { label: "Hipoteca",   value: 84_320, hue: 30 },
  { label: "Préstamos",  value: 12_440, hue: 0  },
];

// Donut composition: legacy alias used by some screens. Same as NW_COMPOSITION_ASSETS.
const NW_COMPOSITION = NW_COMPOSITION_ASSETS;

// Timeline points (last 12 months) — €
const NW_TIMELINE = [
  { m: "Jun", v: 261_300 },
  { m: "Jul", v: 263_800 },
  { m: "Ago", v: 265_120 },
  { m: "Sep", v: 268_900 },
  { m: "Oct", v: 271_400 },
  { m: "Nov", v: 269_840 },
  { m: "Dic", v: 274_200 },
  { m: "Ene", v: 277_510 },
  { m: "Feb", v: 280_140 },
  { m: "Mar", v: 282_420 },
  { m: "Abr", v: 284_580 },
  { m: "May", v: 287_420 },
];

// SVG donut helper
function Donut({
  data, total, size = 200, thickness = 18, accent, activeIdx = -1,
  totalLabel = "Total",
  centerLabel,         // optional override for the eyebrow line
  centerValue,         // optional override for the big number (e.g. "75%")
}) {
  const [hoveredIdx, setHoveredIdx] = React.useState(-1);
  const cx = size / 2, cy = size / 2;
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  let off = 0;
  const sum = data.reduce((s, d) => s + d.value, 0);
  // Hover wins over the prop-driven activeIdx so the center reflects
  // whatever slice the user is pointing at right now.
  const effectiveIdx = hoveredIdx >= 0 ? hoveredIdx : activeIdx;
  const hasOverride = centerLabel !== undefined || centerValue !== undefined;
  const eyebrow = effectiveIdx >= 0
    ? data[effectiveIdx].label
    : hasOverride ? (centerLabel ?? totalLabel) : totalLabel;
  const big = effectiveIdx >= 0
    ? fmtEUR(data[effectiveIdx].value)
    : hasOverride ? (centerValue ?? fmtEUR(total ?? sum)) : fmtEUR(total ?? sum);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:"block" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth={thickness} />
      {data.map((d, i) => {
        const frac = d.value / sum;
        const dash = frac * C;
        const dim = effectiveIdx >= 0 && effectiveIdx !== i;
        const thicker = effectiveIdx === i ? thickness + 4 : thickness;
        const seg = (
          <circle key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={d.color || `oklch(0.74 0.13 ${d.hue})`}
            strokeOpacity={dim ? 0.18 : 1}
            strokeWidth={thicker}
            strokeDasharray={`${dash} ${C - dash}`}
            strokeDashoffset={-off}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="butt"
            style={{ cursor: "default", transition: "stroke-width .12s, stroke-opacity .12s" }}
            pointerEvents="visibleStroke"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx((cur) => (cur === i ? -1 : cur))}
          />
        );
        off += dash;
        return seg;
      })}
      <g style={{ pointerEvents: "none" }}>
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.6" style={{textTransform:"uppercase", letterSpacing:"0.08em"}}>{eyebrow}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" fontSize="22" fontWeight="600" fill="currentColor" fontFamily='"Geist Mono", monospace'>{big}</text>
      </g>
    </svg>
  );
}

// Sparkline / area chart helper
function AreaChart({ data, w = 760, h = 200, accent = "currentColor", padding = 16 }) {
  const xs = data.map((_, i) => i);
  const vs = data.map(d => d.v);
  const min = Math.min(...vs);
  const max = Math.max(...vs);
  const range = max - min || 1;
  const px = i => padding + (i / (xs.length - 1)) * (w - 2 * padding);
  const py = v => padding + (1 - (v - min) / range) * (h - 2 * padding - 20);
  const path = data.map((d, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(d.v)}`).join(" ");
  const area = `${path} L ${px(data.length - 1)} ${h - padding} L ${px(0)} ${h - padding} Z`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:"block"}}>
      <defs>
        <linearGradient id="ac-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* y gridlines */}
      {[0.25, 0.5, 0.75].map((f, i) => (
        <line key={i} x1={padding} x2={w - padding} y1={padding + f * (h - 2 * padding - 20)} y2={padding + f * (h - 2 * padding - 20)} stroke="currentColor" strokeOpacity="0.07" />
      ))}
      <path d={area} fill="url(#ac-grad)" />
      <path d={path} fill="none" stroke={accent} strokeWidth="1.75" />
      {data.map((d, i) => (
        <text key={i} x={px(i)} y={h - 4} textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.55">{d.m}</text>
      ))}
    </svg>
  );
}

// Stripe placeholder for images
function Placeholder({ label = "image", w = "100%", h = 120, radius = 8 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: radius,
      background: "repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 10px)",
      color: "rgba(127,127,127,0.4)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:'"Geist Mono", monospace', fontSize: 11, letterSpacing:"0.06em", textTransform:"uppercase",
    }}>
      <span style={{background: "var(--surface,#fff)", padding:"2px 8px", borderRadius: 4, color:"currentColor"}}>{label}</span>
    </div>
  );
}

Object.assign(window, { fmtEUR, fmtPct, NW_DATA, NW_COMPOSITION, NW_COMPOSITION_ASSETS, NW_COMPOSITION_LIABILITIES, NW_STRUCTURE, NW_TIMELINE, Donut, AreaChart, Placeholder });
