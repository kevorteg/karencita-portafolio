// Photography Section

function epath(raw) {
    return raw.split('/').map(seg => encodeURIComponent(seg)).join('/');
}

const photoCategories = [
    {
        id: 'corporativas',
        label: 'Corporativas',
        icon: 'briefcase',
        description: 'Precision y sobriedad para empresas y organizaciones.',
        cover: 'assets/Fotografia/FOTOGRAFIA/corporativas/DSC_0467.jpg',
        images: [
            'assets/Fotografia/FOTOGRAFIA/corporativas/DSC_0467.jpg',
            'assets/Fotografia/FOTOGRAFIA/corporativas/DSC_0482.jpg',
            'assets/Fotografia/FOTOGRAFIA/corporativas/DSC_0483.jpg',
            'assets/Fotografia/FOTOGRAFIA/corporativas/DSC_0491.jpg',
            'assets/Fotografia/FOTOGRAFIA/corporativas/DSC_0497.jpg',
            'assets/Fotografia/FOTOGRAFIA/corporativas/DSC_0501.jpg',
            'assets/Fotografia/FOTOGRAFIA/corporativas/DSC_0505.jpg',
            'assets/Fotografia/FOTOGRAFIA/corporativas/DSC_0509.jpg',
            'assets/Fotografia/FOTOGRAFIA/corporativas/DSC_0511.jpg',
        ]
    },
    {
        id: 'quinceaneros',
        label: 'Quince Anos',
        icon: 'sparkles',
        description: 'La energia emocional de un momento irrepetible.',
        cover: 'assets/Fotografia/FOTOGRAFIA/15 AÑOS/DSC_0022.jpg',
        images: [
            'assets/Fotografia/FOTOGRAFIA/15 AÑOS/1.jpg',
            'assets/Fotografia/FOTOGRAFIA/15 AÑOS/DSC_0022.jpg',
            'assets/Fotografia/FOTOGRAFIA/15 AÑOS/DSC_0027.jpg',
            'assets/Fotografia/FOTOGRAFIA/15 AÑOS/DSC_0030.jpg',
            'assets/Fotografia/FOTOGRAFIA/15 AÑOS/DSC_0040.jpg',
            'assets/Fotografia/FOTOGRAFIA/15 AÑOS/DSC_0043.jpg',
            'assets/Fotografia/FOTOGRAFIA/15 AÑOS/DSC_0048.jpg',
            'assets/Fotografia/FOTOGRAFIA/15 AÑOS/DSC_0059.jpg',
            'assets/Fotografia/FOTOGRAFIA/15 AÑOS/DSC_0066.jpg',
        ]
    },
    {
        id: 'paisajes',
        label: 'Paisajes & Viajes',
        icon: 'map-pin',
        description: 'La paciencia de esperar la luz perfecta en cada horizonte.',
        cover: 'assets/Fotografia/FOTOGRAFIA/PAISAJES Y VIAJES/DSC_0005.jpg',
        images: [
            'assets/Fotografia/FOTOGRAFIA/PAISAJES Y VIAJES/DSC_0005.jpg',
            'assets/Fotografia/FOTOGRAFIA/PAISAJES Y VIAJES/DSC_0018.jpg',
            'assets/Fotografia/FOTOGRAFIA/PAISAJES Y VIAJES/DSC_0019.jpg',
            'assets/Fotografia/FOTOGRAFIA/PAISAJES Y VIAJES/DSC_0022.jpg',
            'assets/Fotografia/FOTOGRAFIA/PAISAJES Y VIAJES/DSC_0025.jpg',
            'assets/Fotografia/FOTOGRAFIA/PAISAJES Y VIAJES/DSC_0028.jpg',
            'assets/Fotografia/FOTOGRAFIA/PAISAJES Y VIAJES/DSC_0034.jpg',
            'assets/Fotografia/FOTOGRAFIA/PAISAJES Y VIAJES/DSC_0047.jpg',
            'assets/Fotografia/FOTOGRAFIA/PAISAJES Y VIAJES/DSC_0050.jpg',
        ]
    },
    {
        id: 'salsa',
        label: 'Salsa & Cultura',
        icon: 'music',
        description: 'El ritmo capturado en un instante.',
        cover: 'assets/Fotografia/FOTOGRAFIA/SALSA/_DSC0014.JPG',
        images: [
            'assets/Fotografia/FOTOGRAFIA/SALSA/_DSC0014.JPG',
            'assets/Fotografia/FOTOGRAFIA/SALSA/_DSC0025.JPG',
            'assets/Fotografia/FOTOGRAFIA/SALSA/_DSC0045.JPG',
            'assets/Fotografia/FOTOGRAFIA/SALSA/_DSC0055.JPG',
            'assets/Fotografia/FOTOGRAFIA/SALSA/_DSC0082.JPG',
            'assets/Fotografia/FOTOGRAFIA/SALSA/_DSC0084.JPG',
            'assets/Fotografia/FOTOGRAFIA/SALSA/_DSC0094.JPG',
            'assets/Fotografia/FOTOGRAFIA/SALSA/_DSC0112.JPG',
        ]
    },
];

let activePhotoCategory = 'corporativas';

function ensurePhotoModal() {
    if (document.getElementById('photo-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'photo-modal';
    modal.style.cssText = `
        display:none; position:fixed; inset:0; z-index:9999;
        align-items:center; justify-content:center;
        background:rgba(0,0,0,0.96); backdrop-filter:blur(10px);
    `;
    modal.innerHTML = `
        <button onclick="closePhotoModal()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:50%;width:36px;height:36px;color:white;cursor:pointer;font-size:16px;z-index:10;display:flex;align-items:center;justify-content:center;">✕</button>
        <img id="photo-modal-img" src="" style="max-width:90vw;max-height:90vh;object-fit:contain;border-radius:12px;box-shadow:0 30px 80px rgba(0,0,0,0.9);">
    `;
    modal.addEventListener('click', e => { if (e.target === modal) closePhotoModal(); });
    document.body.appendChild(modal);

    window.openPhotoModal = function (src) {
        const modal = document.getElementById('photo-modal');
        document.getElementById('photo-modal-img').src = epath(src);
        modal.style.display = 'flex';
    };
    window.closePhotoModal = function () {
        document.getElementById('photo-modal').style.display = 'none';
    };
}

function buildPhotoGrid(categoryId) {
    const cat = photoCategories.find(c => c.id === categoryId);
    if (!cat) return '';
    return cat.images.map((src, i) => `
        <div
            class="relative group cursor-zoom-in overflow-hidden rounded-xl"
            onclick="openPhotoModal('${src.replace(/'/g, "\\'")}')"
        >
            <img
                src="${epath(src)}"
                alt="${cat.label} ${i + 1}"
                loading="lazy"
                class="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105"
                onerror="this.parentElement.style.display='none';"
            >
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end justify-end p-3">
                <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                    <i data-lucide="zoom-in" class="w-5 h-5 text-white"></i>
                </div>
            </div>
        </div>
    `).join('');
}

window.switchPhotoCategory = function (catId) {
    activePhotoCategory = catId;

    // Update tabs
    photoCategories.forEach(c => {
        const btn = document.getElementById(`photo-tab-${c.id}`);
        if (!btn) return;
        if (c.id === catId) {
            btn.style.background = '#7C3AED';
            btn.style.color = 'white';
            btn.style.borderColor = '#7C3AED';
            btn.classList.remove('opacity-50');
        } else {
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = 'rgba(99,86,255,0.2)';
            btn.classList.add('opacity-50');
        }
    });

    // Update grid
    const grid = document.getElementById('photo-grid');
    if (grid) {
        grid.innerHTML = buildPhotoGrid(catId);
        if (window.lucide) window.lucide.createIcons();
    }

    // Update description
    const descEl = document.getElementById('photo-cat-desc');
    const cat = photoCategories.find(c => c.id === catId);
    if (descEl && cat) descEl.textContent = cat.description;
};

export function renderPhotographySection(container, themePanel, themeBorder) {
    ensurePhotoModal();

    const html = `
        <!-- INTRO -->
        <div class="mb-14">
            <div class="flex items-center gap-3 mb-6">
                <div class="h-[1px] w-8 bg-violet-600"></div>
                <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-600">Observacion & Tecnica</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                <div>
                    <h2 class="text-3xl md:text-4xl font-serif italic leading-tight mb-6">
                        Capturar la esencia<br><em>del momento.</em>
                    </h2>
                    <p class="text-sm leading-relaxed opacity-65">
                        Mi aproximacion a la fotografia es una extension de mi capacidad de observacion y adaptabilidad. He navegado por diversos escenarios: desde la precision y sobriedad de eventos corporativos y academicos, hasta la energia emocional de celebraciones sociales como los Quince Anos.
                    </p>
                </div>
                <div class="${themePanel} border ${themeBorder} rounded-2xl p-7">
                    <p class="text-[11px] font-black uppercase tracking-[0.25em] text-violet-600 mb-4">Disciplina & Vision</p>
                    <p class="text-sm leading-relaxed opacity-65">
                        En cada proyecto, mi objetivo es el mismo: capturar la esencia del momento con una tecnica impecable. Mi experiencia en fotografia de paisaje y viajes me ha dado la paciencia para esperar la luz perfecta, una disciplina que traslado a cada encargo profesional para garantizar resultados que no solo registran, sino que comunican.
                    </p>
                    <div class="mt-6 flex flex-wrap gap-2">
                        ${['Corporativa', 'Retrato', 'Paisaje', 'Eventos', 'Luz Natural'].map(t => `
                            <span class="px-3 py-1 border border-violet-300/30 text-violet-400 rounded-full text-[9px] font-bold uppercase tracking-wider">${t}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <!-- CATEGORY COVERS ROW -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            ${photoCategories.map(cat => `
                <div
                    class="relative cursor-pointer group overflow-hidden rounded-2xl"
                    onclick="switchPhotoCategory('${cat.id}')"
                    style="aspect-ratio:3/4;"
                >
                    <img
                        src="${epath(cat.cover)}"
                        alt="${cat.label}"
                        loading="lazy"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-4">
                        <p class="text-white font-bold text-sm leading-tight">${cat.label}</p>
                        <p class="text-white/50 text-[9px] uppercase tracking-widest mt-1">${cat.images.length} fotos</p>
                    </div>
                    <!-- Selected highlight -->
                    <div id="photo-cover-ring-${cat.id}" class="absolute inset-0 border-2 border-transparent group-hover:border-violet-500 transition-all rounded-2xl pointer-events-none"></div>
                </div>
            `).join('')}
        </div>

        <!-- TABS -->
        <div class="flex items-center gap-2 mb-2 overflow-x-auto pb-1" style="scrollbar-width:none;">
            ${photoCategories.map((cat, i) => `
                <button
                    id="photo-tab-${cat.id}"
                    onclick="switchPhotoCategory('${cat.id}')"
                    class="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all"
                    style="${i === 0 ? 'background:#7C3AED;color:white;border-color:#7C3AED;' : 'border-color:rgba(99,86,255,0.2);'}"
                    ${i !== 0 ? 'class="opacity-50"' : ''}
                >
                    <i data-lucide="${cat.icon}" class="w-3 h-3"></i>
                    ${cat.label}
                </button>
            `).join('')}
        </div>
        <p id="photo-cat-desc" class="text-[11px] opacity-40 mb-6 mt-2">${photoCategories[0].description}</p>

        <!-- PHOTO GRID -->
        <div id="photo-grid" class="grid grid-cols-3 gap-2 mb-24">
            ${buildPhotoGrid('corporativas')}
        </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
}
