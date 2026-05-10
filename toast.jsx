// ─── Toast / feedback global ─────────────────────────────────────────────────
// Sistema de feedback para tornar o protótipo "vivo": qualquer botão sem
// handler explícito ainda confirma visualmente a ação ao clicar.

function ToastHost() {
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => {
    window.showToast = (msg, tone = "good", sub) => {
      const id = Date.now() + Math.random();
      setToasts(t => [...t, { id, msg, tone, sub }]);
      setTimeout(() => {
        setToasts(t => t.filter(x => x.id !== id));
      }, 2800);
    };
    return () => { delete window.showToast; };
  }, []);

  // Delegação global: qualquer .btn ou .btn-mini clicado mostra toast,
  // exceto botões marcados com data-no-toast ou dentro de regiões internas.
  React.useEffect(() => {
    const onClick = (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      // Só mostra toast em botões com classe .btn / .btn-mini / .icon-btn
      const isAction = btn.classList.contains("btn")
                    || btn.classList.contains("btn-mini")
                    || btn.classList.contains("icon-btn");
      if (!isAction) return;

      // Ignorar opt-out e regiões que controlam estado próprio
      if (btn.dataset.noToast === "true") return;
      if (btn.closest("[data-no-toast-zone]")) return;

      // Texto da ação
      const label = btn.dataset.toast
        || btn.getAttribute("aria-label")
        || btn.textContent.trim()
        || btn.title
        || "Ação registrada";

      // Tone vem do data-toast-tone, ou se for crítico no contexto
      const tone = btn.dataset.toastTone
        || (btn.classList.contains("btn-primary") ? "good" : "info");

      // Subtexto contextual
      const sub = btn.dataset.toastSub;

      window.showToast?.(label.length > 60 ? label.slice(0, 58) + "…" : label, tone, sub);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="toast-host" data-no-toast-zone>
      {toasts.map(t => (
        <div key={t.id} className="toast" data-tone={t.tone}>
          <span className="toast-icon">{
            t.tone === "good" ? "✓" :
            t.tone === "warn" ? "!" :
            t.tone === "crit" ? "✕" : "→"
          }</span>
          <div className="toast-body">
            <div className="toast-msg">{t.msg}</div>
            {t.sub && <div className="toast-sub">{t.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

window.ToastHost = ToastHost;
