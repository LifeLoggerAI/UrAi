import Link from "next/link";

export const metadata = {
  title: "Support | URAI",
  description: "Find answers, privacy notes, and ways to reach the URAI team.",
};

const supportSections = [
  {
    title: "Quick answers",
    items: [
      {
        label: "Is URAI therapy?",
        body: "Nope. It’s a reflective tool. We prompt for licensed help whenever things feel clinical.",
      },
      {
        label: "Do I need to log anything?",
        body: "No manual tracking. URAI relies on passive signals and annotations you approve.",
      },
      {
        label: "Can I export or delete my data?",
        body: "Yes. Every account has a one-tap export + delete flow under Profile → Privacy.",
      },
    ],
  },
  {
    title: "Helpful routes",
    links: [
      { label: "Status page", href: "/status" },
      { label: "Privacy & security", href: "/privacy" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl space-y-12 px-6 pb-24 pt-20">
        <header className="space-y-4 text-balance">
          <p className="text-sm uppercase tracking-[0.35em] text-white/50">Support</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">We’re here to help</h1>
          <p className="text-base leading-relaxed text-white/60">
            If you’re seeing something off, have privacy questions, or want onboarding support, drop us a note.
            We reply within 24 hours (often much faster during launch week).
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          {supportSections.map((section) => (
            <article key={section.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              {section.items ? (
                <ul className="mt-4 space-y-4 text-sm text-white/70">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <p className="font-semibold text-white">{item.label}</p>
                      <p className="mt-1 text-white/60">{item.body}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.links ? (
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-white underline decoration-dashed underline-offset-4 hover:decoration-solid"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 p-6 text-sm leading-relaxed text-white/70">
          <h2 className="text-lg font-semibold text-white">Need a human?</h2>
          <p className="mt-2">
            Email
            <a href="mailto:press@urai.app" className="text-white underline underline-offset-4">
              {" "}
              press@urai.app
            </a>
            {" "}or DM @urai on X. For enterprise pilots, reply with “pilot” and we’ll send the setup doc.
          </p>
        </section>
      </div>
    </main>
  );
}
