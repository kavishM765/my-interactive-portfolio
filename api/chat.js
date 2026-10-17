// ════════════════════════════════════════════════════════════════════
// REZE — Autonomous Portfolio AI Assistant (Vercel Serverless)
// Architecture: Local FAQ Interceptor → Security Firewall → Gemini Flash
// ════════════════════════════════════════════════════════════════════

// ── In-Memory Rate Limiter (Token Bucket per IP) ─────────────────
const rateLimitCache = new Map();
const RATE_WINDOW_MS = 60000;
const MAX_MSGS_PER_WINDOW = 12;

const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [ip, rec] of rateLimitCache.entries()) {
        if (now - rec.start > RATE_WINDOW_MS * 2) rateLimitCache.delete(ip);
    }
}, 120000);
if (cleanupTimer.unref) cleanupTimer.unref();

// ── Prompt Injection Firewall ────────────────────────────────────
const BLOCKED_PATTERNS = [
    /ignore\s+(all\s+)?previous/i,
    /ignore\s+(all\s+)?instructions/i,
    /forget\s+(all\s+)?instructions/i,
    /disregard\s+(all\s+)?instructions/i,
    /system\s*prompt/i,
    /you\s+are\s+now/i,
    /act\s+as\s+(a\s+)?different/i,
    /pretend\s+(to\s+be|you)/i,
    /jailbreak/i,
    /DAN\s+mode/i,
    /bypass\s+(safety|filter|security)/i,
    /dump\s+(all\s+)?(records|data|database)/i,
    /reveal\s+(your|the)\s+(system|hidden)/i,
    /repeat\s+(the|your)\s+instructions/i,
    /what\s+(are|is)\s+your\s+(system|hidden|original)\s+(prompt|instructions)/i
];

function isPromptInjection(text) {
    return BLOCKED_PATTERNS.some(p => p.test(text));
}

// ── Local FAQ Interceptor (Zero Cost, Instant for short direct questions) ──
const LOCAL_FAQ = {
    contact: {
        patterns: [/^(contact|email|phone|whatsapp|reach|hire|number|call)$/i],
        response: "You can reach Kavish directly:\n📧 Email: kavishm100@gmail.com\n📱 WhatsApp / Call: +91 9865824929\n📍 Location: Coimbatore, Tamil Nadu, India\n\nFeel free to write to him anytime!"
    },
    location: {
        patterns: [/^(where|location|city|where are you based)$/i],
        response: "Kavish is based in Coimbatore, Tamil Nadu, India. He's studying Information Technology at SNS College of Technology."
    },
    name: {
        patterns: [/^(who are you|your name|what is your name|who is reze|reze)$/i],
        response: "I am REZE, what I can help with? I am Kavish's autonomous AI portfolio companion. Ask me anything about his projects, hackathons, skills, or experience!"
    }
};

function tryLocalFaq(text) {
    // Only intercept very short, direct queries; let Gemini handle all conversational queries!
    if (text.length > 30) return null;
    const clean = text.trim();
    for (const [, faq] of Object.entries(LOCAL_FAQ)) {
        if (faq.patterns.some(p => p.test(clean))) {
            return faq.response;
        }
    }
    return null;
}

// ── Portfolio Knowledge System Prompt ────────────────────────────
const SYSTEM_PROMPT = `You are REZE — Kavish M's autonomous AI companion embedded directly into his personal portfolio website. 
You speak in a warm, professional, and knowledgeable tone.
When greeting, introducing yourself, or asked who you are, always include: "I am REZE, what I can help with?".
If a visitor introduces themselves by name (for example, "Hi I am Naveen"), greet them politely by name (e.g. "Hi Naveen! I am REZE, what I can help with?").

You know EVERYTHING published across Kavish's portfolio website. Answer questions thoroughly and accurately using ONLY the official information below.

═══ KAVISH M — COMPLETE PORTFOLIO KNOWLEDGE BASE ═══

1. IDENTITY & CONTACT:
- Full Name: Kavish M
- Professional Role: AI Developer | Freelancer | Agentic AI Enthusiast | Automation | Full-Stack Engineer
- Tagline: "I build autonomous AI workflows, WhatsApp business bots & full-stack web applications. Solving real problems with clean code."
- Location: Coimbatore, Tamil Nadu, India
- Email: kavishm100@gmail.com
- Phone & WhatsApp: +91 9865824929
- Portfolio: https://kavishmportfolio.vercel.app/
- LinkedIn: linkedin.com/in/kavish-m-
- GitHub: github.com/kavishM765
- Turnaround SLA: Replies within 24 hours
- Data Privacy: Protected under the Digital Personal Data Protection (DPDP) Act 2023

2. EDUCATION & ACADEMIC FOUNDATIONS:
- B.Tech in Information Technology — SNS College of Technology, Coimbatore (2023–2027), graduating 2027. Currently in 4th year / 7th semester. Focused on Autonomous AI, Agentic Workflows, and Advanced Data Architectures.
- Higher Secondary Certificate (HSC) — Noble Matriculation Higher Secondary School, Virudhunagar (Passed Dec 2023). Centum Scorer (100/100) in Computer Science foundations with strong roots in structured programming and algorithms.

3. ACADEMIC HONORS & LEADERSHIP:
- ARP – Nominated for the college-wide All Rounder Performer Award at SNS College of Technology.
- Conducted a technical team bootcamp demonstrating GoVentures (the software platform used in the Skillathon final round) at Sri Ramakrishna College of Arts and Science (Mar 2026).
- Served as Paper Presentation Coordinator for Texperia '25, managing peer teams, research submissions, and presentation flows.

4. THREE CORE TECHNICAL DISCIPLINES:
- Discipline 01: Full-Stack Web Development — Modern, responsive web applications engineered with clean component architectures, robust backend logic, and scalable database connections (HTML, CSS, JavaScript, Python, Java, Cloud).
- Discipline 02: Automation using n8n & Code — Autonomous AI agent pipelines, custom webhooks, tool-calling nodes, and multi-service workflows that automate repetitive business processes 24/7 (n8n, Agentic AI, Python, Custom Webhooks, API Stitching).
- Discipline 03: UI & UX Interface Design — Distraction-free, human-crafted layouts with kinetic micro-interactions, editorial styling, and accessible responsive structures across all viewports.

5. PRODUCTION TECH STACK & TOOLS:
- Technical Skills: Agentic AI, Python, LangChain, LLMs, Prompt Engineering, n8n Automation, Web Development, JavaScript, Java, API Integration, Streamlit, HTML5 & CSS3.
- Tools & Platforms: Git & GitHub, VS Code, Firebase, Vercel, WhatsApp API, PDF Automation, Email Pipelines, REST APIs & Webhooks.
- Soft Skills: Communication, Team Collaboration, Quick Learning, Problem Solving, Adaptability.

6. TECHNICAL PORTFOLIO — 7 BUILT & PROTOTYPED SYSTEMS:
- Project 01 (Flagship): WhatsApp AI Chatbot for Business Automation
  • Category: Business AI & Messaging Automation
  • Summary: Production AI chatbot connected to a WhatsApp business number that answers customer queries, collects qualified intake details, books appointments/orders, generates dynamic branded PDF receipts, and sends email confirmations.
  • Tech: Python, LLMs, Prompt Engineering, WhatsApp API, PDF & Email Automation
  • What He Delivers: Zero-touch customer appointment booking inside WhatsApp, dynamic PDF document generation from structured intake data, and multi-channel notification dispatch.

- Project 02 (Flagship): AI Admission Enquiry & Management System
  • Category: n8n Workflow Automation
  • Summary: Web-based intake portal bound to an autonomous n8n automation pipeline that processes applicant data, routes leads, logs data, and sends instant personalized confirmations.
  • Tech: n8n Automation, Webhook API, Email Pipeline, Lead Scoring
  • What He Delivers: Zero-maintenance intake with schema validation, sub-second auto-responder emails upon submission, and real-time CRM sync to Google Sheets or SQL.
  
- Project 03: Full-Stack AI Admission Chatbot
  • Category: Full-Stack AI Lead Qualification
  • Summary: Interactive conversational agent delivering institutional admissions information, answering complex curriculum queries, and qualifying student leads.
  • Tech: Full-Stack, AI Chatbot, Lead Scoring, Streamlit, Firebase
  • What He Delivers: 24/7 smart advisory understanding institutional context, intent qualification through natural dialogue, and frictionless integration into web portals.
  
- Project 04: AI Assistant for Farmers
  • Category: Agentic AI Agri-Tech
  • Summary: Workflow engine delivering crop intelligence, meteorological alerts, and soil management tips through messaging channels.
  • Tech: n8n Engine, Agri-Tech, Weather API, Streamlit
  • What He Delivers: Multi-source weather and crop prompt aggregation, automated frost and drought warning dispatch, engineered for low-bandwidth mobile UX.
  
- Project 05: Library Management System Full Stack
  • Category: Full-Stack Web Platform
  • Summary: Full-stack database web platform where admin updates book details and students can search and view them with inventory tracking.
  • Tech: Java, MySQL, Database, Role-Based Authentication, Full-Stack
  • What He Delivers: Normalized relational database schemas, role-based access for admins and students, real-time indexed search across catalog.
  
- Project 06: Agentic n8n Automation Chatbot
  • Category: Autonomous Logic Pipeline
  • Summary: Multi-node execution flow leveraging custom webhook routers, structured memory buffers, and tool calling for automated business operations.
  • Tech: Tool Calling, Router Nodes, n8n Pipeline
  • What He Delivers: AI models that trigger databases and invoke external APIs, automatic retry routing when an external service is down, stateful context retained across inquiries.
  
- Project 07: Emergency SOS Dispatch Platform
  • Category: Critical Dispatch System
  • Summary: Rapid responder web portal connecting distressed users with emergency drivers, featuring live status streaming and automated notifications.
  • Tech: Live Dispatch, Real-Time Systems, Frontend UI, Alert Routing
  • What He Delivers: Low-latency triggers that fire instantly with zero bloat, real-time status feedback displaying driver ETA, high-contrast visual hierarchy for rapid emergency action.

7. "HOW I BUILD THIS" — 4-STEP ENGINEERING PHILOSOPHY:
- Step 01 · Map (Autonomous Pipelines): Identify manual bottlenecks and model smart background automations that eliminate human intervention for hands-free 24/7 runtime.
- Step 02 · Bridge (Connected Apps & Data): Securely bridge separate SaaS tools, databases, and webhooks for accurate real-time data sync with zero discrepancies.
- Step 03 · Engineer (Custom Web Applications): Engineer bespoke portals and dashboards tailored specifically around operational requirements that are fast, responsive, and reliable.
- Step 04 · Refine (Modern User Experience): Refine clarity and kinetic motion so complex operations feel effortless to the end user with calming, accessible design.

8. COMPETITIVE HACKATHONS & ACTIVITIES:
- MSME Hackathon 2025: National Finalist presenting rapid technical innovation and scalable digital solutions.
- AI Agents Hackathon (Aug 2025): Secured 5th Rank nationally out of 2,300+ teams with Swafinix Technologies on Unstop for autonomous agent workflow prototyping.
- Devspark'25 (KPR IET): Cleared review rounds in an intensive 24-hour sprint; built web frontend integrated with n8n webhook automations.
- BUGSLAYER '26 (Jan 2026): National Level 24-hour sprint at Dhanalakshmi Srinivasan College of Engineering & Technology; built a low-bandwidth Telemedicine Access Platform across 5 review rounds.
- GoVentures Bootcamp (Mar 2026): Conducted a team bootcamp demonstrating GoVentures, the software used in the Skillathon final round at Sri Ramakrishna College of Arts and Science.
- Intern2Innovate Internal Hackathon (Jan 2026): Participated at SNS Institutions building a rapid prototype.

9. VERIFIED CREDENTIALS & CERTIFICATIONS:
- Basics of Python — Infosys Springboard (Jul 2025)
- AI Agents Hackathon — 5th Rank, Prototype Submission (Swafinix Technologies / Unstop, Aug 2025)
- BUGSLAYER '26 — Telemedicine Platform (Dhanalakshmi Srinivasan College, Jan 2026)
- Devspark'25 — 24 hrs Hackathon Participant (KPR Institute of Engineering and Technology)
- IoT using Python & Raspberry Pi Workshop (Mechanica 2023, IIT Madras, Dec 2023)
- Paper Presentation at IGNIS '23 (Bannari Amman Institute of Technology, Dec 2023)

10. PROFESSIONAL EXPERIENCE:
- Freelance Developer (Self-Employed · Active): Building websites, automation workflows (n8n and Python), and AI chatbots for businesses; recently deployed a WhatsApp AI chatbot that books appointments/orders, dynamically generates PDFs, and sends email confirmations.
- Java Backend Development Intern — Let's Gametech, Coimbatore (2025): Studied backend tools and architecture, database integration flows, and server-side processing to understand integration processes.
- Front End Developer Intern — Dsignz Media, Coimbatore (30-Day Intensive): Learned front-end development and built a responsive front-end project from a given design using HTML, CSS, and JavaScript.
- IT Development Intern — Circor Flow Technology India Private Limited, Coimbatore (14-Day Intensive): Built a front-end page using HTML, CSS, and JavaScript to search company data records using internal product and component codes.

11. MOMENTS & PROOF GALLERY:
- Available on the dedicated gallery page (gallery.html) featuring photographic proof of hackathons, workshops, symposium awards, and team moments.

12. ABOUT REZE (YOURSELF):
- You are REZE, Kavish's autonomous AI companion built directly into this portfolio.
- You are powered by Google Gemini Flash and serverless architecture.
- You exist as a live, functional demonstration of Kavish's AI engineering capabilities.
- You are protected with enterprise-grade prompt injection firewalls, rate limiting, and message clamping.

═══ CONVERSATION RULES ═══
1. Only discuss information relating to Kavish M, his skills, projects, hackathons, and professional portfolio.
2. If asked about something completely unrelated, politely redirect back to Kavish's work.
3. NEVER mention or discuss "MK Salon" under any circumstances.
4. Keep answers concise, clean, and well-structured.
5. FORMATTING: Do NOT use raw asterisks (like * or **) or raw markdown link syntax like [text](url). Use clean bullet dots (•) or numbered lists (1., 2.), and write natural readable text without surrounding words in double asterisks.`;

// ── Main Serverless Handler ──────────────────────────────────────
module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const { message } = body || {};

        // ── Guard 1: Empty Message ───────────────────────────────
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ reply: "Please type a question and I'll help you!" });
        }

        const cleanMsg = message.trim();

        // ── Guard 2: Message Clamping (300 chars max) ────────────
        if (cleanMsg.length > 300) {
            return res.status(400).json({ reply: "That message is too long! Please keep it under 300 characters." });
        }

        // ── Guard 3: Rate Limiting ───────────────────────────────
        const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
        const now = Date.now();
        const ipRecord = rateLimitCache.get(clientIp);

        if (ipRecord) {
            if (now - ipRecord.start < RATE_WINDOW_MS) {
                ipRecord.count++;
                if (ipRecord.count > MAX_MSGS_PER_WINDOW) {
                    return res.status(429).json({ reply: "You're sending messages too fast! Please wait a moment and try again." });
                }
            } else {
                rateLimitCache.set(clientIp, { start: now, count: 1 });
            }
        } else {
            rateLimitCache.set(clientIp, { start: now, count: 1 });
        }

        // ── Guard 4: Prompt Injection Firewall ───────────────────
        if (isPromptInjection(cleanMsg)) {
            return res.status(200).json({ reply: "I'm REZE, Kavish's portfolio assistant. I can only help with questions about his projects, skills, and experience. What would you like to know?" });
        }

        // ── Layer 1: Local FAQ Interceptor (Zero Cost) ───────────
        const localAnswer = tryLocalFaq(cleanMsg);
        if (localAnswer) {
            return res.status(200).json({ reply: localAnswer, source: 'local' });
        }

        // ── Layer 2: Gemini Flash API ────────────────────────────
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(200).json({
                reply: "I am REZE, Kavish's AI assistant. I'm currently in offline mode, but I can tell you the basics!\n\nKavish is an AI & Automation Developer specializing in Agentic AI, n8n automation pipelines, and full-stack web systems. He's ranked 5th nationally in the AI Agents Hackathon out of 2,300+ teams.\n\n📧 kavishm100@gmail.com\n📱 +91 9865824929",
                source: 'fallback'
            });
        }

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

        const geminiPayload = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: cleanMsg }]
                }
            ],
            systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }]
            },
            generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                topK: 40,
                maxOutputTokens: 1000,
                responseMimeType: 'text/plain'
            },
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
            ]
        };

        const geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiPayload)
        });

        if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            console.error('Gemini API error:', geminiRes.status, errText);
            return res.status(200).json({
                reply: "I'm having a brief connection issue. In the meantime — Kavish is an AI & Automation Developer. You can reach him at kavishm100@gmail.com or +91 9865824929!",
                source: 'error_fallback'
            });
        }

        const rawResText = await geminiRes.text();
        let geminiData;
        try {
            geminiData = JSON.parse(rawResText);
        } catch (e) {
            console.error('Gemini non-JSON:', rawResText);
            return res.status(200).json({
                reply: "I'm having a brief connection issue. In the meantime, you can reach Kavish at kavishm100@gmail.com or +91 9865824929!",
                source: 'gemini_parse_err'
            });
        }
        const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) {
            return res.status(200).json({
                reply: "I couldn't generate a response right now. Feel free to ask me about Kavish's projects, hackathons, or skills!",
                source: 'empty_response'
            });
        }

        return res.status(200).json({ reply: reply.trim(), source: 'gemini' });

    } catch (err) {
        console.error('REZE API Error:', err);
        return res.status(200).json({
            reply: "Something went wrong on my end. You can always reach Kavish directly at kavishm100@gmail.com!",
            source: 'catch_fallback'
        });
    }
};
