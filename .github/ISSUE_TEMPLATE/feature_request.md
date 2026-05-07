---
name: Feature request
description: Propose a new URAI feature or improvement
title: "[Feature]: "
labels: ["enhancement"]
body:
  - type: textarea
    id: problem
    attributes:
      label: Problem / opportunity
      description: What user need, product gap, or technical gap does this address?
    validations:
      required: true
  - type: textarea
    id: proposal
    attributes:
      label: Proposed solution
      description: Describe the smallest useful version.
    validations:
      required: true
  - type: dropdown
    id: layer
    attributes:
      label: Product layer
      options:
        - V1 demo spine
        - Companion / narrator
        - Memory constellation
        - Mood forecast / reflection
        - Waitlist / launch funnel
        - Firebase / data model
        - Privacy / consent
        - AI safety
        - Future roadmap
    validations:
      required: true
  - type: textarea
    id: acceptance
    attributes:
      label: Acceptance criteria
      placeholder: |
        - [ ] User can...
        - [ ] Route/API returns...
        - [ ] Docs/tests updated...
    validations:
      required: true
  - type: textarea
    id: risks
    attributes:
      label: Risks / safety notes
      description: Note any privacy, consent, emotional safety, or data exposure risks.
  - type: textarea
    id: validation
    attributes:
      label: Validation plan
      placeholder: npm run check:v1 && npm run preflight
---
