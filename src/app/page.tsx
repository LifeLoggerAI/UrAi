import Link from "next/link";

export const metadata = {
  title: "URAI | Give it one memory",
  description: "Give URAI one memory and watch it become a living world."
};

export default function Page() {
  return (
    <main className="urai-entry-shell">
      <section className="entry-card" aria-labelledby="urai-entry-title">
        <p className="eyebrow">URAI</p>
        <h1 id="urai-entry-title">Give URAI one memory. Watch it become a world.</h1>
        <p className="lede">
          Start with a thought, moment, dream, voice-note transcript, or scene from your life.
          URAI turns it into the first piece of a living cinematic world.
        </p>
        <div className="actions" aria-label="Start URAI">
          <Link className="primary" href="/start">Start</Link>
          <Link className="secondary" href="/home">Enter existing world</Link>
        </div>
        <p className="note">No giant setup. No explanation wall. Add one piece of life and let the world reveal itself.</p>
      </section>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <style>{styles}</style>
    </main>
  );
}

const styles = `
  .urai-entry-shell{min-height:100dvh;display:grid;place-items:center;overflow:hidden;position:relative;background:radial-gradient(circle at 50% 20%,rgba(103,232,249,.18),transparent 34%),radial-gradient(circle at 15% 70%,rgba(168,85,247,.16),transparent 34%),linear-gradient(180deg,#020617,#030712 58%,#000);color:white;padding:24px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
  .entry-card{position:relative;z-index:2;width:min(720px,100%);border:1px solid rgba(255,255,255,.13);border-radius:32px;background:rgba(2,6,23,.62);box-shadow:0 28px 120px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(24px);padding:clamp(28px,7vw,72px);text-align:left}
  .eyebrow{margin:0 0 16px;color:rgba(125,211,252,.9);font-size:.78rem;font-weight:800;letter-spacing:.28em;text-transform:uppercase}
  h1{margin:0;max-width:680px;font-size:clamp(2.55rem,8.5vw,5.8rem);line-height:.9;letter-spacing:-.075em;text-wrap:balance}
  .lede{margin:24px 0 0;max-width:590px;color:rgba(226,232,240,.78);font-size:clamp(1.02rem,2vw,1.24rem);line-height:1.6}
  .actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:34px}.actions a{display:inline-flex;align-items:center;justify-content:center;min-height:52px;border-radius:999px;padding:0 22px;text-decoration:none;font-weight:800;transition:transform .18s ease,border-color .18s ease,background .18s ease}.actions a:hover{transform:translateY(-1px)}
  .primary{background:white;color:#020617;box-shadow:0 16px 50px rgba(255,255,255,.16)}.secondary{border:1px solid rgba(255,255,255,.16);color:rgba(255,255,255,.9);background:rgba(255,255,255,.05)}
  .note{margin:22px 0 0;max-width:520px;color:rgba(148,163,184,.8);font-size:.95rem;line-height:1.55}.ambient{position:absolute;border-radius:999px;filter:blur(80px);opacity:.38;pointer-events:none}.ambient-one{width:360px;height:360px;right:-110px;top:12%;background:rgba(56,189,248,.38)}.ambient-two{width:420px;height:420px;left:-130px;bottom:2%;background:rgba(192,132,252,.26)}
  @media(max-width:640px){.entry-card{border-radius:24px}.actions{display:grid}.actions a{width:100%}}
`;
