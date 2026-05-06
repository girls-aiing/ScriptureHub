import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ── ScriptureHub — Vite Configuration ──────────────────────────────────────
// The `base` option controls the root path when deploying.
//
// DEPLOYMENT GUIDE:
//   • Netlify / Vercel (deployed at a root domain, e.g. scripturehub.com)
//       → base: '/'
//
//   • GitHub Pages (deployed at a subdirectory, e.g. username.github.io/scripturehub/)
//       → base: '/scripturehub/'
//
// To switch between them without editing this file, you can pass an
// environment variable at build time:
//
//   VITE_BASE_PATH=/scripturehub/ npm run build
//
// The fallback '/' works perfectly for Netlify and Vercel out of the box.
// ───────────────────────────────────────────────────────────────────────────

export default defineConfig({
  plugins: [react()],

  // Read base path from environment variable, or default to '/'
  // Change this to '/scripturehub/' if deploying to GitHub Pages
  base: process.env.VITE_BASE_PATH || '/',

  build: {
    // Output folder — this is what you upload / deploy
    outDir: 'dist',

    // Wipe the dist folder clean before each build
    // Prevents stale files from old builds causing confusion
    emptyOutDir: true,
  },

  server: {
    // Local dev server port — visit http://localhost:5173
    port: 5173,

    // Automatically open the browser when you run `npm run dev`
    open: true,
  },
})
