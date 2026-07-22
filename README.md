<div align="center">

  <img src="public/assets/techno_one_logo.png" alt="Techno One Logo" width="120" />

  # Techno One — Sales Offer Generator & Calculator

  **An enterprise-grade, design-driven modular payment calculator and PDF sales proposal generator built for Premier Choice International Developers.**

  [![Build Status](https://img.shields.io/github/actions/workflow/status/usmankhan4001/techno-one-sales-offer/ci.yml?branch=main&style=flat-square&logo=github&label=Build)](https://github.com/usmankhan4001/techno-one-sales-offer/actions)
  [![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Executive Overview](#-executive-overview)
- [Key Business & Technical Features](#-key-business--technical-features)
- [PDF Proposal Architecture & Layout Specs](#-pdf-proposal-architecture--layout-specs)
- [Technology Stack](#-technology-stack)
- [Repository Structure](#-repository-tree)
- [Quick Start Guide](#-quick-start-guide)
- [Docker & Dokploy Deployment](#-dokploy--docker-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏢 Executive Overview

The **Techno One Sales Offer Generator** is a web application designed for real estate sales teams, portfolio managers, and commercial agents at Premier Choice International Developers. It streamlines the generation of personalized, multi-page commercial sales proposals directly from pre-validated inventory datasets.

### Core Value Drivers:
- **Instant Financial Calculation**: Dynamically computes Down Payments, Regular Installments, Possession Balances, and Custom Balloon schedules in real time.
- **Dynamic Floor Plan Mapping**: Automatically pairs every inventory unit (LG-01 to 406) with its high-resolution architectural layout plan drawing.
- **Pixel-Perfect PDF Generation**: Generates 4-page print-ready A4 PDF proposals utilizing high-resolution background assets, precise typography (Work Sans font), and clean table layout continuation rules.
- **Mobile-First Sales Experience**: Fully responsive interface optimized for sales agents operating on tablets and smartphones in the field.

---

## ✨ Key Business & Technical Features

### 1. Pre-Loaded Inventory Backend
- Complete integration of all **36 Techno One units** across Lower Ground, Ground, Mezzanine, 1st, 2nd, 3rd, and 4th Floors.
- Includes exact Gross Area (SqFt), base rate per SqFt, pre-computed down payment, and unit availability status.

### 2. Multi-Mode Financial Engine
- **Monthly Plan**: Custom Down Payment % (e.g. 30%), Possession % (e.g. 10%), and flexible duration up to 24 Months.
- **Quarterly Plan**: Automated 3-month cycle grouping and payment schedule.
- **Full Cash Payment**: One-time lump sum calculation with configurable cash discount percentage.
- **Dynamic Balloon Payments**: Manual balloon payments with auto-deduction from standard monthly installments.
- **Rate & Down Payment Overrides**: Allows authorized sales representatives to apply custom discounts or special client terms.

### 3. Smart Table Continuation (No Overflow)
- **Single-Page Schedule**: Fits up to 25 rows on Table Page 1. Standard 24-month payment plans render on a single table page.
- **Multi-Page Continuation**: When custom balloon rows cause schedule expansion (>25 rows), the table extends onto a seamless second table page with zero whitespace borders or duplicate summary boxes.

---

## 📄 PDF Proposal Architecture & Layout Specs

Each generated PDF proposal conforms to international A4 dimensions (**210mm x 297mm**) and features a 4-page structure:

| Page | Document Section | Assets / Data Layer |
| :--- | :--- | :--- |
| **Page 1** | **Cover Title Page** | `template_title_page.png` + Dynamic Client Name & Unit No. (Work Sans, left-aligned) |
| **Page 2** | **Unit Layout Plan** | `public/unit_plans/${unitNo}.png` (Dedicated architectural floor plan) |
| **Page 3** | **Detailed Payment Plan** | `template_table_page.png` + 8-box financial breakdown grid & schedule table (Font: 12px, regular weight) |
| **Page 3+**| **Continuation Table** | `template_table_page_continuation.png` (Used ONLY if schedule > 25 rows; summary box omitted) |
| **Page 4** | **Back Cover** | `page_4_back_cover.png` (Premier Choice International branding & head office contacts) |

---

## 🛠 Technology Stack

- **Frontend Framework**: [React 18.3](https://react.dev/) + [Vite 5.4](https://vitejs.dev/)
- **Styling & UI**: [Tailwind CSS v3.4](https://tailwindcss.com/) + [Lucide React Icons](https://lucide.dev/)
- **Document Engine**: [html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://github.com/parallax/jsPDF)
- **Typography**: [Work Sans](https://fonts.google.com/specimen/Work+Sans) (Google Fonts)
- **Containerization**: [Docker](https://www.docker.com/) + Alpine Nginx
- **CI/CD**: GitHub Actions + [Dokploy](https://dokploy.com/) Cloudflare deployment

---

## 📁 Repository Tree

```
techno-one-sales-offer/
├── .github/
│   ├── ISSUE_TEMPLATE/       # Bug & Feature templates
│   ├── pull_request_template.md
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI Build pipeline
├── public/
│   ├── assets/               # High-res template images & logos
│   ├── unit_plans/           # 36 individual unit floor plan images
│   └── favicon.png
├── src/
│   ├── components/
│   │   ├── calculator/       # Interactive Modular Calculator UI
│   │   └── doc/              # Hidden PDF Export DOM Container
│   ├── data/                 # Inventory JSON & helper utilities
│   ├── utils/                # Financial calculation engine & PDF exporter
│   ├── App.jsx
│   ├── index.css             # Tailwind imports & Work Sans typography
│   └── main.jsx
├── Dockerfile                # Multi-stage production build
├── nginx.conf                # High-performance static Nginx config
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js **>= 18.0.0**
- npm **>= 9.0.0**

### Local Installation
```bash
# 1. Clone repository
git clone https://github.com/usmankhan4001/techno-one-sales-offer.git
cd techno-one-sales-offer

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The application will be accessible at `http://localhost:8085`.

---

## 🐳 Dokploy & Docker Deployment

This repository includes a multi-stage Docker setup (`Dockerfile` + `nginx.conf`) optimized for deployment on **Dokploy** behind Cloudflare.

### Docker Local Run
```bash
docker build -t techno-one-sales-offer .
docker run -d -p 8080:80 --name sales-offer-app techno-one-sales-offer
```

### Deploying on Dokploy Instance

1. Navigate to your **Dokploy Dashboard**.
2. Click **Create Application**.
3. Configure Repository settings:
   - **Repository URL**: `https://github.com/usmankhan4001/techno-one-sales-offer.git`
   - **Branch**: `main`
   - **Build Type**: `Dockerfile`
   - **Port**: `80`
4. Click **Deploy**. Dokploy will pull the code, execute the Docker build, and expose the HTTPS URL!

---

## 🤝 Contributing

Contributions are welcome! Please review [CONTRIBUTING.md](CONTRIBUTING.md) for commit standards, PR requirements, and code styling guidelines before submitting a pull request.

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

Developed with ❤️ for **Premier Choice International Developers**.
