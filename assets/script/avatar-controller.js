// ════════════════════════════════════════════════════════════════════
// Floating 3D Bot & Intelligent Copilot Controller
// Powered by Three.js (r128), OrbitControls & GLTFLoader
// ════════════════════════════════════════════════════════════════════

var scene, camera, renderer, controls, avatarModel;
var isViewerInitialized = false;
var isUserInteracting = false;

// 1. Toggle Floating Popup Window
function toggleFloatingBot() {
    var popup = document.getElementById('floating-bot-popup');
    if (!popup) return;

    var isHidden = popup.classList.contains('hidden') || popup.style.display === 'none' || getComputedStyle(popup).display === 'none';
    if (isHidden) {
        popup.classList.remove('hidden');
        popup.style.display = 'flex';
        
        // Initialize 3D Viewer once popup opens
        setTimeout(function() {
            if (!isViewerInitialized) {
                initAvatarViewer();
            } else {
                onWindowResize();
            }
        }, 100);
    } else {
        popup.classList.add('hidden');
        popup.style.display = 'none';
    }
}
window.toggleFloatingBot = toggleFloatingBot;

// 2. Initialize Three.js 3D Viewport
function initAvatarViewer() {
    if (isViewerInitialized) return;

    var container = document.getElementById('avatar-container');
    var canvas = document.getElementById('avatar-canvas');
    if (!container || !canvas) return;

    if (typeof THREE === 'undefined') {
        var statusBadge = document.getElementById('avatar-status-badge');
        if (statusBadge) statusBadge.textContent = 'Connecting 3D...';
        setTimeout(initAvatarViewer, 300);
        return;
    }

    var width = container.clientWidth || 360;
    var height = container.clientHeight || 180;

    // Scene
    scene = new THREE.Scene();

    // Camera focused nicely on avatar bust
    camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.55, 2.2);

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Controls: Smooth 360 Orbit
    if (THREE.OrbitControls) {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false; // Keep clean framing
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;
        controls.minPolarAngle = Math.PI / 4;
        controls.maxPolarAngle = Math.PI / 1.9;

        controls.addEventListener('start', function() { isUserInteracting = true; });
        controls.addEventListener('end', function() {
            setTimeout(function() { isUserInteracting = false; }, 2000);
        });
    }

    // Studio Lighting (Warm Gold Key + Platinum Silver Rim)
    var ambientLight = new THREE.AmbientLight(0xfff8ee, 1.4);
    scene.add(ambientLight);

    var keyLight = new THREE.DirectionalLight(0xF5E6CC, 1.8);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    var rimLight = new THREE.DirectionalLight(0xE0E5EC, 1.2);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    var softFill = new THREE.DirectionalLight(0xffffff, 0.8);
    softFill.position.set(0, -2, 2);
    scene.add(softFill);

    // Load Model
    loadAvatarModel();

    // Resize Handler
    window.addEventListener('resize', onWindowResize);

    isViewerInitialized = true;

    // Render Loop
    animate();
}
window.initAvatarViewer = initAvatarViewer;

function onWindowResize() {
    var container = document.getElementById('avatar-container');
    if (!container || !renderer || !camera) return;
    var width = container.clientWidth || 360;
    var height = container.clientHeight || 180;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// 3. Load the .glb file
function loadAvatarModel() {
    var statusText = document.getElementById('avatar-status-badge');
    var modelPath = './assets/models/kavish-avatar.glb';

    if (typeof THREE.GLTFLoader === 'undefined') {
        console.warn('GLTFLoader not ready, using procedural builder model.');
        createProceduralBuilderAvatar();
        return;
    }

    var loader = new THREE.GLTFLoader();

    loader.load(
        modelPath,
        function(gltf) {
            avatarModel = gltf.scene;

            // Auto-center and fit model into view
            var box = new THREE.Box3().setFromObject(avatarModel);
            var center = box.getCenter(new THREE.Vector3());
            var size = box.getSize(new THREE.Vector3());

            var maxDim = Math.max(size.x, size.y, size.z);
            var scale = 1.4 / maxDim;
            avatarModel.scale.set(scale, scale, scale);

            avatarModel.position.x = -center.x * scale;
            avatarModel.position.y = -center.y * scale + 0.45;
            avatarModel.position.z = -center.z * scale;

            scene.add(avatarModel);

            if (statusText) {
                statusText.innerHTML = '<span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span> 3D Model Active · 360° Drag';
            }
        },
        function(xhr) {
            if (xhr.lengthComputable && statusText) {
                var percent = Math.round((xhr.loaded / xhr.total) * 100);
                statusText.textContent = 'Loading 3D (' + percent + '%)';
            }
        },
        function(error) {
            console.warn('Fallback to procedural builder model:', error);
            createProceduralBuilderAvatar();
            if (statusText) {
                statusText.innerHTML = '3D Digital Twin · Drag 360°';
            }
        }
    );
}

function createProceduralBuilderAvatar() {
    avatarModel = new THREE.Group();

    // Stylized Head
    var headGeo = new THREE.SphereGeometry(0.32, 32, 32);
    var goldMat = new THREE.MeshStandardMaterial({
        color: 0xE8E0D0,
        roughness: 0.35,
        metalness: 0.1
    });
    var head = new THREE.Mesh(headGeo, goldMat);
    head.position.y = 0.9;
    avatarModel.add(head);

    // Torso / Jacket
    var torsoGeo = new THREE.CylinderGeometry(0.34, 0.4, 0.8, 32);
    var coatMat = new THREE.MeshStandardMaterial({
        color: 0x1C1B1A,
        roughness: 0.7,
        metalness: 0.2
    });
    var torso = new THREE.Mesh(torsoGeo, coatMat);
    torso.position.y = 0.35;
    avatarModel.add(torso);

    // Gold Ring Stand
    var ringGeo = new THREE.RingGeometry(0.5, 0.6, 48);
    var ringMat = new THREE.MeshBasicMaterial({
        color: 0xC5A059,
        side: THREE.DoubleSide
    });
    var ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.1;
    avatarModel.add(ring);

    avatarModel.position.y = -0.1;
    scene.add(avatarModel);
}

function animate() {
    requestAnimationFrame(animate);

    if (controls) {
        controls.update();
    }

    if (avatarModel && !isUserInteracting) {
        avatarModel.position.y += Math.sin(Date.now() * 0.002) * 0.0003;
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
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
    default: "I'm Kavish's 3D Digital Assistant! Ask me about my n8n automations, full-stack projects, national hackathons, or how to collaborate."
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
    }, 400);
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
