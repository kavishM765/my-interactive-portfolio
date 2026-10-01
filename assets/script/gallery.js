// ════════════════════════════════════════════════════════════════════
// Gallery Controller: Realistic Interlocking Chain Conveyor & Lightbox
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
    renderConveyor();
    renderGrid();
    setupFilters();
    setupLightboxControls();
}

// Render Realistic Interlocking Chain Conveyor (Flows smoothly Right to Left)
function renderConveyor() {
    const track = document.getElementById('conveyor-track');
    if (!track || !galleryData.length) return;

    // Pick 12 top highlight cards for the hanging chain
    const highlights = galleryData.slice(0, 12);
    // Duplicate for seamless infinite loop
    const loopItems = [...highlights, ...highlights];

    track.innerHTML = loopItems.map((item, index) => {
        const swayClass = `sway-${(index % 3) + 1}`;
        const isPriority = index < 4;
        const loadingAttr = isPriority ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';

        return `
            <div class="chain-unit">
                <!-- Overhead Interlocking Chain Segment Moving In Unison with the Card -->
                <div class="horizontal-chain-segment">
                    <svg class="svg-link-horiz" viewBox="0 0 38 18">
                        <rect x="1.5" y="1.5" width="35" height="15" rx="7.5" fill="url(#steelGradH)" stroke="#18181b" stroke-width="1.5"/>
                        <rect x="9" y="5.5" width="20" height="7" rx="3.5" fill="#0a0a0c" stroke="#27272a" stroke-width="1"/>
                        <path d="M6 4.5 Q19 2.5 32 4.5" stroke="rgba(255,255,255,0.7)" stroke-width="1.2" stroke-linecap="round"/>
                    </svg>
                    <svg class="svg-link-vert" viewBox="0 0 12 24">
                        <rect x="1.5" y="1.5" width="9" height="21" rx="4.5" fill="url(#steelGradV)" stroke="#18181b" stroke-width="1.5"/>
                        <path d="M4 3 L4 21" stroke="rgba(255,255,255,0.65)" stroke-width="1.2"/>
                    </svg>
                    <svg class="svg-link-horiz" viewBox="0 0 38 18">
                        <rect x="1.5" y="1.5" width="35" height="15" rx="7.5" fill="url(#steelGradH)" stroke="#18181b" stroke-width="1.5"/>
                        <rect x="9" y="5.5" width="20" height="7" rx="3.5" fill="#0a0a0c" stroke="#27272a" stroke-width="1"/>
                        <path d="M6 4.5 Q19 2.5 32 4.5" stroke="rgba(255,255,255,0.7)" stroke-width="1.2" stroke-linecap="round"/>
                    </svg>
                    <svg class="svg-link-vert" viewBox="0 0 12 24">
                        <rect x="1.5" y="1.5" width="9" height="21" rx="4.5" fill="url(#steelGradV)" stroke="#18181b" stroke-width="1.5"/>
                        <path d="M4 3 L4 21" stroke="rgba(255,255,255,0.65)" stroke-width="1.2"/>
                    </svg>
                    <svg class="svg-link-horiz" viewBox="0 0 38 18">
                        <rect x="1.5" y="1.5" width="35" height="15" rx="7.5" fill="url(#steelGradH)" stroke="#18181b" stroke-width="1.5"/>
                        <rect x="9" y="5.5" width="20" height="7" rx="3.5" fill="#0a0a0c" stroke="#27272a" stroke-width="1"/>
                        <path d="M6 4.5 Q19 2.5 32 4.5" stroke="rgba(255,255,255,0.7)" stroke-width="1.2" stroke-linecap="round"/>
                    </svg>
                </div>

                <!-- Hanging Card Assembly with Pendulum Sway -->
                <div class="hanging-card-wrapper ${swayClass}" onclick="openLightboxById('${item.id}')">
                    <!-- Twin Vertical Dropper Chains Hooked to Card -->
                    <div class="vertical-dropper-system">
                        <div class="drop-chain">
                            <svg class="drop-link-v" viewBox="0 0 10 18"><rect x="1" y="1" width="8" height="16" rx="4" fill="url(#steelGradV)" stroke="#18181b" stroke-width="1"/><path d="M3.5 2.5 L3.5 15.5" stroke="rgba(255,255,255,0.6)" stroke-width="0.8"/></svg>
                            <svg class="drop-link-h" viewBox="0 0 16 10"><rect x="1" y="1" width="14" height="8" rx="4" fill="url(#steelGradH)" stroke="#18181b" stroke-width="1"/><rect x="4.5" y="3" width="7" height="4" rx="2" fill="#0a0a0c"/></svg>
                            <svg class="drop-link-v" viewBox="0 0 10 18"><rect x="1" y="1" width="8" height="16" rx="4" fill="url(#steelGradV)" stroke="#18181b" stroke-width="1"/><path d="M3.5 2.5 L3.5 15.5" stroke="rgba(255,255,255,0.6)" stroke-width="0.8"/></svg>
                            <svg class="steel-carabiner" viewBox="0 0 14 12"><path d="M2 1 H12 V11 H2 Z" fill="#71717a" stroke="#18181b" stroke-width="1"/><circle cx="7" cy="6" r="2.2" fill="#f4f4f5"/></svg>
                        </div>
                        <div class="drop-chain">
                            <svg class="drop-link-v" viewBox="0 0 10 18"><rect x="1" y="1" width="8" height="16" rx="4" fill="url(#steelGradV)" stroke="#18181b" stroke-width="1"/><path d="M3.5 2.5 L3.5 15.5" stroke="rgba(255,255,255,0.6)" stroke-width="0.8"/></svg>
                            <svg class="drop-link-h" viewBox="0 0 16 10"><rect x="1" y="1" width="14" height="8" rx="4" fill="url(#steelGradH)" stroke="#18181b" stroke-width="1"/><rect x="4.5" y="3" width="7" height="4" rx="2" fill="#0a0a0c"/></svg>
                            <svg class="drop-link-v" viewBox="0 0 10 18"><rect x="1" y="1" width="8" height="16" rx="4" fill="url(#steelGradV)" stroke="#18181b" stroke-width="1"/><path d="M3.5 2.5 L3.5 15.5" stroke="rgba(255,255,255,0.6)" stroke-width="0.8"/></svg>
                            <svg class="steel-carabiner" viewBox="0 0 14 12"><path d="M2 1 H12 V11 H2 Z" fill="#71717a" stroke="#18181b" stroke-width="1"/><circle cx="7" cy="6" r="2.2" fill="#f4f4f5"/></svg>
                        </div>
                    </div>

                    <!-- Photo Card -->
                    <div class="hanging-card group">
                        <div class="relative h-44 overflow-hidden bg-[#161822]">
                            <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" ${loadingAttr}>
                            <div class="absolute inset-0 bg-gradient-to-t from-[#111218] via-transparent to-transparent"></div>
                            <span class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md">
                                ${item.badge}
                            </span>
                        </div>
                        <div class="p-3.5 bg-[#111218]">
                            <h4 class="text-white font-bold text-sm leading-snug line-clamp-1 mb-1 group-hover:text-blue-400 transition-colors">
                                ${item.title}
                            </h4>
                            <p class="text-gray-300 text-xs font-light leading-relaxed line-clamp-2">
                                ${item.caption}
                            </p>
                        </div>
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
                <div class="relative h-56 overflow-hidden bg-[#14151e]">
                    <img src="${item.image}" alt="${item.title}" class="milestone-img w-full h-full object-cover" loading="lazy" decoding="async">
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
