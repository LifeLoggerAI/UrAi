"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Star, BarChart2, MessageCircle, ShieldCheck } from "lucide-react";

const items = [
  { href: "/home", label: "Home", Icon: Home, featured: false },
  { href: "/life-map", label: "Life Map", Icon: Star, featured: false },
  { href: "/demo", label: "Demo", Icon: MessageCircle, featured: true },
  { href: "/mirror", label: "Mirror", Icon: BarChart2, featured: false },
  { href: "/passport", label: "Passport", Icon: ShieldCheck, featured: false },
] as const;

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary URAI navigation"
      className="sticky bottom-3 z-40 mx-auto mb-3 mt-10 flex min-h-16 w-[calc(100%-1.5rem)] max-w-3xl items-center justify-around rounded-[2rem] border border-cyan-100/14 bg-slate-950/82 px-3 py-2 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:bottom-5 sm:mb-5 sm:px-4"
    >
      {items.map(({ href, label, Icon, featured }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        if (featured) {
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              aria-label="Open URAI public demo"
              className={`-mt-6 grid h-14 w-14 place-items-center rounded-full border transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 sm:h-16 sm:w-16 ${
                active
                  ? "border-cyan-100/70 bg-cyan-100 text-slate-950 shadow-[0_0_42px_rgba(103,232,249,0.45)]"
                  : "border-cyan-200/40 bg-cyan-200 text-slate-950 shadow-[0_0_35px_rgba(103,232,249,0.35)]"
              }`}
            >
              <Icon className="h-6 w-6" />
            </Link>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-w-12 flex-col items-center gap-1 rounded-2xl px-2 py-1 text-[10px] font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 sm:min-w-16 sm:text-xs ${
              active ? "bg-cyan-100/[0.12] text-cyan-50" : "text-white/58 hover:bg-white/[0.055] hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;