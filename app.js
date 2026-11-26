/* =========================================================================
   CarDesk US — Dashboard Light & OBD Checker
   Part 4: app.js (Logo Intro Animation, Instant Search, Micro-Scan Reveal,
   Vision AI Hook + Demo Mode, 32-Icon Picker, Legal Modals & Share)
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     1. EASY CONFIGURATION (Edit URLs, Email, or Vision AI Endpoint Here)
     ======================================================================= */
  const CONFIG = {
    VIN_AUDIT_URL: "https://cardeskus.com/car-buyer-check",
    SCAM_CHECKER_URL: "https://scamcheck.cardeskus.com",
    TICKET_HELPER_URL: "https://cardeskus.com/ticket-helper",
    CAR_BUYER_URL: "https://cardeskus.com/car-buyer-check",
    CONTACT_EMAIL: "support@cardeskus.com",

    // Vision AI Integration (Leave empty to use built-in Instant Demo Mode)
    // Production tip: Point to a Cloudflare Worker proxy that accepts
    // POST { imageBase64, allowedIds } and returns { matchedId: "P0420" }
    // so your AI API key stays hidden from browser source code.
    VISION_API_ENDPOINT: "",
    VISION_API_KEY: ""
  };

  /* =======================================================================
     2. LIGHTWEIGHT CUSTOM SVG ICONS (100% Copyright-Free)
     ======================================================================= */
  const ICONS = {
    obd: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M7 10h2m3 0h2m3 0h0M7 14h10"/></svg>`,
    cel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8h8l2 2h3v6h-3l-2 2H8l-2-2H4v-5h2l1-3z"/><path d="M9 5h5M11.5 5v3"/></svg>`,
    celFlash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9h8l2 2h3v5h-3l-2 2H8l-2-2H4v-4h2l1-3z"/><path d="M12 2v3M5 4l2 2M19 4l-2 2"/></svg>`,
    oil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13l3-2h7l5-2 2 2-5 5H5l-2-3z"/><path d="M8 11V8m-2 0h4"/><path d="M20 14c0 1.4 1 2.2 1 3a1 1 0 1 1-2 0c0-.8 1-1.6 1-3z"/></svg>`,
    temp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v11m0 0a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM12 6h3M12 9h3"/><path d="M4 19c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 2.5 1 3.5 0"/></svg>`,
    battery: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M7 7V5h2v2M15 7V5h2v2M7 13h3M15 13h3M16.5 11.5v3"/></svg>`,
    brake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"/><path d="M12 9v3.5M12 15.5h.01"/><path d="M4.5 7.5a9.5 9.5 0 0 0 0 9M19.5 7.5a9.5 9.5 0 0 1 0 9"/></svg>`,
    tpms: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5a7 7 0 0 0-1 11.5l1 2.5h10l1-2.5A7 7 0 0 0 17 5"/><path d="M12 9v4M12 16h.01"/></svg>`,
    abs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><text x="12" y="14.5" text-anchor="middle" font-size="6.4" font-family="monospace" font-weight="700" fill="currentColor" stroke="none">ABS</text><path d="M3.5 7.5a10 10 0 0 0 0 9M20.5 7.5a10 10 0 0 1 0 9"/></svg>`,
    airbag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="15.5" cy="6.5" r="2"/><circle cx="8" cy="11" r="3.2"/><path d="M15 10l-2 5h4l2 4M11 19h5"/></svg>`,
    traction: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10l1.5-3.5h9L18 10H6z"/><rect x="5" y="10" width="14" height="3.5" rx="1"/><path d="M8 16c-1 1.5 1 2.5 0 4M16 16c-1 1.5 1 2.5 0 4"/></svg>`,
    steering: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="12" r="6.5"/><circle cx="10" cy="12" r="1.5"/><path d="M4 11h12M10 13.5V18"/><path d="M20 8v5M20 16.5h.01"/></svg>`,
    fuel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="10" height="14" rx="1.5"/><path d="M7 9h4M14 9l3 2v6a1.5 1.5 0 0 0 3 0v-6l-2-2"/></svg>`,
    seatbelt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5.5" r="2.2"/><path d="M8 19v-7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v7"/><path d="M8.5 10.5l7 7"/></svg>`,
    door: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="4" width="8" height="16" rx="3"/><path d="M8 10l-4 3M16 10l4 3"/></svg>`,
    wrench: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3-3a5.5 5.5 0 0 1-7.4 7.4l-6.6 6.6a2 2 0 0 1-2.8-2.8l6.6-6.6a5.5 5.5 0 0 1 7.4-7.4l-3.2 2.8z"/></svg>`,
    trans: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><path d="M12 9v3.5M12 15h.01"/></svg>`,
    washer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16c2-6 5-9 9-9s7 3 9 9l-3 2c-2-2-4-3-6-3s-4 1-6 3l-3-2z"/><path d="M12 15V8m0 0c-1.5-2-3.5-2.5-4.5-1.5M12 8c1.5-2 3.5-2.5 4.5-1.5"/></svg>`,
    pad: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5.5"/><path d="M4.5 7.5a9 9 0 0 0 0 9M19.5 7.5a9 9 0 0 1 0 9" stroke-dasharray="2.5 2.5"/></svg>`,
    epc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="10" rx="2"/><text x="12" y="14.5" text-anchor="middle" font-size="7" font-family="monospace" font-weight="700" fill="currentColor" stroke="none">EPC</text></svg>`,
    glow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15h4c2 0 3-6 1-6s-1 6 1.5 6 3-6 1-6-1 6 1.5 6 3-6 1-6-1 6 2 6h4"/></svg>`,
    dpf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="13" height="8" rx="2"/><path d="M7 12h.01M10 10.5h.01M10 13.5h.01M13 12h.01M17 12h4"/></svg>`,
    key: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="12" r="3.5"/><path d="M11.5 12H21m-3 0v3m-3-3v2"/></svg>`,
    lane: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 19L9 5M18 19l-3-14"/><rect x="10" y="10" width="4" height="6" rx="1"/></svg>`,
    blind: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="6" height="9" rx="1.5"/><rect x="14" y="10" width="6" height="9" rx="1.5"/><path d="M12 7c1.5 0 2.5 1 2.5 2.5"/></svg>`,
    cruise: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17a8 8 0 1 1 14 0"/><path d="M12 13l4-4M17 6l2-2"/></svg>`,
    beam: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d
