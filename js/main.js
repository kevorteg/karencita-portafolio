import { tools, projects } from './data.js';

// --- STATE ---
let activeTool = 'about';
let isDarkMode = false;
let openProjects = [];
let focusedProject = null;

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

// --- ACTIONS ---
window.toggleDarkMode = function () {
    isDarkMode = !isDarkMode;
    const body = document.getElementById('body-main');
    const header = document.getElementById('header');
    const sidebar = document.getElementById('sidebar');
    const tabsBar = document.getElementById('tabs-bar');
    const inspector = document.getElementById('inspector');
    const modal = document.getElementById('modal-panel');
    const themeIcon = document.getElementById('theme-icon');

    if (isDarkMode) {
        body.classList.replace('bg-[#F5F5F0]', 'bg-[#1A1844]');
        body.classList.replace('text-stone-800', 'text-stone-200');
        [header, sidebar, tabsBar, inspector].forEach(el => el.classList.replace('bg-[#EAEAE5]', 'bg-[#16143C]'));
        [header, sidebar, tabsBar, inspector].forEach(el => el.classList.replace('border-stone-300', 'border-indigo-900/30'));
        modal.classList.replace('bg-white', 'bg-[#1D1B4B]');
        modal.classList.replace('border-stone-300', 'border-indigo-900/30');
        themeIcon.setAttribute('data-lucide', 'sun');
    } else {
        body.classList.replace('bg-[#1A1844]', 'bg-[#F5F5F0]');
        body.classList.replace('text-stone-200', 'text-stone-800');
        [header, sidebar, tabsBar, inspector].forEach(el => el.classList.replace('bg-[#16143C]', 'bg-[#EAEAE5]'));
        [header, sidebar, tabsBar, inspector].forEach(el => el.classList.replace('border-indigo-900/30', 'border-stone-300'));
        modal.classList.replace('bg-[#1D1B4B]', 'bg-white');
        modal.classList.replace('border-indigo-900/30', 'border-stone-300');
        themeIcon.setAttribute('data-lucide', 'moon');
    }

    lucide.createIcons();
    renderContent(); // Re-render content to apply theme classes
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
    focusedProject = id;
    renderTabs();
    renderWindows();
};

window.closeProject = function (id) {
    openProjects = openProjects.filter(p => p.id !== id);
    if (focusedProject === id) focusedProject = openProjects.length > 0 ? openProjects[openProjects.length - 1].id : null;
    renderTabs();
    renderWindows();
};

window.focusProject = function (id) {
    focusedProject = id;
    renderTabs();
    renderWindows();
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
            onclick="focusProject(${p.id})"
            class="h-full flex items-center gap-3 px-5 cursor-pointer transition-colors border-r ${themeBorder} ${focusedProject === p.id ? themePanel : 'opacity-40 hover:opacity-80'} whitespace-nowrap"
        >
            <span class="text-[10px] font-bold uppercase tracking-tight">${p.title}</span>
            <button 
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

    let html = `
        <div class="mb-14">
            <div class="flex items-center gap-2 text-[10px] font-bold text-violet-600 mb-3 tracking-[0.4em] uppercase">
                <i data-lucide="chevron-right" class="w-3 h-3"></i> ${tool.role}
            </div>
            <h2 class="text-4xl sm:text-7xl font-serif italic mb-8 leading-none">${tool.label}</h2>
            <div class="max-w-3xl border-l-4 border-violet-600 pl-8 py-2">
                ${activeTool === 'about' ? `
                    <p class="text-2xl italic opacity-90 leading-relaxed font-serif mb-6">${tool.title}</p>
                    <p class="text-sm opacity-60 leading-relaxed font-medium mb-4">${tool.content}</p>
                    <p class="text-sm opacity-60 leading-relaxed font-medium">${tool.extra}</p>
                ` : `
                    <p class="text-xl italic opacity-80 leading-relaxed font-serif">${tool.desc}</p>
                    <p class="text-sm opacity-50 mt-4 leading-relaxed font-medium">${tool.manifesto}</p>
                `}
            </div>
        </div>
    `;

    if (activeTool === 'about') {
        html += `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                <div class="${themePanel} rounded-[2.5rem] p-10 border ${themeBorder} shadow-sm theme-transition">
                    <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 mb-8 border-b pb-4">Protocolos_Acción</h3>
                    <div class="space-y-8">
                        <div class="text-left group cursor-default">
                            <h4 class="text-[11px] font-black uppercase tracking-wider mb-2 flex items-center gap-2 group-hover:text-violet-600 transition-colors">
                                <i data-lucide="zap" class="w-2.5 h-2.5 fill-current"></i> Diseño Gráfico
                            </h4>
                            <p class="text-[13px] opacity-60 leading-relaxed">Identidades visuales y piezas que reflejan la esencia de cada marca, manteniendo coherencia estética y funcional.</p>
                        </div>
                        <div class="text-left group cursor-default">
                            <h4 class="text-[11px] font-black uppercase tracking-wider mb-2 flex items-center gap-2 group-hover:text-violet-600 transition-colors">
                                <i data-lucide="zap" class="w-2.5 h-2.5 fill-current"></i> Publicidad
                            </h4>
                            <p class="text-[13px] opacity-60 leading-relaxed">Conceptos claros y creativos, enfocados en comunicar mensajes relevantes y conectar de manera auténtica.</p>
                        </div>
                        <div class="text-left group cursor-default">
                            <h4 class="text-[11px] font-black uppercase tracking-wider mb-2 flex items-center gap-2 group-hover:text-violet-600 transition-colors">
                                <i data-lucide="zap" class="w-2.5 h-2.5 fill-current"></i> Marketing
                            </h4>
                            <p class="text-[13px] opacity-60 leading-relaxed">Estrategias basadas en análisis, objetivos y público, buscando que cada acción genere impacto real.</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-8">
                    <div class="${themePanel} rounded-[2.5rem] p-10 border ${themeBorder} shadow-sm flex-1 theme-transition">
                        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 mb-8 border-b pb-4">Proceso_Estructurado</h3>
                        <div class="space-y-4">
                            <div class="flex gap-4 items-start text-left">
                                <span class="text-[10px] font-black text-violet-600 pt-1 font-mono">01</span>
                                <p class="text-[13px] opacity-70 leading-relaxed font-medium">Investigación y análisis.</p>
                            </div>
                            <div class="flex gap-4 items-start text-left">
                                <span class="text-[10px] font-black text-violet-600 pt-1 font-mono">02</span>
                                <p class="text-[13px] opacity-70 leading-relaxed font-medium">Conceptualización creativa.</p>
                            </div>
                            <div class="flex gap-4 items-start text-left">
                                <span class="text-[10px] font-black text-violet-600 pt-1 font-mono">03</span>
                                <p class="text-[13px] opacity-70 leading-relaxed font-medium">Desarrollo visual y estratégico.</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-6 h-40">
                        <div class="${themePanel} flex-1 rounded-3xl p-6 border ${themeBorder} flex flex-col justify-center items-center text-center theme-transition">
                            <i data-lucide="graduation-cap" class="text-violet-600 mb-3 w-6 h-6"></i>
                            <span class="text-[9px] font-bold uppercase tracking-widest opacity-40">Educación</span>
                            <p class="text-[10px] font-bold mt-1">Formación Académica</p>
                        </div>
                        <div class="flex-1 rounded-3xl p-6 bg-violet-600 text-white flex flex-col justify-center items-center text-center">
                            <i data-lucide="check-circle-2" class="mb-3 w-6 h-6"></i>
                            <span class="text-[9px] font-bold uppercase tracking-widest opacity-60">Status</span>
                            <p class="text-[10px] font-bold mt-1 uppercase">Disponible</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        html += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 items-stretch">`;

        projects.filter(p => p.category === activeTool).forEach(p => {
            html += `
                <div 
                    onclick="openProject(${p.id})"
                    class="${themePanel} border ${themeBorder} rounded-[2rem] p-5 cursor-pointer group hover:shadow-2xl hover:shadow-violet-600/5 transition-all hover:-translate-y-2 flex flex-col justify-between theme-transition"
                >
                    <div class="aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-6 bg-stone-100 relative shadow-inner">
                        <img src="${p.img}" class="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100" alt="${p.title}" />
                        <div class="absolute inset-0 bg-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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

        html += `
            <div class="${themePanel} border border-dashed ${themeBorder} rounded-[2.5rem] p-10 flex flex-col justify-between shadow-sm group theme-transition">
                <div class="flex flex-col gap-6">
                    <span class="text-[10px] font-bold text-violet-600 uppercase tracking-widest border-b pb-2">Capas de Servicio</span>
                    <ul class="space-y-4">
                        ${tool.services ? tool.services.map(s => `
                            <li class="text-[13px] flex items-center gap-3 font-medium">
                                <div class="w-1.5 h-1.5 bg-violet-600 rounded-full shrink-0"></div>
                                ${s}
                            </li>
                        `).join('') : ''}
                    </ul>
                </div>
                <div class="mt-12 opacity-10 flex justify-center group-hover:scale-110 transition-transform">
                    <i data-lucide="${tool.icon}" style="width: 60px; height: 60px;"></i>
                </div>
            </div>
        </div>`;
    }

    html += `
        <footer class="mt-auto pt-20 pb-10 border-t ${themeBorder} flex flex-col sm:flex-row justify-between items-center gap-10">
            <div class="flex flex-col items-center sm:items-start gap-3">
                <div class="flex items-center gap-3">
                    <div class="w-5 h-5 rounded-md bg-violet-600"></div>
                    <span class="text-[11px] font-black uppercase tracking-[0.2em]">Karen: Jefa Creative Lab</span>
                </div>
                <p class="text-[10px] opacity-40 uppercase tracking-widest font-bold">Protocolos Creativos v.2025</p>
            </div>
            <div class="hidden xl:block text-[11px] font-serif italic opacity-30 text-center max-w-[200px]">
                “Crear es unir pensamiento y emoción.”
            </div>
            <div class="flex items-center gap-6">
                <div class="flex gap-4 items-center text-[10px] font-bold opacity-30 uppercase tracking-widest">
                    <a href="#" class="hover:text-violet-600 transition-colors">LinkedIn</a>
                    <a href="#" class="hover:text-violet-600 transition-colors">Behance</a>
                </div>
                <div class="flex items-center gap-3 text-[10px] font-bold opacity-30 uppercase tracking-widest border-l pl-6">
                    <span>Hecho con</span>
                    <i data-lucide="heart" class="w-3.5 h-3.5 text-red-500 fill-current"></i>
                    <span>by Karen</span>
                </div>
            </div>
        </footer>
    `;

    container.innerHTML = html;
    lucide.createIcons();
}

function renderWindows() {
    const container = document.getElementById('windows-layer');
    const themePanel = isDarkMode ? 'bg-[#1D1B4B]' : 'bg-white';
    const themeBorder = isDarkMode ? 'border-indigo-900/30' : 'border-stone-300';
    const themeSidebar = isDarkMode ? 'bg-[#16143C]' : 'bg-[#EAEAE5]';

    container.innerHTML = openProjects.map((p, index) => `
        <div 
            onmousedown="focusProject(${p.id})"
            style="z-index: ${focusedProject === p.id ? 200 : 100 + index}; top: ${12 + (index * 3)}%; left: ${18 + (index * 3)}%;"
            class="fixed w-full max-w-2xl ${themePanel} rounded-[2rem] border ${themeBorder} shadow-[0_30px_90px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col pointer-events-auto theme-transition"
            id="win-${p.id}"
        >
            <div class="h-11 ${themeSidebar} flex items-center justify-between px-6 cursor-move border-b ${themeBorder} theme-transition">
                <div class="flex items-center gap-3">
                    <i data-lucide="image" class="w-3.5 h-3.5 opacity-40"></i>
                    <span class="text-[11px] font-bold uppercase tracking-widest truncate max-w-[250px]">${p.title}</span>
                </div>
                <div class="flex items-center gap-4">
                    <button 
                        onclick="event.stopPropagation(); closeProject(${p.id});" 
                        class="text-red-500 hover:bg-red-500 hover:text-white transition-all p-1.5 rounded-lg flex items-center justify-center"
                    >
                        <i data-lucide="x" class="w-4.5 h-4.5"></i>
                    </button>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto max-h-[65vh] p-10 custom-scrollbar text-left">
                <div class="rounded-[1.5rem] overflow-hidden mb-10 shadow-md h-72">
                    <img src="${p.img}" class="w-full h-full object-cover" alt="${p.title}" />
                </div>
                <div class="max-w-xl">
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
            <div class="h-8 ${themeSidebar} border-t ${themeBorder} flex items-center px-6 justify-between text-[9px] font-mono opacity-30 uppercase font-bold theme-transition">
                <span>Batch_Karen_Jefa</span>
                <span>Karen_Creative_Suite_v2</span>
            </div>
        </div>
    `).join('');

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
    // Skill Items
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

    // Testimonials
    document.querySelectorAll('.testimonial-card').forEach(el => {
        const quote = el.dataset.quote;
        el.innerHTML = `
            <div class="p-4 rounded-2xl bg-black/5 border border-black/5 relative shadow-sm text-left italic">
                <i data-lucide="quote" class="w-3 h-3 text-violet-600 opacity-20 absolute -top-1 -left-1"></i>
                <p class="text-[10px] leading-relaxed opacity-60 font-medium">“${quote}”</p>
            </div>
        `;
    });
    lucide.createIcons();
}
