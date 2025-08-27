// This layout will house the tracking snippets for marketing campaigns.
import Script from 'next/script';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* GA4 */}
      <Script id="ga4-base" strategy="afterInteractive">
        {`
          window.__consent = window.__consent || { analytics: false }; // flip to true after consent
          window.dataLayer = window.dataLayer || [];
          function gtag(){ if(!window.__consent.analytics) return; dataLayer.push(arguments); }

          // capture UTM for later
          (function(){
            const p = new URLSearchParams(location.search);
            window.__utm = {
              source: p.get('utm_source') || '',
              medium: p.get('utm_medium') || '',
              campaign: p.get('utm_campaign') || ''
            };
          })();
        `}
      </Script>
      <Script
        id="ga4-main"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>

      {/* Meta Pixel (Facebook Pixel) */}
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){ if(!window.__consent.analytics) return; n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)}; if(!f._fbq)f._fbq=n; n.push=n; n.loaded=!0; n.version='2.0';
          n.queue=[]; t=b.createElement(e); t.async=!0; t.src=v; s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s)
          }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>

      {/* TikTok Pixel */}
      <Script id="tiktok-pixel-init" strategy="afterInteractive">
        {`
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","setUserProperties","trackForm","trackClick"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID}');
            const _ttq_page = ttq.page; ttq.page = function(){ if(!window.__consent.analytics) return; _ttq_page.apply(ttq, arguments); };
            ttq.page();
          }(window, document, 'ttq');
        `}
      </Script>

      {children}

      <div id="consent" style={{position:'fixed',bottom:'16px',left:'16px',right:'16px',padding:'12px',borderRadius:'12px',background:'#111',color:'#fff',display:'none',zIndex:1000}}>
        This site uses analytics for improvements. OK?
        <button id="consent-yes" style={{marginLeft:'1rem', padding:'4px 8px', background:'green', border:'none', color:'white', borderRadius:'4px', cursor:'pointer'}}>Allow</button>
        <button id="consent-no" style={{marginLeft:'0.5rem', padding:'4px 8px', background:'red', border:'none', color:'white', borderRadius:'4px', cursor:'pointer'}}>No thanks</button>
      </div>

      <Script id="consent-handler">
        {`
          (function(){
            const key='urai-consent';
            const saved = localStorage.getItem(key);
            const bar = document.getElementById('consent');
            function setConsent(ok){
              window.__consent = { analytics: !!ok };
              localStorage.setItem(key, ok ? '1':'0');
              if(bar) bar.style.display='none';
            }
            if (saved===null && bar) { bar.style.display='flex'; }
            else { window.__consent = { analytics: saved==='1' }; }
            const yesBtn = document.getElementById('consent-yes');
            if (yesBtn) yesBtn.onclick = ()=> setConsent(true);
            const noBtn = document.getElementById('consent-no');
            if (noBtn) noBtn.onclick  = ()=> setConsent(false);
          })();
        `}
      </Script>
    </>
  );
}
