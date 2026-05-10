function StockScreen() {
  const [tab, setTab] = React.useState('parts');

  return (
    <div className="screen-content">
      <div className="tabs">
        <button className={`tab ${tab === 'parts' ? 'active' : ''}`} onClick={() => setTab('parts')}>
          📦 Peças
        </button>
        <button className={`tab ${tab === 'assets' ? 'active' : ''}`} onClick={() => setTab('assets')}>
          ⚙️ Equipamentos
        </button>
      </div>

      {tab === 'parts' && <PartsManager />}
      {tab === 'assets' && <AssetManager />}
    </div>
  );
}

window.StockScreen = StockScreen;
