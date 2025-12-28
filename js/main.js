import { tools, projects } from './data.js';
import { hexToHSL, hslToHex, getContrast, generateProPalettes, findClosestPantone, getBlindnessSimulation } from './color-studio.js';

// --- UTILS ---
window.copyToClipboard = function (text) {
    navigator.clipboard.writeText(text).then(() => {
        // Simple visual feedback
        const el = document.activeElement;
        const original = el.innerHTML;
        el.innerHTML = '<i data-lucide="check" class="w-3 h-3"></i>';
        lucide.createIcons();
        setTimeout(() => {
            el.innerHTML = original;
            lucide.createIcons();
        }, 1000);
    });
};

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
    // Secret System Message 🤫
    console.log(
        "%c Karen Jefa System Loaded: Creative Perfection Detected. \n %c The muse of this code is online.",
        "color: #7c3aed; font-weight: 900; font-size: 16px; font-family: 'Playfair Display', serif; padding: 10px 0;",
        "color: #a8a29e; font-size: 12px; font-style: italic;"
    );

    setTimeout(() => {
        document.getElementById('booting-screen').style.display = 'none';
        const app = document.getElementById('app-container');
        app.style.opacity = '1';

        renderTools();
        renderContent();
        renderInspector();
        lucide.createIcons();

        // Inject Floating WhatsApp Button (Fixed Icon)
        const waBtn = document.createElement('a');
        waBtn.href = "https://wa.me/573164321424";
        waBtn.target = "_blank";
        waBtn.className = "fixed bottom-20 right-5 sm:bottom-8 sm:right-8 z-50 w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95 animate-pop cursor-pointer";
        waBtn.innerHTML = '<i data-lucide="message-circle" class="w-6 h-6 sm:w-8 sm:h-8"></i>';
        document.body.appendChild(waBtn);
        // Important: Re-run Lucide to render the new icon
        lucide.createIcons();

        // Welcome Modal Logic: Show only once per session
        if (!sessionStorage.getItem('welcomeShown')) {
            setTimeout(() => toggleWelcome(true), 500);
            sessionStorage.setItem('welcomeShown', 'true');
        }
    }, 1200);
};

window.sendWhatsApp = function () {
    const name = document.getElementById('contact-name').value;
    const msg = document.getElementById('contact-msg').value;
    const services = Array.from(document.querySelectorAll('input[name="service"]:checked')).map(cb => cb.value).join(', ');

    let text = `Hola Karen! Soy ${name}.`;
    if (services) text += ` Me interesa: ${services}.`;
    if (msg) text += ` ${msg}`;

    const url = `https://wa.me/573164321424?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
};

// --- QUIZ LOGIC (Global Helpers) ---
window.startQuiz = function () {
    document.getElementById('quiz-intro').classList.add('hidden');
    document.getElementById('quiz-q1').classList.remove('hidden');
    document.getElementById('quiz-q1').classList.add('animate-pop');
    document.getElementById('quiz-progress-bar').style.width = '33%';
    document.getElementById('quiz-result').classList.add('hidden');
};

window.nextQuiz = function (current, val) {
    document.getElementById('quiz-' + current).classList.add('hidden');
    const next = current === 'q1' ? 'q2' : 'q3';
    document.getElementById('quiz-' + next).classList.remove('hidden');
    document.getElementById('quiz-' + next).classList.add('animate-pop');

    // Update Progress
    const progress = current === 'q1' ? '66%' : '100%';
    document.getElementById('quiz-progress-bar').style.width = progress;
};

window.finishQuiz = function (val) {
    document.getElementById('quiz-q3').classList.add('hidden');
    document.getElementById('quiz-result').classList.remove('hidden');
    document.getElementById('quiz-result').classList.add('animate-pop');

    // Logic
    const title = val === 'design' ? 'Renovación Visual Premium' : 'Estrategia de Crecimiento';
    const desc = val === 'design'
        ? 'El problema no es tu talento, es cómo te presentas. Necesitamos alinear tu imagen con la calidad de tu trabajo para que puedas cobrar lo que vales sin miedo.'
        : 'Tienes el producto, pero te falta el sistema. Necesitamos crear un embudo de ventas y contenido estratégico que traiga clientes en piloto automático.';

    // Simulate Score Logic
    const score = Math.floor(Math.random() * (85 - 55 + 1)) + 55;

    // Animate Score
    const scoreEl = document.getElementById('health-score');
    let current = 0;
    const timer = setInterval(() => {
        current += 2;
        if (current >= score) {
            current = score;
            clearInterval(timer);
        }
        scoreEl.innerText = current + '%';
        // Color logic
        scoreEl.style.color = score < 70 ? '#f87171' : '#fbbf24';
        if (score > 80) scoreEl.style.color = '#4ade80';
    }, 20);

    document.getElementById('result-title').innerText = title;
    document.getElementById('result-desc').innerText = desc;
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
    const mobileContainer = document.getElementById('mobile-nav');

    const html = tools.map(tool => `
        <button
            onclick="setActiveTool('${tool.id}')"
            class="w-12 h-12 flex items-center justify-center rounded-xl transition-all relative group ${activeTool === tool.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'hover:bg-black/5 opacity-40 hover:opacity-100'}"
        >
            <i data-lucide="${tool.icon}" class="w-5 h-5"></i>
            <span class="absolute left-16 bg-black text-white text-[9px] px-2 py-1.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-4px] group-hover:translate-x-0 whitespace-nowrap z-50 uppercase font-bold tracking-widest hidden sm:block">
                ${tool.label}
            </span>
        </button>
    `).join('');

    if (container) container.innerHTML = html;

    // Mobile Render
    if (mobileContainer) {
        mobileContainer.innerHTML = tools.map(tool => `
            <button
                onclick="setActiveTool('${tool.id}')"
                class="group relative flex items-center justify-center w-12 h-12 rounded-full transition-all"
            >
                <div class="absolute inset-0 bg-violet-600 rounded-full opacity-0 scale-50 transition-all duration-300 ${activeTool === tool.id ? 'opacity-100 scale-100' : ''}"></div>
                <i data-lucide="${tool.icon}" class="relative z-10 w-5 h-5 transition-colors ${activeTool === tool.id ? 'text-white' : 'text-stone-400 dark:text-stone-500'}"></i>
            </button>
        `).join('');
    }

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

// --- COLOR PICKER LOGIC ---
let pickerState = { h: 260, s: 100, v: 100, isDraggingSal: false, isDraggingHue: false };
let pickerListenersAdded = false;

// Flag for GLOBAL listeners only
let pickerGlobalListenersAttached = false;

function initCustomPicker() {
    const salArea = document.getElementById('picker-sl');
    const hueArea = document.getElementById('picker-hue');

    if (!salArea || !hueArea) return;

    const handleMove = (e, type) => {
        const rect = (type === 'sl' ? salArea : hueArea).getBoundingClientRect();

        // Handle both Mouse and Touch events
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        let x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        let y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

        if (type === 'sl') {
            pickerState.s = x * 100;
            pickerState.v = (1 - y) * 100;
            const handle = document.getElementById('picker-sl-handle');
            if (handle) {
                handle.style.left = `${x * 100}%`;
                handle.style.top = `${y * 100}%`;
            }
        } else {
            pickerState.h = x * 360;
            const handle = document.getElementById('picker-hue-handle');
            if (handle) {
                handle.style.left = `${x * 100}%`;
            }
            const slbg = document.getElementById('picker-sl');
            if (slbg) slbg.style.backgroundColor = `hsl(${pickerState.h}, 100%, 50%)`;
        }

        const hex = hsvToHex(pickerState.h, pickerState.s, pickerState.v);
        // Live Preview only (no heavy commit)
        currentBaseColor = hex;

        // Update Text
        const hexDisplay = document.getElementById('picker-hex-display');
        if (hexDisplay) hexDisplay.textContent = hex;

        // Update Visuals
        document.querySelectorAll('.live-preview-bg').forEach(el => el.style.backgroundColor = hex);
        document.querySelectorAll('.live-preview-text').forEach(el => {
            el.style.color = hex;
            el.style.borderColor = hex;
        });
    };

    // Events Wrappers
    const onStartSl = (e) => {
        pickerState.isDraggingSal = true;
        handleMove(e, 'sl');
    };

    const onStartHue = (e) => {
        pickerState.isDraggingHue = true;
        handleMove(e, 'hue');
    };

    // Always re-attach LOCAL listeners (since elements are new)
    // Mouse
    salArea.addEventListener('mousedown', onStartSl);
    hueArea.addEventListener('mousedown', onStartHue);
    // Touch
    salArea.addEventListener('touchstart', (e) => { e.preventDefault(); onStartSl(e); }, { passive: false });
    hueArea.addEventListener('touchstart', (e) => { e.preventDefault(); onStartHue(e); }, { passive: false });


    // Attach GLOBAL listeners only ONCE
    if (!pickerGlobalListenersAttached) {
        const onEnd = () => {
            if (pickerState.isDraggingSal || pickerState.isDraggingHue) {
                pickerState.isDraggingSal = false;
                pickerState.isDraggingHue = false;
                updateColor(currentBaseColor); // Commit change
            }
        };

        const onMove = (e) => {
            if (pickerState.isDraggingSal) {
                e.preventDefault();
                handleMove(e, 'sl');
            }
            if (pickerState.isDraggingHue) {
                e.preventDefault();
                handleMove(e, 'hue');
            }
        };

        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);
        window.addEventListener('mousemove', onMove, { passive: false });
        window.addEventListener('touchmove', onMove, { passive: false });

        pickerGlobalListenersAttached = true;
    }
}

function hsvToHex(h, s, v) {
    s /= 100;
    v /= 100;
    let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`;
}


function renderContent() {
    const container = document.getElementById('main-content-render');
    const tool = tools.find(t => t.id === activeTool);
    const themePanel = isDarkMode ? 'bg-[#1D1B4B]' : 'bg-white';
    const themeBorder = isDarkMode ? 'border-indigo-900/30' : 'border-stone-300';
    const themeTextSub = isDarkMode ? 'text-stone-400' : 'text-stone-500';

    let html = `
        <div class="mb-14">
            <div class="stagger-anim opacity-0 translate-y-4 flex items-center gap-2 text-[10px] font-bold text-violet-600 mb-3 tracking-[0.4em] uppercase">
                <i data-lucide="chevron-right" class="w-3 h-3"></i> ${tool.role}
            </div>
            <h2 class="stagger-anim opacity-0 translate-y-4 text-3xl sm:text-6xl font-serif italic mb-6 sm:mb-8 leading-none dark:text-stone-100">${tool.label}</h2>
            
            ${activeTool === 'about' ? `
                <div class="stagger-anim opacity-0 translate-y-4 max-w-4xl border-l-2 sm:border-l-4 border-violet-600 pl-4 sm:pl-8 py-2 mb-10 sm:mb-16">
                    ${tool.intro.map(p => `<p class="text-[14px] sm:text-xl font-serif leading-relaxed mb-4 sm:mb-6 opacity-90 text-justify sm:text-left">${p}</p>`).join('')}
                </div>
                 <!-- QUÉ HAGO -->
                <div class="stagger-anim opacity-0 translate-y-4 mb-20">
                    <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 mb-6 sm:mb-8 border-b ${themeBorder} pb-4">Qué_Hago</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        ${tool.whatIDo.map(item => `
                            <div class="${themePanel} p-6 sm:p-8 rounded-3xl border ${themeBorder} shadow-sm hover:shadow-md transition-all">
                                <h4 class="font-bold text-base sm:text-lg mb-2 sm:mb-3 font-serif italic">${item.title}</h4>
                                <p class="text-xs sm:text-sm ${themeTextSub} leading-relaxed font-medium">${item.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <!-- SKILLS & PROCESS -->
                 <div class="stagger-anim opacity-0 translate-y-4 grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 mb-20">
                    <div class="lg:col-span-7">
                        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 mb-6 sm:mb-8 border-b ${themeBorder} pb-4">Habilidades_Core</h3>
                        <div class="grid grid-cols-2 gap-6 sm:gap-8">
                            <div>
                                <span class="text-[9px] sm:text-[10px] uppercase font-bold opacity-40 mb-4 block tracking-widest">Creativas</span>
                                <ul class="space-y-3">
                                    ${tool.skills.creative.map(s => `<li class="text-[11px] sm:text-xs font-bold flex items-center gap-2"><div class="w-1 h-1 bg-violet-600 rounded-full"></div> ${s}</li>`).join('')}
                                </ul>
                            </div>
                            <div>
                                <span class="text-[9px] sm:text-[10px] uppercase font-bold opacity-40 mb-4 block tracking-widest">Técnicas_&_Pro</span>
                                <ul class="space-y-3">
                                    ${[...tool.skills.technical, ...tool.skills.professional].map(s => `<li class="text-[11px] sm:text-xs font-bold flex items-center gap-2"><div class="w-1 h-1 bg-stone-400 rounded-full"></div> ${s}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="lg:col-span-5">
                       <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 mb-6 sm:mb-8 border-b ${themeBorder} pb-4">Proceso_Creativo</h3>
                        <div class="${themePanel} p-6 sm:p-8 rounded-[2rem] border ${themeBorder}">
                            <ul class="space-y-6 relative">
                                <div class="absolute left-[7px] top-2 bottom-2 w-[1px] bg-stone-200 dark:bg-stone-800"></div>
                                ${tool.process.map((step, i) => `
                                    <li class="relative pl-8">
                                        <div class="absolute left-0 top-1.5 w-3.5 h-3.5 bg-violet-600 rounded-full border-4 border-white dark:border-[#1D1B4B]"></div>
                                        <span class="text-[9px] font-bold opacity-30 uppercase tracking-widest mb-1 block">Fase 0${i + 1}</span>
                                        <span class="text-xs sm:text-sm font-bold">${step}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                 </div>
                 <div class="stagger-anim opacity-0 translate-y-4 grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                     <div class="${themePanel} p-6 sm:p-8 rounded-[2rem] border ${themeBorder}">
                        <h3 class="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-6">Educación</h3>
                        <p class="text-xs sm:text-sm leading-relaxed font-medium opacity-80">${tool.education}</p>
                     </div>
                     <div class="bg-violet-600 text-white p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-violet-600/20">
                        <h3 class="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6">Status</h3>
                        <p class="text-base sm:text-lg font-serif italic mb-6">${tool.contact.text}</p>
                     </div>
                </div>
            ` : `
                 <div class="stagger-anim opacity-0 translate-y-4 max-w-3xl border-l-4 border-violet-600 pl-6 sm:pl-8 py-2">
                    <p class="text-xl sm:text-2xl italic opacity-90 leading-relaxed font-serif mb-6">${tool.desc}</p>
                    <p class="text-xs sm:text-sm opacity-50 mt-4 leading-relaxed font-medium">${tool.manifesto}</p>
                </div>
            `}
        </div>
    `;

    if (activeTool === 'color') {
        const palettes = generateProPalettes(currentBaseColor);
        // pantoneMatches is an ARRAY of 3 objects now
        const pantoneMatches = findClosestPantone(currentBaseColor);
        const primaryMatch = pantoneMatches[0];

        html += `
            <div class="stagger-anim opacity-0 translate-y-4 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24 items-start">
                
                <!-- LEFT COLUMN: Color Editor -->
                <div class="lg:col-span-4 flex flex-col gap-6">
                    
                    <!-- PRO COLOR EDITOR (Fixed Dragging) -->
                    <div class="${themePanel} border ${themeBorder} rounded-[2rem] p-5 sm:p-6 shadow-xl theme-transition relative overflow-hidden">
                        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 mb-6">Studio_Editor</h3>
                        
                        <!-- Picker Areas -->
                        <div id="picker-sl" class="w-full aspect-[4/3] rounded-xl mb-4 relative picker-saturation shadow-inner" style="background-color: hsl(${pickerState.h}, 100%, 50%)">
                            <div id="picker-sl-handle" class="w-4 h-4 rounded-full border-2 border-white shadow-md absolute -ml-2 -mt-2 pointer-events-none" style="background: ${currentBaseColor}; left: ${pickerState.s}%; top: ${100 - pickerState.v}%"></div>
                        </div>
                        <div id="picker-hue" class="w-full h-4 rounded-full mb-6 relative picker-hue shadow-inner">
                             <div id="picker-hue-handle" class="w-4 h-4 rounded-full border-2 border-white shadow-md absolute top-0 -ml-2 bg-transparent pointer-events-none" style="left: ${pickerState.h / 3.6}%"></div>
                        </div>

                        <!-- Codes -->
                        <div class="flex items-center gap-2">
                             <div class="flex-1 bg-black/5 dark:bg-white/5 rounded-xl px-4 py-3 flex justify-between items-center max-w-full">
                                <span class="text-xs font-bold opacity-50">HEX</span>
                                <span id="picker-hex-display" class="text-sm font-bold uppercase tracking-widest truncate">${currentBaseColor}</span>
                             </div>
                             <button onclick="window.copyToClipboard('${currentBaseColor}')" class="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-colors">
                                <i data-lucide="copy" class="w-4 h-4"></i>
                             </button>
                        </div>
                    </div>

                    <!-- Pantone Pro Card (New Design) -->
                    <div class="rounded-[2rem] shadow-xl overflow-hidden border ${themeBorder} theme-transition">
                        <!-- Top Color Half -->
                        <div class="h-24 sm:h-32 w-full relative group" style="background-color: ${primaryMatch.hex}">
                            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm text-white font-bold text-xs uppercase cursor-pointer" onclick="window.copyToClipboard('${primaryMatch.code}')">
                                Copy ${primaryMatch.code}
                            </div>
                        </div>
                        <!-- Bottom Info Half -->
                        <div class="bg-white dark:bg-[#1D1B4B] p-5 sm:p-6">
                            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Pantone_Match</h3>
                            <div class="flex items-end justify-between">
                                <div>
                                    <h2 class="text-3xl sm:text-4xl font-serif italic leading-none mb-1 text-black dark:text-white">${primaryMatch.code.replace('C', '')} <span class="text-lg opacity-50 not-italic font-sans font-bold">C</span></h2>
                                    <p class="text-xs font-bold opacity-40 uppercase tracking-widest">${primaryMatch.name}</p>
                                </div>
                            </div>
                            <!-- Suggestions -->
                            <div class="mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                                <span class="text-[8px] font-bold uppercase opacity-30 tracking-widest block mb-3">Alternativas_Cercanas</span>
                                <div class="flex gap-2">
                                    ${pantoneMatches.slice(1).map(p => `
                                        <div class="flex-1 flex gap-2 items-center bg-black/5 dark:bg-white/5 p-2 rounded-lg cursor-pointer hover:bg-black/10 transition-colors" onclick="updateColor('${p.hex}')">
                                            <div class="w-6 h-6 rounded-md shadow-sm" style="background-color: ${p.hex}"></div>
                                            <div class="overflow-hidden">
                                                <div class="text-[9px] font-bold truncate">${p.code}</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- RIGHT COLUMN: Live & Palettes -->
                <div class="lg:col-span-8 flex flex-col gap-6">
                    
                    <!-- Live Preview -->
                    <div class="${themePanel} border ${themeBorder} rounded-[2rem] p-8 theme-transition min-h-[300px] flex items-center justify-center relative overflow-hidden">
                         <div class="absolute top-6 left-8 text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 z-10">UI_Live_Playground</div>
                         
                         <!-- Mock UI Component -->
                         <div class="w-full max-w-lg bg-stone-100 dark:bg-black/20 rounded-2xl p-8 flex flex-col sm:flex-row gap-8 items-center justify-center border border-stone-200 dark:border-white/5 relative z-0">
                            <!-- Card Mockup -->
                            <div class="w-60 bg-white dark:bg-[#1A1844] rounded-2xl shadow-xl overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                                <div class="h-24 w-full live-preview-bg" style="background-color: ${currentBaseColor}"></div>
                                <div class="p-5 text-center -mt-10">
                                    <div class="w-20 h-20 bg-white rounded-full mx-auto p-1 shadow-md mb-3">
                                        <div class="w-full h-full rounded-full bg-stone-200 bg-cover bg-center" style="background-image: url('assets/images/profile/perfil.png');"></div>
                                    </div>
                                    <h4 class="font-bold text-sm mb-1 dark:text-white">Karen Jefa</h4>
                                    <p class="text-[10px] opacity-50 mb-4 dark:text-stone-300">Creative Director</p>
                                    <button class="w-full py-2 rounded-lg text-[10px] font-bold text-white shadow-lg  hover:opacity-90 transition-opacity live-preview-bg" style="background-color: ${currentBaseColor}">FOLLOW</button>
                                </div>
                            </div>
                            
                            <!-- UI Controls -->
                            <div class="space-y-4 w-full sm:w-auto">
                                <button class="px-8 py-3 rounded-xl font-bold text-xs text-white shadow-lg transition-transform hover:-translate-y-1 block w-full live-preview-bg" style="background-color: ${currentBaseColor}">Primary Action</button>
                                <button class="px-8 py-3 rounded-xl font-bold text-xs bg-white dark:bg-white/5 border-2 transition-transform hover:-translate-y-1 block w-full dark:text-white live-preview-text" style="border-color: ${currentBaseColor}; color: ${currentBaseColor}">Secondary Action</button>
                                <div class="flex gap-2">
                                     <div class="h-2 flex-1 rounded-full bg-stone-200 dark:bg-white/10 overflow-hidden"><div class="h-full live-preview-bg" style="width: 70%; background-color: ${currentBaseColor}"></div></div>
                                </div>
                            </div>
                         </div>
                    </div>

                    <!-- Adobe-Style Harmonies -->
                    <div class="grid grid-cols-1 gap-4">
                        ${Object.entries(palettes).filter(([k]) => k !== 'Shades').map(([name, colors]) => `
                            <div class="${themePanel} border ${themeBorder} rounded-[1.5rem] p-6 shadow-sm theme-transition">
                                <div class="flex justify-between items-center mb-4">
                                    <h4 class="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">${name}</h4>
                                    <button onclick="window.copyToClipboard('${colors.join(', ')}')" class="text-[9px] font-bold text-violet-600 hover:underline">COPY PALETTE</button>
                                </div>
                                <div class="flex h-20 rounded-xl overflow-hidden shadow-sm relative group">
                                    ${colors.map((c, idx) => `
                                        <div onclick="updateColor('${c}')" class="flex-1 cursor-pointer hover:scale-105 active:scale-95 transition-transform relative border-r border-white/10 last:border-0" style="background-color: ${c}">
                                             <div class="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[1px]">
                                                <span class="text-white text-[9px] font-mono font-bold shadow-sm">${c}</span>
                                                <span class="text-[7px] text-white/80 uppercase font-bold tracking-widest mt-1">
                                                    ${idx === 0 ? 'Base' : 'Accent'}
                                                </span>
                                             </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                </div>
            </div>
        `;

        // Init picker listeners (only if not already added? No, we need to re-attach if DOM was replaced.
        // Wait, updateColor replaces DOM! So initCustomPicker needs to run again.
        // But my 'pickerListenersAdded' check prevents that.
        // Fix: Reset that flag on render? No, the best way is to re-attach always because elements are new.
        // But window listeners accumulate.
        // The robust way: Remove old window listeners before adding new.
        // Simplified approach: Inline window listeners or check if existing.
        // Let's use a cleaner approach: Since I don't see a clear 'teardown' phase here, 
        // I'll make sure internal event handlers are robust. 
        // Actually, renderContent destroys the old elements, so old element listeners die. 
        // But window listeners persist.
        // Let's reset the global flag logic.
        if (pickerState) { // Reset picker state if needed
            pickerListenersAdded = false;
            setTimeout(initCustomPicker, 50);
        }

    } else if (activeTool === 'gallery') {
        // Placeholder images for masonry since we don't have real ones yet
        // Using colors/abstracts for now as "moods"
        const moods = [
            { color: '#FF6B6B', title: 'Urban Sunset', size: 'h-64' },
            { color: '#4ECDC4', title: 'Neon Dreams', size: 'h-96' },
            { color: '#45B7D1', title: 'Deep Ocean', size: 'h-80' },
            { color: '#96CEB4', title: 'Mint Fresh', size: 'h-64' },
            { color: '#FFEEAD', title: 'Golden Hour', size: 'h-96' },
            { color: '#D4A5A5', title: 'Dusty Rose', size: 'h-80' }
        ];

        html += `
            <div class="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 mb-24">
                ${moods.map((m, i) => `
                    <div class="break-inside-avoid rounded-[2rem] overflow-hidden relative group cursor-zoom-in">
                        <div class="${m.size} w-full transition-transform duration-700 group-hover:scale-110" style="background-color: ${m.color}; opacity: 0.8">
                            <!-- Placeholder for real image -->
                            <div class="w-full h-full bg-[url('assets/images/projects/neon.jpg')] bg-cover bg-center opacity-50 mix-blend-overlay"></div>
                        </div>
                        <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-end p-8">
                            <div class="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <h3 class="text-white font-serif italic text-2xl">${m.title}</h3>
                                <p class="text-white/60 text-xs font-bold uppercase tracking-widest mt-2">Moodboard 0${i + 1}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
       `;

    } else if (activeTool === 'strategy') {
        html += `
            <div class="max-w-4xl mx-auto mb-24 font-sans">
                <!-- Main Container -->
                <div class="${themePanel} border ${themeBorder} rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-all duration-500">
                    
                    <!-- Progress Bar (Dynamic Width) -->
                    <div id="quiz-progress-bar" class="absolute top-0 left-0 h-1.5 bg-violet-600 transition-all duration-500" style="width: 0%"></div>

                    <!-- Intro Screen -->
                    <div id="quiz-intro" class="text-center py-10">
                        <h2 class="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-6">Diagnóstico Estratégico</h2>
                        <h1 class="text-4xl md:text-5xl font-serif italic mb-6 leading-tight">¿Qué necesita tu marca <br/> <span class="text-violet-600">realmente?</span></h1>
                        <p class="text-lg opacity-60 max-w-lg mx-auto mb-12 leading-relaxed">Responde 3 preguntas honestas y recibe una hoja de ruta clara para tu siguiente nivel.</p>
                        
                         <button onclick="startQuiz()" class="group relative px-10 py-4 bg-violet-600 text-white rounded-full font-bold uppercase text-xs tracking-widest overflow-hidden shadow-lg shadow-violet-600/30 hover:scale-105 transition-transform active:scale-95">
                            <span class="relative z-10 flex items-center gap-3">
                                Iniciar Diagnóstico <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                            </span>
                            <div class="absolute inset-0 bg-violet-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                        </button>
                    </div>

                    <!-- Question 1 -->
                    <div id="quiz-q1" class="hidden">
                        <div class="flex justify-between items-end mb-10 border-b ${themeBorder} pb-6">
                            <div>
                                <span class="text-xs font-black uppercase tracking-widest text-violet-600 mb-2 block">Paso 01/03</span>
                                <h3 class="text-2xl font-bold">Prioridad Actual</h3>
                            </div>
                            <span class="text-4xl opacity-10 font-serif italic">01</span>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button onclick="nextQuiz('q1', 'design')" class="text-left group relative p-8 rounded-[2rem] border ${themeBorder} hover:border-violet-600 hover:shadow-xl hover:shadow-violet-600/5 transition-all bg-stone-50/50 dark:bg-white/5">
                                <div class="w-12 h-12 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center mb-6 shadow-sm border ${themeBorder} group-hover:scale-110 transition-transform">
                                    <i data-lucide="palette" class="w-6 h-6 text-violet-600"></i>
                                </div>
                                <h4 class="text-lg font-bold mb-2 group-hover:text-violet-600 transition-colors">Imagen & Percepción</h4>
                                <p class="text-sm opacity-60 leading-relaxed">"Siento que mi marca se ve amateur. Necesito elevar mi estética para cobrar mejor."</p>
                            </button>

                            <button onclick="nextQuiz('q1', 'growth')" class="text-left group relative p-8 rounded-[2rem] border ${themeBorder} hover:border-violet-600 hover:shadow-xl hover:shadow-violet-600/5 transition-all bg-stone-50/50 dark:bg-white/5">
                                <div class="w-12 h-12 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center mb-6 shadow-sm border ${themeBorder} group-hover:scale-110 transition-transform">
                                    <i data-lucide="trending-up" class="w-6 h-6 text-violet-600"></i>
                                </div>
                                <h4 class="text-lg font-bold mb-2 group-hover:text-violet-600 transition-colors">Ventas & Tráfico</h4>
                                <p class="text-sm opacity-60 leading-relaxed">"Necesito clientes YA. Mi problema no es lo bonito, es que nadie me ve."</p>
                            </button>
                        </div>
                    </div>

                    <!-- Question 2 -->
                    <div id="quiz-q2" class="hidden">
                         <div class="flex justify-between items-end mb-10 border-b ${themeBorder} pb-6">
                            <div>
                                <span class="text-xs font-black uppercase tracking-widest text-violet-600 mb-2 block">Paso 02/03</span>
                                <h3 class="text-2xl font-bold">Canal Principal</h3>
                            </div>
                            <span class="text-4xl opacity-10 font-serif italic">02</span>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button onclick="nextQuiz('q2', 'design')" class="text-left group relative p-8 rounded-[2rem] border ${themeBorder} hover:border-violet-600 hover:shadow-xl hover:shadow-violet-600/5 transition-all bg-stone-50/50 dark:bg-white/5">
                                <div class="w-12 h-12 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center mb-6 shadow-sm border ${themeBorder} group-hover:scale-110 transition-transform">
                                    <i data-lucide="users" class="w-6 h-6 text-violet-600"></i>
                                </div>
                                <h4 class="text-lg font-bold mb-2 group-hover:text-violet-600 transition-colors">Referidos / Organic</h4>
                                <p class="text-sm opacity-60 leading-relaxed">"Vivo del boca a boca. Si no me recomiendan, no vendo."</p>
                            </button>

                            <button onclick="nextQuiz('q2', 'growth')" class="text-left group relative p-8 rounded-[2rem] border ${themeBorder} hover:border-violet-600 hover:shadow-xl hover:shadow-violet-600/5 transition-all bg-stone-50/50 dark:bg-white/5">
                                <div class="w-12 h-12 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center mb-6 shadow-sm border ${themeBorder} group-hover:scale-110 transition-transform">
                                    <i data-lucide="megaphone" class="w-6 h-6 text-violet-600"></i>
                                </div>
                                <h4 class="text-lg font-bold mb-2 group-hover:text-violet-600 transition-colors">Ads / Social Media</h4>
                                <p class="text-sm opacity-60 leading-relaxed">"Intento mover redes y pauta, pero siento que tiro el dinero."</p>
                            </button>
                        </div>
                    </div>

                    <!-- Question 3 -->
                    <div id="quiz-q3" class="hidden">
                         <div class="flex justify-between items-end mb-10 border-b ${themeBorder} pb-6">
                            <div>
                                <span class="text-xs font-black uppercase tracking-widest text-violet-600 mb-2 block">Paso 03/03</span>
                                <h3 class="text-2xl font-bold">Mayor Obstáculo</h3>
                            </div>
                            <span class="text-4xl opacity-10 font-serif italic">03</span>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button onclick="finishQuiz('design')" class="text-left group relative p-8 rounded-[2rem] border ${themeBorder} hover:border-violet-600 hover:shadow-xl hover:shadow-violet-600/5 transition-all bg-stone-50/50 dark:bg-white/5">
                                <div class="w-12 h-12 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center mb-6 shadow-sm border ${themeBorder} group-hover:scale-110 transition-transform">
                                    <i data-lucide="eye-off" class="w-6 h-6 text-violet-600"></i>
                                </div>
                                <h4 class="text-lg font-bold mb-2 group-hover:text-violet-600 transition-colors">Inseguridad Visual</h4>
                                <p class="text-sm opacity-60 leading-relaxed">"Me da pena mandar mi portafolio o web actual."</p>
                            </button>

                            <button onclick="finishQuiz('growth')" class="text-left group relative p-8 rounded-[2rem] border ${themeBorder} hover:border-violet-600 hover:shadow-xl hover:shadow-violet-600/5 transition-all bg-stone-50/50 dark:bg-white/5">
                                <div class="w-12 h-12 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center mb-6 shadow-sm border ${themeBorder} group-hover:scale-110 transition-transform">
                                    <i data-lucide="message-square-dashed" class="w-6 h-6 text-violet-600"></i>
                                </div>
                                <h4 class="text-lg font-bold mb-2 group-hover:text-violet-600 transition-colors">Claridad del Mensaje</h4>
                                <p class="text-sm opacity-60 leading-relaxed">"No sé cómo explicar lo que hago de forma atractiva."</p>
                            </button>
                        </div>
                    </div>

                    <!-- Result -->
                    <div id="quiz-result" class="hidden text-center py-8">
                         <div class="inline-block px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-widest mb-6 animate-pulse">
                            Diagnóstico Completado
                         </div>
                         <h2 class="text-4xl md:text-5xl font-serif italic mb-6">Tu hoja de ruta:</h2>
                         
                         <div class="p-8 rounded-[2rem] bg-violet-600 text-white mb-10 shadow-2xl shadow-violet-600/40 relative overflow-hidden group">
                            <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div class="relative z-10">
                                <div class="mb-4 opacity-80 text-xs font-bold uppercase tracking-widest">Salud de Marca Actual</div>
                                <div id="health-score" class="text-6xl font-black mb-6">0%</div>
                                <h4 id="result-title" class="text-2xl font-bold mb-4">Analizando...</h4>
                                <p id="result-desc" class="text-white/80 leading-relaxed font-medium">Procesando tus respuestas para darte la mejor estrategia.</p>
                            </div>
                         </div>

                         <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                             <button onclick="setActiveTool('contact')" class="w-full sm:w-auto px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-xl">
                                Agendar Asesoría
                             </button>
                             <button onclick="startQuiz()" class="w-full sm:w-auto px-10 py-5 border border-stone-300 dark:border-white/10 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                Repetir Test
                             </button>
                         </div>
                    </div>

                </div>
            </div>
        `;

    } else if (activeTool === 'contact') {
        html += `
            <div class="max-w-3xl mx-auto mb-24">
                 <div class="${themePanel} border ${themeBorder} rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative">
                    <div class="absolute top-8 right-8 text-violet-600 opacity-20">
                        <i data-lucide="send" class="w-12 h-12"></i>
                    </div>
                    
                    <h2 class="text-3xl font-serif italic mb-2">Hablemos de tu Proyecto</h2>
                    <p class="text-sm opacity-50 font-bold uppercase tracking-widest mb-10">Brief Interactivo</p>

                    <form class="space-y-8">
                        <div class="space-y-2">
                            <label class="text-xs font-black uppercase tracking-widest ml-1 opacity-60">¿Cómo te llamas?</label>
                            <input type="text" id="contact-name" placeholder="Tu nombre o empresa" class="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-6 py-4 font-bold focus:ring-2 focus:ring-violet-600 transition-all outline-none" />
                        </div>

                        <div class="space-y-4">
                             <label class="text-xs font-black uppercase tracking-widest ml-1 opacity-60">¿Qué necesitas?</label>
                             <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                ${['Branding', 'Web', 'Social', 'Otro'].map(opt => `
                                    <label class="cursor-pointer">
                                        <input type="checkbox" name="service" value="${opt}" class="peer sr-only" />
                                        <div class="h-14 flex items-center justify-center rounded-xl border ${themeBorder} text-sm font-bold peer-checked:bg-violet-600 peer-checked:text-white peer-checked:border-violet-600 transition-all hover:bg-black/5 dark:hover:bg-white/5">
                                            ${opt}
                                        </div>
                                    </label>
                                `).join('')}
                             </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-xs font-black uppercase tracking-widest ml-1 opacity-60">Cuéntame más</label>
                            <textarea id="contact-msg" rows="4" placeholder="Detalles, sueños, fechas límite..." class="w-full bg-black/5 dark:bg-white/5 border-0 rounded-xl px-6 py-4 font-medium focus:ring-2 focus:ring-violet-600 transition-all outline-none resize-none"></textarea>
                        </div>

                        <button type="button" onclick="sendWhatsApp()" class="w-full py-5 bg-violet-600 text-white rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-violet-700 active:scale-[0.98] transition-all shadow-lg shadow-violet-600/20">
                            Enviar Brief por WhatsApp
                        </button>
                    </form>
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

    // GSAP Transition
    gsap.fromTo('.stagger-anim',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );
}

function renderWindows() {
    const container = document.getElementById('windows-layer');
    const themePanel = isDarkMode ? 'bg-[#1D1B4B]' : 'bg-white';
    const themeBorder = isDarkMode ? 'border-indigo-900/30' : 'border-stone-300';
    const themeSidebar = isDarkMode ? 'bg-[#16143C]' : 'bg-[#EAEAE5]';

    // Mobile Detection
    const isMobile = window.innerWidth < 640;

    const existingPositions = {};
    openProjects.forEach(p => {
        const el = document.getElementById(`win-${p.id}`);
        if (el) existingPositions[p.id] = { left: el.style.left, top: el.style.top, z: el.style.zIndex };
    });

    container.innerHTML = openProjects.map((p, index) => {
        // Smart Positioning
        let defaultLeft = isMobile ? '5%' : `${18 + (index * 3)}%`;
        let defaultTop = isMobile ? '15%' : `${12 + (index * 3)}%`;

        const pos = existingPositions[p.id] || {
            left: defaultLeft,
            top: defaultTop,
            z: focusedProject === p.id ? zIndexCounter : 100 + index
        };

        return `
            <div 
                onmousedown="focusProject(${p.id})"
                style="z-index: ${pos.z}; top: ${pos.top}; left: ${pos.left};"
                class="fixed w-[85%] sm:w-full sm:max-w-2xl ${themePanel} rounded-[2rem] border ${themeBorder} shadow-[0_30px_90px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col pointer-events-auto theme-transition"
                id="win-${p.id}"
            >
                <div 
                    onmousedown="initDrag(event, ${p.id})"
                    class="h-14 sm:h-11 ${themeSidebar} flex items-center justify-between px-6 window-header border-b ${themeBorder} theme-transition shrink-0 cursor-move"
                >
                    <div class="flex items-center gap-3 overflow-hidden">
                        <i data-lucide="image" class="w-3.5 h-3.5 opacity-40 shrink-0"></i>
                        <span class="text-[11px] font-bold uppercase tracking-widest truncate">${p.title}</span>
                    </div>
                    <div class="flex items-center gap-4 shrink-0 pl-4">
                        <button 
                            onmousedown="event.stopPropagation();"
                            onclick="event.stopPropagation(); closeProject(${p.id});" 
                            class="text-red-500 hover:bg-red-500 hover:text-white transition-all p-2 rounded-lg flex items-center justify-center relative z-50"
                        >
                            <span class="sr-only">Cerrar</span>
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
                <div class="flex-1 overflow-y-auto max-h-[70vh] sm:max-h-[65vh] p-6 sm:p-10 custom-scrollbar text-left">
                    <div class="rounded-[1.5rem] overflow-hidden mb-6 sm:mb-10 shadow-md h-48 sm:h-72 bg-stone-100">
                        <img src="${p.img}" class="w-full h-full object-cover" alt="${p.title}" />
                    </div>
                    <h3 class="text-3xl sm:text-5xl font-serif italic mb-4 sm:mb-6 leading-none break-words">${p.title}</h3>
                    <p class="text-[13px] sm:text-[15px] leading-relaxed opacity-60 mb-8 sm:mb-10 font-medium">
                        ${p.description} <br /><br />
                        Bajo la dirección estratégica de Karen, este proyecto se desarrolló desde la esencia, cuidando cada detalle del proceso creativo.
                    </p>
                    ${p.category === 'special' ? `
                        <button onclick="window.location.href='mailto:hola@karenjefa.com'" class="w-full sm:w-auto px-8 py-4 sm:px-12 sm:py-5 bg-violet-600 text-white rounded-full font-bold uppercase text-[10px] sm:text-[11px] tracking-widest hover:bg-violet-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-violet-600/20 text-center">
                            👉 Iniciar conversación
                        </button>
                    ` : `
                        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button class="w-full sm:w-auto px-6 py-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">Ver Detalles</button>
                            <button class="w-full sm:w-auto px-6 py-4 border border-black/10 dark:border-white/10 rounded-2xl text-[10px] sm:text-[11px] font-bold uppercase tracking-widest hover:bg-black/5 transition-colors">Compartir</button>
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
