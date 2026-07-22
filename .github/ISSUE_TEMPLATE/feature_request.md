name: ✨ Feature Request
description: Suggest an idea or feature enhancement
title: '[FEAT] '
labels: ['enhancement']
assignees: ''

body:
  - type: textarea
    id: problem
    attributes:
      label: Is your feature request related to a problem?
      description: Concise description of the problem (e.g. "I'm always frustrated when...").
    validations:
      required: true
  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: Describe the solution you'd like.
    validations:
      required: true
