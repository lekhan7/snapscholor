import React from "react";
import "../allcss/loading.css";

// React component using external CSS file (LoadingPage.css)
// Place CSS rules in a separate file named LoadingPage.css

export default function Loading({ message = "Loading Snap Scholar..." }) {
  return (
    <div className="lp-root" role="status" aria-live="polite">
      <div className="lp-card">
        <div className="lp-logo-wrap" aria-hidden>
          {/* SVG logo */}
          <svg className="lp-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <rect x="12" y="12" width="76" height="76" rx="14" fill="url(#g)" />
            <path d="M30 62c8-8 22-8 30 0" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="36" r="6" fill="rgba(255,255,255,0.9)" />
          </svg>
        </div>

        <div className="lp-content">
          <div className="lp-title">{message}</div>
          <div className="lp-sub">Preparing your personalized learning session — extracting text, fetching AI answers, and building smart quizzes.</div>

          <div className="lp-progress" aria-hidden>
            <div className="lp-bar">
              <div className="lp-fill" />
            </div>
            <div className="lp-percent">48%</div>
          </div>

          <div className="lp-note"> Wait a While Fetching ur details </div>
        </div>

        <div className="lp-actions">
          <div className="lp-dots" aria-hidden>
            <div className="lp-dot" />
            <div className="lp-dot" />
            <div className="lp-dot" />
          </div>
          <div className="lp-init">Initializing...</div>
        </div>
      </div>
    </div>
  );
}
