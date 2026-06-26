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
        body: "No. URAI is a reflective demo surface, not therapy, diagnosis, emergency support, or clinical care.",
      },
      {
        label: "Do I need to log anything?",
        body: "No manual tracking is required for the public demo. Sensitive passive signals remain gated until consent, privacy, export/delete, and live evidence requirements are proven.",
      },
      {
        label: "Can I export or delete my data?",
        body: "Export and delete controls are required before private account features can be claimed live. The public demo keeps those flows gated until verified.",
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
          <h1 className="text-3xl font-semibold sm:text-4xl">We are here to help</h1>
          <p className="text-base leading-relaxed text-white/60">
            If you are seeing something off, have privacy questions, or want onboarding support, drop us a note.
            Public-demo support is human-reviewed and does not make gated systems live.
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
                        className="inline-flex min-h-9 items-center rounded-full text-white underline decoration-dashed underline-offset-4 hover:decoration-solid"
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
            <a href="mailto:press@urai.app" className="mx-1 inline-flex min-h-9 items-center rounded-full text-white underline underline-offset-4">
              press@urai.app
            </a>
            for launch support or urgent corrections.
          </p>
        </section>
      </div>
    </main>
  );
}
