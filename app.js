/* =========================================================================
   CarDesk US — Dashboard Light & OBD Checker
   Part 3 of 5: app.js
   - Safe non-blocking Signature Car Logo Splash -> Docks to Top Navbar
   - Instant Fixed-Database Lookup (0ms, $0) + Backend /api/scan AI + Demo Mode
   - Crisp ~0.5s Micro-Scan Reveal + RED/YELLOW/GREEN Result Card + Modals
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     1. CONFIGURATION (Update Links / Email if Needed; Keep API Key in Vercel)
     ======================================================================= */
  const CONFIG = {
    VIN_AUDIT_URL: "https://cardeskus.com/car-buyer-check",
    SCAM_CHECKER_URL: "https://scamcheck.cardeskus.com",
    TICKET_HELPER_URL: "https://cardeskus.com/ticket-helper",
    CAR_BUYER_URL: "https://cardeskus.com/car-buyer-check",
    CONTACT_EMAIL: "support@cardeskus.com",

    // Uses Vercel Serverless Function (/api/scan) where GEMINI_API_KEY lives securely
    SCAN_API_ENDPOINT: "/api/scan"
  };

  /* =======================================================================
     2. CUSTOM COPYRIGHT-FREE DASHBOARD & OBD SVG ICONS
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
    beam: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6c4 0 7 2.7 7 6s-3 6-7 6V6z"/><path d="M4 8h5M4 12h5M4 16h5"/></svg>`,
    fog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6c4 0 7 2.7 7 6s-3 6-7 6V6z"/><path d="M4 9l5 1.5M4 13l5 1.5M4 17l5 1.5M7 7c-1 2 1 3 0 5s1 3 0 5"/></svg>`,
    awd: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="3" height="5" rx="1"/><rect x="16" y="4" width="3" height="5" rx="1"/><rect x="5" y="15" width="3" height="5" rx="1"/><rect x="16" y="15" width="3" height="5" rx="1"/><path d="M8 6.5h8M8 17.5h8M12 6.5v11"/></svg>`,
    bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>`
  };

  const SEVERITY_LABELS = {
    RED: "STOP DRIVING IMMEDIATELY",
    YELLOW: "DRIVE CAREFULLY — CHECK SOON",
    GREEN: "SAFE TO DRIVE — MINOR ISSUE"
  };

  /* =======================================================================
     3. LEGAL & CONTACT MODAL CONTENT (Includes Microsoft Clarity Disclosure)
     ======================================================================= */
  const LEGAL_CONTENT = {
    terms: {
      title: "Terms & Conditions",
      html: `
        <p><strong>Effective Date:</strong> January 1, 2026</p>
        <p>By using <strong>Dashboard Light &amp; OBD Checker</strong> (part of CarDesk US, operated by <strong>MANKINAMMA TECHNOLOGY PRIVATE LIMITED</strong>), you agree to these Terms &amp; Conditions.</p>
        <h3>1. Free Educational Tool</h3>
        <p>This tool is provided 100% free of charge for general automotive reference for US drivers. You agree not to abuse, scrape, or disrupt the service.</p>
        <h3>2. No Mechanical Guarantee</h3>
        <p>OBD-II codes and dashboard warning lights can stem from multiple underlying causes. US repair cost ranges are nationwide estimates only and are not binding quotes.</p>
        <h3>3. Limitation of Liability</h3>
        <p>To the fullest extent permitted by law, MANKINAMMA TECHNOLOGY PRIVATE LIMITED is not liable for vehicle damage, towing expenses, personal injury, or indirect losses arising from use of this tool.</p>
      `
    },
    privacy: {
      title: "Privacy Policy",
      html: `
        <p><strong>Effective Date:</strong> January 1, 2026 &bull; Operated by <strong>MANKINAMMA TECHNOLOGY PRIVATE LIMITED</strong> (CarDesk US).</p>
        <h3>1. Zero Account &amp; Zero Permanent Photo Storage</h3>
        <p>No login or personal details are required. Code lookups execute locally in your browser. If you snap or upload a photo of a dashboard warning light or scanner printout, it is processed securely solely to identify the light or code and is <strong>never permanently stored</strong>.</p>
        <h3>2. Analytics Disclosure (Microsoft Clarity)</h3>
        <p>We partner with <strong>Microsoft Clarity</strong> to understand how visitors use our site via behavioral metrics, heatmaps, and session replay so we can improve speed and usability. Sensitive input areas—including photo uploads and code search inputs—are masked (<code>data-clarity-mask="true"</code>). Website usage data is captured using first- and third-party cookies and tracking technologies. For more details, review the Microsoft Privacy Statement.</p>
        <h3>3. Your Controls</h3>
        <p>You may block cookies or analytics scripts in your browser settings at any time while retaining full access to our embedded OBD-II and warning light database.</p>
      `
    },
    disclaimer: {
      title: "US Automotive Safety Disclaimer",
      html: `
        <p><strong>For informational and educational purposes only.</strong></p>
        <p>Dashboard Light &amp; OBD Checker helps US drivers understand standard OBD-II codes and dashboard warning symbols. It is <strong>not</strong> a substitute for an in-person diagnosis by an ASE-certified mechanic.</p>
        <h3>Safety-Critical Situations</h3>
        <p>If your vehicle shows red warning lights, smoke, overheating, brake loss, or steering loss, pull over safely immediately and contact roadside assistance or a certified technician.</p>
      `
    },
    contact: {
      title: "Contact CarDesk US",
      html: `
        <p>Questions, feedback, or a code you'd like added to our US database?</p>
        <h3>Operator</h3>
        <p><strong>MANKINAMMA TECHNOLOGY PRIVATE LIMITED</strong><br>CarDesk US Ecosystem</p>
        <h3>Email Support</h3>
        <p><a href="mailto:${CONFIG.CONTACT_EMAIL}" style="color:var(--neon-cyan);font-weight:600;">${CONFIG.CONTACT_EMAIL}</a></p>
        <p style="font-size:0.8rem;color:var(--text-muted);">Note: We cannot provide individualized mechanic advice by email. For urgent roadside issues, consult a certified US mechanic.</p>
      `
    }
  };

  /* =======================================================================
     4. DATABASE & DOM REFERENCES
     ======================================================================= */
  const DB = Array.isArray(window.CARDESK_OBD_DB) ? window.CARDESK_OBD_DB : [];
  const DB_MAP = Object.fromEntries(DB.map(item => [item.id, item]));

  const el = {
    introSplash: document.getElementById("introSplash"),
    introBadge: document.getElementById("introBadge"),
    introBrandWrap: document.getElementById("introBrandWrap"),
    navLogoDock: document.getElementById("navLogoDock"),
    scannerCard: document.getElementById("scannerCard"),
    input: document.getElementById("codeInput"),
    clearBtn: document.getElementById("clearInputBtn"),
    lookupBtn: document.getElementById("lookupBtn"),
    dropdown: document.getElementById("searchDropdown"),
    snapBtn: document.getElementById("snapBtn"),
    photoInput: document.getElementById("photoInput"),
    browseBtn: document.getElementById("browseLightsBtn"),
    scanPanel: document.getElementById("scanPanel"),
    scanPreviewWrap: document.getElementById("scanPreviewWrap"),
    scanPreviewImg: document.getElementById("scanPreviewImg"),
    scanStatusText: document.getElementById("scanStatusText"),
    scanConfirmGrid: document.getElementById("scanConfirmGrid"),
    closeScanBtn: document.getElementById("closeScanBtn"),
    lightDrawer: document.getElementById("lightDrawer"),
    lightGrid: document.getElementById("lightGrid"),
    microScanPulse: document.getElementById("microScanPulse"),
    microScanLabel: document.getElementById("microScanLabel"),
    resultSection: document.getElementById("resultSection"),
    resultCard: document.getElementById("resultCard"),
    severityBanner: document.getElementById("severityBanner"),
    severityBadgeText: document.getElementById("severityBadgeText"),
    shareResultBtn: document.getElementById("shareResultBtn"),
    resultIconBox: document.getElementById("resultIconBox"),
    resultCodeTag: document.getElementById("resultCodeTag"),
    resultTitle: document.getElementById("resultTitle"),
    resultPlain: document.getElementById("resultPlain"),
    resultCost: document.getElementById("resultCost"),
    resultQuickCheck: document.getElementById("resultQuickCheck"),
    causesRow: document.getElementById("causesRow"),
    checkAnotherBtn: document.getElementById("checkAnotherBtn"),
    funnelCtaLink: document.getElementById("funnelCtaLink"),
    modal: document.getElementById("legalModal"),
    modalTitle: document.getElementById("modalTitle"),
    modalBody: document.getElementById("modalBody"),
    closeModalBtn: document.getElementById("closeModalBtn"),
    toast: document.getElementById("toast")
  };

  let currentItem = null;
  let activeDropIndex = -1;
  let currentMatches = [];
  let scanTimer = null;
  let toastTimer = null;
  let introFinished = false;

  if (el.funnelCtaLink) el.funnelCtaLink.href = CONFIG.VIN_AUDIT_URL;
  const ecoScam = document.getElementById("ecoScamLink");
  const ecoTicket = document.getElementById("ecoTicketLink");
  const ecoBuyer = document.getElementById("ecoBuyerLink");
  if (ecoScam) ecoScam.href = CONFIG.SCAM_CHECKER_URL;
  if (ecoTicket) ecoTicket.href = CONFIG.TICKET_HELPER_URL;
  if (ecoBuyer) ecoBuyer.href = CONFIG.CAR_BUYER_URL;

  /* =======================================================================
     5. GUARANTEED NON-BLOCKING LOGO INTRO -> DOCKS INTO TOP NAVBAR
     ======================================================================= */
  function finishIntroImmediately() {
    if (introFinished) return;
    introFinished = true;
    if (el.navLogoDock) el.navLogoDock.classList.add("landed");
    if (el.introSplash) {
      el.introSplash.classList.add("intro-reveal");
      el.introSplash.classList.add("intro-done");
    }
  }

  function runSignatureLogoIntro() {
    if (!el.introSplash || !el.introBadge || !el.navLogoDock) return;

    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      finishIntroImmediately();
      return;
    }

    // Tap/click anywhere on splash skips straight to page
    el.introSplash.addEventListener("click", finishIntroImmediately, { once: true });

    // Glide badge smoothly into top navbar dock after ~1.0s
    setTimeout(() => {
      if (introFinished) return;
      try {
        const fromRect = el.introBadge.getBoundingClientRect();
        const toRect = el.navLogoDock.getBoundingClientRect();
        const dx = (toRect.left + toRect.width / 2) - (fromRect.left + fromRect.width / 2);
        const dy = (toRect.top + toRect.height / 2) - (fromRect.top + fromRect.height / 2);
        const scale = Math.max(0.24, toRect.width / fromRect.width);

        if (el.introBrandWrap) el.introBrandWrap.classList.add("intro-text-out");
        el.introSplash.classList.add("intro-reveal");
        el.introBadge.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

        setTimeout(finishIntroImmediately, 520);
      } catch (_) {
        finishIntroImmediately();
      }
    }, 1020);

    // Hard failsafe so page can NEVER remain stuck on splash
    setTimeout(finishIntroImmediately, 2100);
  }

  /* =======================================================================
     6. INSTANT SEARCH & GENERIC OBD-II FALLBACK DECODER
     ======================================================================= */
  function searchDatabase(rawQuery) {
    const q = (rawQuery || "").trim().toLowerCase();
    const qCompact = q.replace(/\s+/g, "");
    if (!q) return [];

    const scored = [];
    for (const item of DB) {
      const idLow = item.id.toLowerCase();
      const codeLow = item.code.toLowerCase().replace(/\s+/g, "");
      const nameLow = item.name.toLowerCase();
      const kwText = (item.keywords || []).join(" ").toLowerCase();

      let score = 0;
      if (codeLow === qCompact || idLow === qCompact) score = 100;
      else if (codeLow.startsWith(qCompact)) score = 86;
      else if (nameLow.startsWith(q)) score = 70;
      else if (nameLow.includes(q)) score = 55;
      else if (kwText.includes(q)) score = 45;
      else {
        const words = q.split(/\s+/).filter(Boolean);
        if (words.length > 1 && words.every(w => nameLow.includes(w) || kwText.includes(w) || codeLow.includes(w))) {
          score = 40;
        }
      }
      if (score > 0) scored.push({ item, score });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 8).map(s => s.item);
  }

  function buildGenericOBDFallback(rawCode) {
    const code = (rawCode || "").trim().toUpperCase().replace(/\s+/g, "");
    if (!/^[PBCU][0-3][0-9A-F]{3}$/.test(code)) return null;

    const sysMap = {
      P: { label: "Powertrain (Engine / Transmission)", cost: "$120 – $950" },
      C: { label: "Chassis (ABS / Steering / Suspension)", cost: "$150 – $850" },
      B: { label: "Body (Airbag / Climate / Doors)", cost: "$100 – $650" },
      U: { label: "Network / Computer Communication", cost: "$150 – $800" }
    };
    const sys = sysMap[code[0]];
    const isMfr = code[1] === "1" || code[1] === "3";

    return {
      id: code,
      type: "code",
      code: code,
      icon: "obd",
      name: `${isMfr ? "Manufacturer-Specific" : "Standard"} ${sys.label} Code`,
      severity: "YELLOW",
      summary: `${code} is a valid ${isMfr ? "automaker-specific" : "generic OBD-II"} ${sys.label.toLowerCase()} trouble code not yet in our top-55 quick list.`,
      cost: sys.cost,
      quickCheck: "If the car drives normally and the Check Engine Light isn't flashing, get a free scan printout at AutoZone or O'Reilly with your vehicle make & year.",
      causes: [isMfr ? "Brand-specific sensor or actuator" : "Sensor or wiring fault", "Loose connector or weak 12V battery"]
    };
  }

  function renderDropdown(matches) {
    currentMatches = matches;
    activeDropIndex = -1;
    if (!matches.length) {
      el.dropdown.classList.remove("open");
      el.dropdown.innerHTML = "";
      el.input.setAttribute("aria-expanded", "false");
      return;
    }

    el.dropdown.innerHTML = matches.map((item, idx) => `
      <button type="button" class="drop-item" role="option" data-id="${item.id}" data-idx="${idx}">
        <span class="drop-left">
          <span class="drop-code">${item.code}</span>
          <span class="drop-name">${item.name}</span>
        </span>
        <span class="sev-dot ${item.severity}" aria-label="${item.severity} severity"></span>
      </button>
    `).join("");

    el.dropdown.classList.add("open");
    el.input.setAttribute("aria-expanded", "true");
  }

  /* =======================================================================
     7. CRISP ~0.5s MICRO-SCAN REVEAL -> INTERACTIVE RESULT CARD
     ======================================================================= */
  function revealResultWithPulse(item, skipPulse = false) {
    if (!item) return;
    clearTimeout(scanTimer);
    el.dropdown.classList.remove("open");
    el.input.setAttribute("aria-expanded", "false");

    if (skipPulse) {
      renderResultCard(item, false);
      return;
    }

    el.resultSection.hidden = true;
    el.microScanLabel.textContent = `Verifying ${item.code} against US diagnostic database...`;
    el.microScanPulse.hidden = false;

    scanTimer = setTimeout(() => {
      el.microScanPulse.hidden = true;
      renderResultCard(item, true);
    }, 480);
  }

  function renderResultCard(item, shouldScroll = true) {
    currentItem = item;
    const sev = item.severity || "YELLOW";

    el.resultCard.className = `result-card ${sev}`;
    el.severityBanner.className = `severity-banner ${sev}`;
    el.severityBadgeText.textContent = SEVERITY_LABELS[sev] || SEVERITY_LABELS.YELLOW;

    el.resultIconBox.className = `result-icon-box ${sev}`;
    el.resultIconBox.innerHTML = ICONS[item.icon || "obd"] || ICONS.obd;

    el.resultCodeTag.textContent = item.type === "code"
      ? `OBD-II CODE • ${item.code}`
      : `DASH LIGHT • ${item.code}`;

    el.resultTitle.textContent = item.name;
    el.resultPlain.textContent = item.summary;
    el.resultCost.textContent = item.cost;
    el.resultQuickCheck.textContent = item.quickCheck;

    if (item.causes && item.causes.length) {
      el.causesRow.innerHTML =
        `<span class="causes-label">Common culprits:</span>` +
        item.causes.map(c => `<span class="cause-chip">${c}</span>`).join("");
    } else {
      el.causesRow.innerHTML = "";
    }

    el.resultSection.hidden = false;

    try {
      const url = new URL(window.location.href);
      url.searchParams.set("code", item.id);
      window.history.replaceState({}, "", url);
    } catch (_) {}

    if (shouldScroll) {
      el.resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function executeLookup() {
    const val = el.input.value.trim();
    if (!val) {
      showToast("Enter an OBD code (like P0420) or tap a quick pill");
      el.input.focus();
      return;
    }

    const matches = searchDatabase(val);
    if (matches.length) {
      revealResultWithPulse(matches[0]);
      return;
    }

    const generic = buildGenericOBDFallback(val);
    if (generic) {
      revealResultWithPulse(generic);
      return;
    }

    showToast("No exact match — try P0420, P0300, or Dash Icons (32)");
  }

  /* =======================================================================
     8. VISUAL 32-ICON DASHBOARD LIGHT PICKER
     ======================================================================= */
  function renderLightGrid(filter = "ALL") {
    const lights = DB.filter(i => i.type === "light" && (filter === "ALL" || i.severity === filter));
    el.lightGrid.innerHTML = lights.map(light => `
      <button type="button" class="light-tile ${light.severity}" data-id="${light.id}" title="${light.name}">
        ${ICONS[light.icon] || ICONS.cel}
        <span>${light.code}</span>
      </button>
    `).join("");
  }

  renderLightGrid("ALL");

  el.browseBtn.addEventListener("click", () => {
    const willOpen = el.lightDrawer.hidden;
    el.lightDrawer.hidden = !willOpen;
    el.browseBtn.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) el.scanPanel.hidden = true;
  });

  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderLightGrid(tab.dataset.filter);
    });
  });

  el.lightGrid.addEventListener("click", e => {
    const tile = e.target.closest(".light-tile");
    if (!tile) return;
    const item = DB_MAP[tile.dataset.id];
    if (item) {
      el.input.value = item.name;
      el.clearBtn.classList.add("visible");
      el.lightDrawer.hidden = true;
      el.browseBtn.setAttribute("aria-expanded", "false");
      revealResultWithPulse(item);
    }
  });

  /* =======================================================================
     9. SNAP / UPLOAD PHOTO -> BACKEND /api/scan AI + SMART DEMO FALLBACK
     ======================================================================= */
  el.snapBtn.addEventListener("click", () => el.photoInput.click());

  el.closeScanBtn.addEventListener("click", () => {
    el.scanPanel.hidden = true;
    el.photoInput.value = "";
  });

  function readAndCompressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => resolve(reader.result);
        img.onload = () => {
          try {
            const maxDim = 1280;
            let { width, height } = img;
            if (width > maxDim || height > maxDim) {
              const ratio = Math.min(maxDim / width, maxDim / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
          } catch (_) {
            resolve(reader.result);
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function callBackendScan(imageBase64) {
    const allowedIds = DB.map(d => d.id);
    const res = await fetch(CONFIG.SCAN_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64, allowedIds })
    });

    if (!res.ok) throw new Error("Backend scan unavailable");
    const data = await res.json();
    if (data && data.matchedId) {
      const normalized = String(data.matchedId).trim().toUpperCase();
      if (DB_MAP[normalized]) return DB_MAP[normalized];
      const generic = buildGenericOBDFallback(normalized);
      if (generic) return generic;
    }
    return null;
  }

  function detectFromFilenameHint(filename) {
    const clean = (filename || "").toUpperCase();
    const codeMatch = clean.match(/\b([PBCU][0-3][0-9A-F]{3})\b/);
    if (codeMatch) return DB_MAP[codeMatch[1]] || buildGenericOBDFallback(codeMatch[1]);

    const hints = [
      ["TPMS", "LIGHT_TPMS"], ["TIRE", "LIGHT_TPMS"], ["OIL", "LIGHT_OIL_PRESSURE"],
      ["BATT", "LIGHT_BATTERY"], ["TEMP", "LIGHT_COOLANT_TEMP"], ["COOLANT", "LIGHT_COOLANT_TEMP"],
      ["BRAKE", "LIGHT_BRAKE"], ["ABS", "LIGHT_ABS"], ["AIRBAG", "LIGHT_AIRBAG"],
      ["SRS", "LIGHT_AIRBAG"], ["ENGINE", "LIGHT_CEL_STEADY"], ["CEL", "LIGHT_CEL_STEADY"]
    ];
    for (const [kw, id] of hints) {
      if (clean.includes(kw)) return DB_MAP[id];
    }
    return null;
  }

  function renderQuickPhotoOptions(statusMsg) {
    el.scanStatusText.textContent = statusMsg;
    const quickConfirmIds = [
      "LIGHT_CEL_STEADY", "LIGHT_TPMS", "LIGHT_OIL_PRESSURE",
      "LIGHT_BATTERY", "LIGHT_COOLANT_TEMP", "LIGHT_ABS",
      "LIGHT_BRAKE", "P0420"
    ];
    el.scanConfirmGrid.innerHTML = quickConfirmIds.map(id => {
      const d = DB_MAP[id];
      return `
        <button type="button" class="quick-pill" style="justify-content:center;width:100%;" data-confirm-id="${d.id}">
          <code>${d.code}</code>
        </button>
      `;
    }).join("");
  }

  el.photoInput.addEventListener("change", async e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    el.lightDrawer.hidden = true;
    el.browseBtn.setAttribute("aria-expanded", "false");
    el.scanConfirmGrid.innerHTML = "";
    el.scanPanel.hidden = false;
    el.scanPreviewWrap.classList.add("scanning");
    el.scanStatusText.textContent = "Scanning photo with AI & matching US database...";

    try {
      const compressedBase64 = await readAndCompressImage(file);
      el.scanPreviewImg.src = compressedBase64;

      let detected = null;
      try {
        detected = await callBackendScan(compressedBase64);
      } catch (_) {
        detected = detectFromFilenameHint(file.name);
      }

      el.scanPreviewWrap.classList.remove("scanning");

      if (detected) {
        el.scanStatusText.textContent = `Matched: ${detected.code} — ${detected.name}`;
        el.input.value = detected.code;
        el.clearBtn.classList.add("visible");
        revealResultWithPulse(detected);
      } else {
        const hintMatch = detectFromFilenameHint(file.name);
        if (hintMatch) {
          el.scanStatusText.textContent = `Matched: ${hintMatch.code} — ${hintMatch.name}`;
          el.input.value = hintMatch.code;
          el.clearBtn.classList.add("visible");
          revealResultWithPulse(hintMatch);
        } else {
          renderQuickPhotoOptions("Tap the matching light or code below (or type code above):");
        }
      }
    } catch (_) {
      el.scanPreviewWrap.classList.remove("scanning");
      renderQuickPhotoOptions("Could not read photo — tap a quick match or type code above:");
    }
  });

  el.scanConfirmGrid.addEventListener("click", e => {
    const btn = e.target.closest("[data-confirm-id]");
    if (!btn) return;
    const item = DB_MAP[btn.dataset.confirmId];
    if (item) {
      el.scanStatusText.textContent = `Selected: ${item.code} — ${item.name}`;
      el.input.value = item.code;
      el.clearBtn.classList.add("visible");
      revealResultWithPulse(item);
    }
  });

  /* =======================================================================
     10. INPUT, PILLS, CHECK ANOTHER, SHARE & LEGAL MODALS
     ======================================================================= */
  el.input.addEventListener("input", () => {
    const val = el.input.value;
    el.clearBtn.classList.toggle("visible", val.length > 0);
    renderDropdown(searchDatabase(val));
  });

  el.input.addEventListener("keydown", e => {
    const items = el.dropdown.querySelectorAll(".drop-item");
    if (e.key === "ArrowDown" && items.length) {
      e.preventDefault();
      activeDropIndex = (activeDropIndex + 1) % items.length;
      items.forEach((n, i) => n.classList.toggle("active", i === activeDropIndex));
    } else if (e.key === "ArrowUp" && items.length) {
      e.preventDefault();
      activeDropIndex = (activeDropIndex - 1 + items.length) % items.length;
      items.forEach((n, i) => n.classList.toggle("active", i === activeDropIndex));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeDropIndex >= 0 && currentMatches[activeDropIndex]) {
        const picked = currentMatches[activeDropIndex];
        el.input.value = picked.code;
        el.clearBtn.classList.add("visible");
        revealResultWithPulse(picked);
      } else {
        executeLookup();
      }
    } else if (e.key === "Escape") {
      el.dropdown.classList.remove("open");
    }
  });

  el.dropdown.addEventListener("click", e => {
    const btn = e.target.closest(".drop-item");
    if (!btn) return;
    const item = DB_MAP[btn.dataset.id];
    if (item) {
      el.input.value = item.code;
      el.clearBtn.classList.add("visible");
      revealResultWithPulse(item);
    }
  });

  el.clearBtn.addEventListener("click", () => {
    el.input.value = "";
    el.clearBtn.classList.remove("visible");
    el.dropdown.classList.remove("open");
    el.input.focus();
  });

  el.lookupBtn.addEventListener("click", executeLookup);

  document.querySelectorAll(".quick-pill[data-id]").forEach(pill => {
    pill.addEventListener("click", () => {
      const item = DB_MAP[pill.dataset.id];
      if (item) {
        el.input.value = item.code;
        el.clearBtn.classList.add("visible");
        revealResultWithPulse(item);
      }
    });
  });

  el.checkAnotherBtn.addEventListener("click", () => {
    el.input.value = "";
    el.clearBtn.classList.remove("visible");
    el.scanPanel.hidden = true;
    el.photoInput.value = "";
    el.scannerCard.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => el.input.focus(), 300);
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".search-wrap")) {
      el.dropdown.classList.remove("open");
      el.input.setAttribute("aria-expanded", "false");
    }
  });

  el.shareResultBtn.addEventListener("click", async () => {
    if (!currentItem) return;
    const shareText = `${currentItem.code}: ${currentItem.name} (${SEVERITY_LABELS[currentItem.severity]}) — US Repair Est: ${currentItem.cost}. Quick Check: ${currentItem.quickCheck}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentItem.code} — Dashboard Light & OBD Checker`,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (_) {}
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      showToast("Result copied to clipboard!");
    } catch (_) {
      showToast("Copy link from address bar");
    }
  });

  document.querySelectorAll(".legal-trigger[data-modal]").forEach(btn => {
    btn.addEventListener("click", () => {
      const content = LEGAL_CONTENT[btn.dataset.modal];
      if (!content) return;
      el.modalTitle.textContent = content.title;
      el.modalBody.innerHTML = content.html;
      el.modal.hidden = false;
    });
  });

  function closeModal() { el.modal.hidden = true; }
  el.closeModalBtn.addEventListener("click", closeModal);
  el.modal.addEventListener("click", e => { if (e.target === el.modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove("show"), 2600);
  }

  /* =======================================================================
     11. BOOT: RUN LOGO INTRO & CHECK SHARED ?code= QUERY
     ======================================================================= */
  runSignatureLogoIntro();

  (function initFromURL() {
    const params = new URLSearchParams(window.location.search);
    const qCode = params.get("code");
    if (!qCode) return;
    const clean = qCode.trim().toUpperCase();
    const item = DB_MAP[clean] || searchDatabase(qCode)[0] || buildGenericOBDFallback(clean);
    if (item) {
      el.input.value = item.code;
      el.clearBtn.classList.add("visible");
      revealResultWithPulse(item, true);
    }
  })();
})();
