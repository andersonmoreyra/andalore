const ToastContext = React.createContext({push:()=>{}});
function ToastHost({children}){const [toasts,setToasts]=React.useState([]);const push=(msg)=>{const id=Date.now();setToasts(t=>[...t,{id,msg}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),2600)};return <ToastContext.Provider value={{push}}>{children}<div className="toast-host">{toasts.map(t=><div className="toast" key={t.id}>{t.msg}</div>)}</div></ToastContext.Provider>}
function useToast(){return React.useContext(ToastContext)}
