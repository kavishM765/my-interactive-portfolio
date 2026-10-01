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
    render3DConveyor();
    renderGrid();
    setupFilters();
    setupLightboxControls();
}

// Render 3D Interlocking Oblong Chains with Dual-Point Suspension (Right to Left)
function render3DConveyor() {
    const track = document.getElementById('conveyor-track');
    if (!track || !galleryData.length) return;

    // Pick top highlight cards for the moving chain
    const highlights = galleryData.slice(0, 12);
    // Duplicate for seamless infinite loop
    const loopItems = [...highlights, ...highlights];

    track.innerHTML = loopItems.map((item, index) => {
        const swayClass = `sway-${(index % 3) + 1}`;
        const isPriority = index < 4;
        const loadingAttr = isPriority ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';

        return `
            <div class="chain-rig-unit ${swayClass}">
                
                <!-- Overhead Interlocking Chain Segment with Industrial Trolley Slider Blocks -->
                <svg class="top-chain-svg" viewBox="0 0 320 32">
                    <!-- Slider Trolley Mounts directly on rail -->
                    <rect x="34" y="0" width="22" height="12" rx="2" fill="#2d4253" stroke="#5f7a90" stroke-width="1.5" />
                    <rect x="264" y="0" width="22" height="12" rx="2" fill="#2d4253" stroke="#5f7a90" stroke-width="1.5" />

                    <!-- Oblong Chain Links Interlocking Horizontally Across Rail -->
                    <g filter="url(#chainShadow)">
                        <!-- Link 1 (Face) -->
                        <rect x="2" y="6" width="38" height="20" rx="10" fill="none" stroke="url(#metal3D_Horiz)" stroke-width="5"/>
                        <!-- Link 2 (Side Profile) -->
                        <rect x="32" y="5" width="13" height="22" rx="6.5" fill="none" stroke="url(#metal3D_Profile)" stroke-width="4.8"/>
                        <!-- Link 3 (Face - Left Drop Anchor) -->
                        <rect x="38" y="6" width="38" height="20" rx="10" fill="none" stroke="url(#metal3D_Horiz)" stroke-width="5"/>
                        <!-- Link 4 (Side Profile) -->
                        <rect x="68" y="5" width="13" height="22" rx="6.5" fill="none" stroke="url(#metal3D_Profile)" stroke-width="4.8"/>
                        <!-- Link 5 (Face) -->
                        <rect x="74" y="6" width="38" height="20" rx="10" fill="none" stroke="url(#metal3D_Horiz)" stroke-width="5"/>
                        <!-- Link 6 (Side Profile) -->
                        <rect x="104" y="5" width="13" height="22" rx="6.5" fill="none" stroke="url(#metal3D_Profile)" stroke-width="4.8"/>
                        <!-- Link 7 (Face) -->
                        <rect x="110" y="6" width="38" height="20" rx="10" fill="none" stroke="url(#metal3D_Horiz)" stroke-width="5"/>
                        <!-- Link 8 (Side Profile) -->
                        <rect x="140" y="5" width="13" height="22" rx="6.5" fill="none" stroke="url(#metal3D_Profile)" stroke-width="4.8"/>
                        <!-- Link 9 (Face) -->
                        <rect x="146" y="6" width="38" height="20" rx="10" fill="none" stroke="url(#metal3D_Horiz)" stroke-width="5"/>
                        <!-- Link 10 (Side Profile) -->
                        <rect x="176" y="5" width="13" height="22" rx="6.5" fill="none" stroke="url(#metal3D_Profile)" stroke-width="4.8"/>
                        <!-- Link 11 (Face) -->
                        <rect x="182" y="6" width="38" height="20" rx="10" fill="none" stroke="url(#metal3D_Horiz)" stroke-width="5"/>
                        <!-- Link 12 (Side Profile) -->
                        <rect x="212" y="5" width="13" height="22" rx="6.5" fill="none" stroke="url(#metal3D_Profile)" stroke-width="4.8"/>
                        <!-- Link 13 (Face) -->
                        <rect x="218" y="6" width="38" height="20" rx="10" fill="none" stroke="url(#metal3D_Horiz)" stroke-width="5"/>
                        <!-- Link 14 (Side Profile) -->
                        <rect x="248" y="5" width="13" height="22" rx="6.5" fill="none" stroke="url(#metal3D_Profile)" stroke-width="4.8"/>
                        <!-- Link 15 (Face - Right Drop Anchor) -->
                        <rect x="254" y="6" width="38" height="20" rx="10" fill="none" stroke="url(#metal3D_Horiz)" stroke-width="5"/>
                        <!-- Link 16 (Side Profile) -->
                        <rect x="284" y="5" width="13" height="22" rx="6.5" fill="none" stroke="url(#metal3D_Profile)" stroke-width="4.8"/>
                    </g>
                </svg>

                <!-- Dual-Point Suspension Drop Chains (Left & Right) -->
                <div class="dual-drop-chains">
                    <!-- Left Vertical Drop Chain (6 Interlocking Links) -->
                    <svg class="drop-chain-svg" viewBox="0 0 24 96" filter="url(#chainShadow)">
                        <rect x="2" y="2" width="20" height="24" rx="10" fill="none" stroke="url(#metal3D_Face)" stroke-width="5"/>
                        <rect x="7.5" y="14" width="9" height="24" rx="4.5" fill="none" stroke="url(#metal3D_Profile)" stroke-width="4.5"/>
                        <rect x="2" y="26" width="20" height="24" rx="10" fill="none" stroke="url(#metal3D_Face)" stroke-width="5"/>
                        <rect x="7.5" y="38" width="9" height="24" rx="4.5" fill="none" stroke="url(#metal3D_Profile)" stroke-width="4.5"/>
                        <rect x="2" y="50" width="20" height="24" rx="10" fill="none" stroke="url(#metal3D_Face)" stroke-width="5"/>
                        <rect x="7.5" y="62" width="9" height="26" rx="4.5" fill="none" stroke="url(#metal3D_Profile)" stroke-width="4.5"/>
                    </svg>

                    <!-- Right Vertical Drop Chain (6 Interlocking Links) -->
                    <svg class="drop-chain-svg" viewBox="0 0 24 96" filter="url(#chainShadow)">
                        <rect x="2" y="2" width="20" height="24" rx="10" fill="none" stroke="url(#metal3D_Face)" stroke-width="5"/>
                        <rect x="7.5" y="14" width="9" height="24" rx="4.5" fill="none" stroke="url(#metal3D_Profile)" stroke-width="4.5"/>
                        <rect x="2" y="26" width="20" height="24" rx="10" fill="none" stroke="url(#metal3D_Face)" stroke-width="5"/>
                        <rect x="7.5" y="38" width="9" height="24" rx="4.5" fill="none" stroke="url(#metal3D_Profile)" stroke-width="4.5"/>
                        <rect x="2" y="50" width="20" height="24" rx="10" fill="none" stroke="url(#metal3D_Face)" stroke-width="5"/>
                        <rect x="7.5" y="62" width="9" height="26" rx="4.5" fill="none" stroke="url(#metal3D_Profile)" stroke-width="4.5"/>
                    </svg>
                </div>

                <!-- Suspended Photo Card with Dual Metal Grommets -->
                <div class="suspended-photo-card group" onclick="openLightboxById('${item.id}')">
                    <!-- Metal Eyelet Grommets where chains feed into the card -->
                    <div class="card-grommet-left"></div>
                    <div class="card-grommet-right"></div>

                    <!-- Photo Container -->
                    <div class="relative h-44 overflow-hidden bg-[#161822]">
                        <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" ${loadingAttr}>
                        <div class="absolute inset-0 bg-gradient-to-t from-[#10121a] via-transparent to-transparent"></div>
                        <span class="absolute top-2.5 left-14 px-2.5 py-1 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                            ${item.badge}
                        </span>
                    </div>

                    <!-- Details: Title & Simple One-Line Description -->
                    <div class="p-3.5 bg-[#10121a]">
                        <h4 class="text-white font-bold text-sm leading-snug line-clamp-1 mb-1 group-hover:text-cyan-400 transition-colors">
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
