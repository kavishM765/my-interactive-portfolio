// --- Modal Templates ---
const templates = {
    email: `
        <h2 class="text-2xl font-bold mb-6 text-white">Direct Engagement</h2>
        <form id="contact-form" action="https://formspree.io/f/xeozngwn" method="POST" class="space-y-4">
            <input type="email" name="email" placeholder="Hiring Manager Email" class="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-blue-500 outline-none transition" required>
            <textarea name="message" placeholder="I saw your Telemedicine Platform from BUGSLAYER '26..." class="w-full bg-white/5 border border-white/10 p-4 rounded-xl h-32 focus:border-blue-500 outline-none transition" required></textarea>
            
            <p id="form-status" class="text-sm font-semibold hidden"></p>

            <div class="flex justify-end gap-3 pt-4">
                <button type="button" onclick="closeAllModals()" class="text-gray-400 font-medium px-4">Close</button>
                <button type="submit" id="submit-btn" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition">Send Inquiry</button>
            </div>
        </form>`,
    phone: `
        <div class="text-center">
            <h2 class="text-2xl font-bold mb-2 text-white">Direct Contact</h2>
            <p class="text-blue-500 font-bold mb-8">+91 9865824929</p>
            <div class="grid grid-cols-1 gap-3">
                <a href="tel:+919865824929" class="bg-blue-600 text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition">Call for Opportunity</a>
                <a href="https://www.linkedin.com/in/kavish-m-" target="_blank" class="bg-white/5 text-white py-4 rounded-xl font-bold hover:bg-white/10 transition">LinkedIn Message</a>
                <button onclick="closeAllModals()" class="text-gray-500 pt-4 text-xs font-semibold uppercase tracking-widest">Back to Dashboard</button>
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

// --- AJAX Form Submission Logic ---
async function handleFormSubmit(event) {
    event.preventDefault(); // Stops the redirect to Formspree

    const form = event.target;
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const data = new FormData(form);

    // UI Loading State
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    status.classList.add('hidden');

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json' // Tells Formspree to return data, not a webpage
            }
        });

        if (response.ok) {
            // Success State
            status.innerText = "Message sent successfully! I will get back to you soon.";
            status.className = "text-green-500 text-sm font-semibold block mt-2";
            form.reset();
            submitBtn.innerText = "Sent!";
            
            // Auto-close modal after 3 seconds
            setTimeout(() => {
                closeAllModals();
            }, 3000);
        } else {
            // Error State from Formspree
            status.innerText = "Oops! There was a problem submitting your form.";
            status.className = "text-red-500 text-sm font-semibold block mt-2";
            submitBtn.innerText = "Send Inquiry";
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    } catch (error) {
        // Network Error State
        status.innerText = "Oops! Network error. Please try again.";
        status.className = "text-red-500 text-sm font-semibold block mt-2";
        submitBtn.innerText = "Send Inquiry";
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
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