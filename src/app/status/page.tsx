import Link from "next/link";
import StatusGrid from "@/components/StatusGrid";
import styles from "./status.module.css";

export const metadata = {
  title: "Status & Reliability",
  description:
    "Public Genesis launch status, preview boundaries, and evidence-gated readiness for URAI.",
};

const readinessChecks = [
  {
    label: "Build and type checks",
    status: "Evidence tracked",
    detail: "Validated through release commands when a launch candidate is prepared.",
  },
  {
    label: "Route smoke tests",
    status: "Evidence tracked",
    detail: "Public routes stay gated until smoke results are recorded in launch proof.",
  },
  {
    label: "Visual screenshots",
    status: "Evidence tracked",
    detail: "Genesis route screenshots are collected during visual QA passes.",
  },
  {
    label: "Firebase rules and storage checks",
    status: "Pending evidence",
    detail: "Rules, indexes, and Storage remain evidence-gated before claims expand.",
  },
  {
    label: "Privacy and consent verification",
    status: "Evidence tracked",
    detail: "Passport and consent defaults keep sensitive layers closed by default.",
  },
  {
    label: "Live service monitoring",
    status: "Not connected",
    detail: "This page does not claim external uptime monitoring or incident history.",
  },
];

const evidenceRows = [
  ["Status source", "Static Genesis launch preview"],
  ["Current branch", "Evidence pending in release proof"],
  ["Commit hash", "Evidence pending in release proof"],
  ["Last verified build", "Recorded when release checks are run"],
  ["Deploy target", "Firebase Hosting evidence required"],
  ["Known limitations", "Dynamic service wiring and private actions remain gated"],
];

export default function StatusPage() {
  return (
    <main className={styles.statusPage}>
      <div className={styles.background} aria-hidden="true">
        <span className={styles.orbitOne} />
        <span className={styles.orbitTwo} />
        <span className={styles.securityGrid} />
      </div>

      <div className={styles.shell}>
        <nav className={styles.topNav} aria-label="Status navigation">
          <Link href="/home" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true" />
            URAI
          </Link>
          <div className={styles.navLinks}>
            <Link href="/home">Home</Link>
            <Link href="/life-map">Life Map</Link>
            <Link href="/passport">Passport</Link>
            <Link href="/support">Support</Link>
          </div>
        </nav>

        <header className={styles.hero}>
          <section className={styles.heroCopy} aria-labelledby="status-title">
            <p className={styles.eyebrow}>Platform Health</p>
            <h1 id="status-title">URAI Status &amp; Reliability</h1>
            <p className={styles.headline}>Public launch posture, shown honestly.</p>
            <p className={styles.bodyCopy}>
              This dashboard reflects the current public demo launch posture. Systems remain
              marked as preview until deploy logs, tests, screenshots, and smoke evidence are
              verified.
            </p>
            <div className={styles.heroActions}>
              <Link href="/home" className={styles.primaryAction}>
                Return Home
              </Link>
              <Link href="/life-map" className={styles.secondaryAction}>
                Open Life Map
              </Link>
            </div>
          </section>

          <aside className={styles.trustPanel} aria-label="Launch trust posture">
            <div className={styles.trustOrb} aria-hidden="true">
              <span />
            </div>
            <p className={styles.trustLabel}>Static launch preview</p>
            <h2>Evidence first. Claims second.</h2>
            <p>
              No fake uptime, no invented incident history, and no private service claims without
              proof.
            </p>
            <div className={styles.trustSignals}>
              <span>Preview-labelled</span>
              <span>Privacy-gated</span>
              <span>Smoke-evidence required</span>
            </div>
          </aside>
        </header>

        <StatusGrid />

        <section className={styles.readinessPanel} aria-labelledby="readiness-title">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Readiness Evidence</p>
            <h2 id="readiness-title">How readiness is verified</h2>
            <p>
              Checks are treated as evidence only when they are run and recorded. Unknown systems
              stay labelled as pending, preview, gated, or not connected.
            </p>
          </div>
          <div className={styles.readinessGrid}>
            {readinessChecks.map((item) => (
              <article key={item.label} className={styles.readinessCard}>
                <div className={styles.checkIcon} aria-hidden="true">
                  {item.status === "Not connected" ? "!" : "OK"}
                </div>
                <div>
                  <h3>{item.label}</h3>
                  <p className={styles.readinessStatus}>{item.status}</p>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.evidencePanel} aria-labelledby="evidence-title">
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Transparency</p>
            <h2 id="evidence-title">Launch evidence snapshot</h2>
            <p>
              This public page does not fetch private deploy logs or external monitoring feeds. When
              live proof is absent, the field stays pending instead of being guessed.
            </p>
          </div>
          <dl className={styles.evidenceList}>
            {evidenceRows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.supportPanel} aria-labelledby="support-title">
          <div>
            <p className={styles.eyebrow}>Need help?</p>
            <h2 id="support-title">Support and next actions</h2>
            <p>
              If something looks degraded, use the public support path or return to a stable Genesis
              surface. Feedback capture is routed through existing public support surfaces.
            </p>
          </div>
          <div className={styles.supportActions}>
            <Link href="/support">Support Docs</Link>
            <Link href="/passport">Open Passport</Link>
            <a href="mailto:support@urai.app">Email Support</a>
          </div>
        </section>
      </div>
    </main>
  );
}
