import Link from "next/link";
import styles from "@/app/status/status.module.css";

type ServiceState = "operational" | "preview" | "needs-verification" | "offline";

type ServiceStatus = {
  id: string;
  label: string;
  summary: string;
  evidence: string;
  status: ServiceState;
  action?: { label: string; href: string };
};

const STATUS_LABELS: Record<ServiceState, { label: string; intent: string }> = {
  operational: {
    label: "Operational",
    intent: "Confirmed public route surface",
  },
  preview: {
    label: "Preview Mode",
    intent: "Launch-safe static preview",
  },
  "needs-verification": {
    label: "Needs Verification",
    intent: "Waiting on deploy or smoke evidence",
  },
  offline: {
    label: "Offline",
    intent: "Not available on public preview",
  },
};

const SERVICES: ServiceStatus[] = [
  {
    id: "web-app",
    label: "URAI Web App",
    status: "operational",
    summary: "Public visual routes are available on the Genesis web surface.",
    evidence: "Static route and hosting evidence required before broader production claims.",
    action: { label: "Open Home", href: "/home" },
  },
  {
    id: "life-map",
    label: "Life Map & Mirror",
    status: "operational",
    summary: "Life Map, Focus, Replay, Passport, privacy, and terms routes are part of the public preview.",
    evidence: "Visual and route smoke evidence must remain current for launch readiness.",
    action: { label: "Open Life Map", href: "/life-map" },
  },
  {
    id: "preview",
    label: "Public Preview",
    status: "preview",
    summary: "Genesis is presented as a static launch-safe preview with demo/sample boundaries.",
    evidence: "Dynamic service wiring awaits the next backend proof pass.",
    action: { label: "View Launch", href: "/launch" },
  },
  {
    id: "private-actions",
    label: "Private Actions",
    status: "needs-verification",
    summary: "Write actions, provider-backed generation, and private service calls remain off the public preview surface.",
    evidence: "Requires auth, consent, owner-scoped storage, tests, deploy logs, and smoke evidence.",
    action: { label: "Open Passport", href: "/passport" },
  },
];

const SUMMARY = [
  { label: "Public Web App", status: "Operational", state: "operational" },
  { label: "Life Map / Mirror", status: "Operational", state: "operational" },
  { label: "Public Preview", status: "Preview Mode", state: "preview" },
  { label: "Private Actions", status: "Needs Verification", state: "needs-verification" },
] satisfies Array<{ label: string; status: string; state: ServiceState }>;

const updatedAt = "Static launch preview - updated when release evidence changes";

export default function StatusGrid() {
  return (
    <section className={styles.statusGridSection} aria-labelledby="service-map-title">
      <div className={styles.summaryStrip} aria-label="Top readiness summary">
        {SUMMARY.map((item) => (
          <div key={item.label} className={styles.summaryItem} data-state={item.state}>
            <span>{item.label}</span>
            <strong>{item.status}</strong>
          </div>
        ))}
      </div>

      <div className={styles.sectionHeader}>
        <p className={styles.eyebrow}>Live Service Map</p>
        <h2 id="service-map-title">What is available right now</h2>
        <p>
          A static-safe launch heartbeat for public visitors. This page does not claim external
          monitoring, uptime percentages, or private backend health.
        </p>
        <p className={styles.updatedAt}>{updatedAt}</p>
      </div>

      <div className={styles.serviceGrid}>
        {SERVICES.map((service) => {
          const tone = STATUS_LABELS[service.status];
          return (
            <article key={service.id} className={styles.serviceCard} data-state={service.status}>
              <div className={styles.serviceCardHeader}>
                <div>
                  <p className={styles.serviceIntent}>{tone.intent}</p>
                  <h3>{service.label}</h3>
                </div>
                <span className={styles.statusBadge} data-state={service.status}>
                  <span aria-hidden="true" />
                  {tone.label}
                </span>
              </div>
              <p className={styles.serviceSummary}>{service.summary}</p>
              <p className={styles.serviceEvidence}>
                <strong>Evidence:</strong> {service.evidence}
              </p>
              {service.action ? (
                <Link href={service.action.href} className={styles.cardAction}>
                  {service.action.label}
                </Link>
              ) : (
                <span className={styles.cardActionDisabled}>No public action configured</span>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
