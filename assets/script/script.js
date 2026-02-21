// --- Initialize Firebase (Firestore only for feedback) ---
const firebaseConfig = { 
    apiKey: "AIzaSyCQ2joP8VVDeaN9wqulImWWeOfS-KlVQRQ",
    authDomain: "kavish-portfolio-e3134.firebaseapp.com",
    projectId: "kavish-portfolio-e3134",
    storageBucket: "kavish-portfolio-e3134.appspot.com",
    messagingSenderId: "1013203061858",
    appId: "1:1013203061858:web:a7b91fcc5cf4649e1dd53b"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const pageContent = {
    main: `
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-20">
                <div class="lg:col-span-7">
                    <span class="badge mb-4">Available for Opportunities</span>
                    <h1 class="text-6xl font-extrabold tracking-tighter mb-6">
                        Engineering the Future of <span class="text-blue-500">Agentic AI.</span>
                    </h1>
                    <p class="text-gray-400 text-lg mb-8 max-w-xl">
                        B.Tech IT student specializing in low-code automation (n8n), AI-driven workflows with Streamlit, and full-stack development. I build tools that bridge the gap between human intent and machine execution.
                    </p>
                    <div class="flex gap-4">
                        <button onclick="showPage('page-projects')" class="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-blue-500 hover:text-white transition">View Projects</button>
                        <a href="https://www.linkedin.com/in/kavish-m-/" target="_blank" class="glass-card px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                            LinkedIn Profile ↗
                        </a>
                    </div>
                </div>
                <div class="lg:col-span-5 relative">
                    <div class="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full"></div>
                    <img src="./assets/image/imgone.jpg" class="relative z-10 w-full aspect-square object-cover rounded-3xl border border-white/10 shadow-2xl">
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div onclick="showPage('page-journey')" class="glass-card p-6 cursor-pointer">
                    <h3 class="font-bold text-xl mb-2">Professional Journey</h3>
                    <p class="text-gray-400 text-sm">From Martial Arts discipline to Technical Excellence.</p>
                </div>
                <div onclick="showPage('page-experience')" class="glass-card p-6 cursor-pointer">
                    <h3 class="font-bold text-xl mb-2">Experience</h3>
                    <p class="text-gray-400 text-sm">Internships at Circor and Dsignz Media.</p>
                </div>
                <div onclick="showPage('page-hackathons')" class="glass-card p-6 cursor-pointer">
                    <h3 class="font-bold text-xl mb-2">Hackathons</h3>
                    <p class="text-gray-400 text-sm">National finalist and Rank 5 in AI Agents.</p>
                </div>
                <div onclick="showPage('page-certs')" class="glass-card p-6 cursor-pointer">
                    <h3 class="font-bold text-xl mb-2">Credentials</h3>
                    <p class="text-gray-400 text-sm">Certifications in IoT, Python, and AR/VR.</p>
                </div>
            </div>
        </div>
    `,
    journey: `
        <div class="max-w-4xl mx-auto px-6">
            <button onclick="showPage('page-main')" class="text-blue-500 mb-8 font-medium">← Back to Overview</button>
            <h2 class="text-4xl font-bold mb-10">The Fighter's Path</h2>
            <div class="space-y-12 border-l border-white/10 pl-8 relative">
                <div class="relative"><div class="absolute -left-[41px] top-1 w-5 h-5 bg-blue-500 rounded-full border-4 border-black"></div><h4 class="font-bold text-xl">The Spark (Early Years)</h4><p class="text-gray-400 mt-2">Noble Matriculation School. Focused on discipline through dance and martial arts.</p></div>
                <div class="relative"><div class="absolute -left-[41px] top-1 w-5 h-5 bg-blue-500 rounded-full border-4 border-black"></div><h4 class="font-bold text-xl">The Forge (Martial Arts)</h4><p class="text-gray-400 mt-2">Achieved Black Belt in Karate. Learned that resilience is the foundation of any technical skill.</p></div>
                <div class="relative"><div class="absolute -left-[41px] top-1 w-5 h-5 bg-blue-500 rounded-full border-4 border-black"></div><h4 class="font-bold text-xl">The Key (College)</h4><p class="text-gray-400 mt-2">Translating discipline into Computer Science at SNS College. 100% score in CS foundations.</p></div>
            </div>
        </div>
    `,
    // Simplified Templates for Modals
    emailModal: `
        <div class="glass-card p-8">
            <h2 class="text-2xl font-bold mb-4">Send Feedback</h2>
            <form id="email-form" action="https://formspree.io/f/xeozngwn" method="POST" class="space-y-4">
                <input type="email" name="email" placeholder="Your Email" class="w-full bg-black/40 border border-white/10 p-3 rounded-lg" required>
                <textarea name="message" placeholder="Message" class="w-full bg-black/40 border border-white/10 p-3 rounded-lg h-32" required></textarea>
                <div class="flex justify-end gap-3">
                    <button type="button" onclick="closeAllModals()" class="text-gray-400">Cancel</button>
                    <button type="submit" class="bg-blue-600 px-6 py-2 rounded-lg font-bold">Send</button>
                </div>
            </form>
        </div>`
};

// --- CORE APP FUNCTIONS ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if(target) {
        target.classList.add('active');
        window.scrollTo(0,0);
        if(pageId !== 'page-main' && !target.innerHTML) {
            loadDetailPage(pageId);
        }
    }
}

function loadDetailPage(pageId) {
    const key = pageId.replace('page-', '');
    const content = pageContent[key] || `<div class="p-20 text-center text-gray-500">Content for ${key} coming soon...</div>`;
    document.getElementById(pageId).innerHTML = content;
}

function openEmailModal() {
    const modal = document.getElementById('email-modal');
    document.getElementById('modal-overlay').style.display = 'block';
    modal.style.display = 'block';
    modal.innerHTML = pageContent.emailModal;
}

function closeAllModals() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById('email-modal').style.display = 'none';
    document.getElementById('phone-modal').style.display = 'none';
}

// Initial Load
window.onload = () => {
    document.getElementById('page-main').innerHTML = pageContent.main;
    showPage('page-main');
};