// ════════════════════════════════════════════════════════════════════
// Gallery Controller: 3D Chain Dynamics & Dual-Point Suspension Conveyor
// ════════════════════════════════════════════════════════════════════

let galleryData = window.EMBEDDED_GALLERY_DATA || [];
let currentLightboxIndex = 0;
let filteredItems = [];

// Initialize immediately or fetch if not embedded
async function initGallery() {
    if (!galleryData.length) {
        try {
            const response = await fetch('./assets/data/gallery.json');
            galleryData = await response.json();
        } catch (err) {
            console.error('Failed to load gallery items:', err);
        }
    }

    filteredItems = [...galleryData];
    renderMomentsStream();
    renderGrid();
    setupFilters();
    setupLightboxControls();
}

// Render Clean Horizontal Moving Stream of Pictures with Attached Bottom Cards
function renderMomentsStream() {
    const track = document.getElementById('moments-stream-track');
    if (!track || !galleryData.length) return;

    // Pick top milestone photos for the continuous moving stream
    const highlights = galleryData.slice(0, 12);
    // Duplicate for seamless, uninterrupted infinite glide
    const loopItems = [...highlights, ...highlights];

    track.innerHTML = loopItems.map((item, index) => {
        const isPriority = index < 4;
        const loadingAttr = isPriority ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';

        return `
            <div class="moment-card-unit" onclick="openLightboxById('${item.id}')">
                <!-- Photo Container -->
                <div class="moment-photo-box">
                    <img src="${item.image}" alt="${item.title}" ${loadingAttr}>
                    <span class="moment-overlay-badge">
                        ${item.badge}
                    </span>
                </div>

                <!-- Attached Info Card Below -->
                <div class="moment-attached-info">
                    <span class="moment-category-pill">${item.category}</span>
                    <h4 class="moment-title" title="${item.title}">
                        ${item.title}
                    </h4>
                    <p class="moment-caption">
                        ${item.caption}
                    </p>
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
            <div class="col-span-full py-16 text-center text-slate-400 font-light">
                No milestones found in this category.
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredItems.map((item, index) => {
        return `
            <div class="milestone-grid-card group cursor-pointer" onclick="openLightboxById('${item.id}')">
                <div class="relative h-56 overflow-hidden bg-slate-100">
                    <img src="${item.image}" alt="${item.title}" class="milestone-img w-full h-full object-cover" loading="lazy" decoding="async">
                    <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                    <div class="absolute top-3 left-3 flex items-center gap-2">
                        <span class="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase bg-slate-900/75 text-white border border-white/20 backdrop-blur-md">
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
                    <h3 class="text-slate-900 font-bold text-base mb-2 group-hover:text-blue-600 transition-colors">
                        ${item.title}
                    </h3>
                    <p class="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
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
    const modal = document.getElementById('gallery-lightbox');
    if (!modal) return;

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('lightbox-backdrop')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
    });
}

document.addEventListener('DOMContentLoaded', initGallery);
