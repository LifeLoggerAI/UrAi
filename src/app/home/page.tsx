const stars = [
  ["Recovery bloom", 15, 28, 18, "#86efac"],
  ["Memory star", 36, 18, 13, "#7dd3fc"],
  ["Council signal", 67, 35, 19, "#c4b5fd"],
  ["Quiet threshold", 80, 68, 15, "#fde68a"],
  ["Life thread", 32, 73, 12, "#f0abfc"],
  ["Social constellation", 56, 58, 11, "#67e8f9"],
] as const;

const cards = [
  ["Home Field", "/home/", "Your private starting space — grounded, alive, and personal."],
  ["Memory Galaxy", "/life-map/", "A symbolic map of meaningful moments, patterns, and life chapters."],
  ["Replay", "/replay/", "A cinematic way to revisit emotional seasons and turning points."],
  ["Passport", "/privacy-controls/", "Your permission layer for access, consent, export, and deletion."],
] as const;

export const metadata = {
  title: "URAI Home Field",
  description: "URAI Home Field with sky, orb, ground, companion, and Memory Galaxy gateway.",
};

export default function Page() {
  return (
    <main style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "#02040b", color: "white", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 8%, rgba(56,189,248,.30), transparent 28%), radial-gradient(circle at 18% 72%, rgba(34,197,94,.24), transparent 25%), radial-gradient(circle at 78% 46%, rgba(168,85,247,.24), transparent 30%), linear-gradient(180deg,#030712 0%,#082038 48%,#04130f 78%,#020403 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 42%, rgba(255,255,255,.10), transparent 34%), radial-gradient(circle at 52% 69%, rgba(125,211,252,.12), transparent 20%)" }} />
      <div style={{ position: "absolute", left: "-10%", right: "-10%", bottom: "-18%", height: "38%", borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(74,222,128,.42), rgba(15,23,42,.92) 58%, #020617 78%)", filter: "blur(4px)" }} />

      {stars.map(([label, x, y, size, color]) => (
        <span key={label} aria-hidden="true" style={{ position: "absolute", zIndex: 1, left: `${x}%`, top: `${y}%`, width: size, height: size, borderRadius: 999, background: color, boxShadow: `0 0 ${size * 3.2}px ${color}` }} />
      ))}

      <section style={{ position: "relative", zIndex: 2, maxWidth: 1240, margin: "0 auto", padding: 28, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18 }}>
          <div>
            <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: ".34em", fontSize: 10, color: "rgba(207,250,254,.62)", fontWeight: 800 }}>URAI</p>
            <h1 style={{ margin: "6px 0 0", fontSize: 28, letterSpacing: "-.04em" }}>Home Field</h1>
          </div>
          <nav aria-label="URAI navigation" style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {[
              ["Memory Galaxy", "/life-map/"],
              ["Replay", "/replay/"],
              ["Passport", "/privacy-controls/"],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{ color: "white", textDecoration: "none", border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.06)", borderRadius: 999, padding: "10px 14px", fontSize: 13, fontWeight: 800 }}>{label}</a>
            ))}
          </nav>
        </header>

        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, alignItems: "center" }}>
          <article style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(2,6,23,.42)", backdropFilter: "blur(22px)", boxShadow: "0 28px 90px rgba(0,0,0,.34)", borderRadius: 38, padding: 30 }}>
            <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: ".34em", fontSize: 10, color: "rgba(207,250,254,.62)", fontWeight: 800 }}>Private emotional intelligence</p>
            <h2 style={{ margin: "14px 0 0", maxWidth: 760, fontSize: "clamp(54px,7.8vw,104px)", lineHeight: .86, letterSpacing: "-.08em", fontWeight: 950 }}>Your life becomes a living map.</h2>
            <p style={{ maxWidth: 700, margin: "20px 0 0", color: "rgba(255,255,255,.72)", fontSize: 18, lineHeight: 1.65 }}>URAI is a private emotional field for memory, motion, voice, place, reflection, and time. Your Home Field, Orb Companion, Ground, Memory Galaxy, Symbolic Replay, Council, Privacy Center, and Passport foundation come together as one living interface.</p>
            <p style={{ maxWidth: 680, margin: "16px 0 0", color: "rgba(255,255,255,.68)", fontSize: 16, lineHeight: 1.6 }}>Private by default. User-owned by design. No ads inside URAI.</p>
            <a href="/life-map/" aria-label="Open Memory Galaxy" style={{ display: "block", position: "relative", overflow: "hidden", height: 320, marginTop: 24, borderRadius: 32, border: "1px solid rgba(125,211,252,.24)", background: "radial-gradient(circle at 50% 40%, rgba(255,255,255,.16), transparent 55%), linear-gradient(145deg, rgba(8,47,73,.70), rgba(2,6,23,.95))", textDecoration: "none", color: "white" }}>
              <span style={{ position: "absolute", left: 24, top: 22, textTransform: "uppercase", letterSpacing: ".28em", fontSize: 10, color: "rgba(255,255,255,.58)", fontWeight: 800 }}>Tap the sky to open your Memory Galaxy</span>
              {stars.map(([label, x, y, size, color]) => (
                <i key={label} aria-label={label} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: size + 9, height: size + 9, borderRadius: 999, transform: "translate(-50%,-50%)", background: color, boxShadow: `0 0 ${size * 4}px ${color}` }} />
              ))}
            </a>
          </article>

          <aside style={{ display: "grid", gap: 14 }}>
            <div style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(2,6,23,.42)", backdropFilter: "blur(22px)", boxShadow: "0 28px 90px rgba(0,0,0,.34)", borderRadius: 34, padding: 24, display: "flex", gap: 18, alignItems: "center" }}>
              <div aria-hidden="true" style={{ width: 116, height: 116, borderRadius: 999, background: "radial-gradient(circle, white 0 14%, #7dd3fc 18% 29%, rgba(168,85,247,.7) 43%, rgba(34,197,94,.5) 72%)", boxShadow: "0 0 86px rgba(125,211,252,.56)", flex: "none" }} />
              <div>
                <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: ".34em", fontSize: 10, color: "rgba(207,250,254,.62)", fontWeight: 800 }}>Orb companion</p>
                <h3 style={{ fontSize: 32, margin: "7px 0 0", letterSpacing: "-.04em" }}>Council presence</h3>
                <p style={{ color: "rgba(255,255,255,.62)", lineHeight: 1.55 }}>Quiet guidance for reflection, memory, and emotional navigation.</p>
              </div>
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,.12)", background: "rgba(2,6,23,.42)", backdropFilter: "blur(22px)", boxShadow: "0 28px 90px rgba(0,0,0,.34)", borderRadius: 26, padding: 18 }}>
              <b>Passport & Permissions</b>
              <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,.62)", lineHeight: 1.55 }}>See, change, export, or revoke what URAI can access — including memory, voice, location, biometric, social, device, and future marketplace permissions.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12 }}>
              {cards.map(([title, href, copy]) => (
                <a key={title} href={href} style={{ minHeight: 112, borderRadius: 24, padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between", textDecoration: "none", color: "white", border: "1px solid rgba(255,255,255,.12)", background: "rgba(2,6,23,.42)", backdropFilter: "blur(22px)" }}>
                  <b>{title}</b>
                  <span style={{ color: "rgba(255,255,255,.62)", lineHeight: 1.55 }}>{copy}</span>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
