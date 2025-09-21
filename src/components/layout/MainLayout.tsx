"use client";

import Link from "next/link";
import React from "react";
import BugReportButton from "@/components/BugReportButton";
import FeedbackBox from "@/components/FeedbackBox";
import BottomNav from "@/components/layout/BottomNav";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pb-24">{children}</main>
      <footer className="border-t border-white/10 bg-black/80 px-6 py-12 text-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-start">
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/40">Build with us</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Help us tune the Life Movie.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
                Spot a rough edge? Drop a note or fire off a bug report. We ship
                daily and reply within 24 hours.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-white/40">
              <Link
                href="/status"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-semibold uppercase tracking-wide text-white hover:border-white/40 hover:text-white"
              >
                Status board ↗
              </Link>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-semibold uppercase tracking-wide text-white hover:border-white/40 hover:text-white"
              >
                Support docs ↗
              </Link>
              <a
                href="mailto:press@urai.app"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-semibold uppercase tracking-wide text-white hover:border-white/40 hover:text-white"
              >
                Email us
              </a>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-6">
            <FeedbackBox />
            <BugReportButton />
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl text-xs text-white/40">
          © {new Date().getFullYear()} URAI. Opt-in. Local modes. Export anytime.
        </p>
      </footer>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
