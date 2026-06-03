"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUraiAuth } from "@/providers/UraiAuthProvider";

type DeleteAccountDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function DeleteAccountDialog({ isOpen, onClose }: DeleteAccountDialogProps) {
  const auth = useUraiAuth();
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText.trim().toUpperCase() === "DELETE";

  const runDelete = async (clearLocal: boolean) => {
    if (!canDelete) return;
    await auth.deleteAccount({ clearLocal });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div className="fixed inset-0 z-[140] grid place-items-center bg-black/65 p-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#090912]/92 p-6 text-white shadow-2xl" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }}>
            <p className="text-xs uppercase tracking-[0.35em] text-white/38">Delete account</p>
            <h2 className="mt-2 text-2xl font-medium">Choose what URAI should remove.</h2>
            <p className="mt-3 text-sm leading-6 text-white/64">Cloud deletion changes account data URAI controls. Local deletion clears this device copy. You can choose one or both.</p>
            <p className="mt-3 rounded-2xl bg-white/[0.055] p-3 text-xs leading-5 text-white/52">This changes data URAI controls. It does not delete data from third-party services. If backend deletion is still processing, the account is marked pending deletion first.</p>
            <p className="mt-3 rounded-2xl bg-white/[0.045] p-3 text-xs leading-5 text-white/46">Before deleting, you may export a permission record from Export Center if that option is available and approved in Passport.</p>
            <label className="mt-4 block text-sm text-white/64">
              Type DELETE to confirm.
              <input value={confirmText} onChange={(event) => setConfirmText(event.target.value)} className="mt-2 w-full rounded-2xl bg-black/24 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10" />
            </label>
            {auth.authError ? <p className="mt-3 rounded-2xl bg-white/[0.08] p-3 text-sm text-white/70">{auth.authError}</p> : null}
            <div className="mt-5 grid gap-2">
              <button disabled={!canDelete} onClick={() => void runDelete(false)} className="rounded-full bg-white/12 px-5 py-3 text-sm text-white disabled:opacity-40">Mark cloud account for deletion</button>
              <button disabled={!canDelete} onClick={() => void runDelete(true)} className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-40">Mark cloud and clear local copy</button>
              <button onClick={onClose} className="rounded-full bg-white/[0.07] px-5 py-3 text-sm text-white/68">Cancel</button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
