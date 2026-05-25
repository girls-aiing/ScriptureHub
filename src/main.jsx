import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ── GLOBAL ERROR INTERCEPTORS (SCRIPTUREHUB GUARD) ───────────────────
window.onerror = function (message, source, lineno, colno, error) {
  fetch('/api/report-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: message,
      stack: error ? error.stack : `Error at ${source}:${lineno}:${colno}`,
      url: window.location.href,
    }),
  }).catch((err) => console.error('Failed to report window error:', err));
  return false; // Allows the error to still show normally in the browser console
};

window.onunhandledrejection = function (event) {
  fetch('/api/report-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Unhandled Promise Rejection: ${event.reason}`,
      stack: event.reason?.stack || 'No stack trace available',
      url: window.location.href,
    }),
  }).catch((err) => console.error('Failed to report promise rejection:', err));
};
// ──────────────────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
