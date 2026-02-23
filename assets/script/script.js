const templates = {
    email: `
        <h2 class="text-2xl font-bold mb-6 text-white">Share Your Feedback</h2>
        <form action="https://formspree.io/f/xeozngwn" method="POST" class="space-y-4">
            <input type="email" name="email" placeholder="Recruiter Email" class="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-blue-500 outline-none transition" required>
            <textarea name="message" placeholder="I saw your work in BUGSLAYER '26..." class="w-full bg-white/5 border border-white/10 p-4 rounded-xl h-32 focus:border-blue-500 outline-none transition" required></textarea>
            <div class="flex justify-end gap-3 pt-4">
                <button type="button" onclick="closeAllModals()" class="text-gray-400 font-medium px-4">Cancel</button>
                <button type="submit" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/20 transition">Send Inquiry</button>
            </div>
        </form>`,
    phone: `
        <div class="text-center">
            <h2 class="text-2xl font-bold mb-2 text-white">Direct Line</h2>
            <p class="text-blue-500 font-bold mb-8">+91 9865824929</p>
            <div class="grid grid-cols-1 gap-3">
                <a href="tel:+919865824929" class="bg-blue-600 text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition">Call for Interview</a>
                <a href="https://www.linkedin.com/in/kavish-m-" target="_blank" class="bg-white/5 text-white py-4 rounded-xl font-bold hover:bg-white/10 transition">LinkedIn DM</a>
                <button onclick="closeAllModals()" class="text-gray-500 pt-4 text-sm font-semibold">Back to Portfolio</button>
            </div>
        </div>`
};

function openEmailModal() {
    const modal = document.getElementById('email-modal');
    modal.innerHTML = templates.email;
    document.getElementById('modal-overlay').classList.remove('hidden');
    modal.classList.remove('hidden');
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

// Senior Performance Tip: Optimized Scroll Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
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