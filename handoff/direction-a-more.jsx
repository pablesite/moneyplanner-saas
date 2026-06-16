// direction-a-more.jsx — extends Direction A to Budget Dashboard, Data Input, Guide, AppShell.
// Reuses the SAME header DSL + same single-elevation surface conventions.

const { useState: useStateAM } = React;

// Sample data ────────────────────────────────────────────────────────────────
// Budget shape mirrors the codebase: each section (income/expense) groups by
// category, which in turn groups subcategories, each subcategory containing
// concrete entries (partidas). Every level exposes planned vs executed YTD.
const BUDGET = {
  fiscalYear: 2026,
  monthIdx: 4, // May (0-indexed)
  months: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
  // YTD execution by-month (last 12)
  ytdIncome:  [5400, 5400, 5670, 6100, 5550, 0, 0, 0, 0, 0, 0, 0],
  ytdExpense: [4180, 4250, 4380, 4640, 4720, 0, 0, 0, 0, 0, 0, 0],
  income: {
    label: "Ingresos",
    categories: [
      {
        key: "salario", label: "Salario", planned: 64_200, executed: 26_750, unbudgeted: 0,
        history: [5350, 5350, 5350, 5350, 5350, 0, 0, 0, 0, 0, 0, 0],
        subs: [
          { key: "sueldo",   label: "Sueldo neto",  planned: 56_400, executed: 23_500, unbudgeted: 0,
            history: [4700, 4700, 4700, 4700, 4700, 0,0,0,0,0,0,0],
            items: [
              { id:1, name: "Nómina Marta", owner: "Marta", planned: 35_400, executed: 14_750, history: [2950,2950,2950,2950,2950,0,0,0,0,0,0,0] },
              { id:2, name: "Nómina Alex",  owner: "Alex",  planned: 21_000, executed: 8_750,  history: [1750,1750,1750,1750,1750,0,0,0,0,0,0,0] },
            ]
          },
          { key: "extra", label: "Pagas extra", planned: 7_800, executed: 3_250, unbudgeted: 0,
            history: [0,0,0,0,3250,0,0,0,0,0,0,0],
            items: [
              { id:3, name: "Paga julio",     owner: "Marta", planned: 2_950, executed: 0,    history: [0,0,0,0,0,0,0,0,0,0,0,0] },
              { id:4, name: "Paga diciembre", owner: "Marta", planned: 2_950, executed: 0,    history: [0,0,0,0,0,0,0,0,0,0,0,0] },
              { id:5, name: "Bonus Alex",     owner: "Alex",  planned: 1_900, executed: 3_250, history: [0,0,0,0,3250,0,0,0,0,0,0,0] },
            ]
          },
        ],
      },
      {
        key: "inversiones", label: "Inversiones", planned: 1_600, executed: 112, unbudgeted: 0,
        history: [0, 0, 0, 0, 112, 0,0,0,0,0,0,0],
        subs: [
          { key: "dividendos", label: "Dividendos", planned: 1_280, executed: 112, unbudgeted: 0,
            history: [0,0,0,0,112,0,0,0,0,0,0,0],
            items: [
              { id:6, name: "Dividendos Q2", owner: "Compartida", planned: 320, executed: 112, history: [0,0,0,0,112,0,0,0,0,0,0,0] },
              { id:7, name: "Dividendos Q3", owner: "Compartida", planned: 320, executed: 0,   history: [0,0,0,0,0,0,0,0,0,0,0,0] },
              { id:8, name: "Dividendos Q4", owner: "Compartida", planned: 320, executed: 0,   history: [0,0,0,0,0,0,0,0,0,0,0,0] },
              { id:9, name: "Dividendos Q1", owner: "Compartida", planned: 320, executed: 0,   history: [0,0,0,0,0,0,0,0,0,0,0,0] },
            ]
          },
          { key: "intereses", label: "Intereses ahorro", planned: 320, executed: 0, unbudgeted: 0,
            history: [0,0,0,0,0,0,0,0,0,0,0,0],
            items: [{ id:10, name: "Trade Republic interés", owner: "Marta", planned: 320, executed: 0, history: [0,0,0,0,0,0,0,0,0,0,0,0] }]
          },
        ],
      },
      {
        key: "otros", label: "Otros", planned: 2_600, executed: 1_258, unbudgeted: 408,
        history: [200,200,0,0,858,0,0,0,0,0,0,0],
        subs: [
          { key: "freelance", label: "Servicios profesionales", planned: 2_400, executed: 850, unbudgeted: 0,
            history: [200,200,0,0,450,0,0,0,0,0,0,0],
            items: [{ id:11, name: "Freelance UX", owner: "Alex", planned: 2_400, executed: 850, history: [200,200,0,0,450,0,0,0,0,0,0,0] }]
          },
          { key: "fiscal", label: "Fiscal", planned: 200, executed: 408, unbudgeted: 408,
            history: [0,0,0,0,408,0,0,0,0,0,0,0],
            items: [{ id:12, name: "Devolución IRPF", owner: "Compartida", planned: 200, executed: 408, history: [0,0,0,0,408,0,0,0,0,0,0,0] }]
          },
        ],
      },
    ],
  },
  expense: {
    label: "Gastos",
    categories: [
      {
        key: "vivienda", label: "Vivienda", planned: 10_800, executed: 4_580, unbudgeted: 0,
        history: [890, 920, 905, 935, 930, 0,0,0,0,0,0,0],
        subs: [
          { key: "hipoteca", label: "Hipoteca", planned: 8_640, executed: 3_600, unbudgeted: 0,
            history: [720,720,720,720,720,0,0,0,0,0,0,0],
            items: [{ id:21, name: "Hipoteca cuota", owner: "Compartida", planned: 720, executed: 720, period: "Mensual", history: [720,720,720,720,720,0,0,0,0,0,0,0] }]
          },
          { key: "suministros", label: "Suministros", planned: 1_680, executed: 720, unbudgeted: 0,
            history: [140,148,142,150,140,0,0,0,0,0,0,0],
            items: [
              { id:22, name: "Electricidad", owner: "Compartida", planned: 84, executed: 92, period: "Mensual", history: [82,94,90,96,88,0,0,0,0,0,0,0] },
              { id:23, name: "Gas",          owner: "Compartida", planned: 24, executed: 28, period: "Mensual", history: [26,28,27,29,28,0,0,0,0,0,0,0] },
              { id:24, name: "Agua",         owner: "Compartida", planned: 16, executed: 18, period: "Mensual", history: [16,17,17,18,18,0,0,0,0,0,0,0] },
              { id:25, name: "Internet",     owner: "Compartida", planned: 16, executed: 18, period: "Mensual", history: [16,18,18,18,18,0,0,0,0,0,0,0] },
            ]
          },
          { key: "comunidad", label: "Comunidad", planned: 480, executed: 260, unbudgeted: 0,
            history: [30,52,43,65,70,0,0,0,0,0,0,0],
            items: [{ id:26, name: "Comunidad", owner: "Compartida", planned: 40, executed: 52, period: "Mensual", history: [30,52,43,65,70,0,0,0,0,0,0,0] }]
          },
        ],
      },
      {
        key: "alimentacion", label: "Alimentación", planned: 7_200, executed: 3_410, unbudgeted: 92,
        history: [620, 640, 690, 720, 740, 0,0,0,0,0,0,0],
        subs: [
          { key: "supermercado", label: "Supermercado", planned: 6_480, executed: 3_060, unbudgeted: 0,
            history: [560,580,610,650,660,0,0,0,0,0,0,0],
            items: [{ id:31, name: "Compra mensual", owner: "Compartida", planned: 540, executed: 612, period: "Mensual", history: [560,580,610,650,660,0,0,0,0,0,0,0] }]
          },
          { key: "fresco", label: "Frescos", planned: 720, executed: 350, unbudgeted: 92,
            history: [60,60,80,70,80,0,0,0,0,0,0,0],
            items: [{ id:32, name: "Mercado", owner: "Compartida", planned: 60, executed: 70, period: "Mensual", history: [60,60,80,70,80,0,0,0,0,0,0,0] }]
          },
        ],
      },
      {
        key: "ocio", label: "Ocio", planned: 3_840, executed: 1_488, unbudgeted: 256,
        history: [220, 240, 240, 268, 520, 0,0,0,0,0,0,0],
        subs: [
          { key: "restaurantes", label: "Restaurantes", planned: 2_640, executed: 920, unbudgeted: 0,
            history: [180,200,180,180,180,0,0,0,0,0,0,0],
            items: [{ id:41, name: "Cenas fuera", owner: "Compartida", planned: 220, executed: 184, period: "Mensual", history: [180,200,180,180,180,0,0,0,0,0,0,0] }]
          },
          { key: "cultura", label: "Cultura", planned: 600, executed: 312, unbudgeted: 0,
            history: [40,40,60,72,100,0,0,0,0,0,0,0],
            items: [{ id:42, name: "Cine y eventos", owner: "Compartida", planned: 50, executed: 78, period: "Mensual", history: [40,40,60,72,100,0,0,0,0,0,0,0] }]
          },
          { key: "viajes", label: "Viajes", planned: 600, executed: 256, unbudgeted: 256,
            history: [0,0,0,16,240,0,0,0,0,0,0,0],
            items: [{ id:43, name: "Escapadas", owner: "Compartida", planned: 50, executed: 256, period: "Puntual", history: [0,0,0,16,240,0,0,0,0,0,0,0] }]
          },
        ],
      },
      {
        key: "transporte", label: "Transporte", planned: 1_920, executed: 760, unbudgeted: 0,
        history: [140, 145, 150, 160, 165, 0,0,0,0,0,0,0],
        subs: [
          { key: "combustible", label: "Combustible", planned: 1_440, executed: 580, unbudgeted: 0,
            history: [110,115,115,120,120,0,0,0,0,0,0,0],
            items: [{ id:51, name: "Gasolina", owner: "Compartida", planned: 120, executed: 145, period: "Mensual", history: [110,115,115,120,120,0,0,0,0,0,0,0] }]
          },
          { key: "publico", label: "Transporte público", planned: 480, executed: 180, unbudgeted: 0,
            history: [30,30,35,40,45,0,0,0,0,0,0,0],
            items: [{ id:52, name: "Bonometro", owner: "Marta", planned: 40, executed: 45, period: "Mensual", history: [30,30,35,40,45,0,0,0,0,0,0,0] }]
          },
        ],
      },
      {
        key: "servicios", label: "Servicios", planned: 1_080, executed: 420, unbudgeted: 0,
        history: [84,84,84,84,84,0,0,0,0,0,0,0],
        subs: [
          { key: "suscripciones", label: "Suscripciones", planned: 1_080, executed: 420, unbudgeted: 0,
            history: [84,84,84,84,84,0,0,0,0,0,0,0],
            items: [{ id:61, name: "Streaming + cloud", owner: "Compartida", planned: 84, executed: 84, period: "Mensual", history: [84,84,84,84,84,0,0,0,0,0,0,0] }]
          },
        ],
      },
      {
        key: "deudas", label: "Deudas", planned: 2_520, executed: 1_050, unbudgeted: 0,
        history: [210,210,210,210,210,0,0,0,0,0,0,0],
        subs: [
          { key: "prestamo", label: "Préstamo personal", planned: 2_520, executed: 1_050, unbudgeted: 0,
            history: [210,210,210,210,210,0,0,0,0,0,0,0],
            items: [{ id:71, name: "Préstamo coche", owner: "Compartida", planned: 210, executed: 210, period: "Mensual", history: [210,210,210,210,210,0,0,0,0,0,0,0] }]
          },
        ],
      },
      {
        key: "salud", label: "Salud", planned: 720, executed: 132, unbudgeted: 132,
        history: [0,0,72,0,60,0,0,0,0,0,0,0],
        subs: [
          { key: "consultas", label: "Consultas", planned: 720, executed: 132, unbudgeted: 132,
            history: [0,0,72,0,60,0,0,0,0,0,0,0],
            items: [{ id:81, name: "Médicos · análisis", owner: "Compartida", planned: 60, executed: 0, period: "Puntual", history: [0,0,0,0,0,0,0,0,0,0,0,0] }]
          },
        ],
      },
    ],
  },
};
function sumExpect(arr, key) { return arr.reduce((s, r) => s + (r[key] || 0), 0); }

// Suggestions (auto from last N months execution) — what we'd recommend
// adjusting the budget to. Mirrors the codebase's budget_suggestions endpoint.
const BUDGET_SUGGESTIONS = {
  windowMonths: 3,
  rows: [
    { kind: "expense", category: "Alimentación", sub: "Supermercado", planned: 540,   suggested: 612,   reason: "Has gastado en promedio 612 €/mes (planned 540)." },
    { kind: "expense", category: "Vivienda",     sub: "Suministros",  planned: 140,   suggested: 156,   reason: "Suministros han subido ~11% en los últimos 3 meses." },
    { kind: "expense", category: "Ocio",         sub: "Restaurantes", planned: 220,   suggested: 184,   reason: "Has gastado menos de lo previsto consistentemente." },
    { kind: "income",  category: "Otros",        sub: "Servicios profesionales", planned: 200, suggested: 280, reason: "Tu freelance está generando más de lo previsto." },
  ],
};

const GUIDE = {
  phaseIdx: 2, // current phase index (0-based) → "Fondo de emergencia"
  phases: [
    { id: 1, label: "Deuda",                  hint: "Eliminar deuda mala",       score: 100, status: "done" },
    { id: 2, label: "Flujo de caja",          hint: "Superávit mensual estable", score: 68,  status: "done" },
    { id: 3, label: "Fondo de emergencia",    hint: "Colchón de seguridad",      score: 35,  status: "current" },
    { id: 4, label: "Salud patrimonial",      hint: "Balancear activos/pasivos", score: 18,  status: "pending" },
    { id: 5, label: "Independencia financiera", hint: "Activos productivos",     score: 6,   status: "pending" },
  ],
  tasks: [
    { id:1, title: "Define el objetivo del fondo",        meta: "6 meses de gastos esenciales · ~21 600 €", done: true },
    { id:2, title: "Automatiza una transferencia mensual", meta: "Cada día 1 · 850 € a cuenta remunerada", done: true },
    { id:3, title: "Mueve la liquidez a 3,7% interés",     meta: "Trade Republic · sin ataduras", done: false },
    { id:4, title: "Revisa cobertura de seguros",          meta: "Hogar · vida · salud", done: false },
    { id:5, title: "Plan de imprevistos anual",            meta: "Categoría dedicada en el presupuesto", done: false },
  ],
};

// Grade A-E from a 0-100 score. Same thresholds as scoreVisuals.ts in the repo.
function gradeFromScore(score) {
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  if (score >= 20) return "D";
  return "E";
}

// Unified grade scale — A and E sit on the same L/C as --pos/--neg, with
// hues stepping evenly. Keeps the whole app reading from one colour family.
const GRADE_HUE  = { A: 148, B: 115, C: 80, D: 45, E: 24 };
function gradeColor(g)      { return `oklch(0.74 0.13 ${GRADE_HUE[g]})`; }
function gradeSoftBg(g)     { return `oklch(0.74 0.13 ${GRADE_HUE[g]} / 0.14)`; }
function gradeSoftBorder(g) { return `oklch(0.74 0.13 ${GRADE_HUE[g]} / 0.42)`; }

// ── Budget Dashboard ────────────────────────────────────────────────────────

// Determine the colour/tone of an execution progress bar.
//   income:  more = better (good); under-execution warn under 70%
//   expense: more = worse (warn 100–120%, danger >120%); on target = good
function budgetTone(kind, ratio) {
  if (kind === "income") {
    if (ratio >= 0.9) return "good";
    if (ratio >= 0.7) return "warn";
    return "neutral";
  }
  // expense: lower is better — being well under planned is good
  if (ratio > 1.2) return "danger";
  if (ratio > 1.0) return "warn";
  return "good";
}

// Tiny sparkline of a 12-month history. Highlights the active month dot.
function ASparkline({ data, activeIdx = -1 }) {
  const upto = data.filter((v, i) => i <= (activeIdx >= 0 ? Math.max(activeIdx, 4) : 11));
  const vals = data;
  const max = Math.max(1, ...vals);
  const W = 64, H = 18, n = vals.length;
  const px = (i) => (i / (n - 1)) * W;
  const py = (v) => H - 2 - (v / max) * (H - 4);
  // Only draw through the last non-zero month so the flat tail isn't noise.
  let last = 0;
  vals.forEach((v, i) => { if (v > 0) last = i; });
  if (last === 0) {
    return <svg className="sparkline" viewBox={`0 0 ${W} ${H}`}><line x1="0" y1={H-2} x2={W} y2={H-2} stroke="currentColor" strokeOpacity="0.25" /></svg>;
  }
  const pts = vals.slice(0, last + 1).map((v, i) => `${i === 0 ? "M" : "L"} ${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");
  return (
    <svg className="sparkline" viewBox={`0 0 ${W} ${H}`}>
      <path d={pts} />
      {activeIdx >= 0 && activeIdx <= last && (
        <circle className="dot-now" cx={px(activeIdx)} cy={py(vals[activeIdx])} r="2" />
      )}
    </svg>
  );
}

// Progress bar with optional "100% tick" for bars that can exceed 1.
function ABudgetBar({ kind, planned, executed, showTick = true }) {
  if (!planned) {
    return (
      <div className="bdg-bar-cell">
        <div className="prog prog-neutral"><i style={{ width: 0 }} /></div>
        <div className="bdg-bar-meta"><span style={{ color: "var(--faint)" }}>—</span><span /></div>
      </div>
    );
  }
  const ratio = executed / planned;
  const tone = budgetTone(kind, ratio);
  // Allow up to 130% before clamping the visible bar; show a tick at 100%.
  const cap = Math.max(1.3, ratio);
  const pct = Math.min(1, ratio / cap) * 100;
  const overflow = ratio > 1;
  const tickPos = (1 / cap) * 100;
  return (
    <div className="bdg-bar-cell">
      <div className={`prog prog-${tone} ${overflow ? "prog-over" : ""}`}>
        <i style={{ width: `${pct}%` }} />
        {showTick && cap > 1 && <span className="prog-tick" style={{ left: `${tickPos}%` }} />}
      </div>
      <div className="bdg-bar-meta">
        <span>{(ratio * 100).toFixed(0)}%</span>
        <span className={overflow ? (kind === "expense" ? "bdg-diff-neg" : "bdg-diff-pos") : ""}>
          {overflow ? "+" : ""}{fmtEUR(executed - planned)}
        </span>
      </div>
    </div>
  );
}

// One row in the budget hierarchy. Level = "cat" | "sub" | "item".
function ABudgetRow({ level, kind, name, planned, executed, sub, period, expanded, onToggle, editable, history, activeIdx, unbudgeted }) {
  const [val, setVal] = React.useState(executed ?? 0);
  React.useEffect(() => { setVal(executed ?? 0); }, [executed]);
  return (
    <div className={`bdg-row bdg-row-${level}`} onClick={onToggle}>
      <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 6 }}>
        <span className={`bdg-chev ${level === "cat" ? "bdg-chev-cat" : ""}`}>{onToggle ? (expanded ? "▾" : "▸") : ""}</span>
        <div style={{ minWidth: 0 }}>
          {level === "cat" && kind && (
            <span className={`bdg-kind ${kind === "income" ? "bdg-kind-asset" : "bdg-kind-liability"}`}>
              {kind === "income" ? "Ingresos" : "Gastos"}
            </span>
          )}
          <span className="bdg-name">{name}</span>
          {unbudgeted > 0 && (
            <span className="pill-unbudgeted" title={`${fmtEUR(unbudgeted)} ejecutado sin presupuestar`}>
              +{fmtEUR(unbudgeted)} fuera
            </span>
          )}
          {sub && <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 1 }}>{sub}</div>}
        </div>
      </div>
      <div className={`bdg-num ${level === "cat" ? "bdg-num-strong" : "bdg-num-muted"}`}>
        {planned > 0 ? fmtEUR(planned) : <span style={{ color: "var(--faint)" }}>—</span>}
        {period && <div className="bdg-pct">{period}</div>}
      </div>
      <ABudgetBar kind={kind} planned={planned} executed={executed} />
      <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", justifyContent: "center" }}>
        {history ? <ASparkline data={history} activeIdx={activeIdx} /> : null}
      </div>
      <div className={`bdg-num ${level === "cat" ? "bdg-num-strong" : ""}`} onClick={(e) => e.stopPropagation()}>
        {editable ? (
          <input
            className="bdg-input"
            type="text"
            value={new Intl.NumberFormat("es-ES").format(val)}
            onChange={(e) => {
              const n = Number(e.target.value.replace(/\./g, "").replace(/,/g, "."));
              if (Number.isFinite(n)) setVal(n);
            }}
            title="Editar importe ejecutado"
          />
        ) : (
          executed > 0 ? fmtEUR(executed) : <span style={{ color: "var(--faint)" }}>—</span>
        )}
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        {level === "item" && <ARowMenu name={name} />}
      </div>
    </div>
  );
}

function ABudgetView() {
  const b = BUDGET;
  const [view, setView] = useStateAM("annual");           // annual | exec | sugg
  const [scope, setScope] = useStateAM("month");          // ytd | month
  const [month, setMonth] = useStateAM(b.monthIdx);       // active month when scope==="month"
  const [showInfo, setShowInfo] = useStateAM(true);       // show suggestions banner
  const [expanded, setExpanded] = useStateAM({ "expense:vivienda": true });

  // Execution value of a node for the current scope:
  //   month → that month's figure from history; ytd → accumulated executed.
  const execFor = (node) => scope === "month" ? (node.history?.[month] ?? 0) : node.executed;
  // Planned value scaled to the current scope.
  const plannedFor = (node) => scope === "month" ? node.planned / 12 : node.planned * (b.monthIdx + 1) / 12;
  const activeIdx = scope === "month" ? month : b.monthIdx;

  const totalIncomePlanned = sumExpect(b.income.categories, "planned");
  const totalIncomeExec    = sumExpect(b.income.categories, "executed");
  const totalExpensePlanned = sumExpect(b.expense.categories, "planned");
  const totalExpenseExec   = sumExpect(b.expense.categories, "executed");

  const toggle = (key) => setExpanded((e) => ({ ...e, [key]: !e[key] }));
  const isExpanded = (key) => !!expanded[key];

  const renderSection = (kindKey, section) => {
    const kind = kindKey; // "income" | "expense"
    const totalPlanned = sumExpect(section.categories, "planned");
    const totalExec    = sumExpect(section.categories, "executed");
    const totalUnbudgeted = sumExpect(section.categories, "unbudgeted");
    const secPlanned = plannedFor({ planned: totalPlanned });
    const secExec = scope === "month"
      ? section.categories.reduce((s, c) => s + (c.history?.[month] ?? 0), 0)
      : totalExec;
    return (
      <div>
        <ASectHead
          title={section.label}
          count={`${section.categories.length} categorías · ${fmtEUR(totalPlanned)} previsto · ${fmtEUR(totalExec)} ejecutado`}
          actions={(
            <div style={{ display:"flex", gap:8 }}>
              <button className="btn btn-ghost" style={{ fontSize: 12 }}>+ Añadir partida</button>
            </div>
          )}
        />
        <div>
          {section.categories.map((cat) => {
            const catKey = `${kind}:${cat.key}`;
            const opened = isExpanded(catKey);
            return (
              <React.Fragment key={cat.key}>
                <ABudgetRow
                  level="cat"
                  kind={kind}
                  name={cat.label}
                  planned={plannedFor(cat)}
                  executed={execFor(cat)}
                  history={cat.history}
                  activeIdx={activeIdx}
                  unbudgeted={scope === "ytd" ? cat.unbudgeted : 0}
                  expanded={opened}
                  onToggle={() => toggle(catKey)}
                />
                {opened && cat.subs.map((sub) => {
                  const subKey = `${catKey}:${sub.key}`;
                  const openSub = isExpanded(subKey);
                  return (
                    <React.Fragment key={sub.key}>
                      <ABudgetRow
                        level="sub"
                        kind={kind}
                        name={sub.label}
                        planned={plannedFor(sub)}
                        executed={execFor(sub)}
                        history={sub.history}
                        activeIdx={activeIdx}
                        unbudgeted={scope === "ytd" ? sub.unbudgeted : 0}
                        expanded={openSub}
                        onToggle={() => toggle(subKey)}
                      />
                      {openSub && sub.items.map((it) => (
                        <ABudgetRow
                          key={it.id}
                          level="item"
                          kind={kind}
                          name={it.name}
                          sub={it.owner}
                          period={it.period || (sub.key === "extra" ? "Anual" : "")}
                          planned={plannedFor(it)}
                          executed={execFor(it)}
                          history={it.history}
                          activeIdx={activeIdx}
                          editable
                        />
                      ))}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
        {/* Section total row — same hierarchy as the categories above */}
        <div className="bdg-row bdg-row-cat" style={{ paddingTop: 14, borderTop: "1px solid var(--line-strong)", borderBottom: 0, cursor: "default" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="bdg-chev" />
            <span className="bdg-name" style={{ fontSize: 14, fontWeight: 600 }}>Total {section.label.toLowerCase()}</span>
            {scope === "ytd" && totalUnbudgeted > 0 && (
              <span className="pill-unbudgeted" title={`${fmtEUR(totalUnbudgeted)} ejecutado sin presupuestar`}>
                +{fmtEUR(totalUnbudgeted)} fuera
              </span>
            )}
          </div>
          <div className="bdg-num bdg-num-strong">{fmtEUR(secPlanned)}</div>
          <ABudgetBar kind={kind} planned={secPlanned} executed={secExec} />
          <div />
          <div className="bdg-num bdg-num-strong">{fmtEUR(secExec)}</div>
          <div />
        </div>
      </div>
    );
  };

  return (
    <>
      <ATopbar active="budget" />

      <div className="page">
        <APageHead
          title="Presupuesto"
          meta={[`FY ${b.fiscalYear}`, `Mes activo · ${b.months[b.monthIdx]}`, "Base EUR"]}
          actions={(
            <>
              <button className="btn btn-ghost" style={{ fontSize: 12 }}>{BUDGET_SUGGESTIONS.rows.length} sugerencias</button>
              <button className="btn btn-primary">+ Nueva partida</button>
            </>
          )}
        />

        <AContextBar>
          <AContextField label="Año fiscal">
            <select className="filter-ctrl" defaultValue={String(b.fiscalYear)}>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </AContextField>
          <span className="context-divider" />
          <AContextField label="Titularidad">
            <ASelectCtrl value="all" onChange={() => {}} options={[{ value: "all", label: "Todos" }, { value: "shared", label: "Compartida" }, { value: "marta", label: "Marta" }, { value: "alex", label: "Alex" }]} />
          </AContextField>
          <span className="context-divider" />
          <AContextField label="Vista">
            <div className="seg">
              <button className={view === "annual" ? "on" : ""} onClick={() => setView("annual")}>Anual</button>
              <button className={view === "exec" ? "on" : ""}   onClick={() => setView("exec")}>Ejecución</button>
              <button className={view === "sugg" ? "on" : ""}   onClick={() => setView("sugg")}>Sugerencias</button>
            </div>
          </AContextField>
          <span className="context-divider" />
          <AContextField label="Importes">
            <div className="seg">
              <button className={scope === "month" ? "on" : ""} onClick={() => setScope("month")}>Por mes</button>
              <button className={scope === "ytd" ? "on" : ""}   onClick={() => setScope("ytd")}>YTD</button>
            </div>
          </AContextField>
          {scope === "month" && (
            <>
              <span className="context-divider" />
              <AContextField label="Mes">
                <div className="month-step">
                  <button onClick={() => setMonth((mo) => Math.max(0, mo - 1))} disabled={month === 0} aria-label="Mes anterior">‹</button>
                  <span className="month-label">{b.months[month]} {b.fiscalYear}</span>
                  <button onClick={() => setMonth((mo) => Math.min(b.monthIdx, mo + 1))} disabled={month >= b.monthIdx} aria-label="Mes siguiente">›</button>
                </div>
              </AContextField>
            </>
          )}
        </AContextBar>

        {/* Hero — three KPIs with their own progress bars */}
        <section className="sect">
          <div className="cols-2-tight">
            <div>
              <p className="eyebrow" style={{ color: "var(--muted)" }}>Balance previsto del año</p>
              <div className="hero-value mono">{fmtEUR(totalIncomePlanned - totalExpensePlanned)}</div>
              <div className="hero-delta">
                <span><span className="pos mono">{fmtEUR(totalIncomePlanned)}</span> <span style={{ marginLeft: 4 }}>ingresos</span></span>
                <span style={{ color: "var(--faint)" }}>·</span>
                <span><span className="neg mono" style={{ color: "var(--neg)" }}>{fmtEUR(totalExpensePlanned)}</span> <span style={{ marginLeft: 4 }}>gastos</span></span>
                <span style={{ color: "var(--faint)" }}>·</span>
                <span>
                  <span className="mono" style={{ color: "var(--text)" }}>
                    {((1 - totalExpensePlanned/totalIncomePlanned)*100).toFixed(0)}%
                  </span>
                  <span style={{ marginLeft: 4 }}>tasa de ahorro</span>
                </span>
              </div>

              <div className="kpis" style={{ marginTop: 24 }}>
                <div className="kpi">
                  <p className="kpi-label">Ingresos · YTD</p>
                  <div className="kpi-value mono">{fmtEUR(totalIncomeExec)}</div>
                  <div className="kpi-meta">{((totalIncomeExec / (totalIncomePlanned * (b.monthIdx+1)/12))*100).toFixed(0)}% de lo previsto a {b.months[b.monthIdx]}</div>
                </div>
                <div className="kpi">
                  <p className="kpi-label">Gastos · YTD</p>
                  <div className="kpi-value mono">{fmtEUR(totalExpenseExec)}</div>
                  <div className="kpi-meta">{((totalExpenseExec / (totalExpensePlanned * (b.monthIdx+1)/12))*100).toFixed(0)}% de lo previsto a {b.months[b.monthIdx]}</div>
                </div>
                <div className="kpi">
                  <p className="kpi-label">Residual mes</p>
                  <div className="kpi-value mono">{fmtEUR(b.ytdIncome[b.monthIdx] - b.ytdExpense[b.monthIdx])}</div>
                  <div className="kpi-meta">{b.months[b.monthIdx]} · {fmtEUR(b.ytdIncome[b.monthIdx])} − {fmtEUR(b.ytdExpense[b.monthIdx])}</div>
                </div>
              </div>
            </div>

            <div>
              <p className="eyebrow" style={{ color: "var(--muted)" }}>Ejecución mensual · {b.fiscalYear}</p>
              <div style={{ height: 12 }} />
              <YearStrip
                months={b.months}
                income={b.ytdIncome}
                expense={b.ytdExpense}
                currentIdx={b.monthIdx}
              />
              <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 12, color: "var(--muted)" }}>
                <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "var(--pos)", marginRight: 6 }} />Ingresos</span>
                <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "var(--neg)", marginRight: 6 }} />Gastos</span>
                <span style={{ marginLeft: "auto", color: "var(--faint)", fontSize: 11 }}>FY {b.fiscalYear}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Suggestions banner — collapsible, links to suggestions view */}
        {showInfo && view !== "sugg" && (
          <section className="sect">
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px",
              border: "1px solid var(--accent-line)",
              background: "var(--accent-soft)",
              borderRadius: 10,
            }}>
              <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700 }}>
                {BUDGET_SUGGESTIONS.rows.length} sugerencias
              </span>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>
                Basadas en los últimos {BUDGET_SUGGESTIONS.windowMonths} meses de movimientos
              </span>
              <button
                className="btn btn-ghost"
                style={{ marginLeft: "auto", fontSize: 12 }}
                onClick={() => setView("sugg")}
              >Revisar →</button>
              <button
                className="btn btn-icon"
                onClick={() => setShowInfo(false)}
                aria-label="Cerrar"
              >✕</button>
            </div>
          </section>
        )}

        {/* Annual / Execution view: hierarchical income + expense table */}
        {(view === "annual" || view === "exec") && (
          <>
            {/* Column header row matching the bdg-row grid */}
            <section className="sect">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1fr) 110px minmax(140px, 1.4fr) 70px 110px 28px",
                  gap: 16,
                  padding: "6px 6px 10px",
                  borderBottom: "1px solid var(--line-strong)",
                  fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase",
                  color: "var(--faint)", fontWeight: 600,
                }}
              >
                <span>Partida</span>
                <span style={{ textAlign: "right" }}>Previsto {scope === "month" ? "/ mes" : "YTD"}</span>
                <span>Ejecución</span>
                <span style={{ textAlign: "center", fontSize: 10 }}>Evol.</span>
                <span style={{ textAlign: "right" }}>{scope === "month" ? `${b.months[month]}` : "Ejecutado"}</span>
                <span />
              </div>
              {renderSection("income", b.income)}
            </section>
            <section className="sect">
              {renderSection("expense", b.expense)}
            </section>
          </>
        )}

        {/* Suggestions view */}
        {view === "sugg" && (
          <section className="sect">
            <ASectHead
              title="Sugerencias"
              sub={`Generadas a partir de tu ejecución de los últimos ${BUDGET_SUGGESTIONS.windowMonths} meses`}
            />
            {BUDGET_SUGGESTIONS.rows.map((r, i) => {
              const diff = r.suggested - r.planned;
              const up = diff > 0;
              return (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1.6fr) 140px 140px auto",
                  gap: 16, alignItems: "center",
                  padding: "14px 6px",
                  borderBottom: "1px solid var(--line)",
                }}>
                  <div>
                    <div style={{ fontSize: 14 }}>{r.category} · {r.sub}</div>
                    <div style={{ fontSize: 11, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 2 }}>
                      {r.kind === "income" ? "Ingreso" : "Gasto"}
                    </div>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.reason}</div>
                  <div className="bdg-num">
                    <div className="bdg-num-muted">{fmtEUR(r.planned)}</div>
                    <div className="bdg-pct">previsto</div>
                  </div>
                  <div className="bdg-num">
                    <div className="bdg-num-strong">{fmtEUR(r.suggested)}</div>
                    <div className={`bdg-pct ${up ? "bdg-diff-pos" : "bdg-diff-neg"}`}>{up ? "+" : ""}{fmtEUR(diff)}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost" style={{ fontSize: 12 }}>Ignorar</button>
                    <button className="btn btn-primary" style={{ fontSize: 12 }}>Aplicar</button>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </>);
}

// Mini chart for budget year strip
function YearStrip({ months, income, expense, currentIdx }) {
  const max = Math.max(...income, ...expense, 6500);
  return (
    <svg viewBox="0 0 720 200" width="100%" height="200" style={{display:"block", overflow:"visible"}}>
      {months.map((m, i) => {
        const x = (i / months.length) * 720 + 16;
        const colW = (720 / months.length) - 20;
        const ih = (income[i] / max) * 140;
        const eh = (expense[i] / max) * 140;
        const baseY = 170;
        const isCurrent = i === currentIdx;
        const isFuture = i > currentIdx;
        return (
          <g key={i} opacity={isFuture ? 0.35 : 1}>
            <rect x={x} y={baseY - ih} width={colW/2 - 2} height={ih} fill="var(--pos)" rx="2" />
            <rect x={x + colW/2 + 2} y={baseY - eh} width={colW/2 - 2} height={eh} fill="var(--neg)" rx="2" opacity={0.7} />
            <text x={x + colW/2} y={190} textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity={isCurrent ? 1 : 0.5}>{m}</text>
            {isCurrent && <line x1={x - 2} x2={x + colW + 2} y1={baseY + 4} y2={baseY + 4} stroke="var(--pos)" strokeWidth="1.5" />}
          </g>
        );
      })}
    </svg>
  );
}

// ── Guide / Phase detail ────────────────────────────────────────────────────
function AGuideView() {
  const [filter, setFilter] = useStateAM("pending");
  const g = GUIDE;
  const current = g.phases[g.phaseIdx];
  const currentGrade = gradeFromScore(current.score);
  const currentColor = gradeColor(currentGrade);

  return (
    <>
      <ATopbar active="guide" />

      <div className="page">
        <APageHead
          title={`Guía · ${current.label}`}
          meta={[`Fase ${current.id} de ${g.phases.length}`, current.hint, "Actualizado hoy"]}
          actions={(
            <>
              <button className="btn btn-ghost" style={{fontSize:12}}>Saltar fase</button>
              <button className="btn btn-primary">Marcar fase completada</button>
            </>
          )}
        />

        {/* Phase progress strip — colored top hairline + grade letter pill */}
        <section className="sect">
          <div className="phase-strip" style={{"--n": g.phases.length}}>
            {g.phases.map((p, i) => {
              const isCurrent = p.status === "current";
              const isPast    = p.status === "done";
              const grade = gradeFromScore(p.score);
              const color = gradeColor(grade);
              // current = full saturation; past = full color too; future = muted
              const opacity = isCurrent || isPast ? 1 : 0.5;
              return (
                <div key={p.id} style={{
                  paddingBottom: 14,
                  borderTop: `2px solid ${isCurrent || isPast ? color : "var(--line)"}`,
                  paddingTop: 14,
                  opacity,
                }}>
                  <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8}}>
                    <span style={{fontSize:10.5, letterSpacing:"0.12em", textTransform:"uppercase", color: isCurrent ? color : "var(--faint)", fontWeight:600}}>
                      Fase {p.id}
                    </span>
                    <span style={{
                      display:"inline-flex", alignItems:"center", justifyContent:"center",
                      width:22, height:22, borderRadius:6, fontSize:11, fontWeight:700, letterSpacing:"0.02em",
                      color, background: gradeSoftBg(grade), border: `1px solid ${gradeSoftBorder(grade)}`,
                    }}>{grade}</span>
                  </div>
                  <div style={{fontSize:13, fontWeight: isCurrent ? 600 : 400, marginBottom:2}}>{p.label}</div>
                  <div style={{fontSize:11, color:"var(--faint)", fontFamily:'"Geist Mono", monospace'}}>{p.score}/100</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Score panel + tasks side by side */}
        <section className="sect">
          <div className="cols-2-wide">
            <div>
              <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:8}}>
                <p className="eyebrow" style={{color:"var(--muted)", margin:0}}>Puntuación de fase</p>
                <span style={{
                  display:"inline-flex", alignItems:"center", justifyContent:"center",
                  width:22, height:22, borderRadius:6, fontSize:11, fontWeight:700,
                  color: currentColor, background: gradeSoftBg(currentGrade), border: `1px solid ${gradeSoftBorder(currentGrade)}`,
                }}>{currentGrade}</span>
              </div>
              <div className="hero-value mono" style={{fontSize:64, color: currentColor}}>{current.score}<span style={{fontSize:24, color:"var(--muted)"}}>/100</span></div>
              <p style={{color:"var(--muted)", fontSize:13, maxWidth:380, lineHeight:1.55, margin:"12px 0 0"}}>
                Estás construyendo tu colchón. Te quedan 3 acciones para subir de D a C: trasladar la liquidez a remunerada, revisar seguros y definir el plan de imprevistos.
              </p>
              <div style={{marginTop:24, height: 4, background:"var(--line)", borderRadius:2, overflow:"hidden"}}>
                <div style={{height:"100%", width:`${current.score}%`, background: currentColor}} />
              </div>
              <div style={{display:"flex", justifyContent:"space-between", marginTop:8, fontSize:11, color:"var(--faint)", textTransform:"uppercase", letterSpacing:"0.12em"}}>
                <span>Fase {current.id}</span>
                <span>{100-current.score}% restante</span>
              </div>
            </div>

            <div>
              <ASectHead
                title="Acciones"
                count={`${g.tasks.filter(t=>!t.done).length} pendientes · ${g.tasks.filter(t=>t.done).length} hechas`}
                actions={(
                  <div className="seg">
                    {[["pending","Pendientes"],["all","Todas"],["done","Hechas"]].map(([id,l]) => (
                      <button key={id} className={filter===id?"on":""} onClick={()=>setFilter(id)}>{l}</button>
                    ))}
                  </div>
                )}
              />
              <div>
                {g.tasks
                  .filter(t => filter==="all" ? true : filter==="done" ? t.done : !t.done)
                  .map(t => (
                  <div key={t.id} style={{display:"flex", alignItems:"flex-start", gap:14, padding:"16px 0", borderBottom:"1px solid var(--line)"}}>
                    <span style={{
                      width:18, height:18, borderRadius:"50%",
                      border: t.done ? `1.5px solid ${currentColor}` : "1.5px solid var(--line-strong)",
                      background: t.done ? gradeSoftBg(currentGrade) : "transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      flexShrink:0, marginTop:2, fontSize:10,
                      color: currentColor,
                    }}>
                      {t.done && "✓"}
                    </span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14, fontWeight:500, color: t.done ? "var(--muted)" : "var(--text)", textDecoration: t.done ? "line-through" : "none"}}>{t.title}</div>
                      <div style={{fontSize:12, color:"var(--muted)", marginTop:2}}>{t.meta}</div>
                    </div>
                    <button className="btn btn-ghost" style={{fontSize:12}}>{t.done ? "Reabrir" : "Abrir"}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// ── AppShell — kept as alias; the top navigation is now built into every page.
function AAppShell() {
  return <ANetWorthView onAdd={()=>{}} />;
}

// ── Data Input (form view, using the unified form style) ────────────────────
function ADataInputView() {
  return (
    <>
      <ATopbar active="nw" />

      <div className="page">
        <APageHead
          eyebrow="Datos · 2026"
          title="Entradas anuales"
          meta={["12 meses · EUR", "Compartida", "Borrador automático"]}
          actions={(
            <>
              <button className="btn btn-ghost">Importar CSV</button>
              <button className="btn">Plantilla</button>
              <button className="btn btn-primary">+ Nueva entrada</button>
            </>
          )}
        />

        <section className="sect">
          <ASectHead
            title="Ingresos anuales"
            count="6 entradas"
            sub="Distribuye anual o mensualmente; el sistema reparte automáticamente"
          />

          <div className="form" style={{gridTemplateColumns:"1.5fr 1fr 1fr 0.7fr 32px", columnGap:24}}>
            {/* header row */}
            <div className="field" style={{padding:"6px 0"}}>
              <span className="field-label">Nombre</span>
            </div>
            <div className="field" style={{padding:"6px 0"}}>
              <span className="field-label">Categoría</span>
            </div>
            <div className="field" style={{padding:"6px 0"}}>
              <span className="field-label">Titular</span>
            </div>
            <div className="field" style={{padding:"6px 0"}}>
              <span className="field-label" style={{textAlign:"right", display:"block"}}>Importe anual</span>
            </div>
            <div className="field" style={{padding:"6px 0"}} />
            {/* rows */}
            {[
              ["Nómina Marta",   "Salario · Sueldo neto",      "Marta",      "35.400,00"],
              ["Nómina Alex",    "Salario · Sueldo neto",      "Alex",       "28.800,00"],
              ["Dividendos",     "Inversiones · Renta variable","Compartida", "1.280,00"],
              ["Freelance UX",   "Otros · Servicios profesionales","Alex",   "2.400,00"],
              ["Devolución IRPF","Otros · Fiscal",             "Compartida", "520,00"],
            ].map((r, i) => (
              <React.Fragment key={i}>
                <div className="field"><input className="input" defaultValue={r[0]} /></div>
                <div className="field"><input className="input" defaultValue={r[1]} /></div>
                <div className="field">
                  <div className="field-row">
                    <span className="picker">{r[2]} ▾</span>
                  </div>
                </div>
                <div className="field"><input className="input mono" style={{textAlign:"right"}} defaultValue={r[3]} /></div>
                <div className="field" style={{justifyItems:"end"}}>
                  <button className="btn btn-ghost" style={{padding:"4px 6px"}}>⋯</button>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:14, marginTop:0, borderTop:"1px solid var(--line-strong)"}}>
            <button className="btn btn-ghost">+ Añadir fila</button>
            <div style={{fontSize:13, color:"var(--muted)"}}>Total ingresos · <span className="mono" style={{color:"var(--text)", marginLeft:6}}>{fmtEUR(68_400)}</span></div>
          </div>
        </section>
      </div>
    </>
  );
}

// ── Cierre mensual (monthly close) ──────────────────────────────────────────
const MONTHLY_CLOSE = {
  month: "Mayo 2026",
  fiscalYear: 2026,
  steps: [
    { id: "liquidity", label: "Liquidez",  status: "done"    },
    { id: "income",    label: "Ingresos",  status: "done"    },
    { id: "expense",   label: "Gastos",    status: "current" },
    { id: "result",    label: "Resultado", status: "pending" },
  ],
  summary: {
    liquidityStart: 28_640,
    liquidityEnd: 30_820,
    incomePlanned: 5_870,
    incomeExecuted: 6_200,
    expensePlanned: 4_120,
    expenseExecuted: 4_020,
    residual: 2_180,
  },
  // Expense reconciliation rows (the active step)
  expenseRows: [
    { name: "Hipoteca",        cat: "Vivienda",     planned: 720, executed: 720, status: "matched" },
    { name: "Suministros",     cat: "Vivienda",     planned: 180, executed: 196, status: "over" },
    { name: "Supermercado",    cat: "Alimentación", planned: 540, executed: 612, status: "over" },
    { name: "Restaurantes",    cat: "Ocio",         planned: 220, executed: 184, status: "under" },
    { name: "Transporte",      cat: "Transporte",   planned: 160, executed: 152, status: "matched" },
    { name: "Suscripciones",   cat: "Servicios",    planned: 84,  executed: 84,  status: "matched" },
    { name: "Préstamo coche",  cat: "Deudas",       planned: 210, executed: 210, status: "matched" },
    { name: "Salud",           cat: "Salud",        planned: 60,  executed: 0,   status: "pending" },
  ],
};

function AMonthlyCloseView() {
  const [stepId, setStepId] = useStateAM("expense");
  const m = MONTHLY_CLOSE;
  const active = m.steps.find((s) => s.id === stepId) || m.steps[2];
  const sum = m.summary;

  // helper to render a step "card" in the stepper
  const stepDot = (s) => {
    const done = s.status === "done";
    const current = s.id === stepId;
    return (
      <button
        key={s.id} onClick={() => setStepId(s.id)}
        style={{
          font: "inherit",
          textAlign: "left", padding: "12px 16px 14px", borderRadius: 0, cursor: "pointer", background: "transparent",
          borderTop: `2px solid ${done || current ? "var(--accent)" : "var(--line)"}`,
          borderLeft: 0, borderRight: 0, borderBottom: 0, marginRight: 0,
          opacity: done || current ? 1 : 0.55,
          color: "var(--text)",
        }}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6}}>
          <span style={{fontSize:10.5, letterSpacing:"0.12em", textTransform:"uppercase", color: current ? "var(--accent)" : "var(--faint)", fontWeight:600}}>
            Paso {m.steps.indexOf(s) + 1}
          </span>
          <span style={{
            width:18, height:18, borderRadius:"50%",
            border: `1.5px solid ${done ? "var(--accent-line)" : current ? "var(--accent)" : "var(--line-strong)"}`,
            background: done ? "var(--accent-soft)" : "transparent",
            display:"inline-flex", alignItems:"center", justifyContent:"center",
            color: "var(--accent)", fontSize: 10,
          }}>{done ? "✓" : ""}</span>
        </div>
        <div style={{fontSize:14, fontWeight: current ? 600 : 500}}>{s.label}</div>
      </button>
    );
  };

  return (
    <>
      <ATopbar active="close" />

      <div className="page">
        <APageHead
          title={`Cierre · ${m.month}`}
          meta={[`FY ${m.fiscalYear}`, "Borrador automático"]}
          actions={(
            <>
              <button className="btn btn-ghost" style={{fontSize:12}}>Ver presupuesto</button>
              <button className="btn btn-primary">Cerrar mes</button>
            </>
          )}
        />

        {/* Page-level filters */}
        <AContextBar>
          <AContextField label="Mes">
            <ASelectCtrl value="2026-05" onChange={() => {}} options={[{ value: "2026-03", label: "Marzo 2026" }, { value: "2026-04", label: "Abril 2026" }, { value: "2026-05", label: "Mayo 2026" }]} />
          </AContextField>
          <span className="context-divider" />
          <AContextField label="Titularidad">
            <ASelectCtrl value="all" onChange={() => {}} options={[{ value: "all", label: "Todos" }, { value: "shared", label: "Compartida" }, { value: "marta", label: "Marta" }, { value: "alex", label: "Alex" }]} />
          </AContextField>
        </AContextBar>

        {/* Stepper */}
        <section className="sect">
          <div className="phase-strip" style={{"--n": m.steps.length}}>
            {m.steps.map(stepDot)}
          </div>
        </section>

        {/* Hero — month KPIs */}
        <section className="sect">
          <div>
            <p className="eyebrow" style={{color:"var(--muted)"}}>Residual del mes</p>
            <div className="hero-value mono">{fmtEUR(sum.residual)}</div>
            <div className="hero-delta">
              <span>Liquidez inicial · <span className="mono">{fmtEUR(sum.liquidityStart)}</span></span>
              <span className="dot" style={{width:3, height:3, borderRadius:"50%", background:"var(--faint)", display:"inline-block"}} />
              <span>Liquidez final · <span className="mono">{fmtEUR(sum.liquidityEnd)}</span></span>
              <span className="dot" style={{width:3, height:3, borderRadius:"50%", background:"var(--faint)", display:"inline-block"}} />
              <span className="pos mono">+{fmtEUR(sum.liquidityEnd - sum.liquidityStart)}</span>
              <span>variación</span>
            </div>
            <div className="kpis">
              <div className="kpi">
                <p className="kpi-label">Ingresos</p>
                <div className="kpi-value mono">{fmtEUR(sum.incomeExecuted)}</div>
                <div className="kpi-meta">previsto {fmtEUR(sum.incomePlanned)} · <span className="pos">+{fmtEUR(sum.incomeExecuted - sum.incomePlanned)}</span></div>
              </div>
              <div className="kpi">
                <p className="kpi-label">Gastos</p>
                <div className="kpi-value mono">{fmtEUR(sum.expenseExecuted)}</div>
                <div className="kpi-meta">previsto {fmtEUR(sum.expensePlanned)} · <span className="pos">−{fmtEUR(sum.expensePlanned - sum.expenseExecuted)}</span></div>
              </div>
              <div className="kpi">
                <p className="kpi-label">Tasa de ahorro</p>
                <div className="kpi-value mono">{((sum.incomeExecuted - sum.expenseExecuted) / sum.incomeExecuted * 100).toFixed(0)}%</div>
                <div className="kpi-meta">vs objetivo anual 25%</div>
              </div>
            </div>
          </div>
        </section>

        {/* Current step content */}
        <section className="sect">
          <ASectHead
            title={`Paso ${m.steps.indexOf(active) + 1} · ${active.label}`}
            sub={
              active.id === "liquidity"
                ? "Confirma los saldos de cuentas a fin de mes"
                : active.id === "income"
                ? "Marca como ejecutadas las nóminas, dividendos y demás ingresos del mes"
                : active.id === "expense"
                ? "Concilia los gastos del mes contra el presupuesto y registra los importes reales"
                : "Revisa el residual y confirma el cierre"
            }
            actions={
              <div className="actions">
                <button className="btn btn-ghost">Paso anterior</button>
                <button className="btn btn-primary">Paso siguiente →</button>
              </div>
            }
          />

          {active.id === "expense" && (
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{width:"38%"}}>Partida</th>
                  <th>Categoría</th>
                  <th className="num">Previsto</th>
                  <th className="num">Ejecutado</th>
                  <th className="num">Desvío</th>
                  <th style={{width:120}}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {MONTHLY_CLOSE.expenseRows.map((r, i) => {
                  const diff = r.executed - r.planned;
                  const over = diff > 0;
                  const pendingRow = r.status === "pending";
                  return (
                    <tr key={i}>
                      <td>
                        <div className="name">
                          <div className="swatch lia" />
                          <div>
                            <div className="nameMain">{r.name}</div>
                            <div className="nameSub">{r.cat}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{color:"var(--muted)"}}>{r.cat}</td>
                      <td className="num mono">{fmtEUR(r.planned)}</td>
                      <td className="num mono">{pendingRow ? <span style={{color:"var(--faint)"}}>—</span> : fmtEUR(r.executed)}</td>
                      <td className="num mono" style={{color: pendingRow ? "var(--faint)" : over ? "var(--neg)" : diff < 0 ? "var(--pos)" : "var(--muted)"}}>
                        {pendingRow ? "—" : (diff === 0 ? "0 €" : (over ? "+" : "") + fmtEUR(diff))}
                      </td>
                      <td>
                        {pendingRow
                          ? <AKindChip tone="neutral">Pendiente</AKindChip>
                          : r.status === "over"
                            ? <AKindChip tone="neg">Excedido</AKindChip>
                            : r.status === "under"
                              ? <AKindChip tone="pos">Ahorrado</AKindChip>
                              : <AKindChip tone="neutral" style={{color:"var(--text)", background:"var(--hover)"}}>Conciliado</AKindChip>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="tbl-foot">
                  <td colSpan={2}>Total gastos</td>
                  <td className="num mono">{fmtEUR(MONTHLY_CLOSE.expenseRows.reduce((s,r)=>s+r.planned,0))}</td>
                  <td className="num mono">{fmtEUR(MONTHLY_CLOSE.expenseRows.reduce((s,r)=>s+r.executed,0))}</td>
                  <td className="num mono">{fmtEUR(MONTHLY_CLOSE.expenseRows.reduce((s,r)=>s+(r.executed - r.planned),0))}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          )}

          {active.id !== "expense" && (
            <div style={{padding:"32px 0", color:"var(--muted)", fontSize:13, borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)", textAlign:"center"}}>
              Contenido del paso "{active.label}" — selecciona "Gastos" arriba para ver el patrón completo de conciliación.
            </div>
          )}
        </section>
      </div>
    </>
  );
}

// ── Movimientos (accounting journal) ────────────────────────────────────────
const MOVEMENTS = {
  month: "Mayo 2026",
  netBalance: 287_420,
  assetsTotal: 384_180,
  liabilitiesTotal: 96_760,
  flowMonth: { income: 6_200, expense: 4_020 },
  // Daily balance trend (24 days simulated)
  dailyBalance: Array.from({ length: 24 }, (_, i) => ({
    d: i + 1,
    v: 285_700 + Math.round(Math.sin(i / 2.4) * 1_400 + i * 90 + (i % 3 === 0 ? 320 : 0)),
  })),
  // Sample journal entries
  entries: [
    { id: 1, date: "26 May", concept: "Nómina Marta · BBVA",        debit: "Cuenta BBVA",     credit: "Ingresos · Nómina",     amount: +2_950, kind: "income",       categoryKey: "salario",    subcategoryKey: "sueldo" },
    { id: 2, date: "25 May", concept: "Supermercado Mercadona",     debit: "Gastos · Alimentación", credit: "Cuenta BBVA",     amount: -86.40, kind: "expense",      categoryKey: "alimentacion", subcategoryKey: "supermercado" },
    { id: 3, date: "24 May", concept: "Aportación pensiones",       debit: "Plan pensiones",  credit: "Trade Republic",        amount: +200,   kind: "investment",   categoryKey: "pensiones",  subcategoryKey: "" },
    { id: 4, date: "22 May", concept: "Hipoteca · cuota mensual",   debit: "Hipoteca vivienda", credit: "Cuenta BBVA",         amount: -720,   kind: "debt_payment", categoryKey: "hipoteca",   subcategoryKey: "" },
    { id: 5, date: "21 May", concept: "Restaurante",                debit: "Gastos · Ocio",   credit: "Cuenta BBVA",           amount: -42.80, kind: "expense",      categoryKey: "ocio",       subcategoryKey: "restaurantes" },
    { id: 6, date: "20 May", concept: "Dividendos Q2",              debit: "Cuenta BBVA",     credit: "Ingresos · Inversiones", amount: +112.40, kind: "income",      categoryKey: "inversiones", subcategoryKey: "dividendos" },
    { id: 7, date: "18 May", concept: "Suministros · luz",          debit: "Gastos · Vivienda", credit: "Cuenta BBVA",         amount: -98.20, kind: "expense",      categoryKey: "vivienda",   subcategoryKey: "suministros" },
    { id: 8, date: "16 May", concept: "Compra acciones",            debit: "Acciones individuales", credit: "Cuenta BBVA",     amount: +500,   kind: "investment",   categoryKey: "rentavariable", subcategoryKey: "" },
    { id: 9, date: "15 May", concept: "Devolución Amazon",          debit: "Cuenta BBVA",     credit: "Gastos · Hogar",        amount: +34.90, kind: "adjustment",   categoryKey: "",           subcategoryKey: "" },
    { id:10, date: "12 May", concept: "Transferencia ahorro",       debit: "Trade Republic",  credit: "Cuenta BBVA",           amount: +850,   kind: "transfer",     categoryKey: "",           subcategoryKey: "" },
    { id:11, date: "10 May", concept: "Préstamo coche · cuota",     debit: "Préstamo coche",  credit: "Cuenta BBVA",           amount: -210,   kind: "debt_payment", categoryKey: "prestamo",   subcategoryKey: "" },
    { id:12, date: "08 May", concept: "Nómina Alex",                debit: "Cuenta BBVA",     credit: "Ingresos · Nómina",     amount: +2_400, kind: "income",       categoryKey: "salario",    subcategoryKey: "sueldo" },
  ],
  accounts: [
    { id: "Cuenta BBVA",          type: "asset",     subtype: "Liquidez",    balance:  8_240,  monthFlow: { in: 5_499, out: 1_157 } },
    { id: "Trade Republic",       type: "asset",     subtype: "Liquidez",    balance: 14_400,  monthFlow: { in: 850,   out: 200 } },
    { id: "Plan pensiones",       type: "asset",     subtype: "Inversión",   balance: 32_180,  monthFlow: { in: 200,   out: 0 } },
    { id: "Acciones individuales",type: "asset",     subtype: "Inversión",   balance: 22_240,  monthFlow: { in: 500,   out: 0 } },
    { id: "Hipoteca vivienda",    type: "liability", subtype: "Hipoteca",    balance:-84_320,  monthFlow: { in: 0,     out: 720 } },
    { id: "Préstamo coche",       type: "liability", subtype: "Préstamo",    balance: -8_240,  monthFlow: { in: 0,     out: 210 } },
  ],
  // Expense breakdown for the stats tab (May 2026)
  expenseByCategory: [
    { label: "Vivienda",     value: 1_098, hue: 220 },
    { label: "Alimentación", value: 612,   hue: 30 },
    { label: "Deudas",       value: 930,   hue: 0 },
    { label: "Ocio",         value: 226,   hue: 280 },
    { label: "Transporte",   value: 152,   hue: 160 },
    { label: "Servicios",    value: 84,    hue: 100 },
  ],
};

function ADailyBalanceChart({ data, h = 120 }) {
  const W = 760, pad = 12;
  const vs = data.map((d) => d.v);
  const min = Math.min(...vs), max = Math.max(...vs);
  const range = max - min || 1;
  const px = (i) => pad + (i / (data.length - 1)) * (W - 2 * pad);
  const py = (v) => pad + (1 - (v - min) / range) * (h - 2 * pad);
  const path = data.map((d, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(d.v)}`).join(" ");
  return (
    <div style={{color:"var(--accent)"}}>
      <svg width="100%" height={h} viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none" style={{display:"block"}}>
        <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" />
        {data.map((d, i) =>
          <circle key={i} cx={px(i)} cy={py(d.v)} r={1.6} fill="currentColor" fillOpacity="0.7" />
        )}
      </svg>
    </div>
  );
}

// Filter taxonomy that mirrors the codebase (income/expense/etc. + categories).
const MOV_KINDS = [
  { value: "all",             label: "Tipo" },
  { value: "income",          label: "Ingresos" },
  { value: "expense",         label: "Gastos" },
  { value: "transfer",        label: "Transferencias" },
  { value: "adjustment",      label: "Ajustes" },
  { value: "investment",      label: "Inversión" },
  { value: "debt_payment",    label: "Pago deuda" },
  { value: "opening_balance", label: "Saldo inicial" },
  { value: "revaluation",     label: "Revalorizaciones" },
];
const MOV_KINDS_WITH_CATS = ["income", "expense", "investment", "debt_payment"];
const MOV_ACCOUNTS = [
  { value: "all",            label: "Todas las cuentas" },
  { value: "Cuenta BBVA",    label: "Cuenta BBVA" },
  { value: "Trade Republic", label: "Trade Republic" },
  { value: "Plan pensiones", label: "Plan pensiones" },
  { value: "Acciones individuales", label: "Acciones individuales" },
  { value: "Hipoteca vivienda", label: "Hipoteca vivienda" },
  { value: "Préstamo coche", label: "Préstamo coche" },
];
const MOV_CATEGORIES = {
  income:       [{value:"salario",label:"Salario"}, {value:"inversiones",label:"Inversiones"}, {value:"otros",label:"Otros"}],
  expense:      [{value:"vivienda",label:"Vivienda"}, {value:"alimentacion",label:"Alimentación"}, {value:"ocio",label:"Ocio"}, {value:"transporte",label:"Transporte"}, {value:"servicios",label:"Servicios"}, {value:"salud",label:"Salud"}],
  investment:   [{value:"pensiones",label:"Pensiones"}, {value:"rentavariable",label:"Renta variable"}, {value:"rentafija",label:"Renta fija"}],
  debt_payment: [{value:"hipoteca",label:"Hipoteca"}, {value:"prestamo",label:"Préstamos"}, {value:"tarjeta",label:"Tarjetas"}],
};
const MOV_SUBCATEGORIES = {
  salario:       [{value:"sueldo",label:"Sueldo neto"}, {value:"extra",label:"Pagas extra"}, {value:"bono",label:"Bonus"}],
  alimentacion:  [{value:"supermercado",label:"Supermercado"}, {value:"fresco",label:"Frescos"}],
  vivienda:      [{value:"suministros",label:"Suministros"}, {value:"mantenimiento",label:"Mantenimiento"}, {value:"comunidad",label:"Comunidad"}],
  ocio:          [{value:"restaurantes",label:"Restaurantes"}, {value:"cultura",label:"Cultura"}, {value:"viajes",label:"Viajes"}],
  inversiones:   [{value:"dividendos",label:"Dividendos"}, {value:"intereses",label:"Intereses"}],
};
const MOV_DATE_PRESETS = [
  { value: "today",    label: "Hoy" },
  { value: "week",     label: "Esta semana" },
  { value: "month",    label: "Este mes" },
  { value: "quarter",  label: "Este trimestre" },
  { value: "ytd",      label: "Año en curso" },
  { value: "12m",      label: "Últimos 12 meses" },
  { value: "all",      label: "Todo" },
  { value: "custom",   label: "Rango personalizado…" },
];

function AMovementsView() {
  const [view, setView] = useStateAM("accounts");
  const [expandedAccount, setExpandedAccount] = useStateAM(null);
  const [search, setSearch] = useStateAM("");
  const [kind, setKind] = useStateAM("all");
  const [category, setCategory] = useStateAM("");
  const [subcategory, setSubcategory] = useStateAM("");
  const [accountId, setAccountId] = useStateAM("all");
  const [period, setPeriod] = useStateAM("month");
  const [dateFrom, setDateFrom] = useStateAM("2026-05-01");
  const [dateTo, setDateTo] = useStateAM("2026-05-31");
  const [dateOpen, setDateOpen] = useStateAM(false);
  const m = MOVEMENTS;

  // Closing the date popover on outside click
  const dateRef = React.useRef(null);
  React.useEffect(() => {
    if (!dateOpen) return;
    const off = (e) => { if (!dateRef.current || !dateRef.current.contains(e.target)) setDateOpen(false); };
    document.addEventListener("pointerdown", off, true);
    return () => document.removeEventListener("pointerdown", off, true);
  }, [dateOpen]);

  // When kind changes, reset category/subcategory if no longer applicable
  React.useEffect(() => {
    if (!MOV_KINDS_WITH_CATS.includes(kind)) { setCategory(""); setSubcategory(""); }
  }, [kind]);
  React.useEffect(() => { setSubcategory(""); }, [category]);

  const categoryOptions = MOV_CATEGORIES[kind] || [];
  const subcategoryOptions = MOV_SUBCATEGORIES[category] || [];
  const showCategory = MOV_KINDS_WITH_CATS.includes(kind);
  const showSubcategory = showCategory && subcategoryOptions.length > 0;
  const periodLabel = MOV_DATE_PRESETS.find((p) => p.value === period)?.label ?? "Período";

  const filtered = m.entries
    .filter((e) => accountId === "all" || e.debit === accountId || e.credit === accountId)
    .filter((e) => kind === "all" || e.kind === kind)
    .filter((e) => !category || e.categoryKey === category)
    .filter((e) => !subcategory || e.subcategoryKey === subcategory)
    .filter((e) => search === "" || e.concept.toLowerCase().includes(search.toLowerCase()));

  // running balance (newest first → we cumulate backwards)
  let bal = m.netBalance;
  const withBal = filtered.map((e) => {
    const row = { ...e, balance: bal };
    bal = bal - e.amount;
    return row;
  });

  const netDelta = withBal.reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <ATopbar active="mov" />

      <div className="page">
        <APageHead
          title="Movimientos"
          meta={[m.month, `${m.entries.length} asientos`, "Partida doble"]}
          actions={(
            <>
              <button className="btn btn-ghost" style={{fontSize:12}}>Catálogo de cuentas</button>
              <button className="btn btn-ghost" style={{fontSize:12}}>Importar bancario</button>
              <button className="btn btn-primary">+ Asiento rápido</button>
            </>
          )}
        />

        {/* Hero — balance KPIs + daily trend */}
        <section className="sect">
          <div className="hero">
            <div>
              <p className="eyebrow" style={{color:"var(--muted)"}}>Saldo neto contable</p>
              <div className="hero-value mono">{fmtEUR(m.netBalance)}</div>
              <div className="hero-delta">
                <span className="pos mono">+{fmtEUR(m.flowMonth.income)}</span>
                <span>ingresos del mes</span>
                <span className="dot" style={{width:3, height:3, borderRadius:"50%", background:"var(--faint)", display:"inline-block"}} />
                <span className="neg mono" style={{color:"var(--neg)"}}>−{fmtEUR(m.flowMonth.expense)}</span>
                <span>gastos del mes</span>
              </div>
              <div className="kpis">
                <div className="kpi">
                  <p className="kpi-label">Activos contables</p>
                  <div className="kpi-value mono">{fmtEUR(m.assetsTotal)}</div>
                  <div className="kpi-meta">8 cuentas</div>
                </div>
                <div className="kpi">
                  <p className="kpi-label">Pasivos contables</p>
                  <div className="kpi-value mono">{fmtEUR(m.liabilitiesTotal)}</div>
                  <div className="kpi-meta">3 cuentas</div>
                </div>
                <div className="kpi">
                  <p className="kpi-label">Asientos del mes</p>
                  <div className="kpi-value mono">{m.entries.length}</div>
                  <div className="kpi-meta">{m.entries.filter((e) => e.amount > 0).length} cobros · {m.entries.filter((e) => e.amount < 0).length} pagos</div>
                </div>
              </div>
            </div>

            <div>
              <p className="eyebrow" style={{color:"var(--muted)"}}>Saldo diario · últimos 24 días</p>
              <div style={{marginTop:14}}>
                <ADailyBalanceChart data={m.dailyBalance} h={120} />
                <div style={{display:"flex", justifyContent:"space-between", marginTop:6, fontSize:11, color:"var(--faint)", fontFamily:'"Geist Mono", monospace'}}>
                  <span>{m.dailyBalance[0].d} May</span>
                  <span>hoy</span>
                </div>
              </div>
              <div style={{marginTop:16, padding:"10px 0", borderTop:"1px solid var(--line)", display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--muted)"}}>
                <span>Min · <span className="mono" style={{color:"var(--text)"}}>{fmtEUR(Math.min(...m.dailyBalance.map((d) => d.v)))}</span></span>
                <span>Max · <span className="mono" style={{color:"var(--text)"}}>{fmtEUR(Math.max(...m.dailyBalance.map((d) => d.v)))}</span></span>
              </div>
            </div>
          </div>
        </section>

        {/* View tabs — restore the 3 sections from the existing app */}
        <section className="sect">
          <div className="tabs">
            {[
              { id: "accounts", label: "Cuentas" },
              { id: "all",      label: "Todos los movimientos" },
              { id: "stats",    label: "Estadísticas" },
            ].map((t) => (
              <button key={t.id} className={"tab " + (view === t.id ? "on" : "")} onClick={() => setView(t.id)}>{t.label}</button>
            ))}
          </div>
        </section>

        {/* ── Cuentas ── */}
        {view === "accounts" && (
          <section className="sect">
            <ASectHead
              title="Cuentas"
              count={`${m.accounts.length} cuentas · ${fmtEUR(m.accounts.reduce((s,a)=>s+a.balance,0))} neto`}
              sub="Click sobre una cuenta para ver sus últimos movimientos"
            />
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{width: "40%"}}>Cuenta</th>
                  <th>Tipo</th>
                  <th className="num">Cobros mes</th>
                  <th className="num">Pagos mes</th>
                  <th className="num">Saldo</th>
                  <th style={{width: 36}}></th>
                </tr>
              </thead>
              <tbody>
                {m.accounts.map((acc) => {
                  const isExpanded = expandedAccount === acc.id;
                  const accEntries = m.entries.filter((e) => e.debit === acc.id || e.credit === acc.id);
                  const isLiability = acc.type === "liability";
                  return (
                    <React.Fragment key={acc.id}>
                      <tr className={"clickable" + (isExpanded ? " row-active" : "")} onClick={() => setExpandedAccount(isExpanded ? null : acc.id)}>
                        <td>
                          <div className="name">
                            <div className={"swatch" + (isLiability ? " lia" : "")} />
                            <div>
                              <div className="nameMain">{acc.id}</div>
                              <div className="nameSub">{accEntries.length} asientos este mes</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="chip" style={{fontSize:11}}>{isLiability ? "Pasivo" : "Activo"} · {acc.subtype}</span></td>
                        <td className="num mono" style={{color: acc.monthFlow.in > 0 ? "var(--pos)" : "var(--muted)"}}>
                          {acc.monthFlow.in > 0 ? "+" + fmtEUR(acc.monthFlow.in) : "—"}
                        </td>
                        <td className="num mono" style={{color: acc.monthFlow.out > 0 ? "var(--neg)" : "var(--muted)"}}>
                          {acc.monthFlow.out > 0 ? "−" + fmtEUR(acc.monthFlow.out) : "—"}
                        </td>
                        <td className="num mono" style={{color: isLiability ? "var(--neg)" : "var(--text)"}}>{fmtEUR(acc.balance)}</td>
                        <td onClick={(ev) => ev.stopPropagation()}>
                          <button className="btn-ghost btn" style={{padding:"4px 6px"}}>{isExpanded ? "▾" : "▸"}</button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} style={{padding:0, background:"transparent"}}>
                            <div style={{padding:"4px 20px 18px 28px", borderBottom:"1px solid var(--line)"}}>
                              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0 6px"}}>
                                <span style={{fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--faint)"}}>
                                  Movimientos · {acc.id}
                                </span>
                                <button className="btn btn-ghost" style={{fontSize:12}} onClick={() => { setAccountId(acc.id); setView("all"); }}>
                                  Ver todos →
                                </button>
                              </div>
                              {accEntries.length === 0 ? (
                                <div style={{color:"var(--muted)", fontSize:13, padding:"8px 0"}}>Sin movimientos este mes.</div>
                              ) : (
                                <div style={{display:"grid", gap:0}}>
                                  {accEntries.slice(0, 6).map((e) => {
                                    const isIncome = (e.debit === acc.id) ? e.amount > 0 || e.kind === "income" : e.amount < 0;
                                    // For the account's POV: if account is the debit side, the amount lands in (income); credit = leaving
                                    const sign = (e.debit === acc.id ? +1 : -1) * Math.abs(e.amount);
                                    return (
                                      <div key={e.id} style={{display:"grid", gridTemplateColumns:"80px 1fr auto auto", gap:14, padding:"10px 0", borderTop:"1px solid var(--line-soft, rgba(255,255,255,0.05))", alignItems:"center"}}>
                                        <span className="mono" style={{color:"var(--muted)", fontSize:12}}>{e.date}</span>
                                        <div>
                                          <div style={{fontSize:13.5}}>{e.concept}</div>
                                          <div style={{fontSize:11, color:"var(--muted)"}}>{e.debit === acc.id ? `← ${e.credit}` : `→ ${e.debit}`}</div>
                                        </div>
                                        <span style={{fontSize:11}} className="chip">{MOV_KINDS.find((k) => k.value === e.kind)?.label ?? "—"}</span>
                                        <span className="mono" style={{color: sign > 0 ? "var(--pos)" : "var(--neg)", fontVariantNumeric:"tabular-nums", minWidth: 90, textAlign:"right"}}>
                                          {sign > 0 ? "+" : "−"}{fmtEUR(Math.abs(sign), {decimals: Math.abs(sign) < 100 ? 2 : 0})}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}

        {/* ── Todos los movimientos ── */}
        {view === "all" && (
        <section className="sect">
          <div className="filter-bar">
            <input
              className="filter-ctrl"
              style={{minWidth: 220, flex:"0 1 260px"}}
              placeholder="Buscar…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ASelectCtrl value={accountId} onChange={(v) => setAccountId(v)} options={[]} />
            <ASelectCtrl value={kind} onChange={(v) => setKind(v)} options={[]} />
            <select
              className="filter-ctrl"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              data-disabled={!showCategory ? "true" : undefined}
            >
              <option value="">Categoría</option>
              {categoryOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select
              className="filter-ctrl"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              data-disabled={!showSubcategory ? "true" : undefined}
            >
              <option value="">Subcategoría</option>
              {subcategoryOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <div ref={dateRef} style={{position:"relative"}}>
              <button className="filter-ctrl" onClick={() => setDateOpen((o) => !o)} type="button">
                {periodLabel}
              </button>
              {dateOpen && (
                <div className="filter-popover">
                  {MOV_DATE_PRESETS.map((p) => (
                    <button key={p.value} className={period === p.value ? "on" : ""} onClick={() => { setPeriod(p.value); if (p.value !== "custom") setDateOpen(false); }}>
                      {p.label}
                    </button>
                  ))}
                  {period === "custom" && (
                    <>
                      <hr />
                      <div className="filter-popover-custom">
                        <input className="filter-ctrl" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                        <input className="filter-ctrl" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <span className="filter-count">
              <strong>{withBal.length}</strong> de {m.entries.length}
              <span style={{margin:"0 8px", color:"var(--faint)"}}>·</span>
              <span className="mono" style={{color: netDelta >= 0 ? "var(--pos)" : "var(--neg)"}}>{fmtEUR(netDelta, { signed: true })}</span>
              <span style={{marginLeft:4}}>neto</span>
            </span>
          </div>

          {/* Empty state */}
          {withBal.length === 0 && (
            <div style={{padding:"32px 0", textAlign:"center", color:"var(--muted)", fontSize:13, borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)"}}>
              <div style={{color:"var(--text)", marginBottom:4}}>Sin movimientos para estos filtros</div>
              <div>Prueba otro periodo o ajusta la búsqueda para ver actividad.</div>
            </div>
          )}

          {/* Journal table — single-elevation, hairlines, debit/credit columns */}
          {withBal.length > 0 && (
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{width: 90}}>Fecha</th>
                  <th style={{width: "30%"}}>Concepto</th>
                  <th>Tipo</th>
                  <th>Debe</th>
                  <th>Haber</th>
                  <th className="num">Importe</th>
                  <th className="num">Saldo</th>
                  <th style={{width: 36}}></th>
                </tr>
              </thead>
              <tbody>
                {withBal.map((e) => {
                  const isIncome = e.amount > 0;
                  const kindLabel = MOV_KINDS.find((k) => k.value === e.kind)?.label ?? "—";
                  return (
                    <tr key={e.id} className="clickable">
                      <td className="mono" style={{color:"var(--muted)", fontSize:12.5}}>{e.date}</td>
                      <td>
                        <div className="nameMain" style={{fontSize:14}}>{e.concept}</div>
                      </td>
                      <td><span className="chip" style={{fontSize:11}}>{kindLabel}</span></td>
                      <td style={{color:"var(--muted)", fontSize:12.5}}>{e.debit}</td>
                      <td style={{color:"var(--muted)", fontSize:12.5}}>{e.credit}</td>
                      <td className="num mono" style={{color: isIncome ? "var(--pos)" : "var(--neg)"}}>
                        {isIncome ? "+" : ""}{fmtEUR(e.amount, {decimals: Math.abs(e.amount) < 100 ? 2 : 0})}
                      </td>
                      <td className="num mono" style={{color:"var(--muted)"}}>{fmtEUR(e.balance)}</td>
                      <td onClick={(ev)=>ev.stopPropagation()}><button className="btn-ghost btn" style={{padding:"4px 6px"}}>⋯</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
        )}

        {/* ── Estadísticas ── */}
        {view === "stats" && (
          <section className="sect">
            <ASectHead
              title="Estadísticas"
              sub="Balance contable del año"
              actions={
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <ASelectCtrl value="2026" onChange={() => {}} options={[{ value: "2024", label: "2024" }, { value: "2025", label: "2025" }, { value: "2026", label: "2026" }]} />
                </div>
              }
            />

            {/* KPI strip — activos + pasivos (mirrors AccountingBalances) */}
            <div className="kpis" style={{ gridTemplateColumns:"1fr 1fr", marginTop:0, paddingTop:16, borderTop:"1px solid var(--line)" }}>
              <div className="kpi" style={{ paddingLeft:0 }}>
                <p className="kpi-label">Activos contables</p>
                <div className="kpi-value mono">{fmtEUR(m.assetsTotal)}</div>
                <div className="kpi-meta">{m.accounts.filter((a) => a.type === "asset").length} cuentas</div>
              </div>
              <div className="kpi">
                <p className="kpi-label">Pasivos contables</p>
                <div className="kpi-value mono">{fmtEUR(m.liabilitiesTotal)}</div>
                <div className="kpi-meta">{m.accounts.filter((a) => a.type === "liability").length} cuentas</div>
              </div>
            </div>

            {/* Monthly cashflow strip */}
            <div>
              <div style={{ fontSize:10.5, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--faint)", fontWeight:600, padding:"14px 0 10px", borderBottom:"1px solid var(--line)" }}>
                Flujo mensual · {new Date().getFullYear()}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gap:4, paddingTop:10 }}>
                {["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"].map((mon, i) => {
                  const inc = i <= 4 ? [5400,5400,5670,6100,5550][i] ?? 0 : 0;
                  const exp = i <= 4 ? [4180,4250,4380,4640,4720][i] ?? 0 : 0;
                  const res = inc - exp;
                  const isFuture = i > 4;
                  return (
                    <div key={i} style={{ textAlign:"center", opacity: isFuture ? 0.35 : 1 }}>
                      <div style={{ fontSize:9, letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--faint)", marginBottom:4 }}>{mon}</div>
                      {!isFuture ? (
                        <>
                          <div className="mono" style={{ fontSize:10, color: res >= 0 ? "var(--pos)" : "var(--neg)", fontWeight:500 }}>
                            {res >= 0 ? "+" : "−"}{fmtEUR(Math.abs(res), {decimals:0})}
                          </div>
                          <div style={{ fontSize:9, color:"var(--muted)", marginTop:2 }}>
                            <span style={{ color:"var(--pos)" }}>↑{fmtEUR(inc, {decimals:0})}</span>
                            <span style={{ margin:"0 2px", color:"var(--faint)" }}>/</span>
                            <span style={{ color:"var(--neg)" }}>↓{fmtEUR(exp, {decimals:0})}</span>
                          </div>
                        </>
                      ) : (
                        <div style={{ color:"var(--faint)", fontSize:10 }}>—</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize:12, color:"var(--muted)", marginTop:14, lineHeight:1.5 }}>
                Solo incluye cuentas contables activas. No incluye vivienda, mobiliario u otros activos fuera del libro contable.
              </p>
            </div>

            {/* Technical accounts — collapsible, same as <details> in original */}
            <details style={{ borderTop:"1px solid var(--line)", paddingTop:12 }}>
              <summary style={{ font:"inherit", fontSize:13, color:"var(--muted)", cursor:"pointer", listStyle:"none", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:11 }}>▸</span>
                Contrapartidas técnicas del sistema
                <span className="chip" style={{ marginLeft:4, fontSize:11 }}>3</span>
              </summary>
              <p style={{ fontSize:12, color:"var(--muted)", margin:"10px 0 8px", lineHeight:1.5 }}>
                Estas cuentas siguen existiendo por compatibilidad interna, pero no forman parte del catálogo operativo que se gestiona manualmente.
              </p>
              {[
                { name:"Contrapartida ingresos", type:"income", balance:68_400, currency:"EUR", origin:"system" },
                { name:"Contrapartida gastos",   type:"expense", balance:51_240, currency:"EUR", origin:"system" },
                { name:"Contrapartida apertura", type:"equity",  balance:287_420, currency:"EUR", origin:"system" },
              ].map((acc, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid var(--line)" }}>
                  <div>
                    <div style={{ fontSize:13 }}>{acc.name}</div>
                    <div style={{ fontSize:11, color:"var(--faint)", marginTop:2, display:"flex", gap:8 }}>
                      <span className="chip" style={{ fontSize:10 }}>{acc.currency}</span>
                      <span className="chip" style={{ fontSize:10 }}>{acc.origin}</span>
                    </div>
                  </div>
                  <div className="mono" style={{ fontSize:13, color:"var(--muted)" }}>{fmtEUR(acc.balance)}</div>
                </div>
              ))}
            </details>
          </section>
        )}
      </div>
    </>
  );
}

Object.assign(window, { ABudgetView, AGuideView, ADataInputView, AAppShell, AMonthlyCloseView, AMovementsView });

