// ════════════════════════════════════════════════════════════════════
// 3D Avatar 360° Studio & Intelligent Copilot Controller
// Powered by Three.js, GLTFLoader & OrbitControls
// ════════════════════════════════════════════════════════════════════

import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls, avatarModel;
let isUserInteracting = false;

// 1. Initialize Three.js 3D Viewport
export function initAvatarViewer() {
    const container = document.getElementById('avatar-container');
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 460;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.2);

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('avatar-canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Controls: 360 Orbit
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Keep clean framing
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.9;
    controls.minPolarAngle = Math.PI / 4;  // Prevent flipping under floor
    controls.maxPolarAngle = Math.PI / 1.9;

    controls.addEventListener('start', () => { isUserInteracting = true; });
    controls.addEventListener('end', () => { setTimeout(() => { isUserInteracting = false; }, 2000); });

    // Studio Lighting (Warm Gold Key + Platinum Silver Rim)
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xF5E6CC, 1.8); // Warm Gold
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xE0E5EC, 1.2); // Platinum Rim
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    const softFill = new THREE.DirectionalLight(0xffffff, 0.6);
    softFill.position.set(0, -2, 2);
    scene.add(softFill);

    // Load Model: checks for your .glb
    loadAvatarModel();

    // Resize Handler
    window.addEventListener('resize', onWindowResize);

    // Subtle Cursor Tracking
    window.addEventListener('mousemove', onMouseMove);

    // Render Loop
    animate();
}

function onWindowResize() {
    const container = document.getElementById('avatar-container');
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

let mouseX = 0, mouseY = 0;
function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
}

// 2. Load the .glb file
function loadAvatarModel() {
    const loader = new GLTFLoader();
    const statusText = document.getElementById('avatar-status-badge');
    
    // Path to the downloaded model
    const modelPath = './assets/models/kavish-avatar.glb';

    loader.load(
        modelPath,
        (gltf) => {
            avatarModel = gltf.scene;

            // Auto-center and fit model into view
            const box = new THREE.Box3().setFromObject(avatarModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            // Normalize size
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2.0 / maxDim;
            avatarModel.scale.set(scale, scale, scale);

            // Re-center around origin
            avatarModel.position.x = -center.x * scale;
            avatarModel.position.y = -center.y * scale + 0.95;
            avatarModel.position.z = -center.z * scale;

            scene.add(avatarModel);

            if (statusText) {
                statusText.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 3D Model Loaded · Drag to Rotate 360°';
            }
        },
        (xhr) => {
            if (xhr.lengthComputable && statusText) {
                const percent = Math.round((xhr.loaded / xhr.total) * 100);
                statusText.textContent = `Loading 3D Mesh (${percent}%)`;
            }
        },
        (error) => {
            console.warn('Could not load custom glb, generating clean procedural builder avatar:', error);
            createProceduralBuilderAvatar();
            if (statusText) {
                statusText.innerHTML = '<span class="w-2 h-2 rounded-full bg-[#C5A059]"></span> 3D Digital Twin · Drag to Rotate 360°';
            }
        }
    );
}

// Fallback procedural builder silhouette if file is not found
function createProceduralBuilderAvatar() {
    avatarModel = new THREE.Group();

    // Stylized Head
    const headGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const goldMat = new THREE.MeshStandardMaterial({
        color: 0xE8E0D0,
        roughness: 0.35,
        metalness: 0.1
    });
    const head = new THREE.Mesh(headGeo, goldMat);
    head.position.y = 1.45;
    avatarModel.add(head);

    // Torso / Developer Jacket
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.45, 0.95, 32);
    const coatMat = new THREE.MeshStandardMaterial({
        color: 0x1C1B1A,
        roughness: 0.7,
        metalness: 0.2
    });
    const torso = new THREE.Mesh(torsoGeo, coatMat);
    torso.position.y = 0.85;
    avatarModel.add(torso);

    // Gold Collar Detail
    const collarGeo = new THREE.TorusGeometry(0.24, 0.04, 16, 32);
    const collarMat = new THREE.MeshStandardMaterial({
        color: 0xC5A059,
        roughness: 0.3,
        metalness: 0.6
    });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.25;
    avatarModel.add(collar);

    // Base Stand Ring
    const ringGeo = new THREE.RingGeometry(0.65, 0.75, 48);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0xC5A059,
        side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.25;
    avatarModel.add(ring);

    avatarModel.position.y = -0.3;
    scene.add(avatarModel);
}

function animate() {
    requestAnimationFrame(animate);

    if (controls) {
        controls.update();
    }

    // Subtle gentle breathing sway if user is not dragging
    if (avatarModel && !isUserInteracting) {
        avatarModel.position.y += Math.sin(Date.now() * 0.002) * 0.0004;
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// ════════════════════════════════════════════════════════════════════
// Intelligent Copilot Knowledge Handler
// ════════════════════════════════════════════════════════════════════
const KAVISH_KB = {
    projects: "I have built 6 flagship systems:\n1. AI Admission Enquiry System (n8n autonomous intake with sub-second email dispatch)\n2. Full-Stack AI Admission Chatbot (RAG-enabled lead scoring portal)\n3. AI Assistant for Farmers (Agentic weather & crop advisory)\n4. Agentic n8n Automation Chatbot (Tool-calling multi-node router)\n5. Library Management System (Full-stack role-based auth)\n6. Emergency SOS Dispatch Platform (Low-latency real-time triage)",
    hackathons: "My key hackathon records include:\n• BUGSLAYER '26: Built a low-bandwidth Telemedicine Access Platform across 5 intense review rounds.\n• AI Agents Hackathon: Placed Rank 5 nationally out of 2,300+ teams with Swafinix Technologies.\n• DevForge (KPR IET): Cleared 3 review rounds in a 24-hour AI coding sprint with n8n webhooks.\n• MSME Hackathon 2025: National Finalist.",
    experience: "My industry experience includes:\n• Backend Development Intern at Let's Gametech (API schemas & server-side data)\n• Front End Developer Intern at Dsignz Media (21-day intensive web engineering)\n• IT Development Intern at Circor Flow Technology India Pvt. Ltd. (Enterprise web pages)",
    education: "I am pursuing B.Tech in Information Technology at SNS College of Technology, Coimbatore (2023–2027), currently in my 4th year. Prior to this, I completed HSC at Noble Matriculation Higher Secondary School with a centum in Computer Science.",
    contact: "You can reach me directly via:\n• Email: kavishm100@gmail.com\n• Direct Line / WhatsApp: +91 9865824929\n• Location: Coimbatore, Tamil Nadu, India",
    default: "I'm Kavish's 3D Digital Assistant! Ask me about my n8n automations, full-stack projects, national hackathons, or how to collaborate with me."
};

export function askAvatar(question) {
    const chatStream = document.getElementById('avatar-chat-stream');
    const input = document.getElementById('avatar-input');
    if (!chatStream) return;

    const query = question || (input ? input.value.trim() : '');
    if (!query) return;

    if (input) input.value = '';

    // Append User Message
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble-user';
    userBubble.textContent = query;
    chatStream.appendChild(userBubble);
    chatStream.scrollTop = chatStream.scrollHeight;

    // Plug-and-play adapter: ready for your secure AI endpoint
    setTimeout(() => {
        const responseText = resolveResponse(query);
        const aiBubble = document.createElement('div');
        aiBubble.className = 'chat-bubble-ai';
        aiBubble.innerHTML = responseText.replace(/\n/g, '<br>');
        chatStream.appendChild(aiBubble);
        chatStream.scrollTop = chatStream.scrollHeight;
    }, 450);
}

function resolveResponse(q) {
    const text = q.toLowerCase();
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

// Make globally accessible for HTML onclick
window.askAvatar = askAvatar;

document.addEventListener('DOMContentLoaded', () => {
    initAvatarViewer();
});
