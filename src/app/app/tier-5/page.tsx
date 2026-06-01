import Link from 'next/link';
import { getUraiTier } from '@/lib/uraiTiers';

export default function Tier5Page() {
  const tier = getUraiTier('tier-5');

  if (!tier) {
    return null;
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 16%, #123242 0%, #05070b 52%, #020308 100%)',
      color: '#eefaff',
      padding: '48px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <section style={{ maxWidth: 980, margin: '0 auto' }}>
        <Link href="/app/tiers" style={{ color: '#8fdcff', textDecoration: 'none' }}>← All tiers</Link>
        <p style={{ marginTop: 32, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#8fdcff', fontSize: 12 }}>
          {tier.label} · {tier.status}
        </p>
        <h1 style={{ fontSize: 58, lineHeight: 1, margin: '12px 0 16px' }}>{tier.name}</h1>
        <p style={{ maxWidth: 760, color: '#c9d9df', fontSize: 20, lineHeight: 1.6 }}>{tier.promise}</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 18,
          marginTop: 34
        }}>
          <Panel title="Modules" items={tier.modules} />
          <Panel title="Permissions" items={tier.permissions} />
          <Panel title="Experience" items={tier.experience} />
        </div>

        <Link href={tier.canonicalPath} style={{
          display: 'inline-flex',
          marginTop: 34,
          color: '#061015',
          background: '#9feaff',
          padding: '12px 18px',
          borderRadius: 999,
          textDecoration: 'none',
          fontWeight: 800
        }}>
          Enter canonical {tier.label}
        </Link>
      </section>
    </main>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <article style={{
      border: '1px solid rgba(143,220,255,0.22)',
      background: 'rgba(255,255,255,0.055)',
      borderRadius: 22,
      padding: 22
    }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <ul style={{ color: '#b9cad3', paddingLeft: 18, lineHeight: 1.65 }}>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}
