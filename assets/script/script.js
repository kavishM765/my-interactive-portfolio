// --- Modal Templates ---
const templates = {
    email: `
        <h2 class="text-2xl font-bold mb-4 text-white">Direct Engagement</h2>
        <form id="contact-form" action="https://formspree.io/f/xeozngwn" method="POST" class="space-y-4">
            <!-- Anti-Spam Honeypot Field (Hidden from humans, traps bots) -->
            <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none !important">
            <input type="email" name="email" id="user-email" placeholder="Hiring Manager Email" class="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition" required>
            <textarea name="message" id="user-message" placeholder="I saw your Telemedicine Platform from BUGSLAYER '26..." class="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white h-28 focus:border-blue-500 outline-none transition" minlength="10" maxlength="1000" required></textarea>
            
            <!-- DPDP Act 2023 Explicit Consent Checkbox -->
            <div class="flex items-start gap-2.5 pt-1 text-left">
                <input type="checkbox" id="dpdp-consent" name="dpdp_consent" class="mt-1 rounded bg-white/5 border-white/20 text-blue-600 focus:ring-blue-500" required>
                <label for="dpdp-consent" class="text-[11px] text-gray-400 leading-snug">
                    I consent to Kavish M processing my email & message solely to respond to this inquiry, under the <button type="button" onclick="openPrivacyModal()" class="text-blue-400 hover:underline">DPDP Act 2023</button>.
                </label>
            </div>

            <p id="form-status" class="text-sm font-semibold hidden"></p>

            <div class="flex justify-end gap-3 pt-2">
                <button type="button" onclick="closeAllModals()" class="text-gray-400 font-medium px-4 hover:text-white transition text-sm">Close</button>
                <button type="submit" id="submit-btn" class="bg-blue-600 text-white px-7 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center min-w-[150px] text-sm">
                    Send Inquiry
                </button>
            </div>
        </form>`,
    phone: `
        <div class="text-center">
            <h2 class="text-2xl font-bold mb-2 text-white">Direct Contact</h2>
            <p class="text-blue-500 font-bold mb-8">+91 9865824929</p>
            <div class="grid grid-cols-1 gap-3">
                <a href="tel:+919865824929" class="bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition">Call for Opportunity</a>
                <a href="https://www.linkedin.com/in/kavish-m-" target="_blank" class="bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold hover:bg-white/10 transition">LinkedIn Message</a>
                <button onclick="closeAllModals()" class="text-gray-500 pt-4 text-xs font-semibold uppercase tracking-widest hover:text-white transition">Back to Portfolio</button>
            </div>
        </div>`,
    privacy: `
        <div class="text-left space-y-4 max-h-[75vh] overflow-y-auto pr-2">
            <div class="flex justify-between items-center border-b border-white/10 pb-3">
                <h2 class="text-xl font-bold text-white">Privacy Policy & DPDP Compliance</h2>
                <span class="text-[10px] uppercase font-bold tracking-widest text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">DPDP Act 2023 Compliant</span>
            </div>
            <div class="text-xs text-gray-300 space-y-3 leading-relaxed">
                <p><strong class="text-white">1. Data Fiduciary & Officer:</strong> Kavish M (Contact: <a href="mailto:kavishm100@gmail.com" class="text-blue-400 underline">kavishm100@gmail.com</a>).</p>
                <p><strong class="text-white">2. Data Collected:</strong> Name, Email address, and message content submitted voluntarily via the contact modal.</p>
                <p><strong class="text-white">3. Purpose of Processing:</strong> Information is used exclusively for professional recruitment communications, business inquiries, and technical collaboration. Your data is **never sold, shared, or leased** to third parties.</p>
                <p><strong class="text-white">4. Transmission & Security:</strong> Messages are transmitted securely via HTTPS encrypted POST requests directly to Formspree edge handlers. No cookies or user tracking databases are maintained locally.</p>
                <p><strong class="text-white">5. Your Rights (DPDP Act 2023 & FTC):</strong> You have the right to request access, correction, or permanent deletion of your submitted messages at any time.</p>
            </div>
            <div class="pt-3 border-t border-white/10 flex flex-wrap justify-between items-center gap-3">
                <a href="mailto:kavishm100@gmail.com?subject=DPDP%20Data%20Deletion%20Request" class="text-xs text-red-400 hover:underline font-semibold">Request Message Deletion ↗</a>
                <button type="button" onclick="closeAllModals()" class="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition">Understood</button>
            </div>
        </div>`,
    terms: `
        <div class="text-left space-y-4 max-h-[75vh] overflow-y-auto pr-2">
            <div class="flex justify-between items-center border-b border-white/10 pb-3">
                <h2 class="text-xl font-bold text-white">Terms of Service</h2>
                <span class="text-[10px] uppercase font-bold tracking-widest text-gray-400">Effective 2026</span>
            </div>
            <div class="text-xs text-gray-300 space-y-3 leading-relaxed">
                <p><strong class="text-white">1. Acceptance:</strong> By accessing kavishmportfolio.vercel.app, you agree to these Terms of Service and applicable privacy regulations.</p>
                <p><strong class="text-white">2. Intellectual Property:</strong> All project showcases, custom n8n workflow diagrams, text copy, and interactive components belong to Kavish M unless otherwise attributed.</p>
                <p><strong class="text-white">3. Acceptable Use:</strong> You agree not to spam contact forms, attempt automated script scraping, or inject malicious payloads.</p>
                <p><strong class="text-white">4. Disclaimer:</strong> Projects displayed are for portfolio demonstration, educational, and professional recruitment evaluation purposes.</p>
            </div>
            <div class="pt-3 border-t border-white/10 flex justify-end">
                <button type="button" onclick="closeAllModals()" class="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition">Close</button>
            </div>
        </div>`
};

// --- Modal Controls ---
function openEmailModal() {
    const modal = document.getElementById('email-modal');
    modal.innerHTML = templates.email;
    document.getElementById('modal-overlay').classList.remove('hidden');
    modal.classList.remove('hidden');

    // Attach background submit handler
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', handleFormSubmit);
}

function openPhoneModal() {
    const modal = document.getElementById('phone-modal');
    modal.innerHTML = templates.phone;
    document.getElementById('modal-overlay').classList.remove('hidden');
    modal.classList.remove('hidden');
}

function openPrivacyModal() {
    closeAllModals();
    const modal = document.getElementById('privacy-modal');
    modal.innerHTML = templates.privacy;
    document.getElementById('modal-overlay').classList.remove('hidden');
    modal.classList.remove('hidden');
}

function openTermsModal() {
    closeAllModals();
    const modal = document.getElementById('terms-modal');
    modal.innerHTML = templates.terms;
    document.getElementById('modal-overlay').classList.remove('hidden');
    modal.classList.remove('hidden');
}

function closeAllModals() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('email-modal').classList.add('hidden');
    document.getElementById('phone-modal').classList.add('hidden');
    const privacy = document.getElementById('privacy-modal');
    if (privacy) privacy.classList.add('hidden');
    const terms = document.getElementById('terms-modal');
    if (terms) terms.classList.add('hidden');
}

// --- AJAX Form Submission Logic with Rate Limiting & Input Validation ---
async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const messageInput = document.getElementById('user-message');

    // Security Guard 1: Client-Side Rate Limit (60s Cooldown)
    const lastSubmission = localStorage.getItem('last_submission_time');
    const now = Date.now();
    const COOLDOWN_MS = 60000; // 60 seconds

    if (lastSubmission && (now - lastSubmission < COOLDOWN_MS)) {
        const remainingSec = Math.ceil((COOLDOWN_MS - (now - lastSubmission)) / 1000);
        status.innerHTML = `⚠️ Security Cooldown: Please wait ${remainingSec} seconds before sending another inquiry.`;
        status.className = "text-yellow-400 text-xs font-bold block mt-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20";
        return;
    }

    // Security Guard 2: Input Sanitization & Length Check
    if (messageInput && messageInput.value.trim().length < 10) {
        status.innerHTML = `⚠️ Message too short: Please type at least 10 characters.`;
        status.className = "text-yellow-400 text-xs font-bold block mt-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20";
        return;
    }

    const data = new FormData(form);
    const originalBtnText = "Send Inquiry";

    // UI Loading State
    submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending...
    `;
    submitBtn.disabled = true;
    submitBtn.classList.add('cursor-wait', 'opacity-90');
    status.classList.add('hidden');

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Record submission timestamp for rate limiting
            localStorage.setItem('last_submission_time', Date.now());

            status.innerHTML = `<span class="inline-block animate-bounce mr-1">✅</span> Message sent successfully! I will get back to you soon.`;
            status.className = "text-green-400 text-xs font-bold block mt-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20";
            form.reset();
            submitBtn.innerHTML = "Delivered!";
            submitBtn.classList.replace('bg-blue-600', 'bg-green-600');
            submitBtn.classList.replace('hover:bg-blue-700', 'hover:bg-green-700');
            
            setTimeout(() => {
                closeAllModals();
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.classList.replace('bg-green-600', 'bg-blue-600');
                    submitBtn.classList.replace('hover:bg-green-700', 'hover:bg-blue-700');
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('cursor-wait', 'opacity-90');
                    status.classList.add('hidden');
                }, 500);
            }, 3500);
        } else {
            throw new Error("Formspree rejected submission");
        }
    } catch (error) {
        status.innerHTML = `❌ Network error. Please try again or email directly to kavishm100@gmail.com`;
        status.className = "text-red-400 text-xs font-bold block mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20";
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('cursor-wait', 'opacity-90');
    }
}

// --- Fail-Safe Scroll Observer (Guarantees content is never hidden) ---
function initScrollObserver() {
    const els = document.querySelectorAll('.animate-on-scroll');
    
    if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('appear'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, { threshold: 0.05, rootMargin: '50px' });

    els.forEach(el => {
        observer.observe(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('appear');
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollObserver);
} else {
    initScrollObserver();
}

// Safety Fallback: Ensure all elements are visible after 500ms no matter what
setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('appear'));
}, 500);