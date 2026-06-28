import Link from "next/link";

import styles from "./GenesisProductHome.module.css";

const navItems = [
  { href: "/demo", label: "Demo" },
  { href: "/launch", label: "Launch" },
  { href: "/life-map", label: "Life Map" },
  { href: "/passport", label: "Passport" },
  { href: "/login", label: "Login" },
  { href: "/early-access", label: "Early Access" },
];

const featureCards = [
  {
    href: "/life-map",
    label: "Life Map",
    eyebrow: "Sample memory world",
    body: "A cinematic preview of moments, places, people, time, and meaning arranged as a living constellation.",
    className: styles.lifeMapArt,
  },
  {
    href: "/replay",
    label: "Replay Preview",
    eyebrow: "Genesis demo reel",
    body: "A launch-safe look at where memory-to-cinema can go later, clearly labeled as preview rather than generated private media.",
    className: styles.replayArt,
  },
  {
    href: "/passport",
    label: "Passport / Privacy",
    eyebrow: "User-owned boundary",
    body: "Consent, deletion, export, and private-data systems stay gated until the owner chooses and evidence proves the path.",
    className: styles.passportArt,
  },
  {
    href: "/orb",
    label: "Orb Companion",
    eyebrow: "Interface bridge",
    body: "The living URAI presence that guides the Genesis preview without claiming autonomous action or private-data access.",
    className: styles.orbArt,
  },
];

const exploreLinks = [
  { href: "/demo", label: "Demo Walkthrough", body: "Follow the public-safe guided tour." },
  { href: "/launch", label: "Launch Proof", body: "See the Genesis launch surface and proof path." },
  { href: "/early-access", label: "Early Access", body: "Request entry through the invite-first access gate." },
  { href: "/login", label: "Login Gate", body: "Open the private beta login path without pretending signup is public." },
  { href: "/signup", label: "Signup Gate", body: "See the waitlist-first signup boundary for new accounts." },
  { href: "/life-map", label: "Life Map", body: "Enter the sample memory galaxy." },
  { href: "/focus", label: "Focus", body: "Narrow the field into what matters now." },
  { href: "/replay", label: "Replay", body: "Watch the cinematic preview path." },
  { href: "/orb-chat", label: "Orb Chat", body: "Try the launch-safe companion surface." },
  { href: "/passport", label: "Passport", body: "Review privacy and ownership boundaries." },
  { href: "/waitlist", label: "Waitlist", body: "Join the real waitlist path." },
  { href: "/privacy", label: "Privacy", body: "Read the public privacy posture." },
  { href: "/system", label: "System Status", body: "See what is live, preview, or gated." },
];

export default function GenesisProductHome() {
  return (
    <main className={styles.shell}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.starfield} aria-hidden="true" />
      <div className={styles.horizonGlow} aria-hidden="true" />

      <section className={styles.hero} aria-labelledby="genesis-home-title">
        <nav className={styles.nav} aria-label="URAI Genesis navigation">
          <Link href="/home" className={styles.brand} aria-label="URAI Genesis home">
            <span className={styles.brandMark}>U</span>
            <span>
              <strong>URAI</strong>
              <small>Genesis</small>
            </span>
          </Link>
          <div className={styles.navLinks}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className={styles.heroGrid}>
          <div className={styles.copyColumn}>
            <p className={styles.kicker}>URAI Genesis preview</p>
            <h1 id="genesis-home-title">Your life, becoming a living map.</h1>
            <p className={styles.subhead}>
              A cinematic entry into URAI: sample memories, a glowing Life Map, Replay previews, and privacy boundaries that stay yours.
            </p>
            <div className={styles.ctaRow} aria-label="Primary URAI Genesis actions">
              <Link href="/life-map" className={styles.primaryCta}>
                Enter URAI
              </Link>
              <Link href="/life-map" className={styles.secondaryCta}>
                View Life Map
              </Link>
            </div>
            <p className={styles.trustLine}>
              Launch safety: sample/demo data only. Private data access, passive sensing, generated media, autonomous jobs, provider integrations, XR worlds, and marketplace systems remain gated.
            </p>
          </div>

          <div className={styles.visualColumn} aria-label="URAI Genesis cinematic product visual">
            <div className={styles.cinematicFrame}>
              <div className={styles.skyLayer} aria-hidden="true" />
              <div className={styles.constellationLayer} aria-hidden="true" />
              <div className={styles.orbLayer} aria-hidden="true" />
              <div className={styles.groundLayer} aria-hidden="true" />
              <div className={styles.visualBadge}>Preview / sample-safe</div>
              <div className={styles.visualCaption}>
                <span>Home Orb field</span>
                <strong>Sky, ground, horizon, and memory stars in one launch-safe scene.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features} aria-labelledby="feature-title">
        <div className={styles.sectionHeader}>
          <p>What opens from here</p>
          <h2 id="feature-title">Explore URAI without pretending the future is already unlocked.</h2>
        </div>
        <div className={styles.featureGrid}>
          {featureCards.map((card) => (
            <Link key={card.label} href={card.href} className={styles.featureCard}>
              <span className={[styles.featureArt, card.className].join(" ")} aria-hidden="true" />
              <span className={styles.featureEyebrow}>{card.eyebrow}</span>
              <strong>{card.label}</strong>
              <span>{card.body}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.explore} aria-labelledby="explore-title">
        <div className={styles.sectionHeader}>
          <p>Explore URAI</p>
          <h2 id="explore-title">A clean launch path, not a wall of route pills.</h2>
        </div>
        <div className={styles.exploreGrid}>
          {exploreLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.exploreLink}>
              <strong>{link.label}</strong>
              <span>{link.body}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
