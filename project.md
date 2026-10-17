# Project Architecture & Portfolio Reference Matrix
> **Single Source of Truth for Kavish M's Portfolio & REZE AI Assistant**  
> *Refer to this document first to analyze the project rapidly and conserve context tokens.*

---

## 1. Project Metadata
- **Project Name:** Kavish M — Personal Interactive Portfolio & AI Companion (REZE)
- **Live Production URL:** [https://kavishmportfolio.vercel.app/](https://kavishmportfolio.vercel.app/)
- **GitHub Repository:** [https://github.com/kavishM765/my-interactive-portfolio.git](https://github.com/kavishM765/my-interactive-portfolio.git)
- **Active Branch:** `main`
- **Hosting & Infrastructure:** Vercel (Edge CDN + Node.js Serverless Functions)
- **Deployment Config:** `vercel.json` (`maxDuration: 30s` for `/api/chat.js`)
- **Primary Stack:** Semantic HTML5, Vanilla JavaScript (ES6+), Tailwind CSS (CDN), CSS3 Animations, Rive WebGL Runtime, Google Gemini Flash API

---

## 2. Visual Identity & Editorial Design Tokens
- **Design Philosophy:** Editorial Cashmere Stone aesthetic — warm, distraction-free, light-palette editorial minimalism with brushed gold accents.
- **Color Palette:**
  - **Main Canvas Background:** `#E8E5DF` (Warm Cashmere Stone)
  - **Section Alternates:** `#E3E0D8/60` (Oyster Linen tint)
  - **Card Surface Background:** `#F3F0EB` (Crisp Alabaster Stone)
  - **Surface Borders:** `#CAC7BF` (Muted Warm Linen)
  - **Primary Typography:** `#1C1B1A` (Deep Carbon Charcoal, high-contrast readability)
  - **Secondary Typography:** `#5C5852` (Neutral Slate Warm Grey)
  - **Muted Accents:** `#A09C94` (Muted Sand Grey)
  - **Brushed Gold (Primary Accent):** `#8A651E` (Warm Ochre Gold for tags, active states, badges)
  - **Bright Gold (Interactive/Hover):** `#C5A059` (Luminous Warm Gold for borders and focus rings)
- **Typography:**
  - **Headings:** `Outfit`, sans-serif (Weights: 700 Bold, 800 ExtraBold, 900 Black)
  - **Body & Captions:** `Inter`, sans-serif (Weights: 400 Regular, 500 Medium, 600 SemiBold)
- **Motion & Scroll Reveal (`style.css`):**
  - Cubic-bezier easing: `cubic-bezier(0.16, 1, 0.3, 1)` (0.8s smooth glide)
  - `.animate-on-scroll.appear` — triggers on IntersectionObserver viewport entrance
  - `.slide-left` — enters smoothly from left to right (`translateX(-40px)` -> `0`)
  - `.slide-right` — enters smoothly from right to left (`translateX(40px)` -> `0`)
  - `.fade-up` — enters smoothly from bottom to top (`translateY(32px)` -> `0`)
  - Cascading staggered delays: `.delay-75`, `.delay-100`, `.delay-150`, `.delay-200`, `.delay-225`, `.delay-250`, `.delay-300`, `.delay-400`

---

## 3. Repository Directory Structure
```text
MY PORTFOLIO/
├── index.html                   # Main landing page (Hero, Focus, Tech Ticker, Projects, Hackathons, Experience, Contact, REZE Bot)
├── gallery.html                 # Moments & Proof page (Photographic archive of hackathons, bootcamps, workshops & awards)
├── project.md                   # THIS FILE: Single source of truth for architecture & profile data
├── README.md                    # Public GitHub documentation with architecture overview
├── vercel.json                  # Serverless function routing & timeout limits
├── package.json                 # Dependency definitions & scripts
├── api/
│   └── chat.js                  # Vercel Serverless Function: Rate limiting, prompt injection firewall, local FAQ & Gemini Flash
└── assets/
    ├── css/                     # Legacy style folder (redirected to assets/style/)
    ├── style/
    │   ├── style.css            # Core design system, scroll reveals, tickers, warm-card styling, chat bubbles
    │   └── gallery.css          # Gallery page layout, filters, and lightbox modal styling
    ├── script/
    │   ├── avatar-controller.js # REZE client controller, Rive character instance, 2D fallback, markdown parser, offline KB
    │   ├── script.js            # Light mode modals, Formspree submission, IntersectionObserver scroll observer
    │   ├── gallery.js           # Moments photo stream renderer, category filters, image lightbox controller
    │   ├── living-canvas.js     # Subtle ambient hero background canvas
    │   └── vendor/
    │       └── rive.wasm        # Local WebAssembly binary for Rive runtime
    ├── models/
    │   └── 8257-15795-happy-little-robot.riv # Vector Rive animation file for REZE companion
    └── image/
        ├── kavish-hero.webp     # WebP optimized hero portrait
        ├── kavish-hero-opt.jpg  # Fallback optimized portrait
        └── proof/               # Original photography archive for hackathons and awards
```

---

## 4. Personal Profile & Resume Knowledge Matrix

### 4.1 Contact & Core Identity
- **Full Name:** Kavish M
- **Role Title:** AI Developer | Freelancer | Agentic AI Enthusiast | Automation | Full-Stack Engineer
- **Email:** `kavishm100@gmail.com`
- **Phone & WhatsApp:** `+91 9865824929`
- **Location:** Coimbatore, Tamil Nadu, India
- **LinkedIn:** [linkedin.com/in/kavish-m-](https://www.linkedin.com/in/kavish-m-)
- **GitHub:** [github.com/kavishM765](https://github.com/kavishM765)
- **SLA:** Within 24 hours turnaround

### 4.2 Technical Skills & Toolsets (24 Core Capabilities)
- **Row 1 — Technical Disciplines:**  
  `Agentic AI` · `Python` · `LangChain` · `LLMs` · `n8n Automation` · `Prompt Engineering` · `Web Development` · `JavaScript` · `Java` · `API Integration` · `Streamlit` · `HTML5 & CSS3`
- **Row 2 — Platforms, Tools & Workflows:**  
  `Git & GitHub` · `VS Code` · `Firebase` · `Vercel` · `WhatsApp API` · `PDF Automation` · `Email Pipelines` · `REST & Webhooks` · `Problem Solving` · `Team Collaboration` · `Quick Learning` · `Adaptability`
- **Soft Skills:** Communication, Team Collaboration, Quick Learning, Problem Solving, Adaptability.

### 4.3 Technical Projects (7 Built Systems)
1. **WhatsApp AI Chatbot for Business Automation (Flagship 01):**  
   *Tech:* Python, LLMs, Prompt Engineering, WhatsApp API, PDF & Email Automation  
   *Summary:* Connected to a live WhatsApp Business number; answers customer queries, collects qualified intake details, books appointments/orders, generates dynamic branded PDF receipts, and sends email confirmations.
2. **AI Admission Enquiry & Management System (Flagship 02):**  
   *Tech:* n8n Automation, Webhook API, Email Pipeline, Lead Scoring  
   *Summary:* Web-based intake portal bound to an autonomous n8n automation pipeline that processes applicant data, routes leads, logs data to databases, and sends instant personalized confirmations.
3. **Full-Stack AI Admission Chatbot (Project 03):**  
   *Tech:* Full-Stack, AI Chatbot, Streamlit, Firebase, Lead Qualification  
   *Summary:* Conversational agent delivering institutional admissions information, answering complex curriculum queries, and qualifying prospective student leads.
4. **AI Assistant for Farmers (Project 04):**  
   *Tech:* n8n Engine, Agri-Tech, Weather API, Streamlit  
   *Summary:* Workflow engine delivering crop intelligence, meteorological alerts, and soil management tips through messaging channels.
5. **Library Management System Full Stack (Project 05):**  
   *Tech:* Java, MySQL, Relational Database, Role-Based Auth, Full-Stack  
   *Summary:* Web platform where admin manages book catalogs and students can search and borrow books with real-time inventory tracking.
6. **Agentic n8n Automation Chatbot (Project 06):**  
   *Tech:* Tool Calling, Router Nodes, n8n Pipeline, Structured Memory  
   *Summary:* Multi-node execution flow leveraging custom webhook routers, memory buffers, and tool calling for automated business operations.
7. **Emergency SOS Dispatch Platform (Project 07):**  
   *Tech:* Live Dispatch, Real-Time Systems, Frontend UI, Alert Routing  
   *Summary:* Rapid responder web portal connecting distressed users with emergency drivers, featuring live status streaming and automated notifications.

### 4.4 Professional Experience
1. **Freelance Developer (Active / Ongoing):**  
   Self-employed developer building custom web applications, autonomous automation pipelines with n8n and Python, and intelligent AI chatbots for businesses (e.g. WhatsApp AI booking & PDF invoice pipeline).
2. **Java Backend Development Intern — Let's Gametech, Coimbatore (2025):**  
   Studied backend tools and architecture, database integration flows, and server-side processing to understand integration processes.
3. **Front End Developer Intern — Dsignz Media, Coimbatore (30-Day Intensive):**  
   Learned front-end development and built a responsive front-end project from a given design using HTML, CSS, and JavaScript.
4. **IT Development Intern — Circor Flow Technology India Private Limited, Coimbatore (14-Day Intensive):**  
   Built a front-end page using HTML, CSS, and JavaScript to search company data records using internal product and component codes.

### 4.5 Education
1. **B.Tech in Information Technology (2023 – 2027, Graduating 2027):**  
   SNS College of Technology, Coimbatore. Currently in 4th year / 7th semester. Focused on Autonomous AI, Agentic Workflows, and Advanced Data Architectures.
2. **Higher Secondary Certificate (HSC, Passed Dec 2023):**  
   Noble Matriculation Higher Secondary School, Virudhunagar. Centum scorer (100/100) in Computer Science foundations.

### 4.6 Competitive Hackathons, Honors & Leadership
1. **MSME Hackathon 2025:** National Level Finalist.
2. **AI Agents Hackathon (Aug 2025):** 5th Rank nationally out of 2,300+ teams with Swafinix Technologies on Unstop for autonomous agent workflow prototyping.
3. **Devspark'25 (2025):** 24-hour sprint at KPR Institute of Engineering and Technology; built web frontend integrated with n8n webhook pipelines.
4. **BUGSLAYER '26 (Jan 2026):** National Level 24-hour sprint at Dhanalakshmi Srinivasan College of Engineering & Technology; built Telemedicine Access Platform across 5 review rounds.
5. **GoVentures Team Bootcamp (Mar 2026):** Conducted a technical team bootcamp demonstrating GoVentures, the software platform used in the Skillathon final round at Sri Ramakrishna College of Arts and Science.
6. **Intern2Innovate Internal Hackathon (Jan 2026):** Built rapid prototype at SNS Institutions.
7. **ARP – All Rounder Performer Nominee:** Nominated for the college-wide award at SNS College of Technology.
8. **Paper Presentation Coordinator:** Texperia '25 technical symposium coordinator.

### 4.7 Verified Credentials Timeline
1. **Basics of Python — Infosys Springboard (Jul 2025):** Verified credential covering Python programming, control structures, and modular algorithms.
2. **AI Agents Hackathon — 5th Rank (Aug 2025):** Swafinix Technologies / Unstop.
3. **BUGSLAYER '26 — Telemedicine Platform (Jan 2026):** Dhanalakshmi Srinivasan College.
4. **Devspark'25 — 24 hrs Hackathon Participant:** KPR Institute of Engineering and Technology.
5. **IoT using Python & Raspberry Pi Workshop (Dec 2023):** Mechanica 2023, IIT Madras.
6. **Paper Presentation at IGNIS '23 (Dec 2023):** Bannari Amman Institute of Technology.

---

## 5. REZE AI Copilot Architecture

### 5.1 System Overview
- **Name:** REZE (Autonomous Portfolio Intelligence)
- **Standard Intro:** *"Hi! I am REZE, what I can help with? Ask me anything about Kavish's projects, skills, hackathons, or background!"*
- **Tone:** Warm, professional, concise, helpful. Never mentions fictional or unrelated entities.
- **Engine:** Google Gemini Flash (via `/api/chat.js` serverless function) + Zero-latency client fallback (`REZE_LOCAL_KB`).

### 5.2 Serverless Pipeline (`api/chat.js`)
1. **Rate Limiting:** Token-bucket rate limiter per client IP (12 requests/minute max).
2. **Security Firewall:** In-memory regex filtering against jailbreak attempts (`DAN mode`, `ignore instructions`, `system prompt dumping`).
3. **Local Fast Path:** Zero-latency answers for direct contact and identity queries.
4. **System Prompt Injection:** Complete updated resume knowledge base injected as high-priority developer context.
5. **Formatting Parser:** Converts markdown `**bold**`, bullet points `•`, and `[link](url)` into clean, clickable HTML elements.

### 5.3 Mobile Responsive Layout (`index.html` & `avatar-controller.js`)
- **Container (`#floating-bot-popup`):**
  - Mobile: `bottom-3 right-3 left-3 h-[85vh] max-h-[640px] flex flex-col z-50`
  - Desktop: `sm:bottom-20 sm:right-6 sm:w-[580px] md:w-[620px] sm:h-[520px] sm:flex-row`
- **Companion Section (Left):**
  - Mobile: Compact top section (`h-[95px]`) with animated Rive robot and small `Live` pill; duplicate headers hidden.
  - Desktop: Full 220px wide companion panel with live badge, full canvas, and nameplate.
- **Chat Body (Right):**
  - Flex layout: `flex-1 min-h-0 flex flex-col`.
  - Messages stream: `flex-1 min-h-0 overflow-y-auto`.
  - Footer & Input: `flex-shrink-0` locked at the bottom so chips, input box, and send button are NEVER clipped on mobile.
- **Trigger Button (`#floating-bot-trigger`):**
  - Automatically hidden (`display: none`) when popup opens to prevent visual overlap.
  - Restored (`display: flex`) when popup closes.

---

## 6. How to Use This Document (For Future AI Sessions)
1. **Always read `project.md` first** when starting a new session or analyzing the portfolio to save context tokens.
2. **Update `project.md` whenever:**
   - A new project, hackathon, role, or certification is added.
   - Styling tokens or architecture patterns are modified.
   - REZE's prompts or endpoints are updated.
