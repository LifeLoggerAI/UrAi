"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Toast = { id: string; kind?: "info"|"success"|"error"; text: string };
const ToastCtx = createContext<{
  toasts: Toast[];
  push: (t: Omit<Toast,"id">) => void;
  remove: (id: string) => void;
}>({ toasts: [], push: () => {}, remove: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast,"id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, ...t }]);
    setTimeout(() => setToasts((prev) => prev.filter(x => x.id !== id)), 4000);
  }, []);
  const remove = useCallback((id: string) => setToasts((p)=>p.filter(x=>x.id!==id)), []);
  const value = useMemo(()=>({ toasts, push, remove }), [toasts, push, remove]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed top-3 right-3 z-[9999] space-y-2">
        {toasts.map(t => (
          <div key={t.id}
               className={`px-3 py-2 rounded-md shadow text-sm text-white
                 ${t.kind==="error" ? "bg-red-600/90" : t.kind==="success" ? "bg-emerald-600/90" : "bg-neutral-800/90"}`}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToasts(){ return useContext(ToastCtx); }
