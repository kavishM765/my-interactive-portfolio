// ════════════════════════════════════════════════════════════════════
// Gallery Controller: Hanging Conveyor, Filter Grid, & Lightbox
// ════════════════════════════════════════════════════════════════════

let galleryData = [];
let currentLightboxIndex = 0;
let filteredItems = [];

// Fetch data and initialize
async function initGallery() {
    try {
        const response = await fetch('./assets/data/gallery.json');
        galleryData = await response.json();
        filteredItems = [...galleryData];

        renderConveyor();
        renderGrid();
        setupFilters();
        setupLightboxControls();
    } catch (err) {
        console.error('Failed to load gallery items:', err);
    }
}

// Render Hanging Conveyor (Infinite Loop Right to Left)
function renderConveyor() {
    const track = document.getElementById('conveyor-track');
    if (!track || !galleryData.length) return;

    // Pick a curated selection of 12 top highlight cards for the chain
    const highlights = galleryData.slice(0, 12);
    // Duplicate for seamless infinite marquee loop
    const loopItems = [...highlights, ...highlights];

    track.innerHTML = loopItems.map((item, index) => {
        const swayClass = `sway-${(index % 3) + 1}`;
        return `
            <div class="hanging-card-wrapper ${swayClass}" onclick="openLightboxById('${item.id}')">
                <div class="metal-hanger">
                    <div class="hanger-link"></div>
                    <div class="hanger-link"></div>
                </div>
                <div class="hanging-card group">
                    <div class="relative h-44 overflow-hidden bg-black/40">
                        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-[#111218] via-transparent to-transparent"></div>
                        <span class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md">
                            ${item.badge}
                        </span>
                    </div>
                    <div class="p-3.5">
                        <h4 class="text-white font-bold text-sm leading-snug line-clamp-1 mb-1 group-hover:text-blue-400 transition-colors">
                            ${item.title}
                        </h4>
                        <p class="text-gray-300 text-xs font-light leading-relaxed line-clamp-2">
                            ${item.caption}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Render Structured Grid below the Chain
function renderGrid() {
    const grid = document.getElementById('milestone-grid');
    const countDisplay = document.getElementById('milestone-count');
    if (!grid) return;

    if (countDisplay) {
        countDisplay.textContent = `${filteredItems.length} Milestones`;
    }

    if (!filteredItems.length) {
        grid.innerHTML = `
            <div class="col-span-full py-16 text-center text-gray-400 font-light">
                No milestones found in this category.
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredItems.map((item, index) => {
        return `
            <div class="milestone-grid-card group cursor-pointer" onclick="openLightboxById('${item.id}')">
                <div class="relative h-56 overflow-hidden bg-black/30">
                    <img src="${item.image}" alt="${item.title}" class="milestone-img w-full h-full object-cover" loading="lazy">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#0f1016] via-transparent to-transparent"></div>
                    <div class="absolute top-3 left-3 flex items-center gap-2">
                        <span class="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                            ${item.badge}
                        </span>
                    </div>
                    <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span class="p-2 rounded-full bg-blue-600/90 text-white text-xs flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </span>
                    </div>
                </div>
                <div class="p-5">
                    <h3 class="text-white font-bold text-base mb-2 group-hover:text-cyan-400 transition-colors">
                        ${item.title}
                    </h3>
                    <p class="text-gray-300 text-xs sm:text-sm font-light leading-relaxed">
                        ${item.caption}
                    </p>
                </div>
            </div>
        `;
    }).join('');
}

// Category Filter Handling
function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            if (category === 'all') {
                filteredItems = [...galleryData];
            } else {
                filteredItems = galleryData.filter(item => item.category.toLowerCase() === category.toLowerCase());
            }
            renderGrid();
        });
    });
}

// Lightbox Modal Controls
function openLightboxById(id) {
    const index = galleryData.findIndex(item => item.id === id);
    if (index !== -1) {
        currentLightboxIndex = index;
        updateLightboxContent();
        const modal = document.getElementById('gallery-lightbox');
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
}

function updateLightboxContent() {
    const item = galleryData[currentLightboxIndex];
    if (!item) return;

    document.getElementById('lightbox-img').src = item.image;
    document.getElementById('lightbox-badge').textContent = item.badge;
    document.getElementById('lightbox-title').textContent = item.title;
    document.getElementById('lightbox-caption').textContent = item.caption;
    document.getElementById('lightbox-counter').textContent = `${currentLightboxIndex + 1} / ${galleryData.length}`;
}

function closeLightbox() {
    const modal = document.getElementById('gallery-lightbox');
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

function nextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryData.length;
    updateLightboxContent();
}

function prevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
}

function setupLightboxControls() {
    // Backdrop click
    const modal = document.getElementById('gallery-lightbox');
    if (!modal) return;

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('lightbox-backdrop')) {
            closeLightbox();
        }
    });

    // Keyboard keys
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
    });
}

document.addEventListener('DOMContentLoaded', initGallery);
