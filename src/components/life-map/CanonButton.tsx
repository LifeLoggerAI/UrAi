"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface CanonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  active?: boolean;
}

const variantClasses = {
  primary:
    "border-cyan-100/60 bg-gradient-to-br from-cyan-100/95 to-blue-200/80 text-slate-950 shadow-[0_0_30px_rgba(125,211,252,0.24)]",
  secondary:
    "border-cyan-100/20 bg-slate-950/62 text-cyan-50 hover:border-cyan-100/38 hover:bg-cyan-100/10",
  ghost:
    "border-cyan-100/12 bg-white/[0.035] text-cyan-50/82 hover:border-cyan-100/28 hover:bg-white/[0.07]",
  danger:
    "border-rose-200/25 bg-rose-950/30 text-rose-50 hover:border-rose-100/45 hover:bg-rose-900/34",
};

export default function CanonButton({ children, variant = "secondary", active = false, className = "", type = "button", ...props }: CanonButtonProps) {
  return (
    <button
      type={type}
      data-active={active}
      className={`min-h-11 min-w-11 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-xl transition duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-cyan-100/70 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-40 motion-safe:hover:scale-[1.025] motion-safe:active:scale-[0.97] ${variantClasses[variant]} ${active ? "ring-1 ring-cyan-100/45" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
