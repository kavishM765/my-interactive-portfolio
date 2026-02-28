// --- Modal Templates ---
const templates = {
    email: `
        <h2 class="text-2xl font-bold mb-6 text-white">Direct Engagement</h2>
        <form id="contact-form" action="https://formspree.io/f/xeozngwn" method="POST" class="space-y-4">
            <input type="email" name="email" placeholder="Hiring Manager Email" class="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition" required>
            <textarea name="message" placeholder="I saw your Telemedicine Platform from BUGSLAYER '26..." class="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white h-32 focus:border-blue-500 outline-none transition" required></textarea>
            
            <p id="form-status" class="text-sm font-semibold hidden"></p>

            <div class="flex justify-end gap-3 pt-4">
                <button type="button" onclick="closeAllModals()" class="text-gray-400 font-medium px-4 hover:text-white transition">Close</button>
                <button type="submit" id="submit-btn" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center min-w-[160px]">
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
                <button onclick="closeAllModals()" class="text-gray-500 pt-4 text-xs font-semibold uppercase tracking-widest hover:text-white transition">Back to Dashboard</button>
            </div>
        </div>`
};

// --- Modal Controls ---
function openEmailModal() {
    const modal = document.getElementById('email-modal');
    modal.innerHTML = templates.email;
    document.getElementById('modal-overlay').classList.remove('hidden');
    modal.classList.remove('hidden');

    // Attach the background submit handler once the modal opens
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', handleFormSubmit);
}

function openPhoneModal() {
    const modal = document.getElementById('phone-modal');
    modal.innerHTML = templates.phone;
    document.getElementById('modal-overlay').classList.remove('hidden');
    modal.classList.remove('hidden');
}

function closeAllModals() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('email-modal').classList.add('hidden');
    document.getElementById('phone-modal').classList.add('hidden');
}

// --- AJAX Form Submission Logic (No Redirects) ---
async function handleFormSubmit(event) {
    event.preventDefault(); // Stops the page from leaving/redirecting

    const form = event.target;
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const data = new FormData(form);

    // Store original button text
    const originalBtnText = "Send Inquiry";

    // UI Loading State with SVG Spinner
    submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                'Accept': 'application/json' // Forces Formspree to reply with data, not a HTML page
            }
        });

        if (response.ok) {
            // Success State with smooth animation
            status.innerHTML = `<span class="inline-block animate-bounce mr-1">✅</span> Message sent successfully! I will get back to you soon.`;
            status.className = "text-green-400 text-sm font-bold block mt-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20";
            form.reset();
            submitBtn.innerHTML = "Delivered!";
            submitBtn.classList.replace('bg-blue-600', 'bg-green-600');
            submitBtn.classList.replace('hover:bg-blue-700', 'hover:bg-green-700');
            
            // Auto-close modal after 3.5 seconds
            setTimeout(() => {
                closeAllModals();
                // Reset button for next time they open the modal
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
            throw new Error("Formspree rejected the submission");
        }
    } catch (error) {
        // Error State
        status.innerHTML = `❌ Oops! There was a network error. Please try again.`;
        status.className = "text-red-400 text-sm font-bold block mt-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20";
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('cursor-wait', 'opacity-90');
    }
}

// --- Senior Interaction Observer (High Performance) ---
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
        }
    });
}, observerOptions);

window.onload = () => {
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
};