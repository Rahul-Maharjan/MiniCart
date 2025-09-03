import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (msg, opts = {}) => {
      const id = ++idCounter;
      const toast = {
        id,
        msg,
        type: opts.type || "success",
        ttl: opts.ttl || 3000,
      };
      setToasts((t) => [...t, toast]);
      if (toast.ttl > 0) {
        setTimeout(() => remove(id), toast.ttl);
      }
      return id;
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <div className="fixed z-[999] top-4 right-4 flex flex-col gap-2 w-72 max-w-[90vw]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`group rounded-md border px-3 py-2 text-sm shadow bg-white/90 backdrop-blur-sm flex items-start gap-2 animate-fade-in border-slate-200 ${
              t.type === "success"
                ? "before:bg-green-500"
                : t.type === "error"
                ? "before:bg-red-500"
                : "before:bg-blue-500"
            } relative overflow-hidden`}
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-current opacity-70" />
            <div className="flex-1 text-slate-700 leading-snug">{t.msg}</div>
            <button
              onClick={() => remove(t.id)}
              className="text-slate-400 hover:text-slate-700 transition text-xs font-medium"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <style>{`
      @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0);} }
      .animate-fade-in { animation: fadeIn .18s ease-out; }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
