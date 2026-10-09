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
// REZE — Intelligent Copilot (Hybrid: Local Fast Path → Gemini API)
// ════════════════════════════════════════════════════════════════════

// Local fallback KB (instant, zero-cost fast path)
var REZE_LOCAL_KB = {
    identity: {
        patterns: ['who are you', 'your name', 'reze', 'who is reze', 'what are you', 'introduce', 'about you', 'hello', 'hi'],
        response: "I am REZE, what I can help with? I am Kavish's personal AI assistant built into this portfolio. Ask me anything about his full-stack projects, agentic AI automations, national hackathons, or how to get in touch!"
    },
    contact: {
        patterns: ['contact', 'email', 'phone', 'whatsapp', 'reach', 'hire', 'number', 'call'],
        response: "You can reach Kavish directly:\n📧 Email: kavishm100@gmail.com\n📱 WhatsApp / Call: +91 9865824929\n📍 Location: Coimbatore, Tamil Nadu, India"
    },
    projects: {
        patterns: ['project', 'work', 'built', 'portfolio'],
        response: "Kavish has built 6 flagship systems:\n1. AI Admission Enquiry System — n8n autonomous intake pipeline\n2. Full-Stack AI Admission Chatbot — Conversational lead qualification\n3. AI Assistant for Farmers — Agentic crop intelligence\n4. Agentic n8n Automation Chatbot — Tool-calling multi-node router\n5. Library Management System — Role-based auth & tracking\n6. Emergency SOS Dispatch Platform — Real-time response system"
    },
    hackathons: {
        patterns: ['hackathon', 'swafinix', 'bugslayer', 'devforge', 'competition', 'rank'],
        response: "Key hackathon achievements:\n🏆 AI Agents Hackathon: Rank 5 nationally out of 2,300+ teams\n🏥 BUGSLAYER '26: Built a Telemedicine Platform across 5 review rounds\n⚡ DevForge (KPR IET): Cleared 3 rounds in a 24-hour sprint\n🏭 MSME Hackathon 2025: National Finalist"
    },
    education: {
        patterns: ['college', 'education', 'sns', 'study', 'degree', 'university', 'school'],
        response: "Kavish is pursuing B.Tech in Information Technology at SNS College of Technology, Coimbatore (2023–2027). He scored a centum (100/100) in Computer Science during HSC at Noble Matriculation Higher Secondary School."
    },
    experience: {
        patterns: ['experience', 'intern', 'company', 'job'],
        response: "Kavish's internship experience:\n• Backend Dev Intern — Let's Gametech (API schemas & databases)\n• Frontend Dev Intern — Dsignz Media (21-day responsive web engineering)\n• IT Dev Intern — Circor Flow Technology India Pvt. Ltd. (Corporate web pages)"
    }
};

function tryLocalResponse(text) {
    var lower = text.toLowerCase();
    for (var key in REZE_LOCAL_KB) {
        var entry = REZE_LOCAL_KB[key];
        for (var i = 0; i < entry.patterns.length; i++) {
            if (lower.indexOf(entry.patterns[i]) !== -1) {
                return entry.response;
            }
        }
    }
    return null;
}

// Message clamping guard
var MAX_MSG_LENGTH = 300;

function askAvatar(question) {
    var chatStream = document.getElementById('avatar-chat-stream');
    var input = document.getElementById('avatar-input');
    if (!chatStream) return;

    var query = question || (input ? input.value.trim() : '');
    if (!query) return;
    if (input) input.value = '';

    // Clamp
    if (query.length > MAX_MSG_LENGTH) {
        query = query.substring(0, MAX_MSG_LENGTH);
    }

    // User Bubble
    var userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble-user text-[11px]';
    userBubble.textContent = query;
    chatStream.appendChild(userBubble);
    chatStream.scrollTop = chatStream.scrollHeight;

    // Fast path: Try local KB first (instant, zero cost)
    var localAnswer = tryLocalResponse(query);
    if (localAnswer) {
        setTimeout(function() {
            appendRezeReply(chatStream, localAnswer);
        }, 200);
        return;
    }

    // Show typing indicator
    var typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble-ai text-[11px] reze-typing';
    typingBubble.innerHTML = '<span class="inline-flex gap-1 items-center"><span class="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce" style="animation-delay:0ms"></span><span class="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce" style="animation-delay:150ms"></span><span class="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-bounce" style="animation-delay:300ms"></span></span>';
    chatStream.appendChild(typingBubble);
    chatStream.scrollTop = chatStream.scrollHeight;

    // Call REZE API (Gemini-powered)
    fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        // Remove typing indicator
        if (typingBubble.parentNode) typingBubble.remove();
        var reply = (data && data.reply) ? data.reply : "I couldn't process that. Try asking about Kavish's projects, hackathons, or skills!";
        appendRezeReply(chatStream, reply);
    })
    .catch(function(err) {
        console.warn('REZE API error:', err);
        if (typingBubble.parentNode) typingBubble.remove();
        appendRezeReply(chatStream, "I'm having a brief connection issue. You can reach Kavish directly at kavishm100@gmail.com or +91 9865824929!");
    });
}

function appendRezeReply(chatStream, text) {
    var aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble-ai text-[11px]';
    aiBubble.innerHTML = text.replace(/\n/g, '<br>');
    chatStream.appendChild(aiBubble);
    chatStream.scrollTop = chatStream.scrollHeight;
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
