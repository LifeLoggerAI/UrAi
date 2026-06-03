# URAI Data Retention Matrix

Conservative launch assumptions. Update before legal review and production launch.

| Data layer | Default state | Stored locally? | Synced to cloud? | Used in AI? | Exportable? | User can delete? | Notes |
|---|---|---:|---:|---:|---:|---:|---|
| Passport | Available | Yes | Only if sync enabled | Permissions only | Permissions only | Yes | Source of truth for layer access. |
| Settings | Available | Yes | Only if sync enabled | No | No | Yes | Local preferences by default. |
| Onboarding | Available | Yes | Only if sync enabled | No | No | Yes | Can be reset. |
| Mood | Closed | Optional | Only if allowed | Summary only if allowed | Summary only if export allowed | Yes | Not diagnostic. |
| Life Map | Closed | Optional | Only if allowed | Summary only if allowed | Summary only if export allowed | Yes | Memory summaries only. |
| Ground | Closed | Optional | Only if allowed | Summary only if allowed | Summary only if export allowed | Yes | Stability/ritual state. |
| Mirror | Closed | Optional | Only if allowed | Summary only if allowed | Summary only if export allowed | Yes | Reflection, not verdict. |
| Shadow | Closed | Optional | Off by default | Only if Shadow and AI context allowed | Extra confirmation required | Yes | Sensitive; never notification content. |
| Legacy | Closed | Optional | Off by default | Only if Legacy allowed | Requires export permission | Yes | Nothing carried forward unless chosen. |
| Rituals | Closed | Optional | Only if allowed | Summary only if allowed | Summary only if export allowed | Yes | Optional ritual state. |
| Exports | Closed | Optional | Metadata only if allowed | No raw content | Review required | Yes | No public links by default. |
| Notifications | Off/limited | Yes | Only if allowed | Generic metadata only | No | Yes | No sensitive content. |
| Companion messages | Local session | Optional | Off by default | Current session only | No by default | Yes | Do not save arbitrary AI replies by default. |
| Companion summaries | Closed | Optional | Off by default | Only if enabled | No by default | Yes | Summary only, explicit opt-in. |
| Audio | Sound off | No capture by default | No | No | No | Yes | Playback is separate from recording. |
| Transcripts | Closed | Not implemented / future | Off by default | Only if explicit | Summary only if allowed | Yes | Requires explicit capture/transcript permission. |
| Location | Closed | Optional | Off by default | Summary only if allowed | Summary only if allowed | Yes | Exact location avoided by default. |
| Gmail | Closed | Not implemented / future | Off by default | Summary only if allowed | Summary only if allowed | Yes | Explicit connection required. |
| Calendar | Closed | Not implemented / future | Off by default | Summary only if allowed | Summary only if allowed | Yes | Explicit connection required. |
| Health | Closed | Not implemented / future | Off by default | No diagnosis | No by default | Yes | No medical advice. |
| Relationships | Closed | Optional | Off by default | Summary only if allowed | Summary only if allowed | Yes | No deception or intent certainty. |
| Device behavior | Closed | Optional | Off by default | Summary only if allowed | Summary only if allowed | Yes | Sensitive behavioral metadata. |
