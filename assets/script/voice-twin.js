/**
 * Kavish M - AI Voice Twin Client-Side Script
 * 
 * Handles the Web Audio recording, WebSocket streaming, audio playback,
 * and 3D reactive animations for the voice companion.
 */

// Configuration Block
const VOICE_CONFIG = {
    // Development local URL: "ws://localhost:3000/api/live"
    // Production Render/Railway URL: "wss://your-render-app.onrender.com/api/live"
    wsUrl: window.location.protocol === "https:" 
        ? `wss://${window.location.host}/api/live` 
        : `ws://${window.location.host}/api/live`,
    
    // Set this if you want to bypass the proxy server and connect directly from browser (API Key Exposed!)
    directConnection: {
        enabled: false,
        apiKey: "YOUR_GEMINI_API_KEY",
        endpoint: "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent"
    }
};

// Global state variables
let connectionState = "idle"; // "idle" | "connecting" | "connected" | "error"
let isSpeaking = false;
let ws = null;
let stream = null;
let inputAudioContext = null;
let outputAudioContext = null;
let processor = null;
let source = null;
let analyser = null;

let nextStartTime = 0;
let scheduledSources = [];
let audioVisualizerInterval = null;

// UI Elements
const ui = {
    widget: null,
    avatar: null,
    avatarImage: null,
    micBtn: null,
    pulseRings: [],
    statusText: null,
    glowBackdrop: null
};

// Main entry point - initialize UI and listeners
window.addEventListener("DOMContentLoaded", () => {
    createVoiceWidgetMarkup();
    initializeUIReferences();
    setupEventListeners();
});

// Create HTML markup for the floating widget programmatically to keep index.html clean
function createVoiceWidgetMarkup() {
    const widgetHtml = `
        <!-- Floating Trigger Button -->
        <button id="voice-twin-trigger" class="fixed bottom-6 right-6 z-50 h-14 w-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 hover:bg-blue-700 transition duration-300 group">
            <span class="absolute inset-0 rounded-full bg-blue-500/30 animate-ping opacity-75"></span>
            <svg class="h-6 w-6 text-white group-hover:scale-110 transition duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        </button>

        <!-- Voice Chat Modal Wrapper -->
        <div id="voice-twin-modal" class="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
            <div id="voice-twin-card" class="bg-[#121216]/90 border border-white/10 p-8 rounded-[2.5rem] w-[90%] max-w-sm flex flex-col items-center justify-between min-h-[480px] shadow-2xl relative overflow-hidden transition-all duration-500 scale-95">
                
                <!-- Glow Backdrops -->
                <div id="vt-glow" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-600/10 blur-[80px] pointer-events-none transition duration-500"></div>

                <!-- Header -->
                <div class="w-full flex justify-between items-center z-10">
                    <span class="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">AI Voice Companion</span>
                    <button id="voice-twin-close" class="text-gray-500 hover:text-white transition">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- 3D Tilting Face & Visualizer -->
                <div class="relative w-44 h-44 flex items-center justify-center my-6 z-10">
                    <!-- Visualizer pulsing rings -->
                    <div id="vt-ring-1" class="absolute inset-0 rounded-full border border-blue-500/0 scale-100 transition duration-300"></div>
                    <div id="vt-ring-2" class="absolute inset-0 rounded-full border border-cyan-500/0 scale-100 transition duration-300"></div>

                    <!-- Tilting Avatar -->
                    <div id="vt-avatar" class="w-36 h-36 rounded-full border border-white/10 overflow-hidden bg-[#1a1a24] shadow-xl relative cursor-grab active:cursor-grabbing transition duration-150">
                        <img id="vt-avatar-img" src="./assets/image/imgone.jpg" alt="Kavish M" class="w-full h-full object-cover select-none pointer-events-none">
                    </div>
                </div>

                <!-- Description / Text Info -->
                <div class="text-center z-10">
                    <h3 class="font-heading text-xl font-bold text-white">Kavish M</h3>
                    <p class="text-xs text-blue-500 mt-1 font-semibold">AI & Automation Developer Twin</p>
                    <p id="vt-status" class="text-xs text-gray-500 uppercase tracking-widest mt-4 font-semibold">TAP TO SPEAK</p>
                </div>

                <!-- Microphone Button -->
                <div class="z-10 mt-6">
                    <button id="vt-mic-btn" class="h-16 w-16 bg-[#1e1e24] border border-white/10 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300 relative">
                        <svg id="vt-mic-icon" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </button>
                </div>

            </div>
        </div>
    `;

    const container = document.createElement("div");
    container.innerHTML = widgetHtml;
    document.body.appendChild(container);
}

// Map references to DOM elements
function initializeUIReferences() {
    ui.widget = document.getElementById("voice-twin-modal");
    ui.trigger = document.getElementById("voice-twin-trigger");
    ui.close = document.getElementById("voice-twin-close");
    ui.card = document.getElementById("voice-twin-card");
    ui.avatar = document.getElementById("vt-avatar");
    ui.avatarImage = document.getElementById("vt-avatar-img");
    ui.micBtn = document.getElementById("vt-mic-btn");
    ui.pulseRings = [
        document.getElementById("vt-ring-1"),
        document.getElementById("vt-ring-2")
    ];
    ui.statusText = document.getElementById("vt-status");
    ui.glowBackdrop = document.getElementById("vt-glow");
}

// Connect click handlers and hover animation hooks
function setupEventListeners() {
    // Open/Close triggers
    ui.trigger.addEventListener("click", openModal);
    ui.close.addEventListener("click", closeModal);
    ui.widget.addEventListener("click", (e) => {
        if (e.target === ui.widget) closeModal();
    });

    // Mic action
    ui.micBtn.addEventListener("click", toggleVoiceConnection);

    // 3D Mouse Move Tilt Effect on Avatar Card
    ui.avatar.addEventListener("mousemove", (e) => {
        const rect = ui.avatar.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Tilt degrees mapping (max 15 deg)
        const tiltX = -(y / (rect.height / 2)) * 12;
        const tiltY = (x / (rect.width / 2)) * 12;
        
        ui.avatar.style.transform = `perspective(300px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
        ui.avatarImage.style.transform = `scale(1.08) translate(${-x * 0.15}px, ${-y * 0.15}px)`;
    });

    ui.avatar.addEventListener("mouseleave", () => {
        ui.avatar.style.transform = `perspective(300px) rotateX(0deg) rotateY(0deg) scale(1)`;
        ui.avatarImage.style.transform = `scale(1) translate(0, 0)`;
    });
}

function openModal() {
    ui.widget.classList.remove("hidden");
    setTimeout(() => {
        ui.widget.classList.add("opacity-100");
        ui.card.classList.add("scale-100");
        ui.card.classList.remove("scale-95");
    }, 10);
}

function closeModal() {
    disconnect();
    ui.widget.classList.remove("opacity-100");
    ui.card.classList.add("scale-95");
    ui.card.classList.remove("scale-100");
    setTimeout(() => {
        ui.widget.classList.add("hidden");
    }, 300);
}

// Connect / Disconnect Action Bridge
function toggleVoiceConnection() {
    if (connectionState === "idle" || connectionState === "error") {
        connect();
    } else {
        disconnect();
    }
}

// Initialize recording and WebSockets connection
async function connect() {
    updateState("connecting");
    
    try {
        // 1. Request Mic hardware
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // 2. Setup Audio Contexts (mic 16kHz, speaker 24kHz)
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        inputAudioContext = new AudioContextClass({ sampleRate: 16000 });
        outputAudioContext = new AudioContextClass({ sampleRate: 24000 });
        
        // Setup analyser for voice visualizer mapping
        analyser = outputAudioContext.createAnalyser();
        analyser.fftSize = 64;

        // 3. Initiate WebSocket connection
        let socketUrl = VOICE_CONFIG.wsUrl;
        if (VOICE_CONFIG.directConnection.enabled) {
            socketUrl = `${VOICE_CONFIG.directConnection.endpoint}?key=${VOICE_CONFIG.directConnection.apiKey}`;
        }
        
        ws = new WebSocket(socketUrl);

        ws.onopen = () => {
            console.log("WebSocket open. Starting audio pipeline stream.");
            startMicrophoneStream();
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message.status === "connected") {
                    updateState("connected");
                }

                if (message.audio) {
                    playAudioChunk(message.audio);
                }

                if (message.interrupted) {
                    stopPlayback();
                }

                if (message.error) {
                    console.error("Gemini server error:", message.error);
                    handleError(message.error);
                }
            } catch (err) {
                console.error("Error decoding server JSON frame:", err);
            }
        };

        ws.onclose = (event) => {
            console.log("WebSocket closed:", event);
            if (connectionState !== "error") {
                disconnect();
            }
        };

        ws.onerror = (err) => {
            console.error("WebSocket transport error:", err);
            handleError("WebSocket transport connection failure.");
        };

    } catch (err) {
        console.error("Mic access or API connection error:", err);
        handleError("Mic access denied or server connection failed.");
    }
}

function startMicrophoneStream() {
    if (!inputAudioContext || !stream) return;

    source = inputAudioContext.createMediaStreamSource(stream);
    
    // Buffer size 4096 is responsive and robust in browser sandbox
    processor = inputAudioContext.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (e) => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        const inputData = e.inputBuffer.getChannelData(0);

        // Convert Float32 array to 16-bit Int16 PCM little-endian
        const buffer = new ArrayBuffer(inputData.length * 2);
        const view = new DataView(buffer);
        for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }

        // Convert ArrayBuffer to Base64
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);

        // Send raw chunk to Gemini Live server
        ws.send(JSON.stringify({ audio: base64 }));
    };

    source.connect(processor);
    processor.connect(inputAudioContext.destination);
}

// Convert Base64 response to Float32 array for raw 24kHz destination playback
function base64ToFloat32(base64) {
    const binary = atob(base64);
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const u8 = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
        u8[i] = binary.charCodeAt(i);
    }
    const int16Array = new Int16Array(buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
    }
    return float32Array;
}

// Gapless real-time voice scheduler
function playAudioChunk(base64Audio) {
    const audioContext = outputAudioContext;
    if (!audioContext) return;

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const pcmData = base64ToFloat32(base64Audio);
    if (pcmData.length === 0) return;

    const audioBuffer = audioContext.createBuffer(1, pcmData.length, 24000);
    audioBuffer.getChannelData(0).set(pcmData);

    const sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    
    // Connect output through visualizer analyser
    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);

    const currentTime = audioContext.currentTime;
    let startTime = nextStartTime;
    if (startTime < currentTime) {
        startTime = currentTime + 0.05; // 50ms buffer to prevent click pops
    }

    sourceNode.start(startTime);
    nextStartTime = startTime + audioBuffer.duration;
    scheduledSources.push(sourceNode);

    sourceNode.onended = () => {
        scheduledSources = scheduledSources.filter((s) => s !== sourceNode);
    };
}

// Halt speaker playback on interrupt
function stopPlayback() {
    scheduledSources.forEach((source) => {
        try {
            source.stop();
        } catch (e) {
            // Ignore if already stopped
        }
    });
    scheduledSources = [];
    nextStartTime = 0;
}

// Release microphone, WebSocket, and context resources
function disconnect() {
    stopPlayback();
    clearInterval(audioVisualizerInterval);

    if (ws) {
        ws.close();
        ws = null;
    }

    if (processor) {
        processor.disconnect();
        processor = null;
    }

    if (source) {
        source.disconnect();
        source = null;
    }

    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
    }

    if (inputAudioContext) {
        inputAudioContext.close();
        inputAudioContext = null;
    }

    if (outputAudioContext) {
        outputAudioContext.close();
        outputAudioContext = null;
    }

    updateState("idle");
}

function handleError(msg) {
    console.error("Voice Agent Error:", msg);
    updateState("error");
    disconnect();
}

// Update DOM elements based on connection status and animate speaking levels
function updateState(state) {
    connectionState = state;

    // Reset styles
    ui.micBtn.className = "h-16 w-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 relative";
    ui.statusText.className = "text-xs mt-4 font-semibold tracking-widest";
    
    // Reset visualizer rings
    ui.pulseRings.forEach(ring => {
        ring.className = "absolute inset-0 rounded-full border border-blue-500/0 scale-100 transition duration-300";
    });

    if (state === "idle") {
        ui.micBtn.classList.add("bg-[#1e1e24]", "border-white/10", "hover:scale-105");
        ui.micBtn.innerHTML = `
            <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        `;
        ui.statusText.innerText = "TAP TO SPEAK";
        ui.statusText.classList.add("text-gray-500");
        ui.glowBackdrop.style.background = "rgba(37, 99, 235, 0.1)"; // soft blue
    } 
    else if (state === "connecting") {
        ui.micBtn.classList.add("bg-[#1e1e24]", "border-blue-500/30", "animate-pulse");
        ui.micBtn.innerHTML = `
            <svg class="h-6 w-6 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89" />
            </svg>
        `;
        ui.statusText.innerText = "STARTING TWIN...";
        ui.statusText.classList.add("text-blue-500");
    } 
    else if (state === "connected") {
        ui.micBtn.classList.add("bg-blue-600/20", "border-blue-500/50", "hover:bg-blue-600/30", "hover:scale-105");
        ui.micBtn.innerHTML = `
            <svg class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
        `;
        ui.statusText.innerText = "CONNECTED";
        ui.statusText.classList.add("text-green-500");
        
        // Start audio visualizer loops
        startVisualizerAnimation();
    } 
    else if (state === "error") {
        ui.micBtn.classList.add("bg-rose-500/10", "border-rose-500/30", "hover:scale-105");
        ui.micBtn.innerHTML = `
            <svg class="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        `;
        ui.statusText.innerText = "CONNECTION ERROR";
        ui.statusText.classList.add("text-rose-500");
        ui.glowBackdrop.style.background = "rgba(244, 63, 94, 0.1)"; // soft rose glow
    }
}

// Periodically read frequencies from Web Audio API and animate visual rings
function startVisualizerAnimation() {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    audioVisualizerInterval = setInterval(() => {
        if (!analyser || connectionState !== "connected") return;
        
        analyser.getByteFrequencyData(dataArray);
        
        // Get average frequency power level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const volumeFactor = average / 128.0; // scale between 0.0 and 2.0+

        // Check if actively generating audio playback
        const speaking = (outputAudioContext && outputAudioContext.currentTime < nextStartTime && average > 5);
        
        if (speaking !== isSpeaking) {
            isSpeaking = speaking;
            if (isSpeaking) {
                ui.statusText.innerText = "SPEAKING";
                ui.statusText.className = "text-xs mt-4 font-semibold tracking-widest text-blue-400";
                ui.glowBackdrop.style.background = "rgba(56, 189, 248, 0.2)"; // bright cyan glow
            } else {
                ui.statusText.innerText = "LISTENING";
                ui.statusText.className = "text-xs mt-4 font-semibold tracking-widest text-green-400 animate-pulse";
                ui.glowBackdrop.style.background = "rgba(34, 197, 94, 0.1)"; // soft green glow
            }
        }

        // Animate circular rings dynamically using the voice audio volumes!
        if (isSpeaking) {
            const scale1 = 1.0 + (volumeFactor * 0.18);
            const scale2 = 1.0 + (volumeFactor * 0.35);
            
            ui.pulseRings[0].style.transform = `scale(${scale1})`;
            ui.pulseRings[0].style.borderColor = `rgba(59, 130, 246, ${0.1 + volumeFactor * 0.2})`;
            
            ui.pulseRings[1].style.transform = `scale(${scale2})`;
            ui.pulseRings[1].style.borderColor = `rgba(34, 211, 238, ${0.05 + volumeFactor * 0.1})`;
        } else {
            // Passive resting state animations when only listening
            ui.pulseRings[0].style.transform = "scale(1.05)";
            ui.pulseRings[0].style.borderColor = "rgba(34, 197, 94, 0.05)";
            ui.pulseRings[1].style.transform = "scale(1.15)";
            ui.pulseRings[1].style.borderColor = "rgba(34, 197, 94, 0.02)";
        }

    }, 40);
}
