# Techno One - Sales Offer Generator

A modern, standalone payment calculator and design-based sales offer generator for Techno One by Premier Choice International Developers.

## Features
- **36 Inventory Units**: Full pricing, area, rate, floor, and unit layout plans for Techno One.
- **Flexible Payment Plans**: Monthly, Quarterly, or Full Cash options with custom rate & down payment overrides.
- **Dynamic Balloon Payments**: Manual balloon payment addition with automatic regular installment reduction.
- **Design Template PDF Export**:
  - Page 1: Cover Title Page with dynamic Client Name & Unit No.
  - Page 2: Dedicated Unit Architectural Floor Plan.
  - Page 3 (+ Page 4 if multi-page): Detailed Payment Schedule Table (Work Sans font, 12px, clean un-bolded design).
  - Page 4: Branded Premier Choice Back Cover Page.

## Local Development
```bash
npm install
npm run dev
```

## Docker Build & Deployment
```bash
docker build -t techno-one-sales-offer .
docker run -p 80:80 techno-one-sales-offer
```
