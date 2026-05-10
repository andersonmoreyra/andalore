// ─── App principal ───────────────────────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "density": "regular",
  "accentHue": 35,
  "showTimeline": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = React.useState("dashboard");
  const [selectedWO, setSelectedWO] = React.useState("OS-2839");
  const [assetDetail, setAssetDetail] = React.useState(null);

  // Verificar autenticação ao montar o componente
  React.useEffect(() => {
    if (!Auth.checkAuth()) {
      return; // Auth.checkAuth() já mostra a tela de login
    }
  }, []);

  // Aplica tema/densidade no <html>
  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = t.dark ? "dark" : "light";
    root.dataset.density = t.density;
    root.style.setProperty("--accent-h", t.accentHue);
  }, [t.dark, t.density, t.accentHue]);

  const accentColor = `oklch(65% 0.18 ${t.accentHue})`;

  const goToOrders = (id) => {
    if (id) setSelectedWO(id);
    setScreen("ordens");
  };

  // Atende navegação vinda do command palette
  React.useEffect(() => {
    const onNav = (e) => setScreen(e.detail);
    const onAsset = (e) => setAssetDetail(e.detail);
    window.addEventListener("__nav", onNav);
    window.addEventListener("__open_asset", onAsset);
    return () => {
      window.removeEventListener("__nav", onNav);
      window.removeEventListener("__open_asset", onAsset);
    };
  }, []);

  return (
    <div className="shell">
      <TopBar accent={accentColor} />
      <Sidebar active={screen} onChange={setScreen} />
      <CommandPalette />
      <AssetDetailDrawer
        assetId={assetDetail}
        onClose={() => setAssetDetail(null)}
        onOpenWO={goToOrders}
      />
      <ToastHost />
      <NewWOModal />
      <main className="main">
        {screen === "dashboard" && <DashboardScreen onOpenWO={goToOrders} onNav={setScreen} />}
        {screen === "ordens" && <WorkOrdersScreen selectedId={selectedWO} onSelect={setSelectedWO} />}
        {screen === "agenda" && <ScheduleScreen />}
        {screen === "ativos" && <PlantMapScreen onOpenWO={goToOrders} />}
        {screen === "equipe" && <TeamScreen />}
        {screen === "solicitacoes" && <RequestsScreen />}
        {screen === "estoque" && <StockScreen />}
        {screen === "relatorios" && <ReportsScreen />}
      </main>

      <TweaksPanel title="Ajustes do painel">
        <TweakSection label="Aparência" />
        <TweakToggle label="Modo escuro (sala de controle)" value={t.dark}
                     onChange={(v) => setTweak('dark', v)} />
        <TweakRadio label="Densidade" value={t.density}
                    options={['compact', 'regular', 'confort']}
                    onChange={(v) => setTweak('density', v)} />
        <TweakSlider label="Tom do acento" value={t.accentHue} min={0} max={360} unit="°"
                     onChange={(v) => setTweak('accentHue', v)} />
        <TweakSection label="Painéis" />
        <TweakToggle label="Mostrar timeline do turno" value={t.showTimeline}
                     onChange={(v) => setTweak('showTimeline', v)} />
        <TweakSection label="Navegação" />
        <TweakSelect label="Tela inicial" value={screen}
                     options={[
                       { value: 'dashboard', label: 'Sala de controle' },
                       { value: 'ordens', label: 'Ordens de serviço' },
                       { value: 'agenda', label: 'Agenda' },
                       { value: 'ativos', label: 'Planta' },
                       { value: 'equipe', label: 'Equipe' },
                     ]}
                     onChange={setScreen} />
      </TweaksPanel>
    </div>
  );
}

function PlaceholderScreen({ title, sub }) {
  return (
    <div className="screen-pad">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">{title}</h1>
          <p className="screen-sub">{sub}</p>
        </div>
      </div>
      <div className="card" style={{ padding: 60, textAlign: "center", color: "var(--ink-3)" }}>
        <div style={{ fontSize: 32, marginBottom: 14, opacity: 0.4 }}>—</div>
        <div style={{ fontSize: 13 }}>Tela em desenvolvimento neste protótipo.</div>
        <div style={{ fontSize: 11.5, marginTop: 6 }}>
          Use Sala de controle, Ordens, Agenda, Planta ou Equipe para navegar pelas telas finalizadas.
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
