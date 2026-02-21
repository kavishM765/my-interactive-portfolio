// --- Modal Templates ---
const templates = {
    email: `
        <h2 class="text-2xl font-bold mb-6">Share Your Feedback</h2>
        <form action="https://formspree.io/f/xeozngwn" method="POST" class="space-y-4">
            <input type="email" name="email" placeholder="Your Email" class="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-blue-500 outline-none" required>
            <textarea name="message" placeholder="How was the portfolio?" class="w-full bg-white/5 border border-white/10 p-4 rounded-xl h-32 focus:border-blue-500 outline-none" required></textarea>
            <div class="flex justify-end gap-3 pt-4">
                <button type="button" onclick="closeAllModals()" class="text-gray-400 font-medium">Cancel</button>
                <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">Send Feedback</button>
            </div>
        </form>`,
    phone: `
        <div class="text-center">
            <h2 class="text-2xl font-bold mb-2">Connect with Kavish</h2>
            <p class="text-gray-400 mb-8">+91 9865824929</p>
            <div class="grid grid-cols-1 gap-3">
                <a href="tel:+919865824929" class="bg-blue-600 text-white py-4 rounded-xl font-bold">Call for Work</a>
                <button onclick="alert('Please connect via LinkedIn for personal matters.')" class="bg-white/5 text-white py-4 rounded-xl font-bold">Personal Inquiry</button>
                <button onclick="closeAllModals()" class="text-gray-500 pt-4">Close</button>
            </div>
        </div>`
};

// --- Modal Controls ---
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

// --- Animation Observer ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
        }
    });
}, { threshold: 0.15 });

window.onload = () => {
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
};