import Link from "next/link";
import { AssetFactoryRoutePanel } from "@/components/urai/assets/AssetFactoryRoutePanel";

export const metadata = {
  title: "URAI Ground World",
  description:
    "The URAI Ground World: a launch-safe real-life operating layer with reception, privacy, objects, schedules, and private workforce previews.",
};

const routeRail = [
  ["Home", "/home"],
  ["Ground", "/ground"],
  ["Life Map", "/life-map"],
  ["Focus", "/focus"],
  ["Replay", "/replay"],
  ["Mirror", "/mirror"],
  ["Passport", "/passport"],
  ["Privacy", "/privacy-controls"],
  ["Status", "/status"],
] as const;

const agents = [
  {
    name: "Welcome Guide",
    zone: "Reception",
    role: "Explains what URAI can help with and keeps the experience human before anything private opens.",
  },
  {
    name: "Schedule Steward",
    zone: "Planning table",
    role: "Turns appointments, deadlines, routines, and open loops into a calm next-plan preview.",
  },
  {
    name: "Privacy Steward",
    zone: "Consent sanctuary",
    role: "Keeps permissions, exports, deletion, and model access visible before any deeper surface expands.",
  },
  {
    name: "Wellness Guide",
    zone: "Recovery corner",
    role: "Reflects focus, pressure, and recovery context as guidance only, never diagnosis or medical truth.",
  },
  {
    name: "Relationship Liaison",
    zone: "Connections desk",
    role: "Helps stage check-ins, repair threads, reminders, and conversations for owner review.",
  },
  {
    name: "Logistics Helper",
    zone: "Errands bay",
    role: "Organizes deliveries, returns, tasks, home services, and handoffs without acting without approval.",
  },
] as const;

const objects = [
  ["Keys by the door", "Departures, errands, appointments, and return-home rituals stay connected to the day."],
  ["Kitchen table", "Meals, bills, notes, calls, repairs, and family context become inspectable life context."],
  ["Work console", "Projects, messages, files, and unfinished decisions route to the right helper."],
  ["Memory case", "Important objects can open context before ascending into the Life Map galaxy."],
  ["Calendar tower", "Deadlines, routines, windows, and timing are staged without pretending to live for you."],
  ["Health signal", "Body, focus, recovery, and pressure signals are private context only, never a diagnosis."],
] as const;

const zones = [
  ["Reception", "Start here. Ask what matters, see what is safe, and choose the next surface."],
  ["Privacy Sanctuary", "Consent, ownership, export, deletion, and provenance stay visible at the world level."],
  ["Planning Table", "Calendar, work, relationships, logistics, and routines become calm staged tasks."],
  ["Memory Archive", "Real objects can connect back to meaning, places, replay threads, and review gates."],
] as const;

export default function GroundPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070503] text-white selection:bg-amber-100/25">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,232,180,0.20),transparent_25%),radial-gradient(circle_at_18%_62%,rgba(45,212,191,0.15),transparent_28%),radial-gradient(circle_at_84%_58%,rgba(96,165,250,0.13),transparent_30%),linear-gradient(180deg,#150c06_0%,#071622_42%,#071009_100%)]" />
      <div className="pointer-events-none absolute inset-x-[-20%] bottom-[-18%] h-[56%] rounded-[50%] border border-amber-100/10 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.18),rgba(6,78,59,0.30)_42%,rgba(2,6,23,0.96)_78%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-[repeating-radial-gradient(ellipse_at_50%_100%,transparent_0_42px,rgba(253,230,138,0.10)_43px_45px),linear-gradient(180deg,transparent,rgba(0,0,0,0.58))]" />
      <div className="pointer-events-none absolute left-1/2 top-[42%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/10 bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.80),rgba(186,230,253,0.42)_16%,rgba(14,116,144,0.20)_44%,transparent_68%)] shadow-[0_0_150px_rgba(125,211,252,0.24)]" />

      <header className="relative z-30 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 md:px-8">
        <Link href="/home" className="rounded-full border border-amber-100/18 bg-black/34 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.26em] text-amber-50/78 backdrop-blur-xl hover:text-white">
          URAI Ground World
        </Link>
        <nav className="flex flex-wrap justify-end gap-2" aria-label="URAI route rail">
          {routeRail.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              data-active={href === "/ground" ? "true" : "false"}
              className="rounded-full border border-white/10 bg-black/28 px-3 py-2 text-[0.64rem] font-black uppercase tracking-[0.16em] text-white/58 backdrop-blur-xl transition hover:border-cyan-100/30 hover:text-white data-[active=true]:border-cyan-100/45 data-[active=true]:bg-cyan-100 data-[active=true]:text-slate-950"
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="relative z-20 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-8 px-5 pb-10 md:grid-cols-[0.88fr_1.12fr] md:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-amber-100/20 bg-amber-100/8 px-4 py-2 text-[0.64rem] font-black uppercase tracking-[0.32em] text-amber-100/76 backdrop-blur-xl">
            Enterable real-life layer
          </p>
          <h1 className="mt-6 text-5xl font-black leading-[0.88] tracking-[-0.075em] text-white sm:text-6xl lg:text-7xl">
            Your private world helps your real life.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Ground is the lived place below the galaxy: reception, privacy, objects, routines, work, relationships, calendars, and a private workforce that stages the next useful move for owner approval.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/life-map" className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-[0_18px_60px_rgba(251,191,36,0.18)] transition hover:-translate-y-0.5 hover:bg-cyan-50">
              Ascend to Life Map
            </Link>
            <Link href="/privacy-controls" className="rounded-full border border-cyan-100/20 bg-cyan-100/8 px-5 py-3 text-sm font-bold text-cyan-50 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-cyan-100/12">
              Review permissions
            </Link>
            <Link href="/home" className="rounded-full border border-white/15 bg-white/[0.07] px-5 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/12">
              Return Home
            </Link>
          </div>
        </div>

        <div className="relative min-h-[42rem]">
          <div className="absolute left-1/2 top-[18%] h-56 w-72 -translate-x-1/2 rounded-t-[9rem] border border-cyan-100/14 bg-[radial-gradient(circle_at_50%_34%,rgba(186,230,253,0.24),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-[0_30px_110px_rgba(8,47,73,0.20)]" />
          <div className="absolute left-[8%] top-[20%] h-80 w-36 rounded-3xl border border-amber-100/12 bg-white/[0.045] backdrop-blur-xl" />
          <div className="absolute right-[4%] top-[32%] h-72 w-44 rounded-3xl border border-cyan-100/12 bg-white/[0.04] backdrop-blur-xl" />

          <div className="absolute left-1/2 top-[52%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_25%,#fff,rgba(186,230,253,0.92)_18%,rgba(14,116,144,0.72)_48%,rgba(2,6,23,0.92)_78%)] shadow-[0_0_130px_rgba(125,211,252,0.45)]">
            <span className="absolute -inset-10 rounded-full border border-cyan-100/10" />
            <span className="absolute inset-5 rounded-full border border-white/15" />
          </div>

          <section className="absolute inset-x-0 bottom-0 grid gap-3 rounded-[2.5rem] border border-amber-100/14 bg-black/34 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:grid-cols-2 lg:grid-cols-3" aria-label="Ground workforce">
            {agents.map((agent, index) => (
              <article key={agent.name} className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-cyan-100/20 bg-cyan-100/10 text-xs font-black text-cyan-50 shadow-[0_0_35px_rgba(125,211,252,0.20)]">
                    0{index + 1}
                  </span>
                  <span className="h-2.5 w-2.5 rounded-full bg-lime-200 shadow-[0_0_20px_rgba(190,242,100,0.75)]" />
                </div>
                <p className="text-[0.58rem] font-black uppercase tracking-[0.20em] text-cyan-100/55">{agent.zone}</p>
                <h2 className="mt-2 text-base font-black tracking-[-0.03em] text-white">{agent.name}</h2>
                <p className="mt-2 text-xs leading-5 text-white/60">{agent.role}</p>
              </article>
            ))}
          </section>
        </div>
      </section>

      <AssetFactoryRoutePanel route="/ground" title="Ground Asset Factory" />

      <section className="relative z-20 mx-auto grid max-w-7xl gap-4 px-5 pb-10 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div className="rounded-[2rem] border border-cyan-100/14 bg-cyan-100/[0.05] p-5 backdrop-blur-2xl">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-cyan-100/64">World zones</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {zones.map(([name, detail]) => (
              <article key={name} className="rounded-3xl border border-white/10 bg-black/22 p-4">
                <h2 className="text-sm font-black text-white">{name}</h2>
                <p className="mt-2 text-xs leading-5 text-white/58">{detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-amber-100/14 bg-amber-100/[0.055] p-5 backdrop-blur-2xl">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-amber-100/64">Inspectable objects</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {objects.map(([name, detail]) => (
              <details key={name} className="group rounded-3xl border border-white/10 bg-black/24 p-4 open:border-cyan-100/35">
                <summary className="cursor-pointer list-none text-sm font-black text-white marker:hidden">
                  {name}
                </summary>
                <p className="mt-2 text-xs leading-5 text-white/60">{detail}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto max-w-7xl px-5 pb-14 md:px-8">
        <div className="rounded-[1.6rem] border border-amber-100/18 bg-amber-100/[0.06] p-4 text-sm leading-6 text-amber-50/76 backdrop-blur-xl">
          <strong className="text-amber-50">Launch safety:</strong> Ground is a public, sample-data world preview. It does not claim autonomous action, passive sensing, medical inference, or private account access. It proves the route and product shape are live.
        </div>
      </section>
    </main>
  );
}
