
// Social Media Section - Instagram-style UI

const brands = [
    {
        id: 'cbc',
        name: 'CBC',
        niche: 'Bebidas & Lifestyle',
        color: '#F59E0B',
        gradient: 'from-yellow-400 to-orange-500',
        avatar: 'assets/SOCIAL MEDIA/SOCIAL MEDIA/CBC/post/3 FEB.png',
        stories: [
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CBC/historias/1 MAR (1).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CBC/historias/1 MAR (2).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CBC/historias/1 MAR (3).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CBC/historias/2 MAR (1).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CBC/historias/2 MAR (2).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CBC/historias/3 MAR (1).png',
        ],
        posts: [
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CBC/post/3 FEB.png',
            { type: 'youtube', id: 'frhwYgwE8eo' },
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CBC/post/6 FEB.png',
            { type: 'youtube', id: '-P2aYx7dZ2o' },
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CBC/post/7 FEB.png',
            { type: 'youtube', id: 'nrNDX-RDj_U' },
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CBC/post/10 FEB.png',
            { type: 'youtube', id: 'IrIg2P96TDE' },
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CBC/post/13 FEB.png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CBC/post/17 FEB.png',
        ]
    },
    {
        id: 'disenamos',
        name: 'Diseñamos',
        niche: 'Moda & Educación',
        color: '#EC4899',
        gradient: 'from-pink-400 to-fuchsia-600',
        avatar: 'assets/SOCIAL MEDIA/SOCIAL MEDIA/DISEÑAMOS/historias/1 MAR (1).png',
        stories: [
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/DISEÑAMOS/historias/1 MAR (1).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/DISEÑAMOS/historias/1 MAR (2).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/DISEÑAMOS/historias/2 MAR (1).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/DISEÑAMOS/historias/3 MAR (1).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/DISEÑAMOS/historias/4 MAR (1).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/DISEÑAMOS/historias/5 MAR (1).png',
        ],
        posts: [
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/DISEÑAMOS/historias/6 MAR (1).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/DISEÑAMOS/historias/7 MAR (1).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/DISEÑAMOS/historias/8 MAR (1).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/DISEÑAMOS/historias/9 MAR (1).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/DISEÑAMOS/historias/10 MAR (1).png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/DISEÑAMOS/historias/11 MAR (1).png',
        ]
    },
    {
        id: 'cootraim',
        name: 'Cootraim',
        niche: 'Cooperativa',
        color: '#0EA5E9',
        gradient: 'from-sky-400 to-blue-600',
        avatar: 'assets/SOCIAL MEDIA/SOCIAL MEDIA/COOTRAIM/Captura de pantalla 2026-02-27 132136.png',
        stories: [
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/COOTRAIM/Captura de pantalla 2026-02-27 132136.png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/COOTRAIM/Captura de pantalla 2026-02-27 132155.png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/COOTRAIM/Captura de pantalla 2026-02-27 132213.png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/COOTRAIM/Captura de pantalla 2026-02-27 132230.png',
        ],
        posts: [
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/COOTRAIM/Captura de pantalla 2026-02-27 132136.png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/COOTRAIM/Captura de pantalla 2026-02-27 132155.png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/COOTRAIM/Captura de pantalla 2026-02-27 132213.png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/COOTRAIM/Captura de pantalla 2026-02-27 132230.png',
        ]
    },
    {
        id: 'confecoop',
        name: 'Confecoop',
        niche: 'Cooperativismo',
        color: '#10B981',
        gradient: 'from-emerald-400 to-teal-600',
        avatar: 'assets/SOCIAL MEDIA/SOCIAL MEDIA/CONFECOOP/BANNER CONFECOOP.jpg',
        stories: [
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CONFECOOP/BANNER CONFECOOP.jpg',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CONFECOOP/POST CONFECOOP 2.jpg',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CONFECOOP/VOLANTE.jpg',
        ],
        posts: [
            { type: 'youtube', id: 'jjwhMMT3iW0' },
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CONFECOOP/BANNER CONFECOOP.jpg',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CONFECOOP/POST CONFECOOP 2.jpg',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CONFECOOP/VOLANTE.jpg',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/CONFECOOP/MENÚ_Mesa de trabajo 1.png',
        ]
    },
    {
        id: 'cepeda',
        name: 'Dra. Cepeda',
        niche: 'Salud & Bienestar',
        color: '#8B5CF6',
        gradient: 'from-violet-400 to-purple-600',
        avatar: 'assets/SOCIAL MEDIA/SOCIAL MEDIA/dra. Cepeda/Captura de pantalla 2026-02-27 134010.png',
        stories: [
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/dra. Cepeda/Captura de pantalla 2026-02-27 134010.png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/dra. Cepeda/Captura de pantalla 2026-02-27 134052.png',
        ],
        posts: [
            { type: 'youtube', id: 'a83wBaZYYuw' },
            { type: 'youtube', id: 'vJe27nFcETU' },
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/dra. Cepeda/Captura de pantalla 2026-02-27 134010.png',
            { type: 'youtube', id: 't9khmslm7Y0' },
            { type: 'youtube', id: 'ayWMulaqeOY' },
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/dra. Cepeda/Captura de pantalla 2026-02-27 134052.png',
            { type: 'youtube', id: 'LF9UR0anCtM' }
        ]
    },
    {
        id: 'arias',
        name: 'Dra. Arias',
        niche: 'Salud & Dermatología',
        color: '#F43F5E',
        gradient: 'from-rose-400 to-pink-600',
        avatar: 'assets/SOCIAL MEDIA/SOCIAL MEDIA/dra. Liliana Arias/Captura de pantalla 2026-02-27 133002.png',
        stories: [
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/dra. Liliana Arias/Captura de pantalla 2026-02-27 133002.png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/dra. Liliana Arias/Captura de pantalla 2026-02-27 133043.png',
        ],
        posts: [
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/dra. Liliana Arias/Captura de pantalla 2026-02-27 133002.png',
            'assets/SOCIAL MEDIA/SOCIAL MEDIA/dra. Liliana Arias/Captura de pantalla 2026-02-27 133043.png',
        ]
    },
];

// Helper: encode path (handles spaces, parentheses, ñ, etc.)
function epath(rawPath) {
    return rawPath.split('/').map(seg => encodeURIComponent(seg)).join('/');
}

// --- STATE ---
let activeStoryBrand = null;
let activeStoryIndex = 0;
let storyTimer = null;

// ---- Create body-level modals (bypasses overflow/transform stacking issues) ----
function ensureModals() {
    if (document.getElementById('sm-story-modal')) return; // already created

    // STORY MODAL
    const storyModal = document.createElement('div');
    storyModal.id = 'sm-story-modal';
    storyModal.style.cssText = `
        display: none; position: fixed; inset: 0; z-index: 9999;
        align-items: center; justify-content: center;
        background: rgba(0,0,0,0.96); backdrop-filter: blur(8px);
    `;
    storyModal.innerHTML = `
        <!-- Progress bars -->
        <div id="sm-story-progress" style="position:absolute;top:12px;left:0;right:0;display:flex;gap:4px;padding:0 16px;z-index:10;"></div>

        <!-- Close -->
        <button onclick="clearSMStory()" style="position:absolute;top:16px;right:16px;z-index:11;background:rgba(255,255,255,0.1);border:none;border-radius:50%;width:36px;height:36px;color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;">✕</button>

        <!-- Prev -->
        <button onclick="prevSMStory()" style="position:absolute;left:16px;top:50%;transform:translateY(-50%);z-index:10;background:rgba(255,255,255,0.1);border:none;border-radius:50%;width:40px;height:40px;color:white;cursor:pointer;font-size:20px;">‹</button>

        <!-- Next -->
        <button onclick="nextSMStory()" style="position:absolute;right:16px;top:50%;transform:translateY(-50%);z-index:10;background:rgba(255,255,255,0.1);border:none;border-radius:50%;width:40px;height:40px;color:white;cursor:pointer;font-size:20px;">›</button>

        <!-- Story frame -->
        <div style="position:relative;width:min(360px,90vw);aspect-ratio:9/16;border-radius:24px;overflow:hidden;box-shadow:0 25px 50px rgba(0,0,0,0.5);">
            <!-- Header -->
            <div style="position:absolute;top:32px;left:12px;right:12px;display:flex;align-items:center;gap:8px;z-index:5;">
                <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;border:2px solid white;flex-shrink:0;background:#333;">
                    <img id="sm-story-avatar-img" src="" style="width:100%;height:100%;object-fit:cover;" alt="">
                </div>
                <div>
                    <p id="sm-story-brand-name" style="color:white;font-size:13px;font-weight:700;margin:0;text-shadow:0 1px 3px rgba(0,0,0,0.8);"></p>
                    <p id="sm-story-counter" style="color:rgba(255,255,255,0.6);font-size:10px;margin:2px 0 0;"></p>
                </div>
            </div>
            <img id="sm-story-img" src="" alt="Story" style="width:100%;height:100%;object-fit:cover;background:#111;">
            <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.4),transparent 30%,transparent 70%,rgba(0,0,0,0.2));pointer-events:none;"></div>
        </div>
    `;
    document.body.appendChild(storyModal);

    // POST MODAL
    const postModal = document.createElement('div');
    postModal.id = 'sm-post-modal';
    postModal.style.cssText = `
        display: none; position: fixed; inset: 0; z-index: 9999;
        align-items: center; justify-content: center;
        background: rgba(0,0,0,0.92); backdrop-filter: blur(8px);
        cursor: zoom-out;
    `;
    postModal.innerHTML = `
        <button onclick="closeSMPost()" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.1);border:none;border-radius:50%;width:36px;height:36px;color:white;cursor:pointer;font-size:18px;z-index:10;">✕</button>
        <div id="sm-post-content" class="w-full h-full flex flex-col items-center justify-center"></div>
    `;
    postModal.addEventListener('click', (e) => {
        if (e.target === postModal) closeSMPost();
    });
    document.body.appendChild(postModal);
}

export function renderSocialMediaSection(container, themePanel, themeBorder) {

    // Ensure modals exist at body level
    ensureModals();
    setupSMHandlers();

    const html = `
        <!-- BRAND MANAGEMENT INTRO -->
        <div class="mb-14">
            <div class="flex items-center gap-3 mb-6">
                <div class="h-[1px] w-8 bg-violet-600"></div>
                <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-600">Brand Management</span>
            </div>
            <p class="text-sm leading-relaxed opacity-70 max-w-2xl mb-10">
                Mi trayectoria me ha permitido evolucionar de la gestión de redes a la <strong class="opacity-100">arquitectura de identidad digital</strong>. Como Brand Manager, mi enfoque principal ha sido traducir el ADN de cada marca en estrategias de contenido en el ecosistema Meta (Instagram/Facebook) que generen comunidad y retorno de inversión.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div class="${themePanel} border ${themeBorder} rounded-2xl p-6 group hover:-translate-y-1 transition-all">
                    <div class="text-violet-500 text-2xl mb-3"></div>
                    <h4 class="font-serif italic text-base mb-2 font-bold">Servicios y Finanzas</h4>
                    <p class="text-[11px] opacity-50 leading-relaxed">Especialista en la humanización de servicios complejos. Transformé tecnicismos en contenido educativo y accesible, posicionando a las marcas como autoridades de confianza en su sector. <em class="opacity-70">(Cootraim, Confecoop)</em></p>
                </div>
                <div class="${themePanel} border ${themeBorder} rounded-2xl p-6 group hover:-translate-y-1 transition-all">
                    <div class="text-pink-500 text-2xl mb-3"></div>
                    <h4 class="font-serif italic text-base mb-2 font-bold">Moda y Gastronomía</h4>
                    <p class="text-[11px] opacity-50 leading-relaxed">Gestión de narrativa visual y sensorial. Desarrollé campañas enfocadas en el storytelling del proceso creativo y experiencias de consumo de alto impacto visual para incentivar la conversión. <em class="opacity-70">(Diseñamos, CBC)</em></p>
                </div>
                <div class="${themePanel} border ${themeBorder} rounded-2xl p-6 group hover:-translate-y-1 transition-all">
                    <div class="text-emerald-500 text-2xl mb-3"></div>
                    <h4 class="font-serif italic text-base mb-2 font-bold">Salud y Belleza</h4>
                    <p class="text-[11px] opacity-50 leading-relaxed">Construcción de autoridad y lealtad. Implementé estrategias basadas en la educación y la empatía, transformando marcas personales en comunidades de cuidado y bienestar. <em class="opacity-70">(Dra. Arias, Dra. Cepeda)</em></p>
                </div>
            </div>
        </div>

        <!-- STORIES BAR -->
        <div class="mb-10">
            <div class="flex items-center gap-3 mb-5">
                <div class="h-[1px] w-8 bg-violet-600"></div>
                <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-600">Clientes · Destacados</span>
            </div>
            <div class="flex gap-5 overflow-x-auto pb-3" style="scrollbar-width:none;">
                \${brands.map(b => `
        < div
    class="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
    onclick = "openSMStory('\${b.id}')"
        >
                        <div class="p-[2.5px] rounded-full bg-gradient-to-br \${b.gradient} hover:scale-105 transition-transform duration-300 shadow-lg">
                            <div class="w-[68px] h-[68px] rounded-full bg-[#0f0c29] p-[2px] overflow-hidden">
                                <img
                                    src="\${epath(b.avatar)}"
                                    alt="\${b.name}"
                                    class="w-full h-full rounded-full object-cover"
                                    onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;border-radius:50%;background:\${b.color}33;display:flex;align-items:center;justify-content:center;font-size:18px;\\'>📸</div>'"
                                >
                            </div>
                        </div>
                        <span class="text-[9px] font-bold uppercase tracking-wide opacity-60 group-hover:opacity-100 transition-opacity text-center leading-tight" style="max-width:72px;">\${b.name}</span>
                        <span class="text-[8px] opacity-30 text-center">\${b.stories.length} hist.</span>
                    </div >
        `).join('')}
            </div>
        </div>

        <!-- BRAND FILTER TABS -->
        <div class="flex items-center gap-2 mb-6 overflow-x-auto pb-1" style="scrollbar-width:none;">
            <button onclick="filterSMBrand('all')" id="sm-filter-all"
                class="shrink-0 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all bg-violet-600 text-white border-violet-600">
                Todos
            </button>
            \${brands.map(b => `
        < button onclick = "filterSMBrand('\${b.id}')" id = "sm-filter-\${b.id}"
    class="shrink-0 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all opacity-50 hover:opacity-100" style = "border-color:rgba(99,86,255,0.2);" >
    \${ b.name }
                </button >
        `).join('')}
        </div>

        <!-- POSTS GRID -->
        <div id="sm-posts-grid" class="grid grid-cols-3 gap-1 mb-20">
            \${brands.flatMap(b =>
        b.posts.map((post, i) => {
            const isVideo = typeof post === 'object' && post.type === 'youtube';
            const src = isVideo ? \`https://img.youtube.com/vi/\${post.id}/hqdefault.jpg\` : epath(post);
            const clickArg = isVideo ? \`{ type: 'youtube', id: '\${post.id}' }\` : \`'\${post.replace(/'/g, "\\\\'")}'\`;

            return `
        < div
    class="sm-post-item aspect-square overflow-hidden cursor-pointer relative group"
    data - brand="\${b.id}"
    onclick = "openSMPost(\${clickArg})"
    style = "background:\${b.color}15;"
        >
        <img
            src="\${src}"
            alt="\${b.name} post \${i + 1}"
            class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
            loading="lazy"
            onerror="this.style.display='none';"
        >
            \${isVideo ? `
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div class="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white border border-white/20">
                                <i data-lucide="play" class="w-4 h-4 ml-0.5" fill="currentColor"></i>
                            </div>
                        </div>
                        ` : ''}
            <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all z-10">
                <span class="text-white text-[8px] font-bold uppercase tracking-widest">\${b.name}</span>
            </div>
        </div>
    `;
        })
    ).join('')}
        </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
}

function setupSMHandlers() {

    window.openSMStory = function (brandId) {
        const brand = brands.find(b => b.id === brandId);
        if (!brand || brand.stories.length === 0) return;
        activeStoryBrand = brand;
        activeStoryIndex = 0;
        const modal = document.getElementById('sm-story-modal');
        modal.style.display = 'flex';
        renderStoryFrame();
        startStoryTimer();
    };

    window.clearSMStory = function () {
        clearTimeout(storyTimer);
        const modal = document.getElementById('sm-story-modal');
        if (modal) modal.style.display = 'none';
        activeStoryBrand = null;
        activeStoryIndex = 0;
    };

    window.nextSMStory = function () {
        if (!activeStoryBrand) return;
        clearTimeout(storyTimer);
        activeStoryIndex++;
        if (activeStoryIndex >= activeStoryBrand.stories.length) {
            window.clearSMStory();
            return;
        }
        renderStoryFrame();
        startStoryTimer();
    };

    window.prevSMStory = function () {
        if (!activeStoryBrand) return;
        clearTimeout(storyTimer);
        activeStoryIndex = Math.max(0, activeStoryIndex - 1);
        renderStoryFrame();
        startStoryTimer();
    };

    function renderStoryFrame() {
        const brand = activeStoryBrand;
        const total = brand.stories.length;
        const current = activeStoryIndex;

        const img = document.getElementById('sm-story-img');
        img.src = '';
        img.src = epath(brand.stories[current]);
        document.getElementById('sm-story-brand-name').textContent = brand.name;
        document.getElementById('sm-story-counter').textContent = \`\${current + 1} / \${total}\`;
        document.getElementById('sm-story-avatar-img').src = epath(brand.avatar);

        // Progress bars
        const progressEl = document.getElementById('sm-story-progress');
        progressEl.innerHTML = brand.stories.map((_, i) => \`
            <div style="flex:1;height:2px;border-radius:99px;overflow:hidden;background:rgba(255,255,255,0.2);">
                <div id="sm-prog-\${i}" style="height:100%;border-radius:99px;background:white;width:\${i < current ? '100%' : '0%'};"></div>
            </div>
        \`).join('');

        // Animate current bar
        setTimeout(() => {
            const bar = document.getElementById(\`sm-prog-\${current}\`);
            if (bar) {
                bar.style.transition = 'width 5s linear';
                bar.style.width = '100%';
            }
        }, 50);
    }

    function startStoryTimer() {
        clearTimeout(storyTimer);
        storyTimer = setTimeout(() => window.nextSMStory(), 5000);
    }

    window.openSMPost = function (srcOrObj) {
        const modal = document.getElementById('sm-post-modal');
        const contentContainer = document.getElementById('sm-post-content');

        // Clear previous content
        contentContainer.innerHTML = '';

        if (typeof srcOrObj === 'object' && srcOrObj.type === 'youtube') {
            contentContainer.innerHTML = \`
                <div class="relative w-full max-w-4xl mx-auto aspect-[9/16] sm:aspect-video rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/10 bg-black">
                    <iframe 
                        src="https://www.youtube.com/embed/\${srcOrObj.id}?autoplay=1&controls=0&rel=0&modestbranding=1&playsinline=1" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen
                        class="absolute inset-0 w-full h-full"
                    ></iframe>
                </div>
            \`;
        } else {
            contentContainer.innerHTML = \`
                <img src="\${epath(srcOrObj)}" alt="Post" class="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
            \`;
        }

        modal.style.display = 'flex';
    };

    window.closeSMPost = function () {
        const modal = document.getElementById('sm-post-modal');
        const contentContainer = document.getElementById('sm-post-content');
        if (modal) {
            modal.style.display = 'none';
            // Clear content to stop video playback
            contentContainer.innerHTML = '';
        }
    };

    window.filterSMBrand = function (brandId) {
        const allBtn = document.getElementById('sm-filter-all');
        brands.forEach(b => {
            const btn = document.getElementById(\`sm-filter-\${b.id}\`);
            if (btn) {
                btn.style.background = '';
                btn.style.color = '';
                btn.style.borderColor = 'rgba(99,86,255,0.2)';
                btn.classList.add('opacity-50');
                btn.classList.remove('opacity-100');
            }
        });
        if (allBtn) {
            allBtn.style.background = '';
            allBtn.style.color = '';
            allBtn.classList.add('opacity-50');
            allBtn.classList.remove('opacity-100', 'bg-violet-600', 'text-white');
        }

        const activeBtn = brandId === 'all' ? allBtn : document.getElementById(\`sm-filter-\${brandId}\`);
        if (activeBtn) {
            activeBtn.style.background = '#7C3AED';
            activeBtn.style.color = 'white';
            activeBtn.style.borderColor = '#7C3AED';
            activeBtn.classList.remove('opacity-50');
            activeBtn.classList.add('opacity-100');
        }

        document.querySelectorAll('.sm-post-item').forEach(post => {
            post.style.display = (brandId === 'all' || post.dataset.brand === brandId) ? 'block' : 'none';
        });
    };
}
