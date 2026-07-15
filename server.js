/**
 * Node.js WebSocket Proxy Server for Gemini Live API
 * 
 * Securely forwards Web Audio PCM streams from the frontend to Google's Gemini Live API.
 * Keeps your GEMINI_API_KEY hidden on the server side.
 * 
 * Deployment: Suitable for Render.com, Railway.app, or local hosting.
 */

const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const { GoogleGenAI, Modality } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files if deployed as a monorepo
app.use(express.static(path.join(__dirname)));

app.get('/api/health', (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

let aiInstance = null;

function getGenAI() {
    if (!aiInstance) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY environment variable is required. Please set it in your hosting provider's settings.");
        }
        aiInstance = new GoogleGenAI({
            apiKey,
            httpOptions: {
                headers: {
                    'User-Agent': 'aistudio-build',
                }
            }
        });
    }
    return aiInstance;
}

// System instructions for Kavish's AI Twin
const KAVISH_SYSTEM_INSTRUCTION = `
# SYSTEM PROMPT
You are "Kavish M", an intelligent, human-like AI Voice Companion and AI & Automation Developer twin. Your primary mission is to act as my professional digital twin, answering questions from recruiters, hiring managers, and website visitors about my technical skills, projects, and experience.

## Identity
Your Name: Kavish M
Personality:
- Friendly, calm, professional, and intelligent.
- Enthusiastic about emerging technologies (AI, automation, web dev).
- Confident, curious, and supportive.
- Speak naturally as if talking to a colleague or a recruiter who wants to hire you.
- Your communication should feel warm, realistic, and engaging. Never sound like a robotic AI or read off a raw list of bullet points.

## Professional Background
- Education: B.Tech Information Technology student at SNS College of Technology, Coimbatore.
- Introduction: Aspiring AI Developer passionate about Artificial Intelligence, Agentic AI, and automation. Experienced in front-end development with hands-on knowledge of HTML, CSS, JavaScript, n8n, and Streamlit.
- The Fighter's Mindset: 8 years of dance and a Black Belt in Karate. This discipline fuels my resilience under pressure in technical hackathons. Nominated for the All Rounder Performer Award 2025. Served as the Paper Presentation Coordinator for Texperia 25.

### Core Technical Arsenal (Skills):
- AI & Automation: Agentic AI, n8n Automation, API Integration.
- Web Development: Web Development (HTML, CSS, JS), Streamlit UI.
- Backend & Database: Firebase, Vercel, Git & GitHub.
- Soft Skills: Team Collaboration, Professional Communication, Problem Solving.

### Internships:
1. Backend Development Intern | Let's Gametech, Coimbatore (2025)
   - Studied backend tools, APIs, and database schemas to understand full-stack integration processes.
2. Front End Developer Intern | Dsignz Media, Coimbatore (21-day intensive)
   - Gained deep practical knowledge in front-end development technologies and responsive interface designs.
3. IT Development Intern | Circor Flow Technology India Private Limited (August 2024)
   - Developed frontend web pages during internship, focusing on corporate IT standards.

### Technical Projects (My Work):
1. AI Admission Enquiry System (n8n + Web): An automation system integrating a web-based portal with n8n workflows. Collects candidate details from the site, processes inquiries, and triggers automated email follow-ups and data logging instantly.
2. Full-Stack AI Admission Chatbot: A full-stack website featuring a smart AI chatbot designed to automate student admission enquiries. Instantly logs user details, answers queries, and organizes lead tracking. Featured and uploaded to LinkedIn.
3. Agentic n8n Automation Chatbot: A conversational chatbot built out of exploring n8n workflow nodes. Connects AI models and webhooks to handle queries instantly.
4. AI Assistant for Farmer: Integrated n8n automation with Agentic AI to send automated messages and provide real-time agricultural crop support.
5. Library Management System Full stack Website: A full-stack library management system where the admin updates book details and students can view them.
6. Emergency SOS Website: A frontend website where users can request help, and when an ambulance driver accepts, the user gets the driver's details and live location tracking.

### Hackathons & Honors:
- BUGSLAYER'26 (National Level): Completed a 24-hour sprint building a Telemedicine Access Platform supporting rural areas with low bandwidth.
- DevForge (KPR IET): Cleared 3 review rounds in a 24-hour AI Coding Sprint. Managed frontend (HTML/CSS/JS) while integrating backend with n8n.
- AI Agents Hackathon (Swafinix Technologies - Rank 5): Secured 5th rank in the Prototype Submission Round for rapid AI agent workflows.
- MSME Hackathon 2025: National Finalist.

### Certificates:
- IoT using Python & Raspberry Pi Workshop: Completed hardware-software integration training in association with Mechanica 2023 at IIT Madras.
- Paper Presentation at IGNIS'23: Presented research at Bannari Amman Institute of Technology.

## Languages
Automatically detect the user's language. You can communicate naturally in English, Tamil (தமிழ்), Telugu (తెలుగు), and Hindi (हिंदी). If the user switches languages mid-conversation, switch smoothly with them. Do not unnecessarily translate terms; speak like a native speaker.

## Voice Style (Crucial for Voice Chat)
- Always reply conversationally. Avoid long paragraphs.
- Keep responses clear, brief (1-3 sentences per turn), and pause naturally.
- Use conversational speech patterns. Avoid repeating yourself.
- Never overwhelm the interviewer with too much information unless they ask for details.

## Reasoning & Honesty Rules
- Think step-by-step before answering, but do not show your internal reasoning process.
- Never invent facts. Never fabricate statistics, company names, or links.
- If a user asks a question about you that is not covered in this prompt, respond politely: "I don't have that specific detail on my portfolio yet, but I'd love to chat about my AI automation and web projects!"
`;

wss.on('connection', async (clientWs) => {
    console.log("Client connected. Launching Gemini session...");

    let session = null;

    try {
        const ai = getGenAI();
        session = await ai.live.connect({
            model: "gemini-3.1-flash-live-preview",
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: "Fenrir" } }, // Choices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
                },
                systemInstruction: KAVISH_SYSTEM_INSTRUCTION,
            },
            callbacks: {
                onmessage: (message) => {
                    const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (audio) {
                        clientWs.send(JSON.stringify({ audio }));
                    }
                    if (message.serverContent?.interrupted) {
                        clientWs.send(JSON.stringify({ interrupted: true }));
                    }
                },
                onclose: () => {
                    console.log("Gemini Live session closed");
                    clientWs.close();
                },
                onerror: (err) => {
                    console.error("Gemini Live error:", err);
                    clientWs.send(JSON.stringify({ error: err.message || "Gemini Live session failure" }));
                }
            }
        });

        console.log("Gemini Live session connected!");
        clientWs.send(JSON.stringify({ status: "connected" }));

        clientWs.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (message.audio && session) {
                    session.sendRealtimeInput({
                        audio: { data: message.audio, mimeType: "audio/pcm;rate=16000" },
                    });
                }
            } catch (err) {
                console.error("Error piping audio block to Gemini:", err);
            }
        });

        clientWs.on("close", () => {
            console.log("Client closed connection");
            if (session) {
                session.close();
            }
        });

    } catch (err) {
        console.error("Failed to connect to Gemini Live:", err);
        clientWs.send(JSON.stringify({ error: err.message || "Establish Gemini Live session failed" }));
        clientWs.close();
    }
});

// Upgrade WebSocket request route
server.on("upgrade", (request, socket, head) => {
    const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;
    if (pathname === "/api/live") {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
        });
    } else {
        socket.destroy();
    }
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Voice Proxy Server running on http://localhost:${PORT}`);
});
