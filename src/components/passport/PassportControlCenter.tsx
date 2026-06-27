'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';

import { PassportLayerGroup } from './PassportLayerGroup';
import { PassportStatusSummary } from './PassportStatusSummary';
import { PassportLayerId } from '../../lib/passport';
import './Passport.css';

const CORE_REFLECTION_LAYERS: PassportLayerId[] = ['lifemap', 'ground', 'mirror', 'intelligence', 'companion_context'];
const PROTECTED_LAYERS: PassportLayerId[] = ['shadow', 'legacy', 'export'];
const PASSIVE_SOURCES_LAYERS: PassportLayerId[] = ['passive_data', 'audio', 'location', 'health', 'gmail', 'calendar', 'contacts', 'motion', 'camera'];
const EXPERIENCE_LAYERS: PassportLayerId[] = ['notifications', 'spatial', 'system'];
const ADMIN_LAYERS: PassportLayerId[] = ['admin'];

type PassportNotice = {
  message: string;
  tone: 'safe' | 'review' | 'closed';
};

const SECTION_LINKS = [
  { href: '#core-reflection', label: 'Core' },
  { href: '#protected', label: 'Protected' },
  { href: '#passive-sources', label: 'Passive' },
  { href: '#experience', label: 'Experience' },
  { href: '#support', label: 'Support' },
];

export const PassportControlCenter = () => {
  const [notice, setNotice] = useState<PassportNotice>({
    tone: 'safe',
    message: 'Closed layers stay closed until you open them. Protected layers require review.',
  });

  const scrollToSection = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleLayerAction = useCallback((nextNotice: PassportNotice) => {
    setNotice(nextNotice);
  }, []);

  return (
    <main className="passport-shell">
      <div className="passport-ambient" aria-hidden="true">
        <span className="passport-ambient__ring passport-ambient__ring--outer" />
        <span className="passport-ambient__ring passport-ambient__ring--inner" />
        <span className="passport-ambient__thread passport-ambient__thread--one" />
        <span className="passport-ambient__thread passport-ambient__thread--two" />
      </div>

      <nav className="passport-topbar" aria-label="Passport navigation">
        <Link href="/home" className="passport-brand-link" aria-label="Return to URAI Home">
          <span>URAI</span>
          <strong>Passport</strong>
        </Link>
        <div className="passport-topbar__links">
          <Link href="/life-map">Life Map</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/status">Status</Link>
          <Link href="/system">System</Link>
          <Link href="/support">Support</Link>
        </div>
      </nav>

      <section className="passport-hero" aria-labelledby="passport-title">
        <div className="passport-hero__copy">
          <p className="passport-eyebrow">Consent Passport</p>
          <h1 id="passport-title">Your URAI Passport</h1>
          <p className="passport-lede">URAI only opens what you choose.</p>
          <p className="passport-copy">
            Every layer begins closed. Opening a layer records your choice. Sensitive sources require explicit approval before anything is connected.
          </p>
          <div className="passport-hero__actions">
            <button type="button" onClick={() => scrollToSection('core-reflection')}>
              Start Passport review
            </button>
            <button type="button" onClick={() => scrollToSection('passive-sources')} className="passport-secondary-button">
              Review passive sources
            </button>
          </div>
        </div>

        <div className="passport-vault-core" aria-label="URAI Passport vault status visual">
          <div className="passport-vault-core__seal" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p>Closed by default</p>
          <strong>Consent controls the door.</strong>
          <small>Opening a layer is a preference. Real account, browser, device, or provider access requires a separate permission step.</small>
        </div>
      </section>

      <PassportStatusSummary />

      <section className="passport-guided-review" aria-labelledby="passport-review-title">
        <div>
          <p className="passport-eyebrow">Guided review</p>
          <h2 id="passport-review-title">Move through the vault in order.</h2>
          <p>
            Start with product layers, pause at protected sources, then decide whether any optional passive preference should be recorded. Nothing begins collecting from this screen.
          </p>
        </div>
        <ol>
          <li><span>01</span> Review Core Reflection</li>
          <li><span>02</span> Keep Protected layers sealed unless reviewed</li>
          <li><span>03</span> Confirm passive sources remain permission-bound</li>
          <li><span>04</span> Return to Home, Life Map, or Support</li>
        </ol>
      </section>

      <p className={`passport-inline-notice passport-inline-notice--${notice.tone}`} role="status" aria-live="polite">
        {notice.message}
      </p>

      <nav className="passport-section-nav" aria-label="Passport sections">
        {SECTION_LINKS.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>

      <PassportLayerGroup
        sectionId="core-reflection"
        eyebrow="Private product layers"
        title="Core Reflection"
        layerIds={CORE_REFLECTION_LAYERS}
        description="Private product layers that shape your URAI experience. They can be opened as preferences without granting external source access."
        onLayerAction={handleLayerAction}
      />
      <PassportLayerGroup
        sectionId="protected"
        eyebrow="Sealed boundaries"
        title="Protected"
        layerIds={PROTECTED_LAYERS}
        description="High-sensitivity layers stay sealed until reviewed. They do not reveal private data from this launch surface."
        onLayerAction={handleLayerAction}
      />
      <PassportLayerGroup
        sectionId="passive-sources"
        eyebrow="Optional and permission-bound"
        title="Passive Sources"
        layerIds={PASSIVE_SOURCES_LAYERS}
        description="Optional sources may require device, account, browser, or provider approval. Opening a layer here records a Passport preference only."
        onLayerAction={handleLayerAction}
      />
      <section className="passport-passive-boundary" aria-labelledby="passive-boundary-title">
        <div>
          <p className="passport-eyebrow">Passive source boundary</p>
          <h2 id="passive-boundary-title">Opening a preference is not collection.</h2>
          <p>
            Gmail, Calendar, Contacts, Camera, Microphone, Health, Location, Motion, and passive signals require their own account, browser, device, or provider approval before anything can connect.
          </p>
        </div>
        <div className="passport-passive-boundary__cards" aria-label="Passive source safeguards">
          <article>
            <strong>No silent tracking</strong>
            <span>Nothing starts in the background from this screen.</span>
          </article>
          <article>
            <strong>Separate permission</strong>
            <span>Device and account sources need explicit real permission flows.</span>
          </article>
          <article>
            <strong>Revocable boundary</strong>
            <span>Future live sources must support consent, export, delete, and revoke gates.</span>
          </article>
        </div>
      </section>
      <PassportLayerGroup
        sectionId="experience"
        eyebrow="Interface controls"
        title="Experience"
        layerIds={EXPERIENCE_LAYERS}
        description="Interface layers that change how URAI feels and communicates. External permissions still remain separate."
        onLayerAction={handleLayerAction}
      />
      <PassportLayerGroup
        sectionId="admin"
        eyebrow="Restricted"
        title="Admin"
        layerIds={ADMIN_LAYERS}
        description="Restricted operational controls. Public users cannot open these controls and they do not expose raw private data."
        onLayerAction={handleLayerAction}
      />

      <section id="support" className="passport-support-panel" aria-labelledby="passport-support-title">
        <div>
          <p className="passport-eyebrow">Trust and support</p>
          <h2 id="passport-support-title">Need help reading a boundary?</h2>
          <p>
            Passport is designed to be reversible, conservative, and owner-controlled. If feedback capture is unavailable in this environment, use Support for time-sensitive public demo questions.
          </p>
        </div>
        <div className="passport-support-panel__actions">
          <Link href="/status">Status Board</Link>
          <Link href="/support">Support Docs</Link>
          <a href="mailto:support@urai.app">Email support</a>
        </div>
      </section>
    </main>
  );
};
