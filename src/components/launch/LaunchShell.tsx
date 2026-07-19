"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { addLaunchDocument, trackLaunchEvent } from "@/lib/launch/firebaseClient";
import { createFoundingAccessCheckout, createMakeMineCheckout } from "@/lib/launch/payments";
import {
  NO_AD_COMPLIANCE_ITEMS,
  PRIVATE_APP_ADS_ALLOWED,
  PUBLIC_MEDIA_MONETIZATION_ALLOWED,
  TRUST_COPY,
} from "@/lib/launch/noAds";
import type { FoundingTier, InterestType, PublicPermission } from "@/lib/launch/types";

type LaunchPageKind =
  | "home"
  | "worlds"
  | "make-mine"
  | "founding"
  | "creators"
  | "watch"
  | "trust"
  | "waitlist"
  | "passport";

const socialLinks = [
  "YouTube",
  "TikTok",
  "Instagram",
  "Facebook",
  "X",
  "Threads",
  "Snapchat",
  "Pinterest",
  "LinkedIn",
  "Reddit",
];

const seedVideos = [
  {
    title: "No Ads Inside Your Memory",
    description: "URAI Private stays ad-free. URAI Worlds funds the public signal.",
    category: "Founder Lab",
  },
  {
    title: "Your Phone Has the Fragments",
    description: "URAI builds the world from memory, emotion, voice, and life signals.",
    category: "Memory Cinema",
  },
  {
    title: "Not a Chatbot. A Memory OS.",
    description: "URAI is building the private emotional memory OS.",
    category: "Signal Breakdown",
  },
  {
    title: "The Market Is Validating URAI in Fragments",
    description: "AI companions, memory, video, identity, and voice are converging. URAI unifies the signal.",
    category: "Founder Thesis",
  },
  {
    title: "Your Life Was Never Just Data",
    description: "A cinematic memory-world demo.",
    category: "Memory Cinema",
  },
];

const nav = [
  ["Worlds", "/worlds"],
  ["Make Mine", "/make-mine"],
  ["Founding", "/founding"],
  ["Creators", "/creators"],
  ["Watch", "/watch"],
  ["Trust", "/trust"],
] as const;

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#02040b] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,#4f46e533,transparent_35%),radial-gradient(circle_at_75%_15%,#14b8a633,transparent_30%),linear-gradient(180deg,#02040b,#071015_60%,#120b05)]" />
      <div className="relative z-10">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="font-semibold tracking-[0.45em] text-cyan-100">URAI</Link>
          <nav className="hidden gap-4 text-xs uppercase tracking-[0.22em] text-slate-300 md:flex">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
          <Link href="/waitlist" className="rounded-full border border-cyan-200/40 px-4 py-2 text-xs uppercase tracking-[0.22em] text-cyan-100 hover:bg-cyan-100/10">
            Join
          </Link>
        </header>
        {children}
        <footer className="mx-auto max-w-7xl px-5 py-12 text-sm text-slate-400">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-lg text-white">{TRUST_COPY.adFree}</p>
            <p className="mt-2 max-w-3xl">URAI Worlds is the public media layer. Social, YouTube, creator revenue, sponsorships, and aligned affiliate links stay outside the private memory product.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Hero({ eyebrow, title, subtitle, primaryHref = "/waitlist", primary = "Join Waitlist", secondaryHref = "/worlds", secondary = "Watch URAI Worlds" }: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryHref?: string;
  primary?: string;
  secondaryHref?: string;
  secondary?: string;
}) {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-[1.05fr_.95fr] md:py-24">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{subtitle}</p>
        <p className="mt-5 rounded-2xl border border-amber-200/20 bg-amber-200/10 p-4 text-sm text-amber-100">{TRUST_COPY.adFree}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={primaryHref} className="rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(103,232,249,.3)]">{primary}</Link>
          <Link href={secondaryHref} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">{secondary}</Link>
        </div>
      </div>
      <OrbPanel />
    </section>
  );
}

function OrbPanel() {
  return (
    <div className="relative min-h-[420px] rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur">
      <div className="absolute inset-x-8 top-8 h-40 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-40 rounded-b-[2rem] bg-gradient-to-t from-emerald-950 via-emerald-900/40 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#f8fafc,#67e8f9_30%,#8b5cf6_55%,transparent_72%)] shadow-[0_0_120px_rgba(103,232,249,.55)]" />
      <div className="absolute left-[18%] top-[26%] h-2 w-2 rounded-full bg-white/80 shadow-[0_0_18px_white]" />
      <div className="absolute left-[72%] top-[18%] h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_16px_#67e8f9]" />
      <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Private home shell</p>
        <p className="mt-2 text-white">Glowing orb. Ground layer. Emotional sky. Chat, Life Map, Passport. No ads.</p>
      </div>
    </div>
  );
}

function Cards({ items }: { items: Array<{ title: string; body: string }> }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-5 py-10 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur">
          <h3 className="text-xl font-semibold text-white">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">{item.body}</p>
        </article>
      ))}
    </section>
  );
}

function WaitlistForm() {
  const [status, setStatus] = useState<string>("");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("consentAccepted")) {
      setStatus("Accept the URAI trust/consent promise before joining.");
      return;
    }
    await addLaunchDocument("waitlistEntries", {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      interestType: String(data.get("interestType") || "private_beta") as InterestType,
      desiredMemoryWorld: String(data.get("desiredMemoryWorld") || ""),
      source: "urai_v1_launch_shell",
      consentAccepted: Boolean(data.get("consentAccepted")),
      emailOptIn: Boolean(data.get("emailOptIn")),
      smsOptIn: Boolean(data.get("smsOptIn")),
    });
    await trackLaunchEvent("waitlist_submit", { interestType: data.get("interestType") });
    event.currentTarget.reset();
    setStatus("You’re on the early URAI list. URAI Private is ad-free. Your memory is not ad inventory.");
  }
  return <LaunchForm title="Join the early URAI list" onSubmit={onSubmit} status={status} fields={["name", "email", "phone", "desiredMemoryWorld"]} extra={<>
    <label className="text-sm text-slate-300">Interest<select name="interestType" className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white"><option value="private_beta">Private Beta</option><option value="founding_access">Founding Access</option><option value="make_mine">Make Mine</option><option value="creator">Creator</option><option value="investor">Investor</option><option value="partner">Partner</option><option value="press">Press</option></select></label>
    <Consent />
  </>} />;
}

function MakeMineForm() {
  const [status, setStatus] = useState<string>("");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("consentAccepted")) {
      setStatus("Accept consent before submitting your memory-world request.");
      return;
    }
    const doc = await addLaunchDocument("makeMineRequests", {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      memoryTheme: String(data.get("memoryTheme") || ""),
      storyText: String(data.get("storyText") || ""),
      emotionalTone: String(data.get("emotionalTone") || ""),
      desiredVisualStyle: String(data.get("desiredVisualStyle") || ""),
      privateOnly: Boolean(data.get("privateOnly")),
      publicPermission: String(data.get("publicPermission") || "none") as PublicPermission,
      interestedInFoundingAccess: Boolean(data.get("interestedInFoundingAccess")),
      consentAccepted: Boolean(data.get("consentAccepted")),
      paymentStatus: "unpaid",
      paymentProvider: "none",
      fulfillmentStatus: "new",
    });
    await trackLaunchEvent("make_mine_submit", {});
    await createMakeMineCheckout(doc.id, 99);
    event.currentTarget.reset();
    setStatus("Your Make Mine request has been received. Payment placeholder started for the founding preview.");
  }
  return <LaunchForm title="Start Make Mine" onSubmit={onSubmit} status={status} fields={["name", "email", "phone", "memoryTheme", "emotionalTone", "desiredVisualStyle"]} textarea="storyText" extra={<>
    <label className="text-sm text-slate-300">Public permission<select name="publicPermission" className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white"><option value="none">Private only</option><option value="anonymized">Anonymized</option><option value="okay_to_feature">Okay to feature</option></select></label>
    <Checkbox name="privateOnly" label="Keep this private only" />
    <Checkbox name="interestedInFoundingAccess" label="I’m interested in Founding Access too" />
    <Consent />
  </>} />;
}

function FoundingForm() {
  const [status, setStatus] = useState<string>("");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("consentAccepted")) {
      setStatus("Accept the founding trust promise before continuing.");
      return;
    }
    const tier = String(data.get("tier") || "early_believer") as FoundingTier;
    const doc = await addLaunchDocument("foundingAccessMembers", {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      tier,
      paymentStatus: "unpaid",
      accessStatus: "founding",
      whyURAI: String(data.get("whyURAI") || ""),
      updateOptIn: Boolean(data.get("updateOptIn")),
      consentAccepted: Boolean(data.get("consentAccepted")),
      joinedAt: new Date().toISOString(),
    });
    await trackLaunchEvent("founding_submit", { tier });
    await createFoundingAccessCheckout(doc.id, tier);
    event.currentTarget.reset();
    setStatus("Founding Access request received. Checkout placeholder started.");
  }
  return <LaunchForm title="Join Founding Access" onSubmit={onSubmit} status={status} fields={["name", "email"]} textarea="whyURAI" extra={<>
    <label className="text-sm text-slate-300">Tier<select name="tier" className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white"><option value="early_believer">Early Believer — $99</option><option value="founding_member">Founding Member — $249</option><option value="lab_circle">Lab Circle — $499</option></select></label>
    <Checkbox name="updateOptIn" label="Send me founder updates" />
    <Consent />
  </>} />;
}

function CreatorForm() {
  const [status, setStatus] = useState<string>("");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("consentAccepted") || !data.get("acceptsOriginalAssetRules") || !data.get("acceptsNoPrivateUserDataWithoutConsent")) {
      setStatus("Accept the creator safety rules before applying.");
      return;
    }
    await addLaunchDocument("creatorApplications", {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      creatorType: String(data.get("creatorType") || ""),
      portfolioUrl: String(data.get("portfolioUrl") || ""),
      platformHandles: String(data.get("platformHandles") || ""),
      toolsUsed: String(data.get("toolsUsed") || ""),
      whyURAI: String(data.get("whyURAI") || ""),
      sampleTheme: String(data.get("sampleTheme") || ""),
      acceptsOriginalAssetRules: true,
      acceptsNoPrivateUserDataWithoutConsent: true,
      consentAccepted: true,
      status: "new",
    });
    await trackLaunchEvent("creator_application_submit", {});
    event.currentTarget.reset();
    setStatus("Creator application received. URAI Creators is building the new cinematic language of memory.");
  }
  return <LaunchForm title="Apply as a Creator" onSubmit={onSubmit} status={status} fields={["name", "email", "creatorType", "portfolioUrl", "platformHandles", "toolsUsed", "sampleTheme"]} textarea="whyURAI" extra={<>
    <Checkbox name="acceptsOriginalAssetRules" label="I will use original, licensed, AI-generated, public, or explicitly consented material only" />
    <Checkbox name="acceptsNoPrivateUserDataWithoutConsent" label="I will not use private user data without explicit consent" />
    <Consent />
  </>} />;
}

function LaunchForm({ title, fields, textarea, extra, status, onSubmit }: { title: string; fields: string[]; textarea?: string; extra?: React.ReactNode; status: string; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-5 grid gap-4">
        {fields.map((field) => (
          <label key={field} className="text-sm capitalize text-slate-300">{field.replace(/([A-Z])/g, " $1")}
            <input required={field === "name" || field === "email"} name={field} type={field === "email" ? "email" : "text"} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white outline-none ring-cyan-200/40 focus:ring" />
          </label>
        ))}
        {textarea ? <label className="text-sm capitalize text-slate-300">{textarea.replace(/([A-Z])/g, " $1")}
          <textarea required name={textarea} rows={5} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white outline-none ring-cyan-200/40 focus:ring" />
        </label> : null}
        {extra}
      </div>
      <button className="mt-6 rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950">Submit</button>
      {status ? <p className="mt-4 rounded-xl border border-cyan-200/20 bg-cyan-200/10 p-3 text-sm text-cyan-100">{status}</p> : null}
    </form>
  );
}

function Checkbox({ name, label }: { name: string; label: string }) {
  return <label className="flex gap-3 text-sm text-slate-300"><input name={name} type="checkbox" className="mt-1" />{label}</label>;
}

function Consent() {
  return <label className="flex gap-3 text-sm text-slate-300"><input name="consentAccepted" type="checkbox" className="mt-1" />I accept URAI’s trust promise: private memory is not ad inventory.</label>;
}

export function LaunchPage({ kind }: { kind: LaunchPageKind }) {
  const hero = useMemo(() => {
    switch (kind) {
      case "worlds": return { eyebrow: "URAI Worlds", title: "Your life was never just data.", subtitle: "URAI Worlds turns memory, emotion, identity, voice, and life signals into cinematic AI worlds.", primaryHref: "/make-mine", primary: "Make Mine", secondaryHref: "/watch", secondary: "Watch More" };
      case "make-mine": return { eyebrow: "Make Mine", title: "See your life as a cinematic memory world.", subtitle: "Submit a memory, season, relationship, dream, grief, identity shift, or turning point. URAI turns it into a cinematic memory-world preview.", primaryHref: "#form", primary: "Start Request", secondaryHref: "/trust", secondary: "Read Trust Promise" };
      case "founding": return { eyebrow: "Founding Access", title: "Help build the private memory OS before the world catches up.", subtitle: "Early believers receive founder updates, private build drops, early access, and cinematic memory drops while keeping URAI Private ad-free.", primaryHref: "#form", primary: "Join Founding", secondaryHref: "/worlds", secondary: "See Worlds" };
      case "creators": return { eyebrow: "URAI Creators", title: "Build the new cinematic language of memory.", subtitle: "For AI artists, editors, filmmakers, storytellers, voice artists, narrators, and worldbuilders.", primaryHref: "#form", primary: "Apply", secondaryHref: "/watch", secondary: "Watch Demos" };
      case "watch": return { eyebrow: "URAI Watch", title: "Watch the signal become a world.", subtitle: "Public URAI Worlds videos, founder breakdowns, cinematic memory demos, and signal experiments.", primaryHref: "/worlds", primary: "Explore Worlds", secondaryHref: "/make-mine", secondary: "Make Mine" };
      case "trust": return { eyebrow: "Trust Center", title: "No ads inside your memory.", subtitle: "URAI Private is ad-free. Your memory, voice, emotions, relationships, journal data, passive signals, and personal insights are not ad inventory.", primaryHref: "/waitlist", primary: "Join Waitlist", secondaryHref: "/worlds", secondary: "Public Worlds" };
      case "waitlist": return { eyebrow: "Waitlist", title: "Join the early URAI list.", subtitle: "Be first to see URAI Private, URAI Worlds, Make Mine previews, and Founding Access drops.", primaryHref: "#form", primary: "Join", secondaryHref: "/trust", secondary: "Trust Promise" };
      case "passport": return { eyebrow: "URAI Passport", title: "Your memory. Your permission. Your passport.", subtitle: "URAI Passport is the access and consent layer for private memory, founding status, creator status, and future user-owned data permissions.", primaryHref: "/waitlist", primary: "Get Access", secondaryHref: "/trust", secondary: "Trust Center" };
      default: return { eyebrow: "URAI V1", title: "Not a chatbot. A memory OS.", subtitle: "URAI turns memory, emotion, voice, reflection, and life signals into a private symbolic interface for understanding your life.", primaryHref: "/waitlist", primary: "Join Waitlist", secondaryHref: "/worlds", secondary: "Watch URAI Worlds" };
    }
  }, [kind]);

  return (
    <PublicLayout>
      <Hero {...hero} />
      {kind === "home" ? <Cards items={[{ title: "URAI Private", body: "The sacred private product: orb, ground layer, chat, symbolic life map, and trust-first memory reflection." }, { title: "URAI Worlds", body: "The public signal layer: YouTube, Shorts, Reels, creator media, and cinematic memory demos that fund attention." }, { title: "Make Mine", body: "The fastest paid offer: custom cinematic memory-world previews without turning private memory into ad inventory." }]} /> : null}
      {kind === "worlds" ? <WorldsSections /> : null}
      {kind === "watch" ? <WatchSections /> : null}
      {kind === "trust" ? <TrustSections /> : null}
      {kind === "passport" ? <PassportSections /> : null}
      {kind === "make-mine" ? <section id="form" className="mx-auto max-w-3xl px-5 py-10"><MakeMineForm /></section> : null}
      {kind === "founding" ? <section id="form" className="mx-auto max-w-3xl px-5 py-10"><FoundingForm /></section> : null}
      {kind === "creators" ? <section id="form" className="mx-auto max-w-3xl px-5 py-10"><CreatorForm /></section> : null}
      {kind === "waitlist" ? <section id="form" className="mx-auto max-w-3xl px-5 py-10"><WaitlistForm /></section> : null}
    </PublicLayout>
  );
}

function WorldsSections() {
  return <><Cards items={[{ title: "Public Media Monetization", body: "YouTube, Shorts, Reels, platform-native creator revenue, sponsorships, aligned affiliate links, and owned offers stay in URAI Worlds." }, { title: "Private Separation", body: "URAI Private remains ad-free. Public signal pays. Private trust stays clean." }, { title: "Creator Funnel", body: "AI artists, filmmakers, editors, narrators, and worldbuilders can apply to build public cinematic memory language." }]} /><WatchSections /></>;
}

function WatchSections() {
  return <section className="mx-auto max-w-7xl px-5 py-10"><div className="grid gap-4 md:grid-cols-3">{seedVideos.map((video) => <article key={video.title} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6"><p className="text-xs uppercase tracking-[0.25em] text-cyan-200">{video.category}</p><h3 className="mt-3 text-xl font-semibold text-white">{video.title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{video.description}</p></article>)}</div><div className="mt-6 flex flex-wrap gap-3">{socialLinks.map((link) => <span key={link} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">{link}</span>)}</div></section>;
}

function TrustSections() {
  return <Cards items={[{ title: "Ad-Free Private App Promise", body: "URAI Private does not use banner ads, interstitials, rewarded ads, watch-ad-to-unlock mechanics, or third-party ad placements." }, { title: "Public vs Private", body: "URAI Worlds is public media. URAI Private is private memory. We do not use private memories publicly without explicit consent." }, { title: "Not Therapy", body: "URAI is not therapy, medical care, diagnosis, crisis intervention, or a replacement for professional support." }, { title: "AI Disclosure", body: "Some URAI Worlds visuals, scripts, voices, and cinematic previews may be AI-assisted or AI-generated." }, { title: "Creator Safety", body: "Creators may use original, licensed, AI-generated, public, or explicitly consented material only." }, { title: "Sponsorship Separation", body: "Sponsorships and platform revenue belong in public URAI Worlds content, not inside the private memory product." }]} />;
}

function PassportSections() {
  return <Cards items={[{ title: "Access Status", body: "Passport tracks waitlist, founding, creator, beta, and admin access states." }, { title: "Consent Preferences", body: "Email, SMS, creator contact, public Make Mine usage, and future data marketplace interest are explicit controls." }, { title: "Future Data Rights", body: "Export/delete placeholders and user-owned permission infrastructure are staged for later layers." }]} />;
}

export function PrivateHomeShell() {
  return (
    <main className="min-h-screen bg-[#02040b] text-slate-100">
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 md:grid-cols-[1fr_360px]">
        <div className="min-h-[680px] rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,#38bdf833,transparent_35%),linear-gradient(180deg,#02040b,#041019_55%,#173018)] p-6 shadow-2xl">
          <div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.32em] text-cyan-200">URAI Private</p><Link href="/trust" className="text-xs text-amber-100">{TRUST_COPY.noAds}</Link></div>
          <div className="relative mt-12 min-h-[460px]">
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff,#67e8f9_30%,#8b5cf6_55%,transparent_72%)] shadow-[0_0_140px_rgba(103,232,249,.55)]" />
            <div className="absolute bottom-0 left-0 right-0 h-52 rounded-[2rem] bg-gradient-to-t from-emerald-950 via-emerald-900/70 to-transparent" />
          </div>
          <p className="rounded-2xl border border-amber-200/20 bg-amber-200/10 p-4 text-amber-100">{TRUST_COPY.adFree}</p>
        </div>
        <aside className="grid gap-4">
          {[
            ["Chat", "Open the orb companion panel."],
            ["Life Map", "Enter symbolic memory constellations."],
            ["Passport", "Review access and consent controls."],
            ["Trust", "Read no-ad and public/private separation rules."],
          ].map(([title, body]) => <Link href={title === "Passport" ? "/passport" : title === "Trust" ? "/trust" : "#"} key={title} onClick={() => trackLaunchEvent(title === "Chat" ? "chat_entry_click" : title === "Life Map" ? "life_map_opened" : title === "Passport" ? "passport_opened" : "no_ads_notice_viewed")} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6"><h2 className="text-xl font-semibold text-white">{title}</h2><p className="mt-2 text-sm text-slate-300">{body}</p></Link>)}
        </aside>
      </section>
    </main>
  );
}

export function AdminShell() {
  return (
    <main className="min-h-screen bg-[#02040b] px-5 py-8 text-slate-100">
      <section className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">Admin Command Center</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">URAI V1 Launch Shell</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Launch operations for waitlist, Make Mine, Founding Access, creators, public worlds, Signal Ledger, payment events, and no-ad compliance.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">{["Waitlist", "Make Mine", "Founding", "Creators", "Public Worlds", "Watch Videos", "Signal Ledger", "Payment Events"].map((item) => <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5"><p className="text-sm text-slate-400">Section</p><h2 className="mt-1 text-lg font-semibold text-white">{item}</h2><p className="mt-3 text-xs text-slate-400">Firestore-backed admin table placeholder.</p></div>)}</div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6"><h2 className="text-2xl font-semibold">Launch Task Checklist</h2><ul className="mt-4 space-y-2 text-sm text-slate-300">{["Publish /, /worlds, /make-mine, /founding, /creators, /watch, /trust, /waitlist, /passport", "Activate waitlist, Make Mine, Founding, and Creator forms", "Connect checkout placeholders", "Create social accounts", "Post first 5 clips", "Verify analytics events", "Verify Signal Ledger"].map((item) => <li key={item}>□ {item}</li>)}</ul></div>
          <div className="rounded-3xl border border-amber-200/20 bg-amber-200/10 p-6"><h2 className="text-2xl font-semibold text-amber-100">No-Ad Compliance</h2><p className="mt-2 text-sm text-amber-100">PRIVATE_APP_ADS_ALLOWED = {String(PRIVATE_APP_ADS_ALLOWED)} · PUBLIC_MEDIA_MONETIZATION_ALLOWED = {String(PUBLIC_MEDIA_MONETIZATION_ALLOWED)}</p><ul className="mt-4 space-y-2 text-sm text-amber-50">{NO_AD_COMPLIANCE_ITEMS.map((item) => <li key={item}>□ {item}</li>)}</ul></div>
        </div>
      </section>
    </main>
  );
}
