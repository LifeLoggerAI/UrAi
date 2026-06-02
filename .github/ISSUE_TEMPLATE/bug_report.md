---
name: Bug report
description: Report a reproducible URAI bug
title: "[Bug]: "
labels: ["bug"]
body:
  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: What broke?
      placeholder: The public constellation route fails to...
    validations:
      required: true
  - type: dropdown
    id: area
    attributes:
      label: Area
      options:
        - Home route
        - Public constellation
        - Companion API/UI
        - Waitlist API/UI
        - Firebase/rules/indexes
        - Seed/export scripts
        - Docs
        - CI/tests
        - Other
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
      placeholder: |
        1. Run npm run dev
        2. Open /u/adamclamp
        3. Click ...
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
    validations:
      required: true
  - type: textarea
    id: actual
    attributes:
      label: Actual behavior
    validations:
      required: true
  - type: textarea
    id: validation
    attributes:
      label: Validation output
      description: Paste relevant command output.
      render: shell
      placeholder: |
        npm run check:v1
        npm run test:unit
        npm run build
  - type: input
    id: browser
    attributes:
      label: Browser/device
      placeholder: Chrome desktop, Safari iPhone, etc.
---
