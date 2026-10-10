# Kavish M — Interactive Portfolio & Autonomous AI Companion

[![Live Website](https://img.shields.io/badge/Live_Portfolio-kavishmportfolio.vercel.app-C5A059?style=for-the-badge&logo=vercel&logoColor=white)](https://kavishmportfolio.vercel.app)
[![Vercel Deployment](https://img.shields.io/badge/Deployment-Ready-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://kavishmportfolio.vercel.app)
[![Google Gemini](https://img.shields.io/badge/Powered_by-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-gray?style=for-the-badge)](LICENSE)

An editorial, interactive developer portfolio showcasing autonomous agentic pipelines, full-stack web applications, and a live embedded AI companion (**REZE**) powered by Google Gemini.

---

## 🌟 Highlights

* **REZE — Live AI Companion**: An autonomous conversational assistant living inside the portfolio, powered by **Google Gemini Flash** via a secured Vercel Serverless Gateway.
* **Interactive Animated Character**: Left-docked companion featuring Rive WebAssembly animation with custom 2D Canvas fallbacks.
* **Warm Editorial Aesthetic**: Crafted with a bespoke Cashmere Stone (`#E8E5DF`), Oyster Linen (`#F3F0EB`), and Brushed Gold (`#C5A059`) palette.
* **Moving Tech Tickers & Project Streams**: Continuous bidirectional marquee tracks for production skills and project inspection.
* **Moments & Proof Gallery (`gallery.html`)**: Filterable media showcase with verified photographic evidence of national hackathons, symposium awards, and certifications.

---

## 🤖 REZE — AI Companion Architecture

REZE is not a static chatbot script; she is an autonomous, secured conversational agent equipped with complete knowledge of Kavish's projects, hackathons, and technical background.

```
Visitor Message
       │
       ▼
┌──────────────────────────────┐
│  Input Clamping & Validation │  ← Max 300 characters, sanitize input
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Prompt Injection Firewall   │  ← Blocks jailbreaks, DAN prompts, instruction overrides
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  In-Memory IP Rate Limiter   │  ← Token-bucket limiter protecting API quota
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Google Gemini Flash Backend │  ← Serverless /api/chat endpoint with rich portfolio context
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  Client Markdown Formatter   │  ← Transforms markdown into clean bullet dots & clickable links
└──────────────────────────────┘
```

### Security & Optimization Features
* **Prompt Injection Firewall**: Pattern matcher intercepts prompt theft, jailbreak attempts, and instruction overrides.
* **Token-Bucket Rate Limiter**: Per-IP windowing prevents quota exhaustion.
* **Message Clamping**: Enforces strict buffer limits (300 chars) before queries reach the LLM.
* **Zero-Cost Local Fallback**: Instant offline fast-path knowledge base ensures the bot remains responsive even during network interruptions.
* **Client-Side Markdown Formatter**: Automatically renders bold text, bullet points (`•`), and active hyperlinks without raw syntax characters.

---

## 🛠️ Featured Technical Projects

| Project | Category | Tech Stack | Highlights |
|:---|:---|:---|:---|
| **AI Admission Enquiry System** *(Flagship)* | n8n Workflow Automation | n8n, Webhook API, Email Pipeline, Sheets CRM | Zero-maintenance intake portal, sub-second dynamic auto-responders, and real-time CRM database synchronization. |
| **Full-Stack AI Admission Chatbot** *(Flagship)* | Full-Stack Conversational AI | Streamlit, Firebase, Web Technologies | 24/7 institutional admissions advisor, natural lead scoring, and curriculum query resolver. |
| **AI Assistant for Farmers** | Agentic Agri-Tech | n8n Engine, Weather API, Streamlit | Crop intelligence workflow engine with automated frost & drought alerts optimized for low-bandwidth mobile UX. |
| **Agentic n8n Automation Chatbot** | Autonomous Logic Pipeline | Tool Calling, Router Nodes, n8n Pipeline | Autonomous multi-node execution flow triggering databases and external APIs with automated retry routing. |
| **Library Management System** | Full-Stack Web Platform | Java, MySQL, Role-Based Auth | Relational database schemas, role-based controls for admins/students, and real-time indexed search across catalogs. |
| **Emergency SOS Dispatch Platform** | Critical Dispatch System | Real-Time Systems, Live Dispatch, Alert Routing | Rapid responder portal connecting distressed users with emergency drivers, featuring live status streaming and driver ETA. |

---

## 🏆 Competitive Hackathons & Milestones

* **AI Agents Hackathon (Swafinix Technologies / Unstop)**: **Rank 5 Nationally** out of 2,300+ teams for autonomous agent prototyping under time pressure *(Aug 2025)*.
* **BUGSLAYER '26 (National Level)**: Cleared 5 intense review rounds building a low-bandwidth Telemedicine Access Platform at Dhanalakshmi Srinivasan College *(Jan 2026)*.
* **DevForge (KPR IET)**: Cleared 3 review rounds in a 24-hour sprint; engineered the responsive frontend while connecting backend flows with n8n webhooks.
* **MSME Hackathon 2025**: **National Finalist** for scalable digital innovation.
* **Texperia '25**: Served as Paper Presentation Coordinator, managing peer teams, submissions, and research presentations.
* **All Rounder Performer Award 2025**: Nominated college-wide at SNS College of Technology.

---

## 💼 Professional Internships

* **Backend Development Intern** — *Let's Gametech, Coimbatore (2025)*: Explored server-side architectures, database schemas, and API integration flows for gaming applications.
* **Front End Developer Intern** — *Dsignz Media, Coimbatore (21-Day Intensive)*: Built responsive web applications mastering modern CSS, JavaScript, and user experience patterns.
* **IT Development Intern** — *Circor Flow Technology India Pvt. Ltd. (Aug 2024)*: Engineered enterprise frontend web portals adhering to strict corporate design standards.

---

## 🎓 Education

* **B.Tech in Information Technology** — *SNS College of Technology, Coimbatore (2023–2027)*  
  Currently in 4th year / 7th semester. Focused on Autonomous AI, Agentic Workflows, and Advanced Data Architectures.
* **Higher Secondary Certificate (HSC)** — *Noble Matriculation Higher Secondary School, Virudhunagar (Passed Dec 2023)*  
  **Centum Scorer (100/100)** in Computer Science foundations.

---

## 🚀 Local Development Setup

To run this project locally on your machine:

```bash
# 1. Clone the repository
git clone https://github.com/kavishM765/my-interactive-portfolio.git

# 2. Navigate to project directory
cd my-interactive-portfolio

# 3. Create a local environment file (optional, for Gemini AI backend)
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local

# 4. Open in any static server (or VS Code Live Server)
# If using Node:
npx serve .
```

Visit `http://localhost:3000` (or the port specified) in your browser.

---

## 🔒 Security & Data Privacy

* **Zero Leaked Credentials**: All API keys and environment variables are serverless-only and strictly gitignored.
* **Data Privacy Protection**: Contact inquiry endpoints comply with the **Digital Personal Data Protection (DPDP) Act 2023**.
* **Strict CSP**: Content Security Policy configured in `vercel.json` with hardened frame, script, and object restrictions.

---

## 📬 Contact & Connect

* **Email:** [kavishm100@gmail.com](mailto:kavishm100@gmail.com)
* **Phone / WhatsApp:** [+91 9865824929](tel:+919865824929)
* **LinkedIn:** [linkedin.com/in/kavish-m-](https://www.linkedin.com/in/kavish-m-)
* **GitHub:** [github.com/kavishM765](https://github.com/kavishM765)
* **Response SLA:** Within 24 hours

---

*Designed and Engineered with precision by Kavish M.*