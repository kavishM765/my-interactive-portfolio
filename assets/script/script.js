// --- PASTE YOUR FIREBASE CONFIGURATION HERE ---
const firebaseConfig = {
  apiKey: "AIzaSyCQ2joP8VVDeaN9wqulImWWeOfS-KlVQRQ",
  authDomain: "kavish-portfolio-e3134.firebaseapp.com",
  projectId: "kavish-portfolio-e3134",
  storageBucket: "kavish-portfolio-e3134.appspot.com",
  messagingSenderId: "1013203061858",
  appId: "1:1013203061858:web:a7b91fcc5cf4649e1dd53b",
  measurementId: "G-NPB1L7BPSC"
};
// ---------------------------------------------

// --- Initialize Firebase ---
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- CONTENT TEMPLATES ---
const templates = {
    login: `<div class="w-full max-w-md space-y-4 text-center p-4"><div id="auth-container" class="glass-card p-6 md:p-8 space-y-4 text-left"></div><p id="auth-error" class="text-red-400 text-sm h-4"></p></div>`,
    signUpForm: `<h1 class="text-3xl font-black text-white text-center">Create an Account</h1><form id="signup-form" class="space-y-4"><div><label for="signup-name" class="block text-sm font-medium text-gray-300">Your Name</label><input type="text" id="signup-name" placeholder="e.g., Sundar Pichai" class="form-input mt-1" required></div><div><label for="signup-location" class="block text-sm font-medium text-gray-300">Where are you from?</label><input type="text" id="signup-location" placeholder="e.g., Mountain View, CA" class="form-input mt-1" required></div><div><label for="signup-email" class="block text-sm font-medium text-gray-300">Your Email</label><input type="email" id="signup-email" placeholder="e.g., sundar@google.com" class="form-input mt-1" required></div><div><label for="signup-password" class="block text-sm font-medium text-gray-300">Create a Password</label><input type="password" id="signup-password" placeholder="••••••••" class="form-input mt-1" required></div><button type="submit" class="w-full btn-primary h-12">Sign Up & Explore</button></form><p class="text-xs text-center text-gray-400 mt-4">Already have an account? <span onclick="toggleAuthForm('signin')" class="font-bold text-blue-300 cursor-pointer">Sign In</span></p>`,
    signInForm: `<h1 class="text-3xl font-black text-white text-center">Welcome Back!</h1><form id="signin-form" class="space-y-4"><div><label for="signin-email" class="block text-sm font-medium text-gray-300">Your Email</label><input type="email" id="signin-email" placeholder="e.g., sundar@google.com" class="form-input mt-1" required></div><div><label for="signin-password" class="block text-sm font-medium text-gray-300">Password</label><input type="password" id="signin-password" placeholder="••••••••" class="form-input mt-1" required></div><button type="submit" class="w-full btn-primary h-12">Sign In</button></form><p class="text-xs text-center text-gray-400 mt-4">Don't have an account? <span onclick="toggleAuthForm('signup')" class="font-bold text-blue-300 cursor-pointer">Sign Up</span></p>`,
    main: `<header class="p-4 md:p-6 flex justify-between items-center"><div class="max-w-full truncate"><h1 class="text-2xl sm:text-3xl font-bold text-white truncate">Kavish M's Portfolio</h1><p id="welcome-message" class="text-blue-300 text-sm sm:text-base truncate">The interactive resume of a future innovator.</p></div><button onclick="logout()" class="btn-secondary px-4 py-2 rounded-lg font-medium flex-shrink-0">Logout</button></header><div class="page-content-wrapper"><div class="mx-auto max-w-7xl"><div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">...</div></div></div><footer class="page-footer"></footer>`,
    detailHeader: `<header class="p-4 md:p-6 flex justify-between items-center"><button onclick="showPage('page-main')" class="btn-secondary px-4 py-2 rounded-lg font-medium">&larr; Back</button><button onclick="logout()" class="btn-secondary px-4 py-2 rounded-lg font-medium">Logout</button></header>`,
    footer: `<p class="font-bold">Kavish M</p><p class="text-sm">Coimbatore, Tamil Nadu, India</p><div class="mt-4 flex justify-center gap-6"><span onclick="openEmailModal()" class="cursor-pointer hover:text-white">Email</span><span onclick="openPhoneModal()" class="cursor-pointer hover:text-white">Phone</span></div>`,
    emailModal: `<div class="glass-card modal-content"><div id="email-form-view"><h2 class="text-xl font-bold mb-4">Feedback for Kavish M</h2><form id="email-form" action="https://formspree.io/f/xeozngwn" method="POST"><div class="space-y-4"><input type="hidden" name="email" id="visitor-email-field"><input type="hidden" name="location" id="visitor-location-field"><div><label class="block text-sm font-medium mb-2">How was the website?</label><div class="flex flex-col sm:flex-row gap-2 sm:gap-4"><label class="flex items-center gap-2"><input type="radio" name="Website Feedback" value="Excellent" checked> Excellent</label><label class="flex items-center gap-2"><input type="radio" name="Website Feedback" value="Good"> Good</label><label class="flex items-center gap-2"><input type="radio" name="Website Feedback" value="Needs Improvement"> Needs Improvement</label></div></div><div><label class="block text-sm font-medium mb-2">How did you find this website?</label><div class="flex flex-col gap-2"><label class="flex items-center gap-2"><input type="radio" name="Source" value="Friends" onclick="toggleOtherSource(false)" checked> Friends</label><label class="flex items-center gap-2"><input type="radio" name="Source" value="From the Admin" onclick="toggleOtherSource(false)"> From the Admin (Kavish)</label><label class="flex items-center gap-2"><input type="radio" name="Source" value="Other" onclick="toggleOtherSource(true)"> Other</label></div><textarea id="other-source-explanation" name="Other Source Details" class="form-input mt-2 hidden" placeholder="Please explain..."></textarea></div><div class="flex justify-end gap-4"><button type="button" onclick="closeAllModals()" class="btn-secondary px-4 py-2 rounded-lg">Cancel</button><button type="submit" class="btn-primary">Send Feedback</button></div></div></form></div><div id="email-success-view" class="hidden text-center"><h2 class="text-xl font-bold mb-2">Thank You!</h2><p class="text-gray-300">Your feedback has been sent successfully.</p><button onclick="closeAllModals()" class="btn-primary mt-4">Close</button></div></div>`,
    phoneModal: `<div class="glass-card modal-content text-center"><div id="phone-initial-view"><h2 class="text-xl font-bold mb-2">Contact Kavish M</h2><p class="mb-4 text-gray-300">My phone number is:</p><p class="text-2xl font-bold text-white tracking-widest bg-black/20 rounded-lg py-2 mb-4">+91 9865824929</p><p class="mb-4 text-gray-400 text-sm">You can tap a button below to start a call on a compatible device.</p><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><button onclick="handleCall('work')" class="btn-primary">Call (Work)</button><button onclick="handleCall('personal')" class="btn-secondary px-4 py-2 rounded-lg">Personal</button><button onclick="handleCall('other')" class="btn-primary">Call (Other)</button></div></div><div id="phone-personal-message" class="hidden"><h2 class="text-xl font-bold mb-2">Thank you!</h2><p class="text-gray-300">For personal matters, please connect with me via Email or LinkedIn. Thank you for your understanding.</p><button onclick="closeAllModals()" class="btn-primary mt-4">Got it</button></div></div>`
};

const pageTitles = { journey: 'My Journey', projects: 'Projects & Skills', experience: 'Experience & Activities', leadership: 'Leadership & Honors', hackathons: 'Hackathon Achievements', certs: 'Certifications & Workshops', profiles: 'My Online Profiles' };
const pageSubtitles = { journey: 'The Path of a Fighter.', projects: 'Explore my hands-on projects and competencies.', experience: 'A journey of internships and leadership.', leadership: 'Highlights of my community involvement.', hackathons: 'Proven skills in competitive environments.', certs: 'My commitment to skill development.', profiles: 'Connect with me across the web.' };

const pageContent = {
    mainGrid: `<div class="glass-card col-span-1 md:col-span-2 xl:col-span-3 flex flex-col sm:flex-row items-center gap-6"><img src="./assets/image/imgone.jpg" alt="Kavish M" class="w-28 h-28 md:w-36 md:h-36 object-cover rounded-full border-2 border-blue-400 flex-shrink-0"><div><h2 class="text-2xl lg:text-3xl font-bold">Kavish M</h2><p class="text-gray-300">B.Tech IT Student @ SNS College of Technology</p><p class="mt-2 text-gray-400">IT Student | Agentic AI & Low-Code Automation (n8n) | AI  with Streamlit | Web Dev: HTML, CSS, JS | Java, Python</p></div></div>` +
              ['journey', 'projects', 'experience', 'leadership', 'hackathons', 'certs', 'profiles'].map(key => `<div onclick="showPage('page-${key}')" class="glass-card glass-card-interactive cursor-pointer"><h3 class="text-xl font-bold mb-2">${pageTitles[key]}</h3><p class="text-gray-400">${pageSubtitles[key]}</p></div>`).join(''),
    journey: `<h1 class="text-3xl md:text-4xl xl:text-5xl font-black text-white mb-6">My Journey: The Path of a Fighter</h1><div class="space-y-6"><div id="chapter-1" class="glass-card reveal-card"><h2 class="text-2xl font-bold text-blue-300">Chapter I: The Spark</h2><p class="mt-2 text-gray-300">My story begins at Noble Matriculation Higher Secondary School. Beyond academics, I found a passion for dance, performing for eight consecutive years. But another fire was lit in me—a desire for discipline. My first steps into martial arts were met with disappointment as instructors for Taekwondo and Silambam left unexpectedly. It felt like a path closed before it could even begin.</p><button onclick="revealChapter(2)" class="btn-secondary mt-4 px-4 py-2 rounded-lg font-medium w-full">Reveal the Next Chapter...</button></div><div id="chapter-2" class="glass-card reveal-card hidden"><h2 class="text-2xl font-bold text-green-300">Chapter II: The Forge</h2><p class="mt-2 text-gray-300">With my friends' motivation, I found Karate. This was the turning point. It wasn't just a hobby; it became a part of me. I poured my energy into it, collecting prizes and pushing my limiotsz. The discipline was intense, and balancing it with my studies was a constant battle. I fought hard on two fronts, striving for excellence in both the dojo and the classroom.</p><button onclick="revealChapter(3)" class="btn-secondary mt-4 px-4 py-2 rounded-lg font-medium w-full">Uncover the Trial...</button></div><div id="chapter-3" class="glass-card reveal-card hidden"><h2 class="text-2xl font-bold text-yellow-300">Chapter III: The Test</h2><p class="mt-2 text-gray-300">The ultimate test came at the National level. Twice I competed, and twice I returned without a win. It was heartbreaking. But the core lesson of Karate is to never give up. I channeled that spirit, pushing through the disappointment until I earned my Black Belt—a symbol of resilience. That same resilience helped me fight for my studies, achieving a centum in Computer Science, a small but significant victory that paved my way to college.</p><button onclick="revealChapter(4)" class="btn-secondary mt-4 px-4 py-2 rounded-lg font-medium w-full">Discover the Key...</button></div><div id="chapter-4" class="glass-card reveal-card hidden"><h2 class="text-2xl font-bold text-red-300">Chapter IV: The Key</h2><p class="mt-2 text-gray-300">Now in college, my journey continues. I've learned that my struggles are not setbacks; they are my keys. The discipline from Karate, the creativity from dance, and the persistence from overcoming failure are the tools I now apply to technology and leadership. Every challenge is just another dojo, another stage, another opportunity to grow.</p></div></div>`,
    projects: `<h1 class="text-3xl md:text-4xl xl:text-5xl font-black text-white mb-6">Projects & Skills</h1><div class="glass-card reveal-card"><h2 class="text-2xl font-semibold mb-4">Technical Projects</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h3 class="font-bold">Full-Stack Library Management</h3><p class="text-sm text-gray-400">A complete web application with both frontend and backend functionality.</p></div><div><h3 class="font-bold">AI Admission Project using Agentic AI n8n</h3><p class="text-sm text-gray-400">A collaborative project utilizing n8n for automation workflows and a custom frontend.</p></div><div><h3 class="font-bold">Emergency SOS Website</h3><p class="text-sm text-gray-400">A responsive, standard front-end website for emergency situations.</p></div><div><h3 class="font-bold">AI/ML Streamlit Apps</h3><p class="text-sm text-gray-400">Includes a Resume Analyzer and Photo Filters app to demonstrate practical AI.</p></div><div><h3 class="font-bold">Ai Assistant For Farmers</h3><p class="text-sm text-gray-400">AI chatbot for farmers with thier details and alert messages using Agentic AI n8n</p></div></div><h2 class="text-2xl font-semibold mt-8 mb-4">Tech Stack</h2><div class="flex flex-wrap gap-3"><span class="bg-blue-500/50 px-3 py-1 rounded-full text-sm">Node Js</span><span class="bg-yellow-500/50 px-3 py-1 rounded-full text-sm">MongoDb Atlas</span><span class="bg-green-500/50 px-3 py-1 rounded-full text-sm">HTML/CSS/JS</span><span class="bg-purple-500/50 px-3 py-1 rounded-full text-sm">Streamlit</span><span class="bg-indigo-500/50 px-3 py-1 rounded-full text-sm"> AGENTIC AI n8n</span><span class="bg-red-500/50 px-3 py-1 rounded-full text-sm">JAVA SPRINGBOOT</span><span class="bg-pink-500/50 px-3 py-1 rounded-full text-sm">MY SQL</span></div></div>`,
    experience: `<h1 class="text-3xl md:text-4xl xl:text-5xl font-black text-white mb-6">Experience & Activities</h1><div class="space-y-6"><div class="glass-card reveal-card"><h2 class="text-xl font-bold">Internships</h2><p class="mt-2 text-gray-300">Gained valuable hands-on experience in website development and front-end technologies through internships at <strong>Circor International, Inc.</strong> and a 21-day program at <strong>Dsignz Media</strong>.</p></div><div class="glass-card reveal-card"><h2 class="text-xl font-bold">Agentic AI Bootcamp</h2><p class="mt-2 text-gray-300">Participated in an intensive 3-day bootcamp by <strong>SNS iHub</strong>, where I explored agent-based automation and built a working N8N automation workflow with my team, inspired by a session with Prof. Ulrich Weinberg.</p></div><div class="glass-card reveal-card"><h2 class="text-xl font-bold">Public Speaking & Seminars</h2><p class="mt-2 text-gray-300">Delivered many seminar's. I am confident and experienced in presenting complex technical topics to an audience.</p></div><div class="glass-card reveal-card"><h2 class="text-xl font-bold">Texperia Event Coordinator</h2><p class="mt-2 text-gray-300">Proud to have been a Paper Presentation Coordinator at Texperia event , held  in our SNS College of Technology</p></div></div>`,
    leadership: `<h1 class="text-3xl md:text-4xl xl:text-5xl font-black text-white mb-6">Leadership & Honors</h1><div class="space-y-6"><div class="glass-card reveal-card"><h2 class="text-2xl font-bold text-yellow-300">All Rounder Performer Award 2025</h2><p class="mt-2 text-gray-300">Honored to receive this award at SNS College of Technology, a recognition built on five key pillars: growth, learning, and self-discovery. It celebrates involvement in leadership, co-curriculars, and social impact beyond academics.</p></div><div class="glass-card reveal-card"><h2 class="text-2xl font-bold text-blue-300">Student Organizer, Texperia</h2><p class="mt-2 text-gray-300">Proud to have been a Paper Presentation Coordinator for the Texperia event, organizing and facilitating innovative research discussions among talented individuals.</p></div><div class="glass-card reveal-card"><h2 class="text-xl font-bold">A Dream Come True Moment</h2><p class="mt-2 text-gray-300">Had the once-in-a-lifetime opportunity to meet and interact with actor Thalapathy Vijay at the TVK Students Meet, an experience that reinforced the value of hard work and family support.</p></div></div>`,
    hackathons: `<h1 class="text-3xl md:text-4xl xl:text-5xl font-black text-white mb-6">Hackathon Achievements</h1><div class="space-y-6"><div class="glass-card reveal-card"><h2 class="text-2xl font-bold text-green-300">Rank 5 - AI Agents Hackathon</h2><p class="mt-2 text-gray-300">My teammate Bharath N and I secured Rank 5 in the competitive AI Agents Hackathon conducted by Swafinix Technologies PVT. Ltd., showcasing our ability to rapidly prototype and deliver effective AI solutions.</p></div><div class="glass-card reveal-card"><h2 class="text-2xl font-bold text-blue-300">MSME Hackathon 2025 Finalist</h2><p class="mt-2 text-gray-300">Successfully cleared the All round (Idea Submission phase and Prototype phase) of this national-level hackathon, demonstrating strong ideation and problem-solving skills.</p></div><div class="glass-card reveal-card"><h2 class="text-2xl font-bold text-yellow-300">Ideathon Participant</h2><p class="mt-2 text-gray-300">Collaborated with my team in an enriching Ideathon at our college, gaining valuable insights into problem-solving and enhancing my perspective on teamwork and innovation.</p></div><div class="glass-card reveal-card"><h2 class="text-2xl font-bold text-blue-300">DEVSPARK'25- 24 HRS HACKATHON</h2><p class="mt-2 text-gray-300">Our team Dynamic Duo (me and Bharath N) competed with many teams and cleared three review.</p></div><div class="glass-card reveal-card"><h2 class="text-2xl font-bold text-blue-300">Adobe India Hackathon 2025</h2><p class="mt-2 text-gray-300">Participated in Adobe India Hackathon 2025 , completed the Round 1 -Online MCQ Assessment + Coding which is organised by Adope</p></div></div>`,
    certs: `<h1 class="text-3xl md:text-4xl xl:text-5xl font-black text-white mb-6">Certifications & Workshops</h1><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="glass-card reveal-card"><h3 class="font-bold">AR/VR: Creating Immersive Experience</h3><p class="text-sm text-gray-400">National Level Technical Fest NETRIX '25, KPR Institute of Engineering and Technology.</p></div><div class="glass-card reveal-card"><h3 class="font-bold">Embedded Systems and IoT</h3><p class="text-sm text-gray-400">One-day National Level Workshop at ELZIA 2K24, Hindusthan College of Engineering and Technology.</p></div><div class="glass-card reveal-card"><h3 class="font-bold">Blender Workshop</h3><p class="text-sm text-gray-400">Gained practical skills in 3D modeling and animation at Johnson College, Coimbatore.</p></div><div class="glass-card reveal-card"><h3 class="font-bold">One-Month LeetCode Training</h3><p class="text-sm text-gray-400">Completed an intensive daily training program focusing on DSA, teamwork, and problem-solving.</p></div><div class="glass-card reveal-card"><h3 class="font-bold">Basics of Python</h3><p class="text-sm text-gray-400">Infosys Springboard, July 31, 2025</p></div><div class="glass-card reveal-card"><h3 class="font-bold">IoT using Python and Raspberry Pi</h3><p class="text-sm text-gray-400">Workshop in association with Mechanica 2023, IIT Madras.</p></div></div>`,
    profiles: `<h1 class="text-3xl md:text-4xl xl:text-5xl font-black text-white mb-6">My Online Profiles</h1><div class="space-y-6"><a href="https://www.linkedin.com/in/kavish-m-" target="_blank" class="glass-card glass-card-interactive reveal-card flex items-center justify-between"><div><h3 class="text-2xl font-bold text-blue-400">LinkedIn</h3><p>View my professional journey, connections, and activity.</p></div><span class="text-2xl">&rarr;</span></a><a href="https://github.com/kavishM765" target="_blank" class="glass-card glass-card-interactive reveal-card flex items-center justify-between"><div><h3 class="text-2xl font-bold text-white">GitHub</h3><p>Explore my code repositories and technical projects.</p></div><span class="text-2xl">&rarr;</span></a><a href="https://leetcode.com/u/Kavish20240905/" target="_blank" class="glass-card glass-card-interactive reveal-card flex items-center justify-between"><div><h3 class="text-2xl font-bold text-yellow-400">LeetCode</h3><p>See my progress in data structures and algorithm challenges.</p></div><span class="text-2xl">&rarr;</span></a></div>`
};

// --- GLOBAL STATE ---
let currentUser = null;
let userData = {};

// --- SCRIPT LOGIC ---
const modalOverlay = document.getElementById('modal-overlay');
const emailModal = document.getElementById('email-modal');
const phoneModal = document.getElementById('phone-modal');

function setupPage(pageId, content) {
    const pageDiv = document.getElementById(pageId);
    if(pageDiv) pageDiv.innerHTML = content;
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = 'flex';
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        if (pageId === 'page-journey') {
            for (let i = 2; i <= 4; i++) {
                const chapter = document.getElementById(`chapter-${i}`);
                if (chapter) chapter.classList.add('hidden');
            }
        }
    }
}

function revealChapter(chapterNumber) {
    const chapter = document.getElementById(`chapter-${chapterNumber}`);
    if (chapter) {
        chapter.classList.remove('hidden');
        chapter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function logout() {
    auth.signOut();
}

function openEmailModal() { 
    const visitorEmailField = document.getElementById('visitor-email-field');
    const visitorLocationField = document.getElementById('visitor-location-field');
    if(visitorEmailField && currentUser) visitorEmailField.value = currentUser.email;
    if(visitorLocationField && userData) visitorLocationField.value = userData.location;
    
    modalOverlay.style.display = 'block'; 
    emailModal.style.display = 'block'; 
}
function openPhoneModal() {
    document.getElementById('phone-initial-view').style.display = 'block';
    document.getElementById('phone-personal-message').style.display = 'none';
    modalOverlay.style.display = 'block';
    phoneModal.style.display = 'block';
}
function closeAllModals() { modalOverlay.style.display = 'none'; emailModal.style.display = 'none'; phoneModal.style.display = 'none'; }
function toggleOtherSource(isOther) { 
    const explanationEl = document.getElementById('other-source-explanation');
    if(explanationEl) explanationEl.style.display = isOther ? 'block' : 'none'; 
}

function handleCall(reason) {
    if (reason === 'personal') {
        document.getElementById('phone-initial-view').style.display = 'none';
        document.getElementById('phone-personal-message').style.display = 'block';
    } else {
        window.location.href = 'tel:+919865824929';
        closeAllModals();
    }
}

function setAuthError(message = "") {
    const errorEl = document.getElementById('auth-error');
    if (errorEl) errorEl.textContent = message;
}

function toggleAuthForm(formType) {
    const container = document.getElementById('auth-container');
    if (!container) return;

    if (formType === 'signin') {
        container.innerHTML = templates.signInForm;
        const signInForm = document.getElementById('signin-form');
        if (signInForm) signInForm.addEventListener('submit', handleSignIn);
    } else {
        container.innerHTML = templates.signUpForm;
        const signUpForm = document.getElementById('signup-form');
        if (signUpForm) signUpForm.addEventListener('submit', handleSignUp);
    }
}

async function handleSignUp(e) {
    e.preventDefault();
    setAuthError();
    const button = e.target.querySelector('button[type="submit"]');
    const originalButtonText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<div class="loader mx-auto"></div>`;

    const name = document.getElementById('signup-name').value;
    const location = document.getElementById('signup-location').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        await db.collection('users').doc(user.uid).set({
            name: name,
            location: location,
            email: email
        });
    } catch (error) {
        setAuthError(error.message);
    } finally {
        button.disabled = false;
        button.innerHTML = originalButtonText;
    }
}

async function handleSignIn(e) {
    e.preventDefault();
    setAuthError();
    const button = e.target.querySelector('button[type="submit"]');
    const originalButtonText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<div class="loader mx-auto"></div>`;

    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        setAuthError(error.message);
    } finally {
        button.disabled = false;
        button.innerHTML = originalButtonText;
    }
}

// --- INITIALIZATION ---
function initializeApp() {
    // Setup static modal content
    setupPage('email-modal', templates.emailModal);
    setupPage('phone-modal', templates.phoneModal);

    // Setup main pages
    setupPage('page-login', templates.login);
    const mainPageGrid = document.createElement('div');
    mainPageGrid.innerHTML = templates.main;
    if(mainPageGrid.querySelector('.grid')) {
        mainPageGrid.querySelector('.grid').innerHTML = pageContent.mainGrid;
    }
    document.getElementById('page-main').innerHTML = mainPageGrid.innerHTML;
    
    const detailPages = ['journey', 'projects', 'experience', 'leadership', 'hackathons', 'certs', 'profiles'];
    detailPages.forEach(key => {
        const detailContent = `<div class="page-content-wrapper"><div class="mx-auto max-w-7xl">${pageContent[key]}</div></div>`;
        setupPage(`page-${key}`, templates.detailHeader + detailContent + `<footer class="page-footer"></footer>`);
    });
    
    // Firebase Auth State Listener
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                userData = userDoc.data();
                const welcomeEl = document.getElementById('welcome-message');
                if (welcomeEl) welcomeEl.textContent = `Welcome, ${userData.name}! Glad to have you here.`;
            }
            
            const mainFooter = document.querySelector('#page-main .page-footer');
            if(mainFooter) mainFooter.innerHTML = templates.footer;
            document.querySelectorAll('.page:not(#page-main):not(#page-login) .page-footer').forEach(footer => {
                footer.innerHTML = templates.footer;
            });

            showPage('page-main');
        } else {
            currentUser = null;
            userData = {};
            toggleAuthForm('signin');
            showPage('page-login');
        }
    });
    
    const emailForm = document.getElementById('email-form');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(emailForm);
            const formAction = emailForm.getAttribute('action');

            if (!formAction || formAction === "YOUR_FORMSPREE_ENDPOINT_HERE") {
                alert("Developer: Please replace 'YOUR_FORMSPREE_ENDPOINT_HERE' with your actual Formspree URL.");
                return;
            }

            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                const formView = document.getElementById('email-form-view');
                const successView = document.getElementById('email-success-view');
                if (response.ok) {
                    if(formView) formView.style.display = 'none';
                    if(successView) successView.style.display = 'block';
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert("Oops! There was a problem submitting your form");
                        }
                    })
                }
            }).catch(error => {
                alert("Oops! There was a problem submitting your form");
            });
        });
    }
}

initializeApp();
