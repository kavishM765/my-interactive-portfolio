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
    var canvas = document.getElementById('rive-canvas');
    if (!canvas) return;

    var statusBadge = document.getElementById('rive-status-badge');

    // Start instant charming animated robot face immediately (Zero wait time!)
    if (!isRiveInitialized) {
        drawFallbackRobotFace(canvas);
    }

    if (typeof rive === 'undefined' || !rive.Rive) {
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
                    statusBadge.textContent = 'Live';
                }
            },
            onLoadError: function(err) {
                console.warn('Rive state machine fallback:', err);
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
            if (riveInstance && isRiveInitialized) {
                riveInstance.resizeDrawingSurfaceToCanvas();
            }
        });
    } catch (e) {
        console.warn('Rive initialization:', e);
    }
}
window.initRiveCharacter = initRiveCharacter;

// Instant 2D Animated Blinking Robot Face Fallback
function drawFallbackRobotFace(canvas) {
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var eyeOpen = 1.0;
    var blinkTarget = 1.0;

    var blinkTimer = setInterval(function() {
        if (isRiveInitialized) {
            clearInterval(blinkTimer);
            return;
        }
        blinkTarget = 0.08;
        setTimeout(function() { blinkTarget = 1.0; }, 160);
    }, 2800);

    function renderLoop() {
        if (isRiveInitialized) return;
        requestAnimationFrame(renderLoop);

        eyeOpen += (blinkTarget - eyeOpen) * 0.25;
        var w = canvas.width = canvas.clientWidth || 200;
        var h = canvas.height = canvas.clientHeight || 200;

        ctx.clearRect(0, 0, w, h);
        var cx = w / 2;
        var cy = h / 2;

        // Subtle shadow
        ctx.fillStyle = 'rgba(28, 27, 26, 0.06)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 55, 45, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Antenna
        ctx.strokeStyle = '#8A651E';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 42);
        ctx.lineTo(cx, cy - 60);
        ctx.stroke();

        ctx.fillStyle = '#C5A059';
        ctx.beginPath();
        ctx.arc(cx, cy - 62, 5, 0, Math.PI * 2);
        ctx.fill();

        // Robot Head Body (Warm Cashmere)
        ctx.fillStyle = '#F3F0EB';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(cx - 52, cy - 42, 104, 84, 22);
        } else {
            ctx.rect(cx - 52, cy - 42, 104, 84);
        }
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#CAC7BF';
        ctx.stroke();

        // Ears / Bolts
        ctx.fillStyle = '#C5A059';
        ctx.beginPath();
        ctx.arc(cx - 53, cy, 5, 0, Math.PI * 2);
        ctx.arc(cx + 53, cy, 5, 0, Math.PI * 2);
        ctx.fill();

        // Screen Visor (Charcoal)
        ctx.fillStyle = '#1C1B1A';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(cx - 40, cy - 30, 80, 60, 16);
        } else {
            ctx.rect(cx - 40, cy - 30, 80, 60);
        }
        ctx.fill();

        // Glowing Warm Gold Eyes (Animated Blink)
        ctx.fillStyle = '#C5A059';
        var eyeHeight = Math.max(2, 14 * eyeOpen);
        // Left Eye
        ctx.beginPath();
        ctx.ellipse(cx - 16, cy, 6, eyeHeight, 0, 0, Math.PI * 2);
        ctx.fill();
        // Right Eye
        ctx.beginPath();
        ctx.ellipse(cx + 16, cy, 6, eyeHeight, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye Pupil Sparkles
        if (eyeOpen > 0.6) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(cx - 14, cy - 4, 2, 0, Math.PI * 2);
            ctx.arc(cx + 18, cy - 4, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    renderLoop();
}

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
