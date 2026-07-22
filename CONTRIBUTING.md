# Contributing to Techno One Sales Offer Generator

First off, thank you for considering contributing to the **Techno One Sales Offer Generator** repository!

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Bugs are tracked as GitHub Issues. Before creating a bug report, please check existing issues to ensure it hasn't been reported yet.

When creating a bug report, please include:
- A clear and descriptive title.
- Steps to reproduce the problem.
- Expected vs. actual behavior.
- Screenshots or PDF export outputs if relevant.
- System information (Browser version, OS, screen resolution).

### Submitting Pull Requests

1. **Fork or Branch**: Create a feature branch off `main` (`feature/amazing-feature` or `fix/issue-description`).
2. **Coding Standards**:
   - Follow existing code formatting and styling conventions (Tailwind CSS v3, React 18 functional components).
   - Ensure all PDF export layouts strictly conform to A4 proportions (210mm x 297mm).
3. **Verify Build**:
   ```bash
   npm run build
   ```
4. **Submit PR**: Open a Pull Request referencing the issue number with a detailed description of your changes.

## Commit Message Conventions

We follow Conventional Commits standard:
- `feat: add quarterly payment breakdown calculation`
- `fix: correct table row height alignment on continuation pages`
- `docs: update deployment instructions for Dokploy`
- `refactor: optimize PDF image canvas rendering performance`
