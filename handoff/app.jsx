// app.jsx — wires the design canvas, Direction A screens and tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "density": "compact",
  "accent": 178
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = [
  { label: "Teal",   h: 178 },
  { label: "Indigo", h: 260 },
  { label: "Amber",  h: 70  },
  { label: "Plum",   h: 340 },
];

const DENSITY_SCALE = { compact: 0.86, regular: 1, comfy: 1.14 };

function applyGlobals(t) {
  const root = document.documentElement;
  root.style.setProperty("--accent-h", String(t.accent));
  root.style.setProperty("--density-scale", String(DENSITY_SCALE[t.density] || 1));
}

function Stage({ direction, theme, style, children }) {
  return (
    <div
      className={`dir-${direction} theme-${theme}`}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "auto", ...style }}
    >
      {children}
    </div>
  );
}

// ── Before / After comparison artboards ─────────────────────────────────────
function BeforeNested() {
  return (
    <div style={{
      width:"100%", height:"100%", background:"#0c0d10", color:"rgba(255,255,255,0.9)",
      fontFamily:'"Geist", system-ui, sans-serif', padding: 24, boxSizing:"border-box",
      overflow:"auto",
    }}>
      <p style={{margin:"0 0 14px", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)"}}>
        Antes — 4 capas de bordes
      </p>
      <div style={{border:"1px solid rgba(255,255,255,0.14)", borderRadius:14, padding:14, background:"rgba(255,255,255,0.04)"}}>
        <div style={{border:"1px solid rgba(255,255,255,0.10)", borderRadius:12, padding:12, background:"rgba(255,255,255,0.02)", marginBottom:10}}>
          <div style={{fontSize:11, color:"rgba(255,255,255,0.55)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8}}>Patrimonio</div>
          <div style={{border:"1px solid rgba(255,255,255,0.10)", borderRadius:10, padding:10, background:"rgba(255,255,255,0.03)"}}>
            <div style={{fontSize:14, marginBottom:6}}>Cuenta BBVA</div>
            <div style={{border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:8, background:"rgba(255,255,255,0.02)", fontSize:13}}>
              <div>8 240,00 €</div>
            </div>
          </div>
        </div>
        <div style={{border:"1px solid rgba(255,255,255,0.10)", borderRadius:12, padding:12, background:"rgba(255,255,255,0.02)"}}>
          <div style={{border:"1px solid rgba(255,255,255,0.10)", borderRadius:10, padding:10, background:"rgba(255,255,255,0.03)", fontSize:13}}>Inversiones · 142 540,00 €</div>
        </div>
      </div>
      <p style={{marginTop:18, fontSize:12, color:"rgba(255,255,255,0.55)", maxWidth: 440, lineHeight:1.55}}>
        Cada nivel suma borde + radio + tono. La jerarquía se pierde porque todo es una caja dentro de otra.
      </p>
    </div>
  );
}

function AfterFlat() {
  return (
    <div style={{
      width:"100%", height:"100%", background:"#0c0d10", color:"rgba(255,255,255,0.94)",
      fontFamily:'"Geist", system-ui, sans-serif', padding: 24, boxSizing:"border-box",
      overflow:"auto",
    }}>
      <p style={{margin:"0 0 18px", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"oklch(0.72 0.10 178)", fontWeight:700}}>
        Después — una sola superficie
      </p>
      <div>
        <div style={{paddingBottom:10, borderBottom:"1px solid rgba(255,255,255,0.10)"}}>
          <div style={{fontSize:10.5, color:"rgba(255,255,255,0.36)", textTransform:"uppercase", letterSpacing:"0.14em"}}>Liquidez</div>
        </div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div>
            <div style={{fontSize:14, fontWeight:500}}>Cuenta BBVA</div>
            <div style={{fontSize:11.5, color:"rgba(255,255,255,0.55)"}}>Operativa</div>
          </div>
          <div style={{fontFamily:'"Geist Mono", monospace', fontSize:14}}>8 240,00 €</div>
        </div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div>
            <div style={{fontSize:14, fontWeight:500}}>Ahorro Trade Republic</div>
            <div style={{fontSize:11.5, color:"rgba(255,255,255,0.55)"}}>3,7% interés</div>
          </div>
          <div style={{fontFamily:'"Geist Mono", monospace', fontSize:14}}>14 400,00 €</div>
        </div>

        <div style={{paddingTop:24, paddingBottom:10, borderBottom:"1px solid rgba(255,255,255,0.10)"}}>
          <div style={{fontSize:10.5, color:"rgba(255,255,255,0.36)", textTransform:"uppercase", letterSpacing:"0.14em"}}>Inversiones</div>
        </div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div>
            <div style={{fontSize:14, fontWeight:500}}>Cartera indexada</div>
            <div style={{fontSize:11.5, color:"rgba(255,255,255,0.55)"}}>60/40 acc/bonos</div>
          </div>
          <div style={{fontFamily:'"Geist Mono", monospace', fontSize:14}}>88 120,00 €</div>
        </div>
      </div>
      <p style={{marginTop:22, fontSize:12, color:"rgba(255,255,255,0.55)", maxWidth: 440, lineHeight:1.55}}>
        Misma información, cero recuadros anidados. El ritmo lo dan la línea fina, la mayúscula pequeña y el espacio.
      </p>
    </div>
  );
}

// ── App root ───────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [openModalA, setOpenModalA] = React.useState(false);

  React.useEffect(() => { applyGlobals(t); }, [t.accent, t.density]);

  return (
    <>
      <DesignCanvas>
        <DCSection
          id="dir-a"
          title="Dirección A · Surface Reset"
          subtitle="Un único patrón en toda la app: header eyebrow + título + meta + acciones; una sola elevación; modales como diálogo centrado con el mismo header"
        >
          <DCArtboard id="a-nw" label="Net Worth · vista completa · 1440×900" width={1440} height={900}>
            <Stage direction="a" theme={t.theme}>
              {openModalA
                ? <AAddAssetSheet onClose={() => setOpenModalA(false)} />
                : <ANetWorthView onAdd={() => setOpenModalA(true)} />}
            </Stage>
          </DCArtboard>
          <DCArtboard id="a-modal" label="Modal · Añadir activo (diálogo) · 1440×900" width={1440} height={900}>
            <Stage direction="a" theme={t.theme}>
              <AAddAssetSheet onClose={() => {}} />
            </Stage>
          </DCArtboard>
        </DCSection>

        <DCSection
          id="dir-a-screens"
          title="Más pantallas, mismo sistema"
          subtitle="El patrón aplicado a Budget, Guía y Data Input"
        >
          <DCArtboard id="a-budget" label="Presupuesto · plan anual · 1440×900" width={1440} height={900}>
            <Stage direction="a" theme={t.theme}>
              <ABudgetView />
            </Stage>
          </DCArtboard>
          <DCArtboard id="a-close" label="Cierre mensual · Mayo 2026 · 1440×900" width={1440} height={900}>
            <Stage direction="a" theme={t.theme}>
              <AMonthlyCloseView />
            </Stage>
          </DCArtboard>
          <DCArtboard id="a-mov" label="Movimientos · libro diario · 1440×900" width={1440} height={900}>
            <Stage direction="a" theme={t.theme}>
              <AMovementsView />
            </Stage>
          </DCArtboard>
          <DCArtboard id="a-guide" label="Guía · fase actual · 1440×900" width={1440} height={900}>
            <Stage direction="a" theme={t.theme}>
              <AGuideView />
            </Stage>
          </DCArtboard>
          <DCArtboard id="a-data" label="Data Input · ingresos anuales · 1440×900" width={1440} height={900}>
            <Stage direction="a" theme={t.theme}>
              <ADataInputView />
            </Stage>
          </DCArtboard>
        </DCSection>

        <DCSection
          id="resoluciones"
          title="Resolución · prueba a viewports reales"
          subtitle="La página tiene max-width 1480 y reflows en 1024 y 760. Estas son las resoluciones más comunes de 2026; el alto refleja el viewport útil restando barra del navegador."
        >
          <DCArtboard id="a-nw-1366" label="1366×768 · laptops 'baratos' (worst case común)" width={1366} height={768}>
            <Stage direction="a" theme={t.theme}>
              <ANetWorthView onAdd={() => setOpenModalA(true)} />
            </Stage>
          </DCArtboard>
          <DCArtboard id="a-nw-1920" label="1920×1080 · desktop estándar" width={1920} height={1080}>
            <Stage direction="a" theme={t.theme}>
              <ANetWorthView onAdd={() => setOpenModalA(true)} />
            </Stage>
          </DCArtboard>
          <DCArtboard id="a-nw-1024" label="1024×720 · tablet horizontal / split-screen" width={1024} height={720}>
            <Stage direction="a" theme={t.theme}>
              <ANetWorthView onAdd={() => setOpenModalA(true)} />
            </Stage>
          </DCArtboard>
        </DCSection>

        <DCSection
          id="principios"
          title="Principio · una sola superficie"
          subtitle="Para referencia, el cambio fundamental respecto a la app actual"
        >
          <DCArtboard id="before" label="Antes — recuadros anidados" width={560} height={620}>
            <BeforeNested />
          </DCArtboard>
          <DCArtboard id="after" label="Después — jerarquía tipográfica" width={560} height={620}>
            <AfterFlat />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Tema" />
        <TweakRadio  label="Modo"     value={t.theme}   options={["dark", "light"]} onChange={(v) => setTweak("theme", v)} />
        <TweakRadio  label="Densidad" value={t.density} options={["compact", "regular", "comfy"]} onChange={(v) => setTweak("density", v)} />

        <TweakSection label="Acento" />
        <TweakColor
          label="Hue"
          value={`oklch(0.72 0.10 ${t.accent})`}
          options={ACCENT_OPTIONS.map(o => `oklch(0.72 0.10 ${o.h})`)}
          onChange={(v) => {
            const m = String(v).match(/(\d+(?:\.\d+)?)\)$/);
            if (m) setTweak("accent", Number(m[1]));
          }}
        />

        <TweakSection label="Modal" />
        <TweakToggle label="Superponer en Net Worth" value={openModalA} onChange={setOpenModalA} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
