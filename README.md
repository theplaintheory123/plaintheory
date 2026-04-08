```markdown
# Plaintheory LifeOS

![Plaintheory LifeOS](https://via.placeholder.com/1200x600/FAF8F5/C2786B?text=Your+life,+in+rhythm.)

**A calm, intentional dashboard that brings your digital life into focus.**

[![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0.0-0055FF?logo=framer)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Overview

Plaintheory is a serene, privacy-first LifeOS dashboard that consolidates your calendar, tasks, weather, and notes into a single, beautifully designed interface. This repository contains the **official landing page** — a fully responsive, animated showcase built with Next.js, Tailwind CSS, and Framer Motion.

**Live Demo:** [plaintheory.vercel.app](https://plaintheory.vercel.app)

---

## 🎯 Features

### Landing Page Sections
- **Hero Section** – Animated heartbeat line, email capture, and dashboard preview.
- **Trusted By** – Social proof from leading brands.
- **Features Grid** – Highlights core capabilities including weekly, quarterly, and annual reports.
- **Core Principles** – Unified, Intentional, Owned.
- **Live Heartbeat Visualization** – Interactive ECG-style line that draws on scroll.
- **Reports Showcase** – Beautiful summaries of your data over time.
- **Outcomes & Metrics** – Real-world results from the community.
- **How It Works** – Simple four‑step onboarding.
- **Testimonials** – Quotes from mindful creators.
- **Pricing** – Free forever with all features included.
- **FAQ & CTA** – Answers to common questions and a final call‑to‑action.

### Interactive Elements
- **Parallax SVG Lines** – Background lines move at different speeds with scroll.
- **Heartbeat Animation** – Pulsing visual that responds to scroll progress.
- **Scroll‑Triggered Reveals** – Sections fade and slide into view.
- **Fully Responsive** – Optimized for mobile, tablet, and desktop.
- **Accessible Mobile Menu** – Clean slide‑down navigation on small screens.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Utility‑first styling |
| [Framer Motion](https://www.framer.com/motion/) | Advanced animations and gestures |
| [Vercel](https://vercel.com/) | Deployment and hosting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/plaintheory-landing.git
   cd plaintheory-landing
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Build for Production
```bash
npm run build
npm run start
```

---


## 🎨 Customization

### Colors
The primary palette is defined in `tailwind.config.js` and used throughout the page with utility classes:
- **Background:** `#FAF8F5` (warm off‑white)
- **Text:** `#1A1817` (deep charcoal)
- **Accent:** `#C2786B` (terracotta / rust)

### Fonts
The project uses three Google Fonts loaded via `next/font`:
- **Sans:** Geist (or Inter fallback)
- **Serif:** Playfair Display
- **Mono:** JetBrains Mono

To change fonts, update the imports in `app/layout.tsx` and adjust the `fontFamily` in `tailwind.config.js`.

### Animations
All animations are powered by Framer Motion. Key parameters (duration, delay, easing) can be adjusted directly in the component code.

---

## 🚢 Deployment

The easiest way to deploy this landing page is through [Vercel](https://vercel.com/):

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Vercel will automatically detect Next.js and configure the build settings.
4. Deploy!

Alternatively, you can export a static version:
```bash
npm run build
npm run export
```
Then upload the `out/` folder to any static hosting service (Netlify, Cloudflare Pages, AWS S3).

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- Design inspired by the calm, editorial aesthetic of publications like *Kinfolk* and *Apartamento*.
- Heartbeat animation adapted from medical ECG visualizations.
- Community feedback from [r/selfhosted](https://reddit.com/r/selfhosted) and [r/Productivity](https://reddit.com/r/productivity).

---

## 📬 Contact

Have questions or want to collaborate?  
Reach out at [hello@plaintheory.com](mailto:hello@plaintheory.com) or open an issue.

---

**Crafted with intention.**  
*— The Plaintheory Lab*
```

This README provides a professional, comprehensive introduction to the project, covering setup, structure, customization, and deployment. It reflects the brand's minimalist and intentional aesthetic while being practical for developers.