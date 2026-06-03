"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SignInPanel } from "./SignInPanel";
import { useUraiAuth } from "@/providers/UraiAuthProvider";

type UraiAccountGateProps = {
  isOpen: boolean;
  onClose: () => void;
  reason?: "sync" | "exports" | "account" | "general";
};

export function UraiAccountGate({ isOpen, onClose, reason = "general" }: UraiAccountGateProps) {
  const auth = useUraiAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const body = reason === "sync"
    ? "Sign in only if you want cloud sync. Passport still controls what can sync."
    : "You can stay on this device, or sign in to sync your Genesis across devices.";

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div className="fixed inset-0 z-[120] grid place-items-center bg-black/55 p-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#090912]/88 p-6 text-white shadow-2xl" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }}>
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.35em] text-white/38">Account</p>
              <h2 className="mt-2 text-2xl font-medium">Keep URAI yours.</h2>
              <p className="mt-3 text-sm leading-6 text-white/64">{body}</p>
            </div>
            {showSignIn ? (
              <SignInPanel onDone={onClose} onContinueLocal={() => { auth.continueLocalOnly(); onClose(); }} />
            ) : (
              <div className="space-y-3">
                <button onClick={() => { auth.continueLocalOnly(); onClose(); }} className="w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-black">Continue on this device</button>
                <button onClick={() => setShowSignIn(true)} className="w-full rounded-full bg-white/12 px-5 py-3 text-sm text-white">Sign in</button>
                <button onClick={() => setShowSignIn(true)} className="w-full rounded-full bg-white/[0.07] px-5 py-3 text-sm text-white/72">Create account</button>
                <button onClick={onClose} className="w-full rounded-full px-5 py-2 text-sm text-white/48">Not now</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
