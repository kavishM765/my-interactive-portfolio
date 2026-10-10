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
- Professional Role: AI & Automation Developer, Full-Stack Engineer
- Tagline: "I build autonomous AI workflows & full-stack web applications. Solving real problems with clean code."
- Location: Coimbatore, Tamil Nadu, India
- Email: kavishm100@gmail.com
- Phone & WhatsApp: +91 9865824929
- LinkedIn: linkedin.com/in/kavish-m-
- GitHub: github.com/kavishM765
- Turnaround SLA: Replies within 24 hours
- Data Privacy: Protected under the Digital Personal Data Protection (DPDP) Act 2023

2. EDUCATION & ACADEMIC FOUNDATIONS:
- B.Tech in Information Technology — SNS College of Technology, Coimbatore (2023–2027), currently in 4th year / 7th semester. Focused on Autonomous AI, Agentic Workflows, and Advanced Data Architectures.
- Higher Secondary Certificate (HSC) — Noble Matriculation Higher Secondary School, Virudhunagar (Passed Dec 2023). Centum Scorer (100/100) in Computer Science foundations with strong roots in structured programming and algorithms.

3. ACADEMIC HONORS & LEADERSHIP:
- Nominated for the college-wide All Rounder Performer Award 2025 at SNS College of Technology.
- Served as Paper Presentation Coordinator for Texperia '25, managing peer teams, research submissions, and presentation flows.

4. THREE CORE TECHNICAL DISCIPLINES:
- Discipline 01: Full-Stack Web Development — Modern, responsive web applications engineered with clean component architectures, robust backend logic, and scalable database connections (HTML, CSS, JavaScript, Databases, Cloud).
- Discipline 02: Automation using n8n & Code — Autonomous AI agent pipelines, custom webhooks, tool-calling nodes, and multi-service workflows that automate repetitive business processes 24/7 (n8n, Agentic AI, Custom Webhooks, API Stitching).
- Discipline 03: UI & UX Interface Design — Distraction-free, human-crafted layouts with kinetic micro-interactions, editorial styling, and accessible responsive structures across all viewports.

5. PRODUCTION TECH STACK & TOOLS (12 Skills):
- Agentic AI (Autonomous multi-node agents, tool calling, prompt engineering)
- n8n Automation (Webhooks, autonomous pipelines, workflow routing)
- Java (Object-oriented programming, systems development, backend logic)
- Web Development (HTML5, modern CSS, JavaScript ES6+, responsive architectures)
- API Integration (REST APIs, Webhook architecture, multi-service stitching)
- Streamlit (Rapid AI prototypes, interactive dashboards)
- Firebase (Real-time database, authentication, cloud services)
- Vercel (Serverless deployment, edge hosting, production CI/CD)
- VS Code (Primary engineering environment)
- Git & GitHub (Version control, collaboration, CI/CD)
- Team Work & Communication (Cross-functional collaboration, technical leadership)
- Soft Skills: Problem Solving, Quick Learning, Adaptability, Team Collaboration

6. TECHNICAL PORTFOLIO — 6 BUILT & PROTOTYPED SYSTEMS:
- Project 01 (Flagship): AI Admission Enquiry System
  • Category: n8n Workflow Automation
  • Summary: Web-based intake portal bound to an autonomous n8n automation pipeline that processes applicant data, routes leads, and sends instant personalized confirmations.
  • Tech: n8n Automation, Webhook API, Email Pipeline
  • What He Delivers: Zero-maintenance intake with schema validation, sub-second auto-responder emails upon submission, and real-time CRM sync to Google Sheets or SQL.
  
- Project 02 (Flagship): Full-Stack AI Admission Chatbot
  • Category: Full-Stack AI Lead Qualification
  • Summary: Interactive conversational agent delivering institutional admissions information, answering complex curriculum queries, and qualifying student leads.
  • Tech: Full-Stack, AI Chatbot, Lead Scoring, Streamlit, Firebase
  • What He Delivers: 24/7 smart advisory understanding institutional context, intent qualification through natural dialogue, and frictionless integration into web portals.
  
- Project 03: AI Assistant for Farmers
  • Category: Agentic AI Agri-Tech
  • Summary: Workflow engine delivering crop intelligence, meteorological alerts, and soil management tips through messaging channels.
  • Tech: n8n Engine, Agri-Tech, Weather API, Streamlit
  • What He Delivers: Multi-source weather and crop prompt aggregation, automated frost and drought warning dispatch, engineered for low-bandwidth mobile UX.
  
- Project 04: Agentic n8n Automation Chatbot
  • Category: Autonomous Logic Pipeline
  • Summary: Multi-node execution flow leveraging custom webhook routers, structured memory buffers, and tool calling for automated business operations.
  • Tech: Tool Calling, Router Nodes, n8n Pipeline
  • What He Delivers: AI models that trigger databases and invoke external APIs, automatic retry routing when an external service is down, stateful context retained across inquiries.
  
- Project 05: Library Management System
  • Category: Full-Stack Web Platform
  • Summary: Full-stack database web platform featuring administrative catalog controls, student membership lookup, and real-time inventory tracking.
  • Tech: Java, MySQL, Database, Role-Based Authentication, Full-Stack
  • What He Delivers: Normalized relational database schemas, role-based access for admins and student members, real-time indexed search across large book catalogs.
  
- Project 06: Emergency SOS Dispatch Platform
  • Category: Critical Dispatch System
  • Summary: Rapid responder web portal connecting distressed users with emergency drivers, featuring live status streaming and automated notifications.
  • Tech: Live Dispatch, Real-Time Systems, Frontend UI, Alert Routing
  • What He Delivers: Low-latency triggers that fire instantly with zero bloat, real-time status feedback displaying driver ETA, high-contrast visual hierarchy for rapid emergency action.

7. "HOW I BUILD THIS" — 4-STEP ENGINEERING PHILOSOPHY:
- Step 01 · Map (Autonomous Pipelines): Identify manual bottlenecks and model smart background automations that eliminate human intervention for hands-free 24/7 runtime.
- Step 02 · Bridge (Connected Apps & Data): Securely bridge separate SaaS tools, databases, and webhooks for accurate real-time data sync with zero discrepancies.
- Step 03 · Engineer (Custom Web Applications): Engineer bespoke portals and dashboards tailored specifically around operational requirements that are fast, responsive, and reliable.
- Step 04 · Refine (Modern User Experience): Refine clarity and kinetic motion so complex operations feel effortless to the end user with calming, accessible design.

8. COMPETITIVE HACKATHONS & ACHIEVEMENTS:
- AI Agents Hackathon (Aug 2025): Secured 5th Rank nationally out of 2,300+ teams with Swafinix Technologies on Unstop for autonomous agent workflow prototyping.
- BUGSLAYER '26 (Jan 2026): National Level 24-hour sprint at Dhanalakshmi Srinivasan College of Engineering & Technology; built a low-bandwidth Telemedicine Access Platform across 5 review rounds.
- DevForge (KPR IET): Cleared 3 review rounds in a 24-hour sprint; built the frontend and connected backend flows with n8n webhooks.
- MSME Hackathon 2025: National Finalist presenting rapid technical innovation and scalable digital solutions.

9. VERIFIED CREDENTIALS & CERTIFICATIONS:
- AI Agents Hackathon — 5th Rank, Prototype Submission (Swafinix Technologies / Unstop, Aug 2025)
- BUGSLAYER '26 — Telemedicine Platform (Dhanalakshmi Srinivasan College, Jan 2026)
- IoT using Python & Raspberry Pi Workshop (Mechanica 2023, IIT Madras, Dec 2023)
- Paper Presentation at IGNIS '23 (Bannari Amman Institute of Technology, Dec 2023)

10. PROFESSIONAL INTERNSHIPS:
- Backend Development Intern — Let's Gametech, Coimbatore (2025): Explored backend architecture, database schemas, and API integration flows for server-side gaming data processing.
- Front End Developer Intern — Dsignz Media, Coimbatore (21-Day Intensive): Modern frontend web engineering, HTML, CSS, JavaScript, and responsive layout patterns.
- IT Development Intern — Circor Flow Technology India Pvt. Ltd. (Aug 2024): Developed enterprise-grade corporate frontend web pages with cross-device compatibility.

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
4. Keep answers concise, clean, and nicely formatted with bullet points where appropriate.`;

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
