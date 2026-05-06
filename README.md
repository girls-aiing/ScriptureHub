# ScriptureHub
**AI-Powered Bible Study Platform by Silas Clergy**

> An interactive digital sanctuary for serious Bible students — offering offline Scripture reading,
> 1,000+ gamified quizzes, scholarly theological AI answers, and personal faith-growth tracking.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Local Development](#local-development)
5. [Production Build](#production-build)
6. [Deployment Guide](#deployment-guide)
7. [Project Structure](#project-structure)
8. [Pages & Components](#pages--components)

---

## 🌟 Project Overview

ScriptureHub was founded by **Silas Clergy** to bridge the gap between traditional biblical
scholarship and modern digital engagement. The platform treats faith as a discipline —
offering measurable progress, intellectual depth, and a Zero-Data Study Mode so the
Word stays accessible even in low-connectivity environments.

**Target Audience:** Digitally-active Christians aged 18–45 who value intellectual
depth and want to measure their spiritual growth.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 (functional components + hooks) |
| Routing | react-router-dom v6 |
| Build Tool | Vite 5 |
| Styling | Plain CSS (index.css + component styles) |
| Fonts | Playfair Display + Montserrat (Google Fonts) |
| Database | None — fully static |
| External APIs | None — self-contained |

---

## 🚀 Getting Started

### Step 1 — Get the project files

**Option A — Clone from GitHub:**
```bash
git clone https://github.com/your-username/scripturehub.git
cd scripturehub
```

**Option B — Download ZIP:**
1. Click the green **Code** button on GitHub
2. Select **Download ZIP**
3. Unzip the folder
4. Open a terminal and `cd` into the unzipped folder

---

### Step 2 — Install dependencies

```bash
npm install
```

This downloads React, Vite, and react-router-dom into a `node_modules/` folder.
It only needs to run once (or again if you delete `node_modules/`).

---

## 💻 Local Development

### Step 3 — Start the dev server

```bash
npm run dev
```

Vite will start a local server. Open your browser and visit:

```
http://localhost:5173
```

The page **hot-reloads** automatically every time you save a file — no manual refresh needed.

---

## 📦 Production Build

### Step 4 — Build for production

```bash
npm run build
```

This creates an optimised `dist/` folder containing:
- Minified JavaScript bundles
- Compiled CSS
- Your `index.html` (ready to serve)

To preview the production build locally before deploying:

```bash
npm run preview
```

Visit `http://localhost:4173` to check everything looks correct.

---

## 🌐 Deployment Guide

### Option A — Netlify (Recommended — easiest)

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **Add new site → Import an existing project**
3. Connect your GitHub repo
4. Set these build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site** ✅

> Netlify handles routing automatically. No extra config needed.

**Or drag-and-drop:**
1. Run `npm run build` locally
2. Drag your `dist/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop)

---

### Option B — Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import your GitHub repo
4. Vercel auto-detects Vite — just click **Deploy** ✅

> For client-side routing to work on Vercel, add a `vercel.json` file in the root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

### Option C — GitHub Pages

1. In `vite.config.js`, set the base path to your repo name:
   ```js
   base: '/scripturehub/'
   ```
2. Run `npm run build`
3. Push the `dist/` folder contents to the `gh-pages` branch
4. In your repo Settings → Pages, set source to the `gh-pages` branch ✅

> **Tip:** The `gh-pages` npm package automates step 3:
> ```bash
> npm install --save-dev gh-pages
> npx gh-pages -d dist
> ```

---

## 📁 Project Structure

```
scripturehub/
├── public/               # Static assets (favicon, images)
├── src/
│   ├── main.jsx          # App entry point — mounts React into index.html
│   ├── App.jsx           # Route definitions + layout shell (Navbar + Footer)
│   ├── index.css         # Global styles — fonts, colours, resets
│   ├── pages/
│   │   ├── HomePage.jsx          # Landing page — hero, features, CTA
│   │   ├── BibleReaderPage.jsx   # Offline Scripture reader
│   │   ├── KnowledgeHubPage.jsx  # 1,000+ gamified quizzes
│   │   ├── AIConsultantPage.jsx  # Theological AI Q&A
│   │   ├── GrowthDashboardPage.jsx # Faith-growth tracking
│   │   └── NotFoundPage.jsx      # 404 fallback
│   └── components/
│       ├── Navbar.jsx        # Top navigation — all links use <Link>
│       ├── Footer.jsx        # Site footer
│       ├── FeatureCard.jsx   # Homepage feature highlights
│       ├── QuizCard.jsx      # Quiz display card
│       ├── DidYouKnowCard.jsx # Scriptural secret reveal card
│       ├── ChatBubble.jsx    # AI conversation bubble
│       ├── StatCard.jsx      # Single growth stat display
│       ├── MonthlyReport.jsx # Monthly progress summary
│       ├── DifficultyBadge.jsx # Quiz difficulty indicator
│       └── SuggestedPrompt.jsx # AI prompt suggestion chip
├── index.html            # HTML shell — Vite injects scripts here
├── vite.config.js        # Vite build configuration
├── package.json          # Project dependencies + scripts
└── README.md             # This file
```

---

## 📄 Pages & Components

| Page | Route | Purpose |
|------|-------|---------|
| HomePage | `/` | Welcome, features overview, call-to-action |
| BibleReaderPage | `/bible` | Read Scripture offline |
| KnowledgeHubPage | `/quizzes` | Browse and take quizzes |
| AIConsultantPage | `/ai` | Ask theological questions |
| GrowthDashboardPage | `/dashboard` | Track personal faith progress |
| NotFoundPage | `*` | Friendly 404 page |

---

## 🙏 Created by Silas Clergy

*"Your word is a lamp to my feet and a light to my path."* — Psalm 119:105
