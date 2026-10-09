// ════════════════════════════════════════════════════════════════════
// Connected Rive Animated Character & Intelligent Copilot Controller
// ════════════════════════════════════════════════════════════════════

var riveInstance = null;
var isRiveInitialized = false;

// 1. Toggle Floating Popup Window
function toggleFloatingBot() {
    var popup = document.getElementById('floating-bot-popup');
    if (!popup) return;

    var isHidden = popup.classList.contains('hidden') || popup.style.display === 'none' || getComputedStyle(popup).display === 'none';
    if (isHidden) {
        popup.classList.remove('hidden');
        popup.style.display = 'flex';

        // Initialize Rive animation once popup opens
        setTimeout(function() {
            if (!isRiveInitialized) {
                initRiveCharacter();
            } else if (riveInstance) {
                riveInstance.resizeDrawingSurfaceToCanvas();
            }
        }, 80);
    } else {
        popup.classList.add('hidden');
        popup.style.display = 'none';
    }
}
window.toggleFloatingBot = toggleFloatingBot;

// 2. Initialize Rive Animated Character
function initRiveCharacter() {
    if (isRiveInitialized) return;

    var canvas = document.getElementById('rive-canvas');
    if (!canvas) return;

    var statusBadge = document.getElementById('rive-status-badge');

    if (typeof rive === 'undefined' || !rive.Rive) {
        if (statusBadge) statusBadge.textContent = 'Loading...';
        setTimeout(initRiveCharacter, 200);
        return;
    }

    try {
        if (rive.RuntimeLoader && typeof rive.RuntimeLoader.setWasmUrl === 'function') {
            rive.RuntimeLoader.setWasmUrl('./assets/script/vendor/rive.wasm');
        }

        riveInstance = new rive.Rive({
            src: './assets/models/8257-15795-happy-little-robot.riv',
            canvas: canvas,
            autoplay: true,
            stateMachines: 'State Machine 1',
            onLoad: function() {
                isRiveInitialized = true;
                if (riveInstance) {
                    riveInstance.resizeDrawingSurfaceToCanvas();
                }
                if (statusBadge) {
                    statusBadge.innerHTML = '<span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span> Live';
                }
            },
            onLoadError: function(err) {
                console.warn('Rive state machine fallback:', err);
                // Fallback to idle animation
                riveInstance = new rive.Rive({
                    src: './assets/models/8257-15795-happy-little-robot.riv',
                    canvas: canvas,
                    autoplay: true,
                    animations: 'idle',
                    onLoad: function() {
                        isRiveInitialized = true;
                        if (riveInstance) riveInstance.resizeDrawingSurfaceToCanvas();
                    }
                });
            }
        });

        window.addEventListener('resize', function() {
            if (riveInstance) {
                riveInstance.resizeDrawingSurfaceToCanvas();
            }
        });
    } catch (e) {
        console.error('Error initializing Rive:', e);
    }
}
window.initRiveCharacter = initRiveCharacter;

// ════════════════════════════════════════════════════════════════════
// Intelligent Copilot Knowledge Handler
// ════════════════════════════════════════════════════════════════════
var KAVISH_KB = {
    projects: "I have built 6 flagship systems:\n1. AI Admission Enquiry System (n8n autonomous intake with sub-second email confirmations)\n2. Full-Stack AI Admission Chatbot (Conversational lead qualification)\n3. AI Assistant for Farmers (Agentic crop & meteorological alert dispatch)\n4. Agentic n8n Automation Chatbot (Tool-calling multi-node router)\n5. Library Management System (Role-based auth & database tracking)\n6. Emergency SOS Dispatch Platform (Low-latency real-time response)",
    hackathons: "Key hackathon milestones:\n• BUGSLAYER '26: Built a low-bandwidth Telemedicine Access Platform across 5 intense review rounds.\n• AI Agents Hackathon: Placed Rank 5 nationally out of 2,300+ teams with Swafinix Technologies.\n• DevForge (KPR IET): Cleared 3 review rounds in a 24-hour sprint connecting n8n webhooks.\n• MSME Hackathon 2025: National Finalist.",
    experience: "My industry experience:\n• Backend Development Intern at Let's Gametech (API schemas & databases)\n• Front End Developer Intern at Dsignz Media (21-day responsive web engineering)\n• IT Development Intern at Circor Flow Technology India Pvt. Ltd. (Corporate web pages)",
    education: "I am pursuing B.Tech in Information Technology at SNS College of Technology, Coimbatore (2023–2027), currently in my 4th year. Previously completed HSC at Noble Matriculation Higher Secondary School with a centum in Computer Science.",
    contact: "You can reach me directly via:\n• Email: kavishm100@gmail.com\n• Direct Line / WhatsApp: +91 9865824929\n• Location: Coimbatore, Tamil Nadu, India",
    default: "I'm Kavish's AI Companion! Ask me about my n8n automations, full-stack projects, national hackathons, or how to collaborate."
};

function askAvatar(question) {
    var chatStream = document.getElementById('avatar-chat-stream');
    var input = document.getElementById('avatar-input');
    if (!chatStream) return;

    var query = question || (input ? input.value.trim() : '');
    if (!query) return;

    if (input) input.value = '';

    // User Bubble
    var userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble-user text-[11px]';
    userBubble.textContent = query;
    chatStream.appendChild(userBubble);
    chatStream.scrollTop = chatStream.scrollHeight;

    // AI Bubble
    setTimeout(function() {
        var responseText = resolveResponse(query);
        var aiBubble = document.createElement('div');
        aiBubble.className = 'chat-bubble-ai text-[11px]';
        aiBubble.innerHTML = responseText.replace(/\n/g, '<br>');
        chatStream.appendChild(aiBubble);
        chatStream.scrollTop = chatStream.scrollHeight;
    }, 350);
}

function resolveResponse(q) {
    var text = q.toLowerCase();
    if (text.includes('project') || text.includes('work') || text.includes('built')) {
        return KAVISH_KB.projects;
    }
    if (text.includes('hackathon') || text.includes('swafinix') || text.includes('bugslayer') || text.includes('devforge')) {
        return KAVISH_KB.hackathons;
    }
    if (text.includes('experience') || text.includes('intern') || text.includes('company')) {
        return KAVISH_KB.experience;
    }
    if (text.includes('college') || text.includes('education') || text.includes('sns') || text.includes('study')) {
        return KAVISH_KB.education;
    }
    if (text.includes('contact') || text.includes('email') || text.includes('phone') || text.includes('hire') || text.includes('whatsapp')) {
        return KAVISH_KB.contact;
    }
    return KAVISH_KB.default;
}

window.askAvatar = askAvatar;

// Close on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        var popup = document.getElementById('floating-bot-popup');
        if (popup && (popup.style.display === 'flex' || !popup.classList.contains('hidden'))) {
            toggleFloatingBot();
        }
    }
});
