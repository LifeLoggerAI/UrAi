"use client";

import { FormEvent, useState } from "react";
import { useUraiAuth } from "@/providers/UraiAuthProvider";

type SignInPanelProps = {
  onDone?: () => void;
  onContinueLocal?: () => void;
};

export function SignInPanel({ onDone, onContinueLocal }: SignInPanelProps) {
  const auth = useUraiAuth();
  const [mode, setMode] = useState<"signin" | "create" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (mode === "reset") await auth.sendPasswordReset(email);
    else if (mode === "create") await auth.createAccountWithEmail(email, password);
    else await auth.signInWithEmail(email, password);
    if (!auth.authError) onDone?.();
  };

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
      <p className="text-sm leading-6 text-white/64">URAI can stay local. Sign in only when you want cloud sync or cross-device continuity.</p>
      {auth.authError ? <p className="rounded-2xl bg-white/[0.08] p-3 text-sm text-white/70">{auth.authError}</p> : null}
      <div className="grid gap-2">
        <button onClick={onContinueLocal} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">Continue locally</button>
        <button onClick={async () => { await auth.signInAnonymouslyIfNeeded(); onDone?.(); }} className="rounded-full bg-white/12 px-4 py-2 text-sm text-white">Continue anonymously</button>
        <button onClick={async () => { await auth.signInWithGoogle(); onDone?.(); }} className="rounded-full bg-white/[0.07] px-4 py-2 text-sm text-white/74">Sign in with Google</button>
      </div>
      <form onSubmit={submit} className="space-y-2">
        <input aria-label="Email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" className="w-full rounded-2xl bg-black/24 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/32" />
        {mode !== "reset" ? <input aria-label="Password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" className="w-full rounded-2xl bg-black/24 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/32" /> : null}
        <button type="submit" className="w-full rounded-full bg-white/12 px-4 py-2 text-sm text-white">{mode === "reset" ? "Send password reset" : mode === "create" ? "Create account" : "Sign in with email"}</button>
      </form>
      <div className="flex flex-wrap justify-center gap-3 text-xs text-white/46">
        <button onClick={() => setMode("signin")}>Sign in</button>
        <button onClick={() => setMode("create")}>Create account</button>
        <button onClick={() => setMode("reset")}>Reset password</button>
      </div>
    </div>
  );
}
