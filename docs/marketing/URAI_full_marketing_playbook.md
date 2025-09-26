# URAI Full Marketing Playbook

## Table of Contents
- [Launch Overview](#launch-overview)
  - [Next → Next → Next Execution Plan](#next--next--next-execution-plan)
  - [Launch Phase Timelines](#launch-phase-timelines)
- [Influencer & Investor Targeting Maps](#influencer--investor-targeting-maps)
  - [Influencer Persona Grid](#influencer-persona-grid)
  - [Investor Outreach Matrix](#investor-outreach-matrix)
- [Firebase Automation Snippets](#firebase-automation-snippets)
  - [Hosting Rewrites](#hosting-rewrites)
  - [GA4 Measurement](#ga4-measurement)
  - [Cloud Functions Automation](#cloud-functions-automation)
- [Subject-Line Matrices](#subject-line-matrices)
  - [Launch Emails](#launch-emails)
  - [Investor Updates](#investor-updates)
- [Measurement & KPIs](#measurement--kpis)
  - [Acquisition Metrics](#acquisition-metrics)
  - [Engagement & Retention Metrics](#engagement--retention-metrics)
  - [Revenue & Funding Metrics](#revenue--funding-metrics)

## Launch Overview

### Next → Next → Next Execution Plan
1. **Next (Execute Today)**
   - Finalize beta waitlist segmentation and trigger onboarding flows.
   - Refresh landing page hero copy with AI copilot value prop; deploy via Firebase Hosting.
   - Trigger influencer seeding kit shipments and share URAI explainer deck.
   - QA GA4 event tags against latest build; confirm conversion funnels in DebugView.
2. **Next² (Execute This Week)**
   - Run live onboarding webinar, capture Q&A for knowledge base, and publish highlight reel.
   - Launch coordinated multi-channel announcement (email, LinkedIn, Discord) with trackable UTMs.
   - Initiate warm intros to target pre-seed investors; align on diligence data room contents.
   - Deploy Firebase Remote Config experiment testing in-product upgrade prompts.
3. **Next³ (Execute This Month)**
   - Scale partner integrations campaign with co-marketing assets and shared webinars.
   - Expand influencer program into niche AI/mental wellness communities with referral codes.
   - Roll out automated investor update cadence using Firebase Functions + SendGrid.
   - Report on KPI performance, optimize lifecycle messaging, and prep for Series Seed outreach.

### Launch Phase Timelines
| Phase | Objectives | Key Activities | Owners | Tools/Assets |
| --- | --- | --- | --- | --- |
| **Pre-Launch (T-4 to T-1 weeks)** | Build anticipation & collect qualified waitlist | Persona surveys, beta onboarding, influencer teasers | Marketing Lead, Product Marketing, Community Manager | Typeform, Firebase Hosting, Airtable | 
| **Launch Week (T0)** | Drive sign-ups & usage | Press outreach, launch webinar, daily social drops, GA4 live monitoring | Marketing Lead, Founder, Support Lead | Firebase Hosting, GA4, StreamYard, Buffer |
| **Stabilize (T+1 to T+3 weeks)** | Convert trial to active users | Lifecycle email nurtures, in-app guides, success stories, onboarding analytics | Lifecycle PM, CS Lead | Customer.io, Firebase Functions, Loom |
| **Scale (T+4 weeks onward)** | Expand reach & raise capital | Partner campaigns, investor pipeline, paid experimentation, feature PR | Growth Lead, Founder, Partnerships | HubSpot, Pitch, Notion, Firebase Remote Config |

## Influencer & Investor Targeting Maps

### Influencer Persona Grid
| Persona | Audience Size | Platform Focus | Key Message Angle | Sample Handles | Incentive Structure |
| --- | --- | --- | --- | --- | --- |
| **AI Wellness Guides** | 20K-100K | YouTube, TikTok | "URAI as your AI-assisted wellbeing navigator" | @thecalmai, @mindfulai | Exclusive access, affiliate rev share |
| **Therapist-Educators** | 5K-30K | Instagram, Substack | "Clinical credibility with AI-augmented care" | @therapisttechie, @drmindbalance | Continuing education, co-created content |
| **Founder-Operators** | 10K-50K | LinkedIn, Twitter/X | "AI for founder resilience & productivity" | @buildwithbalance, @founderflow | Product bundles, event invites |
| **Neurodiversity Advocates** | 3K-25K | Discord, Reddit | "Personalized AI support for diverse minds" | u/adhdproductivitybot, @neurodiversecollective | Community grants, donation matching |

### Investor Outreach Matrix
| Tier | Fund Type | Fit Rationale | Warm Intro Path | Assets to Attach | Follow-Up Cadence |
| --- | --- | --- | --- | --- | --- |
| **A** | Mission-driven pre-seed funds (e.g., NFX, Kindred) | Health + AI thesis alignment, active lead potential | Angel syndicate advisors, Techstars mentors | One-pager, deck, traction snapshot | 48 hours post-intro, then weekly |
| **B** | Operator angels & rolling funds | Strategic expertise, high-signal intros | Portfolio founders, LinkedIn shared groups | Loom demo, feature roadmap | 72 hours post-send, bi-weekly |
| **C** | Corporate innovation arms | Strategic distribution, slower cycles | Community events, accelerator partner leads | Partnership proposal, data privacy brief | 1 week post-meeting, monthly |

## Firebase Automation Snippets

### Hosting Rewrites
Use this snippet to route marketing campaign URLs to the Next.js app while caching static assets.

```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      { "source": "/", "destination": "/index.html" },
      { "source": "/launch2024", "destination": "/index.html" },
      { "source": "/investors", "function": "renderInvestorLanding" }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|css|js)",
        "headers": [
          { "key": "Cache-Control", "value": "public,max-age=3600" }
        ]
      }
    ]
  }
}
```

### GA4 Measurement
Add custom events and user properties to improve lifecycle attribution.

```yaml
# analytics.yaml
ga4:
  measurementId: G-XXXXXXXXXX
  defaultConsent:
    analyticsStorage: "denied"
    adStorage: "denied"
  events:
    - name: onboarding_step_completed
      parameters:
        step_name: string
        completion_time_ms: integer
    - name: plan_upgraded
      parameters:
        plan_tier: string
        coupon_code: string
  userProperties:
    - name: cohort_tag
      scope: user
    - name: therapist_referred
      scope: user
```

### Cloud Functions Automation
Automate investor updates with batched emails and Slack alerts.

```js
// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sendgrid = require("@sendgrid/mail");

admin.initializeApp();
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

exports.renderInvestorLanding = functions.https.onRequest(async (req, res) => {
  res.sendFile("investor.html", { root: "public" });
});

exports.monthlyInvestorUpdate = functions.pubsub
  .schedule("0 15 1 * *")
  .timeZone("America/Los_Angeles")
  .onRun(async () => {
    const snapshot = await admin.firestore().collection("investor_updates").orderBy("createdAt", "desc").limit(1).get();
    if (snapshot.empty) {
      console.log("No investor update found");
      return null;
    }

    const update = snapshot.docs[0].data();
    const msg = {
      to: update.subscribers,
      from: "updates@urai.ai",
      subject: `URAI Monthly Investor Update | ${update.period}`,
      html: update.html,
    };

    await sendgrid.sendMultiple(msg);

    await admin.firestore().collection("automation_logs").add({
      type: "investor_update",
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await admin.firestore().collection("slack_notifications").add({
      channel: "#investor-updates",
      message: `Investor update for ${update.period} sent to ${update.subscribers.length} contacts.`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return null;
  });
```

## Subject-Line Matrices

### Launch Emails
| Persona | Stage | Subject Line A/B/C |
| --- | --- | --- |
| **Waitlist Founders** | Pre-launch hype | A: "Tomorrow: Unlock your AI wellbeing copilot"<br>B: "The founder resilience toolkit drops at 9am"<br>C: "Your invite to URAI's private beta" |
| **Beta Users** | Launch day | A: "URAI is live—see what's new"<br>B: "Your AI wellbeing rituals are ready"<br>C: "Today's launch checklist inside" |
| **Community Champions** | Amplification | A: "Help us amplify URAI's AI wellbeing launch"<br>B: "Shareable launch toolkit enclosed"<br>C: "Spotlight: URAI's mission for collective calm" |

### Investor Updates
| Segment | Stage | Subject Line A/B/C |
| --- | --- | --- |
| **Active Conversations** | Launch announcement | A: "URAI launch metrics + raise update"<br>B: "Launch traction: 1K signups in 48 hours"<br>C: "Deeper dive: URAI AI copilot goes live" |
| **Warm Prospects** | Post-launch traction | A: "URAI traction stack: growth, retention, roadmap"<br>B: "Investor brief: URAI KPIs & next raise"<br>C: "Why now: URAI momentum check-in" |
| **Strategic Partners** | Series Seed prep | A: "Co-building mental wellness AI with URAI"<br>B: "URAI partnership + funding conversation"<br>C: "Align on URAI's next stage" |

## Measurement & KPIs

### Acquisition Metrics
- **Sign-up Velocity**: Daily net-new users segmented by channel (UTM driven) and influencer handle.
- **Waitlist Conversion Rate**: Waitlist to activated account over 7-day window.
- **Influencer Contribution**: Track GA4 campaign names + referral codes to attribute revenue and sign-ups.

### Engagement & Retention Metrics
- **Onboarding Completion Rate**: Percentage reaching onboarding_step_completed event step 3 within 48 hours.
- **DAU/WAU Ratio**: Target 35% by week 4 post-launch.
- **Feature Adoption**: Monitor plan_upgraded events and Remote Config experiment lift.

### Revenue & Funding Metrics
- **Monthly Recurring Revenue (MRR)**: Reported via Stripe integration, segmented by persona.
- **Customer Acquisition Cost (CAC) Payback**: Calculate per cohort using paid + influencer incentives.
- **Investor Pipeline Velocity**: Count of investor meetings progressing stages per month.

