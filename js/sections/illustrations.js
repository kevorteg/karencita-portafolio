// Illustrations Section

function epath(raw) {
    return raw.split('/').map(seg => encodeURIComponent(seg)).join('/');
}

const illustrations = [
    {
        src: 'assets/Ilustraciones/Fotos/tumblr_ab7fcbb7b279c774670206de88ec5057_47250c7b_1280.jpg',
        label: 'Línea Narrativa',
        tag: 'Arte Digital'
    },
    {
        src: 'assets/Ilustraciones/Fotos/tumblr_5f5ea6663ead49e4953e4b2f5d9ab675_5c83ab7f_2048.jpg',
        label: 'Contraste Lumínico',
        tag: 'Minimalismo'
    },
    {
        src: 'assets/Ilustraciones/Fotos/tumblr_939516e22b585fca5cc309bf037c11f5_608c2ef6_2048.jpg',
        label: 'Trazo Orgánico',
        tag: 'Ilustración Digital'
    },
    {
        src: 'assets/Ilustraciones/Fotos/PORTADA ESCUELA SEMBRANDO ESTRELLAS_Mesa de trabajo 1.jpg',
        label: 'Identidad Visual',
        tag: 'Branding'
    },
];

const illustrationVideos = [
    { id: 'Jau4wpSdyRY', label: 'Proceso Creativo', tag: 'Edición & Motion' },
];

function ensureIllustrationModal() {
    if (document.getElementById('ill-modal')) return;

    // IMAGE MODAL
    const modal = document.createElement('div');
    modal.id = 'ill-modal';
    modal.style.cssText = `
        display:none; position:fixed; inset:0; z-index:9999;
        align-items:center; justify-content:center;
        background:rgba(0,0,0,0.94); backdrop-filter:blur(10px);
        cursor:zoom-out;
    `;
    modal.innerHTML = `
        <button onclick="closeIllModal()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:50%;width:36px;height:36px;color:white;cursor:pointer;font-size:16px;z-index:10;display:flex;align-items:center;justify-content:center;">✕</button>
        <img id="ill-modal-img" src="" style="max-width:90vw;max-height:90vh;object-fit:contain;border-radius:12px;box-shadow:0 30px 80px rgba(0,0,0,0.8);">
    `;
    modal.addEventListener('click', e => { if (e.target === modal) closeIllModal(); });
    document.body.appendChild(modal);

    // VIDEO MODAL
    const vModal = document.createElement('div');
    vModal.id = 'ill-video-modal';
    vModal.style.cssText = `
        display:none; position:fixed; inset:0; z-index:9999;
        align-items:center; justify-content:center;
        background:rgba(0,0,0,0.95); backdrop-filter:blur(12px);
        cursor:zoom-out;
    `;
    vModal.innerHTML = `
        <button onclick="closeIllVideoModal()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:50%;width:36px;height:36px;color:white;cursor:pointer;font-size:16px;z-index:10;display:flex;align-items:center;justify-content:center;">✕</button>
        <div id="ill-video-content" style="width:min(380px,90vw);aspect-ratio:9/16;border-radius:20px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,0.8);"></div>
    `;
    vModal.addEventListener('click', e => { if (e.target === vModal) closeIllVideoModal(); });
    document.body.appendChild(vModal);

    window.openIllModal = function (src) {
        const modal = document.getElementById('ill-modal');
        document.getElementById('ill-modal-img').src = epath(src);
        modal.style.display = 'flex';
    };
    window.closeIllModal = function () {
        document.getElementById('ill-modal').style.display = 'none';
    };
    window.openIllVideoModal = function (ytId) {
        const modal = document.getElementById('ill-video-modal');
        const content = document.getElementById('ill-video-content');
        content.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:100%;"></iframe>`;
        modal.style.display = 'flex';
    };
    window.closeIllVideoModal = function () {
        const modal = document.getElementById('ill-video-modal');
        const content = document.getElementById('ill-video-content');
        if (modal) { modal.style.display = 'none'; content.innerHTML = ''; }
    };
}

export function renderIllustrationsSection(container, themePanel, themeBorder) {
    ensureIllustrationModal();

    const html = `
        <!-- INTRO -->
        <div class="mb-14">
            <div class="flex items-center gap-3 mb-6">
                <div class="h-[1px] w-8 bg-violet-600"></div>
                <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-600">Filosofia Visual</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                <div>
                    <h2 class="text-3xl md:text-4xl font-serif italic leading-tight mb-6">
                        El trazo como<br><em>lenguaje propio.</em>
                    </h2>
                    <p class="text-sm leading-relaxed opacity-65">
                        Mi propuesta visual se fundamenta en la sintesis de la linea como unidad narrativa. Entiendo cada trazo no como un limite, sino como una historia individual que, al entrelazarse, compone mi esencia creativa. Bajo una estetica ilustrativa y minimalista, exploro las posibilidades del arte digital para dar vida a composiciones donde el manejo de la luz es el protagonista.
                    </p>
                </div>
                <div class="${themePanel} border ${themeBorder} rounded-2xl p-7">
                    <p class="text-[11px] font-black uppercase tracking-[0.25em] text-violet-600 mb-4">Proceso Creativo</p>
                    <p class="text-sm leading-relaxed opacity-65">
                        Como creativo, mi huella personal se define por el uso estrategico de la linea organica y el dominio del contraste luminico en entornos digitales. Mi estilo se caracteriza por una economia de elementos que busca el maximo impacto visual. Cada obra es un ejercicio de minimalismo intencionado: historias construidas a traves de trazos fluidos que emergen de la oscuridad para capturar la esencia de un concepto.
                    </p>
                    <div class="mt-6 flex flex-wrap gap-2">
                        ${['Linea Organica', 'Contraste Luminico', 'Arte Digital', 'Minimalismo', 'Identidad Visual'].map(t => `
                            <span class="px-3 py-1 border border-violet-300/30 text-violet-400 rounded-full text-[9px] font-bold uppercase tracking-wider">${t}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <!-- GALLERY GRID -->
        <div class="mb-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="h-[1px] w-8 bg-violet-600"></div>
                <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-600">Obras</span>
            </div>
        </div>

        <div class="columns-1 sm:columns-2 gap-4 space-y-4 mb-24">
            ${illustrations.map((ill, i) => `
                <div
                    class="break-inside-avoid relative group cursor-zoom-in overflow-hidden rounded-2xl"
                    onclick="openIllModal('${ill.src.replace(/'/g, "\\'")}')"
                >
                    <img
                        src="${epath(ill.src)}"
                        alt="${ill.label}"
                        loading="lazy"
                        class="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style="display:block;"
                        onerror="this.style.display='none'; this.parentElement.style.background='rgba(99,86,255,0.1)';"
                    >
                    <!-- Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-end p-5">
                        <div class="translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                            <p class="text-[9px] font-black uppercase tracking-[0.3em] text-violet-400 mb-1">${ill.tag}</p>
                            <p class="text-white font-serif italic text-lg leading-tight">${ill.label}</p>
                        </div>
                    </div>

                    <!-- Corner index -->
                    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span class="font-serif italic text-white/50 text-sm">0${i + 1}</span>
                    </div>
                </div>
            `).join('')}
        </div>

        <!-- VIDEOS SECTION -->
        <div class="mb-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="h-[1px] w-8 bg-violet-600"></div>
                <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-600">Videos & Motion</span>
            </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-24">
            ${illustrationVideos.map((vid, i) => `
                <div
                    class="relative group cursor-pointer overflow-hidden rounded-2xl"
                    style="aspect-ratio:9/16; background:#0f0c29;"
                    onclick="openIllVideoModal('${vid.id}')"
                >
                    <img
                        src="https://img.youtube.com/vi/${vid.id}/hqdefault.jpg"
                        alt="${vid.label}"
                        loading="lazy"
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-75"
                    >
                    <!-- Play button -->
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div class="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                            <i data-lucide="play" class="w-5 h-5 ml-0.5" fill="currentColor"></i>
                        </div>
                    </div>
                    <!-- Overlay info -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-end p-4">
                        <div class="translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                            <p class="text-[9px] font-black uppercase tracking-[0.3em] text-violet-400 mb-1">${vid.tag}</p>
                            <p class="text-white font-serif italic text-sm leading-tight">${vid.label}</p>
                        </div>
                    </div>
                    <!-- Corner index -->
                    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span class="font-serif italic text-white/50 text-sm">0${i + 1}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
}
