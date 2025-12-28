import { tools, projects } from './data.js';
import { hexToHSL, hslToHex, getContrast, generateProPalettes } from './color-studio.js';

// --- STATE ---
let activeTool = 'about';
let isDarkMode = false;
let openProjects = [];
let focusedProject = null;
let currentBaseColor = '#7c3aed';
let zIndexCounter = 200;
let isDragging = false;
let currentTarget = null;
let startX, startY, initialLeft, initialTop;

// --- INIT ---
window.onload = () => {
    setTimeout(() => {
        document.getElementById('booting-screen').style.display = 'none';
        const app = document.getElementById('app-container');
        app.style.opacity = '1';

        renderTools();
        renderContent();
        renderInspector();
        lucide.createIcons();

        setTimeout(() => toggleWelcome(true), 500);
    }, 1200);
};

// --- CURSOR LOGIC ---
const dot = document.getElementById('cursor-dot');
const outline = document.getElementById('cursor-outline');

window.addEventListener('mousemove', (e) => {
    gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(outline, { x: e.clientX - 15, y: e.clientY - 15, duration: 0.25 });
    const isClickable = e.target.closest('button') || e.target.closest('a') || e.target.closest('.cursor-pointer') || e.target.closest('input') || e.target.closest('.window-header');
    if (isClickable) {
        outline.style.transform = 'scale(1.5)';
        outline.style.borderColor = '#7c3aed';
        dot.style.transform = 'scale(0.5)';
    } else {
        outline.style.transform = 'scale(1)';
        outline.style.borderColor = 'rgba(124, 58, 237, 0.5)';
        dot.style.transform = 'scale(1)';
    }
});

// --- ACTIONS ---
window.toggleDarkMode = function () {
    isDarkMode = !isDarkMode;
    const body = document.getElementById('body-main');
    const elements = [
        document.getElementById('header'),
        document.getElementById('sidebar'),
        document.getElementById('tabs-bar'),
        document.getElementById('inspector'),
        document.getElementById('modal-panel'),
        document.getElementById('modal-header')
    ];

    if (isDarkMode) {
        body.classList.replace('bg-[#F5F5F0]', 'bg-[#1A1844]');
        body.classList.replace('text-stone-800', 'text-stone-200');
        elements.forEach(el => el && el.classList.replace('bg-[#EAEAE5]', 'bg-[#16143C]'));
        elements.forEach(el => el && el.classList.replace('border-stone-300', 'border-indigo-900/30'));
        document.getElementById('theme-icon').setAttribute('data-lucide', 'sun');
    } else {
        body.classList.replace('bg-[#1A1844]', 'bg-[#F5F5F0]');
        body.classList.replace('text-stone-200', 'text-stone-800');
        elements.forEach(el => el && el.classList.replace('bg-[#16143C]', 'bg-[#EAEAE5]'));
        elements.forEach(el => el && el.classList.replace('border-indigo-900/30', 'border-stone-300'));
        document.getElementById('theme-icon').setAttribute('data-lucide', 'moon');
    }

    lucide.createIcons();
    renderContent();
    renderWindows();
};

window.setActiveTool = function (id) {
    activeTool = id;
    renderTools();
    renderContent();

    // Animation for new content
    gsap.fromTo("#main-content-render",
        { opacity: 0, scale: 0.98, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "expo.out" }
    );
};

window.toggleWelcome = function (show) {
    const modal = document.getElementById('welcome-modal');
    modal.style.display = show ? 'flex' : 'none';
};

window.openProject = function (id) {
    const project = projects.find(p => p.id === id);
    if (!openProjects.find(p => p.id === id)) {
        openProjects.push(project);
    }
    focusProject(id);
};

window.closeProject = function (id) {
    openProjects = openProjects.filter(p => p.id !== id);
    if (focusedProject === id) focusedProject = openProjects.length > 0 ? openProjects[openProjects.length - 1].id : null;
    renderTabs();
    renderWindows();
};

window.focusProject = function (id) {
    focusedProject = id;
    zIndexCounter++;
    const win = document.getElementById(`win-${id}`);
    if (win) {
        win.style.zIndex = zIndexCounter;
    }
    renderTabs();
    renderWindows();
};

window.initDrag = function (e, id) {
    // Check if the interaction is on a button (like the close button)
    if (e.target.closest('button')) return;

    isDragging = true;
    currentTarget = document.getElementById(`win-${id}`);
    startX = e.clientX;
    startY = e.clientY;

    // Get current calculated position
    const rect = currentTarget.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    // Reset any percentage-based positioning to pixels for smooth dragging
    currentTarget.style.left = `${initialLeft}px`;
    currentTarget.style.top = `${initialTop}px`;
    currentTarget.style.transform = 'none';

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
};

function handleDrag(e) {
    if (!isDragging || !currentTarget) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    currentTarget.style.left = `${initialLeft + dx}px`;
    currentTarget.style.top = `${initialTop + dy}px`;
}

function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
}

window.updateColor = function (hex) {
    currentBaseColor = hex;
    renderContent();
};

// --- RENDERING ---
function renderTools() {
    const container = document.getElementById('tool-buttons');
    container.innerHTML = tools.map(tool => `
        <button
            onclick="setActiveTool('${tool.id}')"
            class="w-12 h-12 flex items-center justify-center rounded-xl transition-all relative group ${activeTool === tool.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'hover:bg-black/5 opacity-40 hover:opacity-100'}"
        >
            <i data-lucide="${tool.icon}" class="w-5 h-5"></i>
            <span class="absolute left-16 bg-black text-white text-[9px] px-2 py-1.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-4px] group-hover:translate-x-0 whitespace-nowrap z-50 uppercase font-bold tracking-widest">
                ${tool.label}
            </span>
        </button>
    `).join('');
    lucide.createIcons();
}

function renderTabs() {
    const container = document.getElementById('active-tabs-container');
    const themeBorder = isDarkMode ? 'border-indigo-900/30' : 'border-stone-300';
    const themePanel = isDarkMode ? 'bg-[#1D1B4B]' : 'bg-white';

    container.innerHTML = openProjects.map(p => `
        <div 
            onmousedown="focusProject(${p.id})"
            class="h-full flex items-center gap-3 px-5 cursor-pointer transition-colors border-r ${themeBorder} ${focusedProject === p.id ? themePanel : 'opacity-40 hover:opacity-80'} whitespace-nowrap"
        >
            <span class="text-[10px] font-bold uppercase tracking-tight">${p.title}</span>
            <button 
                onmousedown="event.stopPropagation();"
                onclick="event.stopPropagation(); closeProject(${p.id});"
                class="p-1 hover:bg-red-500 hover:text-white rounded-md transition-all flex items-center justify-center"
            >
                <i data-lucide="x" class="w-3 h-3"></i>
            </button>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderContent() {
    const container = document.getElementById('main-content-render');
    const tool = tools.find(t => t.id === activeTool);
    const themePanel = isDarkMode ? 'bg-[#1D1B4B]' : 'bg-white';
    const themeBorder = isDarkMode ? 'border-indigo-900/30' : 'border-stone-300';
    const themeTextSub = isDarkMode ? 'text-stone-400' : 'text-stone-500';

    let html = `
        <div class="mb-14 fade-in">
            <div class="flex items-center gap-2 text-[10px] font-bold text-violet-600 mb-3 tracking-[0.4em] uppercase">
                <i data-lucide="chevron-right" class="w-3 h-3"></i> ${tool.role}
            </div>
            <h2 class="text-4xl sm:text-6xl font-serif italic mb-8 leading-none">${tool.label}</h2>
            
            ${activeTool === 'about' ? `
                <div class="max-w-4xl border-l-4 border-violet-600 pl-8 py-2 mb-16">
                    ${tool.intro.map(p => `<p class="text-lg sm:text-xl font-serif leading-relaxed mb-6 opacity-90">${p}</p>`).join('')}
                </div>

                <!-- QUÉ HAGO -->
                <div class="mb-20">
                    <h3 class="text-xs font-black uppercase tracking-[0.3em] text-violet-600 mb-8 border-b ${themeBorder} pb-4">Qué_Hago</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        ${tool.whatIDo.map(item => `
                            <div class="${themePanel} p-8 rounded-3xl border ${themeBorder} shadow-sm hover:shadow-md transition-all">
                                <h4 class="font-bold text-lg mb-3 font-serif italic">${item.title}</h4>
                                <p class="text-sm ${themeTextSub} leading-relaxed font-medium">${item.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- HABILIDADES & PROCESO -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                    <!-- Skills -->
                    <div class="lg:col-span-7">
                        <h3 class="text-xs font-black uppercase tracking-[0.3em] text-violet-600 mb-8 border-b ${themeBorder} pb-4">Habilidades_Core</h3>
                        <div class="grid grid-cols-2 gap-8">
                            <div>
                                <span class="text-[10px] uppercase font-bold opacity-40 mb-4 block tracking-widest">Creativas</span>
                                <ul class="space-y-3">
                                    ${tool.skills.creative.map(s => `<li class="text-xs font-bold flex items-center gap-2"><div class="w-1 h-1 bg-violet-600 rounded-full"></div> ${s}</li>`).join('')}
                                </ul>
                            </div>
                            <div>
                                <span class="text-[10px] uppercase font-bold opacity-40 mb-4 block tracking-widest">Técnicas_&_Pro</span>
                                <ul class="space-y-3">
                                    ${[...tool.skills.technical, ...tool.skills.professional].map(s => `<li class="text-xs font-bold flex items-center gap-2"><div class="w-1 h-1 bg-stone-400 rounded-full"></div> ${s}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Process -->
                    <div class="lg:col-span-5">
                        <h3 class="text-xs font-black uppercase tracking-[0.3em] text-violet-600 mb-8 border-b ${themeBorder} pb-4">Proceso_Creativo</h3>
                        <div class="${themePanel} p-8 rounded-[2rem] border ${themeBorder}">
                            <ul class="space-y-6 relative">
                                <div class="absolute left-[7px] top-2 bottom-2 w-[1px] bg-stone-200 dark:bg-stone-800"></div>
                                ${tool.process.map((step, i) => `
                                    <li class="relative pl-8">
                                        <div class="absolute left-0 top-1.5 w-3.5 h-3.5 bg-violet-600 rounded-full border-4 border-white dark:border-[#1D1B4B]"></div>
                                        <span class="text-[10px] font-bold opacity-30 uppercase tracking-widest mb-1 block">Fase 0${i + 1}</span>
                                        <span class="text-sm font-bold">${step}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- CONTACT & EDUCATION -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                     <div class="${themePanel} p-8 rounded-[2rem] border ${themeBorder}">
                        <h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6">Educación</h3>
                        <p class="text-sm leading-relaxed font-medium opacity-80">${tool.education}</p>
                     </div>
                     <div class="bg-violet-600 text-white p-8 rounded-[2rem] shadow-xl shadow-violet-600/20">
                        <h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6">Status</h3>
                        <p class="text-lg font-serif italic mb-6">${tool.contact.text}</p>
                        <ul class="space-y-2">
                             ${tool.contact.availability.map(item => `<li class="text-xs font-bold flex items-center gap-2 opacity-80"><i data-lucide="check" class="w-3 h-3"></i> ${item}</li>`).join('')}
                        </ul>
                     </div>
                </div>

            ` : `
                <div class="max-w-3xl border-l-4 border-violet-600 pl-8 py-2">
                    <p class="text-2xl italic opacity-90 leading-relaxed font-serif mb-6">${tool.desc}</p>
                    <p class="text-sm opacity-50 mt-4 leading-relaxed font-medium">${tool.manifesto}</p>
                </div>
            `}
            
        </div>
    `;

    if (activeTool === 'color') {
        const palettes = generateProPalettes(currentBaseColor);
        const hsl = hexToHSL(currentBaseColor);
        const contrastColor = getContrast(currentBaseColor);

        html += `
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-start">
                <!-- Technical Inspector -->
                <div class="lg:col-span-4 flex flex-col gap-6">
                    <div class="${themePanel} border ${themeBorder} rounded-[2.5rem] p-10 shadow-sm theme-transition">
                        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 mb-8 border-b pb-4">Base_Data</h3>
                        <div class="w-full aspect-square rounded-3xl shadow-inner mb-8 flex flex-col items-center justify-center gap-2" style="background-color: ${currentBaseColor}; color: ${contrastColor}">
                            <span class="text-xl font-mono font-bold uppercase">${currentBaseColor}</span>
                            <span class="text-[9px] uppercase font-bold tracking-[0.2em] opacity-60">Visualización_Color</span>
                        </div>
                        <div class="space-y-6 font-mono">
                            <div class="flex justify-between items-center text-[10px] border-b ${themeBorder} pb-3">
                                <span class="opacity-40">RGB</span>
                                <span class="font-bold uppercase tracking-widest">${parseInt(currentBaseColor.slice(1, 3), 16)}, ${parseInt(currentBaseColor.slice(3, 5), 16)}, ${parseInt(currentBaseColor.slice(5, 7), 16)}</span>
                            </div>
                            <div class="flex justify-between items-center text-[10px] border-b ${themeBorder} pb-3">
                                <span class="opacity-40">HSL</span>
                                <span class="font-bold uppercase tracking-widest">${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%</span>
                            </div>
                            <div class="flex justify-between items-center text-[10px] border-b ${themeBorder} pb-3">
                                <span class="opacity-40">Legibilidad</span>
                                <span class="px-3 py-1 rounded-full text-[8px] font-bold ${contrastColor === 'white' ? 'bg-white text-black' : 'bg-black text-white'}">${contrastColor.toUpperCase()} TEXT</span>
                            </div>
                            <input type="color" value="${currentBaseColor}" oninput="updateColor(this.value)" class="w-full h-12 rounded-xl bg-transparent border-none cursor-pointer mt-4">
                        </div>
                    </div>
                </div>

                <!-- Harmonies Explorer -->
                <div class="lg:col-span-8 flex flex-col gap-8">
                    <!-- Harmonies -->
                    ${Object.entries(palettes).filter(([k]) => k !== 'Shades').map(([name, colors]) => `
                        <div class="${themePanel} border ${themeBorder} rounded-[2.5rem] p-8 shadow-sm theme-transition">
                            <div class="flex justify-between items-center mb-6">
                                <h4 class="text-[9px] font-black uppercase tracking-[0.3em] text-violet-600">${name}_Rule</h4>
                                <span class="text-[8px] opacity-30 font-bold uppercase">Armonía_Generada</span>
                            </div>
                            <div class="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                ${colors.map(c => `
                                    <div class="flex-1 min-w-[60px] group">
                                        <div onclick="updateColor('${c}')" class="aspect-[4/3] sm:aspect-square rounded-2xl swatch shadow-sm cursor-pointer" style="background-color: ${c}"></div>
                                        <p class="text-[8px] font-mono mt-3 text-center opacity-40 font-bold uppercase">${c}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}

                    <!-- Matices / Shades & Tints -->
                    <div class="${themePanel} border ${themeBorder} rounded-[2.5rem] p-8 shadow-sm theme-transition">
                        <h4 class="text-[9px] font-black uppercase tracking-[0.3em] text-violet-600 mb-6">Shades_&_Tints</h4>
                        <div class="flex h-16 rounded-2xl overflow-hidden shadow-sm">
                            ${palettes.Shades.map(c => `<div onclick="updateColor('${c}')" class="flex-1 cursor-pointer hover:scale-x-110 transition-transform" style="background-color: ${c}" title="${c}"></div>`).join('')}
                        </div>
                        <div class="flex justify-between mt-4 text-[8px] font-bold opacity-30 uppercase tracking-widest">
                            <span>Darken</span>
                            <span>Escala_Luminosidad</span>
                            <span>Lighten</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (activeTool !== 'about' && activeTool !== 'color') {
        html += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 items-stretch">`;

        projects.filter(p => p.category === activeTool || p.category === 'special').forEach(p => {
            html += `
                <div 
                    onclick="openProject(${p.id})"
                    class="${themePanel} border ${themeBorder} rounded-[2rem] p-5 cursor-pointer group hover:shadow-2xl hover:shadow-violet-600/5 transition-all hover:-translate-y-2 flex flex-col justify-between theme-transition"
                >
                    <div class="aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-6 bg-stone-100 relative shadow-inner">
                        <img src="${p.img}" class="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100" alt="${p.title}" />
                         <div class="absolute top-4 right-4 w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                            <i data-lucide="maximize-2" class="w-3.5 h-3.5 text-white"></i>
                        </div>
                    </div>
                    <div class="flex justify-between items-center px-2">
                        <div class="truncate pr-4 text-left">
                            <h4 class="text-xs font-black uppercase truncate tracking-tight mb-1">${p.title}</h4>
                            <p class="text-[10px] opacity-30 uppercase font-bold tracking-widest">${p.category}</p>
                        </div>
                        <div class="w-9 h-9 flex-shrink-0 rounded-full border ${themeBorder} flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all">
                            <i data-lucide="chevron-right" class="w-4.5 h-4.5"></i>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }

    container.innerHTML = html;
    lucide.createIcons();
}

function renderWindows() {
    const container = document.getElementById('windows-layer');
    const themePanel = isDarkMode ? 'bg-[#1D1B4B]' : 'bg-white';
    const themeBorder = isDarkMode ? 'border-indigo-900/30' : 'border-stone-300';
    const themeSidebar = isDarkMode ? 'bg-[#16143C]' : 'bg-[#EAEAE5]';

    const existingPositions = {};
    openProjects.forEach(p => {
        const el = document.getElementById(`win-${p.id}`);
        if (el) existingPositions[p.id] = { left: el.style.left, top: el.style.top, z: el.style.zIndex };
    });

    container.innerHTML = openProjects.map((p, index) => {
        const pos = existingPositions[p.id] || { left: `${18 + (index * 3)}%`, top: `${12 + (index * 3)}%`, z: focusedProject === p.id ? zIndexCounter : 100 + index };
        return `
            <div 
                onmousedown="focusProject(${p.id})"
                style="z-index: ${pos.z}; top: ${pos.top}; left: ${pos.left};"
                class="fixed w-full max-w-2xl ${themePanel} rounded-[2rem] border ${themeBorder} shadow-[0_30px_90px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col pointer-events-auto theme-transition"
                id="win-${p.id}"
            >
                <div 
                    onmousedown="initDrag(event, ${p.id})"
                    class="h-11 ${themeSidebar} flex items-center justify-between px-6 window-header border-b ${themeBorder} theme-transition"
                >
                    <div class="flex items-center gap-3">
                        <i data-lucide="image" class="w-3.5 h-3.5 opacity-40"></i>
                        <span class="text-[11px] font-bold uppercase tracking-widest truncate max-w-[250px]">${p.title}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <button 
                            onmousedown="event.stopPropagation();"
                            onclick="event.stopPropagation(); closeProject(${p.id});" 
                            class="text-red-500 hover:bg-red-500 hover:text-white transition-all p-1.5 rounded-lg flex items-center justify-center relative z-50"
                        >
                            <i data-lucide="x" class="w-4.5 h-4.5"></i>
                        </button>
                    </div>
                </div>
                <div class="flex-1 overflow-y-auto max-h-[65vh] p-10 custom-scrollbar text-left">
                    <div class="rounded-[1.5rem] overflow-hidden mb-10 shadow-md h-72">
                        <img src="${p.img}" class="w-full h-full object-cover" alt="${p.title}" />
                    </div>
                    <h3 class="text-5xl font-serif italic mb-6 leading-tight">${p.title}</h3>
                    <p class="text-[15px] leading-relaxed opacity-60 mb-10 font-medium">
                        ${p.description} <br /><br />
                        Bajo la dirección estratégica de Karen, este proyecto se desarrolló desde la esencia, cuidando cada detalle del proceso creativo.
                    </p>
                    ${p.category === 'special' ? `
                        <button onclick="window.location.href='mailto:hola@karenjefa.com'" class="px-12 py-5 bg-violet-600 text-white rounded-full font-bold uppercase text-[11px] tracking-widest hover:bg-violet-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-violet-600/20">
                            👉 Iniciar conversación
                        </button>
                    ` : `
                        <div class="flex gap-4">
                            <button class="px-10 py-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">Ver Detalles</button>
                            <button class="px-10 py-4 border border-black/10 dark:border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-black/5 transition-colors">Compartir</button>
                        </div>
                    `}
                </div>
            </div>
        `;
    }).join('');

    lucide.createIcons();

    // Animation for new window
    openProjects.forEach(p => {
        const el = document.getElementById(`win-${p.id}`);
        if (el && !el.dataset.animated) {
            gsap.fromTo(el,
                { scale: 0.95, opacity: 0, y: 30 },
                { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }
            );
            el.dataset.animated = "true";
        }
    });
}

function renderInspector() {
    const aboutTool = tools.find(t => t.id === 'about');

    // Skill items now come from new data or defaults?
    // Since we moved skills to the main view, I will use this space for mini-stats or a condensed view
    // For now, let's keep it simple or dynamic based on what we have.
    // User didn't give numbers, so I'll generate some visual bars just for 'looks' like in the original, or 
    // maybe just hide it if not relevant. But keeping it alive gives a techy feel.
    // Let's populate testimonials dynamically from data.js

    // Testimonials
    const container = document.getElementById('testimonials-container');
    if (container && aboutTool.testimonials) {
        container.innerHTML = aboutTool.testimonials.map(quote => `
            <div class="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 relative shadow-sm text-left italic">
                <i data-lucide="quote" class="w-3 h-3 text-violet-600 opacity-20 absolute -top-1 -left-1"></i>
                <p class="text-[10px] leading-relaxed opacity-60 font-medium">“${quote}”</p>
            </div>
        `).join('');
    }

    // Update Skills Visuals (Just for the 'vibe', even if main skills are detailed text now)
    // We can keep the dummy stats or randomizing them slightly to feel alive
    document.querySelectorAll('.skill-item').forEach(el => {
        const label = el.dataset.label;
        const level = el.dataset.level;
        el.innerHTML = `
            <div class="space-y-2">
                <div class="flex justify-between text-[10px] font-bold uppercase opacity-50 tracking-tighter">
                    <span>${label}</span>
                    <span>${level}%</span>
                </div>
                <div class="h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div style="width: ${level}%" class="h-full bg-violet-600/60 rounded-full"></div>
                </div>
            </div>
        `;
    });

    lucide.createIcons();
}
