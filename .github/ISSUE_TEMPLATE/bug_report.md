name: 🐛 Bug Report
description: Create a report to help us fix a bug
title: '[BUG] '
labels: ['bug']
assignees: ''

body:
  - type: markdown
    attributes:
      value: Thank you for taking the time to report an issue!
  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: Clear description of what the bug is.
    validations:
      required: true
  - type: textarea
    id: reproduction
    attributes:
      label: Steps to Reproduce
      description: Steps to reproduce the behavior.
      placeholder: |
        1. Select Unit 'M-02'
        2. Set Plan Duration to 24 Months
        3. Click 'Download PDF Proposal'
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: Clear description of what you expected to happen.
    validations:
      required: true
