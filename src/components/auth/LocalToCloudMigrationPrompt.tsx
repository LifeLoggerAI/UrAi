"use client";

import { AnimatePresence, motion } from "framer-motion";

type LocalToCloudMigrationPromptProps = {
  isOpen: boolean;
  onKeepLocal: () => void;
  onMergeSafeData: () => void;
  onReviewPassportFirst: () => void;
};

export function LocalToCloudMigrationPrompt({
  isOpen,
  onKeepLocal,
  onMergeSafeData,
  onReviewPassportFirst,
}: LocalToCloudMigrationPromptProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div className="fixed inset-0 z-[130] grid place-items-center bg-black/60 p-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#090912]/90 p-6 text-white shadow-2xl" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }}>
            <p className="text-xs uppercase tracking-[0.35em] text-white/38">Local data</p>
            <h2 className="mt-2 text-2xl font-medium">Bring this device with you?</h2>
            <p className="mt-3 text-sm leading-6 text-white/64">You have URAI data on this device. Do you want to keep it local, merge safe data into your account, or review Passport first?</p>
            <p className="mt-3 rounded-2xl bg-white/[0.055] p-3 text-xs leading-5 text-white/52">Safe merge does not include Shadow, Legacy, Exports, or Companion memory. Restrictive Passport choices win.</p>
            <div className="mt-5 grid gap-2">
              <button onClick={onKeepLocal} className="rounded-full bg-white/[0.07] px-5 py-3 text-sm text-white/74">Keep local</button>
              <button onClick={onMergeSafeData} className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black">Merge safe data</button>
              <button onClick={onReviewPassportFirst} className="rounded-full bg-white/12 px-5 py-3 text-sm text-white">Review Passport first</button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
