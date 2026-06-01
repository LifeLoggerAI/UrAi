import Link from 'next/link';
import { uraiTiers } from '@/lib/uraiTiers';

export default function UraiTiersPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 20%, #102b3a 0%, #05070b 48%, #020308 100%)',
      color: '#eefaff',
      padding: '48px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <section style={{ maxWidth: 1180, margin: '0 auto' }}>
        <p style={{ letterSpacing: '0.24em', textTransform: 'uppercase', color: '#8fdcff', fontSize: 12 }}>
          URAI system lock
        </p>
        <h1 style={{ fontSize: 56, lineHeight: 1, margin: '12px 0 16px' }}>
          Tier 1 → Tier 5 Experience Map
        </h1>
        <p style={{ maxWidth: 760, color: '#b9cad3', fontSize: 18, lineHeight: 1.6 }}>
          The canonical URAI product ladder is now routed through the spatial app universe.
          Tier 1 is the live public home. Higher tiers are structured, gated, and ready for product completion.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 18,
          marginTop: 36
        }}>
          {uraiTiers.map((tier) => (
            <article key={tier.id} style={{
              border: '1px solid rgba(143,220,255,0.22)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025))',
              borderRadius: 24,
              padding: 24,
              boxShadow: '0 24px 80px rgba(0,0,0,0.35)'
            }}>
              <p style={{ color: '#8fdcff', margin: 0, fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                {tier.label} · {tier.status}
              </p>
              <h2 style={{ fontSize: 26, margin: '10px 0' }}>{tier.name}</h2>
              <p style={{ color: '#c9d9df', lineHeight: 1.55 }}>{tier.promise}</p>
              <ul style={{ color: '#aabdc5', paddingLeft: 18, minHeight: 96 }}>
                {tier.modules.slice(0, 4).map((item) => <li key={item}>{item}</li>)}
              </ul>
              <Link href={tier.canonicalPath} style={{
                display: 'inline-flex',
                marginTop: 12,
                color: '#061015',
                background: '#9feaff',
                padding: '10px 14px',
                borderRadius: 999,
                textDecoration: 'none',
                fontWeight: 700
              }}>
                Open {tier.label}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
