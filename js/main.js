import { tools, projects, sidebarData, tutorialSteps } from './data.js';
import {
    generateProPalettes, hexToHSL, findClosestPantone, hexToRgb, rgbToCmyk,
    getMatchConfidence, checkPrintSafety, getChromaticFamily, getAccessibilityReport,
    fetchColorName, generateAura, generateGradients, extractColorsFromImage
} from './color-studio.js';

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
let currentBaseColor = '#5F259F'; // Nuevo morado predeterminado
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

        // Welcome & Tutorial Logic
        if (!localStorage.getItem('tutorialShown')) {
            setTimeout(() => {
                startTutorial();
                localStorage.setItem('tutorialShown', 'true');
            }, 1000);
        } else if (!sessionStorage.getItem('welcomeShown')) {
            // New session but not new user: Show Welcome Modal
            setTimeout(() => toggleWelcome(true), 500);
            sessionStorage.setItem('welcomeShown', 'true');
        }
    }, 1200);

    // Safety Fallback: Force open if something gets stuck
    setTimeout(() => {
        const boot = document.getElementById('booting-screen');
        if (boot && boot.style.display !== 'none') {
            console.warn('Boot sequence timeout - Forcing entry.');
            boot.style.display = 'none';
            document.getElementById('app-container').style.opacity = '1';
        }
    }, 5000);
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

window.handleImageUpload = async function (input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const url = URL.createObjectURL(file);

        // Update State
        window.currentImageURL = url;
        renderContent(false);

        // Auto-Extract on Load
        setTimeout(async () => {
            const { extractColorsFromImage } = await import('./color-studio.js');
            try {
                const colors = await extractColorsFromImage(url);
                if (colors && colors.length > 0) {
                    updateColor(colors[0]);
                }
            } catch (err) {
                console.error("Extraction failed", err);
            }
        }, 50);
    }
};

window.handleImageClick = function (e) {
    const img = e.target;
    // Calculate coordinates relative to the natural image size
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Scale ratio
    const limitX = img.naturalWidth || img.width;
    const limitY = img.naturalHeight || img.height;

    // Safety check just in case
    if (limitX === 0 || limitY === 0) return;

    const scaleX = limitX / img.clientWidth;
    const scaleY = limitY / img.clientHeight;

    const canvas = document.createElement('canvas');
    canvas.width = limitX;
    canvas.height = limitY;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    try {
        const pixel = ctx.getImageData(x * scaleX, y * scaleY, 1, 1).data;
        // pixel is [r, g, b, a]
        const r = pixel[0];
        const g = pixel[1];
        const b = pixel[2];
        const a = pixel[3];

        if (a < 128) {
            // Handle transparency? Maybe ignore or assume white background?
            return;
        }

        const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        updateColor(hex);

        // Optional: Simple visual feedback (ripple?)
    } catch (err) {
        console.error("Eyedropper Error", err);
    }
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

    // --- HOVER TEXT LOGIC ---
    const cursorText = document.getElementById('cursor-text');
    const hoverLabel = e.target.closest('[data-hover-title]');

    if (hoverLabel && cursorText) {
        cursorText.textContent = hoverLabel.getAttribute('data-hover-title');
        cursorText.style.opacity = '1';
        // Position next to cursor
        gsap.to(cursorText, { x: e.clientX + 20, y: e.clientY + 20, duration: 0.1 });
    } else if (cursorText) {
        cursorText.style.opacity = '0';
    }

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
    document.documentElement.classList.toggle('dark'); // Enable Tailwind & CSS dark mode
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
    renderContent(false);
    renderWindows();
};

window.setActiveTool = function (id) {
    activeTool = id;
    renderTools();
    renderContent(true);

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

    // DISABLE TRANSITIONS to prevent flickering/lag during drag
    if (currentTarget) currentTarget.style.transition = 'none';

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
    // RESTORE TRANSITIONS
    if (currentTarget) currentTarget.style.transition = '';

    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
}

// --- BRAND CARD EXPORT ---
window.downloadBrandCard = function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 1200;
    const height = 630; // OG Image standard size
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Accent Side
    ctx.fillStyle = currentBaseColor;
    ctx.fillRect(0, 0, 400, height);

    // Logo / Brand
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'italic 900 80px "Playfair Display", serif'; // Fallback font
    ctx.fillText('kj.', 100, 150);

    ctx.font = 'bold 20px sans-serif';
    ctx.globalAlpha = 0.6;
    ctx.fillText('KAREN JEFA', 100, 200);
    ctx.globalAlpha = 1.0;

    // Content Right Side
    ctx.fillStyle = '#000000';

    // Color Name
    const nameEl = document.getElementById('color-identity-name');
    const colorName = nameEl ? nameEl.textContent : 'Custom Color';
    ctx.font = 'italic 700 60px "Playfair Display", serif';
    ctx.fillText(colorName, 460, 150);

    // Codes
    ctx.font = 'bold 30px monospace';
    ctx.fillStyle = '#333';
    ctx.fillText(currentBaseColor.toUpperCase(), 460, 240);

    const rgb = hexToRgb(currentBaseColor);
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText(`RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`, 460, 290);

    // Viz
    ctx.fillStyle = currentBaseColor;
    ctx.beginPath();
    ctx.arc(1050, 150, 80, 0, Math.PI * 2);
    ctx.fill();

    // Download
    const link = document.createElement('a');
    link.download = `KarenJefa_Brand_${currentBaseColor.replace('#', '')}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

window.updateColor = function (hex) {
    currentBaseColor = hex;

    // --- GLOBAL THEME INJECTION (The "Wow" Factor) ---
    const styleId = 'dynamic-theme-styles';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    // Override the "Brand Color" (Violet) globally, including hover states and shadows
    styleTag.innerHTML = `
        .text-violet-600 { color: ${hex} !important; }
        .bg-violet-600 { background-color: ${hex} !important; }
        .border-violet-600 { border-color: ${hex} !important; }
        .shadow-violet-600\\/20 { box-shadow: 0 10px 15px -3px ${hex}33 !important; }
        .shadow-violet-500\\/20 { box-shadow: 0 10px 15px -3px ${hex}33 !important; }
        .hover\\:bg-violet-600:hover { background-color: ${hex} !important; }
        .group:hover .group-hover\\:text-violet-600 { color: ${hex} !important; }
        
        /* Extra accents & Skills */
        .text-violet-500 { color: ${hex} !important; }
        .bg-violet-500 { background-color: ${hex} !important; }
        .stroke-violet-600 { stroke: ${hex} !important; }
        .stroke-violet-500 { stroke: ${hex} !important; }
        
        /* Creative Progress Bar Gradient */
        .theme-progress-bar {
            background: linear-gradient(90deg, ${hex}66 0%, ${hex} 100%) !important;
            box-shadow: 0 0 10px ${hex}44;
        }

        @keyframes flash {
            0% { background-color: ${hex}aa; }
            100% { background-color: transparent; }
        }
        .animate-flash {
            animation: flash 0.4s ease-out;
        }
    `;

    // Manage History (Smart Persistence)
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('colorHistory')) || [];
    } catch (e) { history = []; }

    history = history.filter(c => c !== hex);
    history.unshift(hex);
    if (history.length > 5) history.pop();

    localStorage.setItem('colorHistory', JSON.stringify(history));

    renderContent(false);

    // --- ASYNC UPDATE: Name & Aura ---
    (async () => {
        try {
            const { fetchColorName, generateAura } = await import('./color-studio.js');

            // 1. Name
            const nameEl = document.getElementById('color-identity-name');
            if (nameEl) {
                const data = await fetchColorName(hex);
                // Ensure we are still on the same color (race condition)
                if (currentBaseColor === hex) {
                    nameEl.textContent = data.name;
                    nameEl.title = data.exact_match ? 'Nombre Exacto' : 'Aproximado';
                }
            }
        } catch (e) { console.error("Async Update Failed", e); }
    })();
};


// --- RENDERING ---
function renderTools() {
    const container = document.getElementById('tool-buttons');
    const mobileContainer = document.getElementById('mobile-nav');

    const html = tools.map(tool => `
        <button
            id="tool-btn-${tool.id}"
            onclick="setActiveTool('${tool.id}')"
            data-hover-title="${tool.label}"
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
        // Always fetch fresh elements to avoid stale closure references after re-renders
        const currentSal = document.getElementById('picker-sl');
        const currentHue = document.getElementById('picker-hue');
        if (!currentSal || !currentHue) return;

        const rect = (type === 'sl' ? currentSal : currentHue).getBoundingClientRect();

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

        // Debounced Color Name API
        clearTimeout(window.colorNameDebounce);
        window.colorNameDebounce = setTimeout(async () => {
            const nameData = await fetchColorName(hex);
            const nameEl = document.getElementById('color-identity-name');
            if (nameEl) {
                nameEl.textContent = nameData.name || 'Desconocido';
                nameEl.title = nameData.exact_match ? 'Nombre Exacto' : 'Aproximado';
            }
        }, 500);
    };

    const disableTransitions = () => {
        document.querySelectorAll('.live-preview-bg, .live-preview-text').forEach(el => {
            el.style.transition = 'none';
        });
    };

    const enableTransitions = () => {
        document.querySelectorAll('.live-preview-bg, .live-preview-text').forEach(el => {
            el.style.transition = '';
        });
    };

    // Events Wrappers
    const onStartSl = (e) => {
        pickerState.isDraggingSal = true;
        disableTransitions();
        handleMove(e, 'sl');
    };

    const onStartHue = (e) => {
        pickerState.isDraggingHue = true;
        disableTransitions();
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
                enableTransitions(); // Restore transitions
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



// --- TUTORIAL LOGIC ---
let currentStepIndex = 0;

window.startTutorial = function () {
    currentStepIndex = 0;
    const overlay = document.getElementById('tutorial-overlay');
    overlay.classList.remove('hidden');
    // Allow small delay for rendering visibility before positioning
    setTimeout(() => updateTutorialStep(), 100);
};

window.endTutorial = function () {
    const overlay = document.getElementById('tutorial-overlay');
    const backdrop = document.getElementById('tutorial-backdrop');

    // Reset visual state
    backdrop.style.width = '0px';
    backdrop.style.height = '0px';
    backdrop.style.top = '50%';
    backdrop.style.left = '50%';

    overlay.classList.add('hidden');
    currentStepIndex = 0;
};

window.nextStep = function () {
    currentStepIndex++;
    if (currentStepIndex >= tutorialSteps.length) {
        endTutorial();
    } else {
        updateTutorialStep();
    }
};

function updateTutorialStep() {
    const step = tutorialSteps[currentStepIndex];
    const targetEl = document.getElementById(step.target);
    const backdrop = document.getElementById('tutorial-backdrop');
    const card = document.getElementById('tutorial-card');

    if (!targetEl) {
        // Skip if target not found (e.g. mobile hidden elements)
        nextStep();
        return;
    }

    // Get Coordinates
    const rect = targetEl.getBoundingClientRect();
    const padding = 10;

    // Move Backdrop (Creating the "Hole")
    backdrop.style.width = `${rect.width + padding * 2}px`;
    backdrop.style.height = `${rect.height + padding * 2}px`;
    backdrop.style.top = `${rect.top - padding}px`;
    backdrop.style.left = `${rect.left - padding}px`;
    backdrop.style.position = 'absolute';

    // Update Content
    document.getElementById('tut-title').innerText = step.title;
    document.getElementById('tut-text').innerText = step.text;
    document.getElementById('tut-step-count').innerText = `PASO ${currentStepIndex + 1}/${tutorialSteps.length}`;

    // Rerender icons because we changed content dynamically
    if (window.lucide) window.lucide.createIcons();

    // Position Card (Smart Positioning)
    const cardRect = card.getBoundingClientRect();
    let top = rect.bottom + 20;
    let left = rect.left;

    // Check if correct goes off scren
    // Check if correction goes off screen
    if (top + cardRect.height > window.innerHeight) {
        top = rect.top - cardRect.height - 20; // Flip to top
    }

    // Safety check for top edge - ensure it doesn't go negative or too high up
    if (top < 20) {
        // If flipping to top makes it go off-screen, try below again or center it
        top = 20;
    }

    if (left + cardRect.width > window.innerWidth) {
        left = window.innerWidth - cardRect.width - 20; // Flip to left
    }

    // Safety check for left edge
    if (left < 20) left = 20;

    card.style.top = `${top}px`;
    card.style.left = `${left}px`;

    // Animate In
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 200);
}


function hsvToHex(h, s, v) {
    s /= 100;
    v /= 100;
    let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`;
}


function renderContent(animate = false) {
    const container = document.getElementById('main-content-render');
    const tool = tools.find(t => t.id === activeTool);
    const themePanel = isDarkMode ? 'bg-[#1D1B4B]' : 'bg-white';
    const themeBorder = isDarkMode ? 'border-indigo-900/30' : 'border-stone-300';
    const themeTextSub = isDarkMode ? 'text-stone-400' : 'text-stone-500';

    const animClass = animate ? 'stagger-anim opacity-0 translate-y-4' : '';

    let html = `
        <div class="mb-14">
            <div class="${animClass} flex items-center gap-2 text-[10px] font-bold text-violet-600 mb-3 tracking-[0.4em] uppercase">
                <i data-lucide="chevron-right" class="w-3 h-3"></i> ${tool.role}
            </div>
            <h2 class="${animClass} text-3xl sm:text-6xl font-serif italic mb-6 sm:mb-8 leading-none dark:text-stone-100">${tool.label}</h2>
            
            ${activeTool === 'about' ? `
                <div class="${animClass} grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16 mb-16 items-start">
                    <!-- Intro Text -->
                    <div class="lg:col-span-7 order-2 lg:order-1 border-l-2 sm:border-l-4 border-violet-600 pl-4 sm:pl-8 py-2">
                         ${tool.intro.map(p => `<p class="text-[14px] sm:text-l font-serif leading-relaxed mb-4 sm:mb-6 opacity-90 text-justify sm:text-left">${p}</p>`).join('')}
                    </div>

                    <!-- Profile Picture (Hierarchical Placement) -->
                    <div class="lg:col-span-5 order-1 lg:order-2">
                        <div class="relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-2xl group border ${themeBorder} transform rotate-3 hover:rotate-0 transition-all duration-700">
                             <div class="absolute inset-0 bg-violet-600/10 mix-blend-multiply pointer-events-none z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-700"></div>
                             <img src="assets/images/profile/perfil.png" 
                                  alt="Karen Jefa" 
                                  class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" />
                             
                             <!-- Floating Badge -->
                             <div class="absolute bottom-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 z-20">
                                <span class="text-[10px] font-black uppercase tracking-widest text-violet-600">The_Creator</span>
                             </div>
                        </div>
                    </div>
                </div>
                 <!-- QUÉ HAGO -->
                <div class="${animClass} mb-20">
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
                 <div class="${animClass} grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 mb-20">
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
                 <div class="${animClass} grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
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
                 <div class="${animClass} max-w-3xl border-l-4 border-violet-600 pl-6 sm:pl-8 py-2">
                    <p class="text-xl sm:text-2xl italic opacity-90 leading-relaxed font-serif mb-6">${tool.desc}</p>
                    <p class="text-xs sm:text-sm opacity-50 mt-4 leading-relaxed font-medium">${tool.manifesto}</p>
                </div>
            `}
        </div>
    `;

    if (activeTool === 'color') {
        // State Initialization
        window.pickerMode = window.pickerMode || 'manual';

        const palettes = generateProPalettes(currentBaseColor);
        const pantoneMatches = findClosestPantone(currentBaseColor);
        const primaryMatch = pantoneMatches[0];

        // Stats & Data
        const rgb = hexToRgb(currentBaseColor);
        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
        const hsl = hexToHSL(currentBaseColor);
        const confidence = getMatchConfidence(primaryMatch.distance);
        const safety = checkPrintSafety(rgb.r, rgb.g, rgb.b);
        const a11y = getAccessibilityReport(currentBaseColor);
        const aura = generateAura(currentBaseColor);
        const cosmicGradients = generateGradients(currentBaseColor, palettes);

        // History Logic (Load from LocalStorage)
        let history = [];
        try { history = JSON.parse(localStorage.getItem('colorHistory')) || ['#5F259F', '#000000', '#ffffff']; } catch (e) { }
        if (history.length === 0) history = ['#5F259F', '#000000', '#ffffff'];

        const pantoneHsl = hexToHSL(primaryMatch.hex);
        const currentFamily = getChromaticFamily(hsl.h, hsl.s, hsl.l);
        const pantoneFamily = getChromaticFamily(pantoneHsl.h, pantoneHsl.s, pantoneHsl.l);

        let matchLabel = "Pantone · Aproximación";
        let subLabel = "Basado en percepción visual y rango de impresión.";
        let recommendation = `
            <div class="flex items-center gap-2 mt-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
                <span>🖥️ Uso: Digital</span>
                <span class="mx-1">|</span>
                <span>🖨️ Impresión: Variable</span>
            </div>
        `;

        // Warning Logic
        if (primaryMatch.distance > 35 || currentFamily !== pantoneFamily) {
            matchLabel = "Pantone cercano";
            subLabel = `Fuera de familia cromática (${currentFamily} vs ${pantoneFamily}).`;
            recommendation = `
                <div class="flex items-center gap-2 mt-2 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                    <i data-lucide="alert-triangle" class="w-3 h-3"></i>
                    <span>Precaución en Impresión</span>
                </div>
             `;
        }

        html += `
            <div class="${animClass} mb-24">
                
                <!-- TOP BAR: History & Actions -->
                <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
                     <div class="flex items-center gap-2">
                        <span class="text-[9px] font-bold uppercase opacity-30 tracking-widest hidden sm:block">Recientes</span>
                        <div class="flex gap-2">
                            ${history.map(c => `
                                <button onclick="updateColor('${c}')" class="w-6 h-6 rounded-full border border-black/10 dark:border-white/10 shadow-sm transition-transform hover:scale-110" style="background-color: ${c}"></button>
                            `).join('')}
                        </div>
                     </div>
                     <div class="flex gap-3">
                         <button onclick="window.downloadBrandCard()" class="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transform">
                            <i data-lucide="download" class="w-3 h-3"></i> Exportar
                         </button>
                         <button onclick="window.copyToClipboard('${currentBaseColor}')" class="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-violet-600 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <i data-lucide="copy" class="w-3 h-3"></i> HEX
                         </button>
                         <button onclick="window.copyToClipboard('R:${rgb.r} G:${rgb.g} B:${rgb.b}')" class="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-violet-600 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <i data-lucide="copy" class="w-3 h-3"></i> RGB
                         </button>
                     </div>
                </div>

                <!-- TOP GRID: STUDIO & HARMONIES/A11Y -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
                    
                    <!-- LEFT COLUMN: DIGITAL STUDIO (Screen) -->
                    <div class="lg:col-span-5 flex flex-col gap-6">
                        <div class="flex items-center justify-between mb-2">
                             <div class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full bg-violet-500"></div>
                                <h3 class="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Digital_Studio</h3>
                             </div>
                             <!-- MODE SWITCHER -->
                             <div class="flex bg-black/5 dark:bg-white/5 rounded-lg p-1 gap-1">
                                <button onclick="window.pickerMode='manual'; renderContent(false);" class="px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${window.pickerMode === 'manual' ? 'bg-white dark:bg-stone-800 shadow-sm opacity-100' : 'opacity-40 hover:opacity-100'}">Manual</button>
                                <button onclick="window.pickerMode='image'; renderContent(false);" class="px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${window.pickerMode === 'image' ? 'bg-white dark:bg-stone-800 shadow-sm opacity-100' : 'opacity-40 hover:opacity-100'}">Imagen</button>
                             </div>
                        </div>

                        <!-- Main Editor -->
                        <div class="${themePanel} border ${themeBorder} rounded-[2rem] p-5 sm:p-6 shadow-xl theme-transition relative overflow-hidden">
                            
                            ${window.pickerMode === 'manual' ? `
                                <!-- Picker Areas -->
                                <div id="picker-sl" class="w-full aspect-[4/3] rounded-xl mb-4 relative picker-saturation shadow-inner" style="background-color: hsl(${pickerState.h}, 100%, 50%)">
                                    <div id="picker-sl-handle" class="w-4 h-4 rounded-full border-2 border-white shadow-md absolute -ml-2 -mt-2 pointer-events-none" style="background: ${currentBaseColor}; left: ${pickerState.s}%; top: ${100 - pickerState.v}%"></div>
                                </div>
                                <div id="picker-hue" class="w-full h-4 rounded-full mb-6 relative picker-hue shadow-inner">
                                     <div id="picker-hue-handle" class="w-4 h-4 rounded-full border-2 border-white shadow-md absolute top-0 -ml-2 bg-transparent pointer-events-none" style="left: ${pickerState.h / 3.6}%"></div>
                                </div>
                            ` : `
                                <!-- Image Drop Zone or Interactive Image -->
                                ${window.currentImageURL ? `
                                    <div class="w-full aspect-[4/3] rounded-xl mb-4 relative overflow-hidden shadow-inner group">
                                        <img src="${window.currentImageURL}" onclick="handleImageClick(event)" class="w-full h-full object-contain bg-pattern cursor-crosshair" id="interactive-img" />
                                        <button onclick="window.currentImageURL = null; renderContent(false);" class="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors backdrop-blur-md shadow-lg z-50" title="Cambiar Imagen">
                                            <i data-lucide="x" class="w-4 h-4"></i>
                                        </button>
                                        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white/90 text-[9px] font-bold uppercase tracking-widest pointer-events-none">
                                            Click para seleccionar
                                        </div>
                                    </div>
                                ` : `
                                    <div id="drop-zone" class="w-full aspect-[4/3] rounded-xl mb-4 relative border-2 border-dashed border-stone-300 dark:border-indigo-900/50 flex flex-col items-center justify-center gap-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5 group cursor-pointer overflow-hidden">
                                        <input type="file" id="img-input" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer z-50" onchange="handleImageUpload(this)">
                                        <div class="w-12 h-12 rounded-full bg-violet-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <i data-lucide="image-plus" class="w-6 h-6 text-violet-600"></i>
                                        </div>
                                        <span class="text-[10px] font-bold uppercase tracking-widest opacity-40">Arrastra o Click</span>
                                        <img id="preview-img" class="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none transition-opacity" />
                                    </div>
                                `}
                            `}

                            <!-- HEX Display -->
                            <div id="picker-hex-btn" class="flex items-center justify-between bg-black/5 dark:bg-white/5 rounded-xl px-4 py-3 cursor-pointer hover:bg-black/10 transition-colors relative overflow-hidden group" onclick="window.copyToClipboard(document.getElementById('picker-hex-display').textContent); const iconP = document.getElementById('picker-copy-icon'); if(iconP) { iconP.setAttribute('data-lucide', 'check'); iconP.classList.add('text-green-500'); lucide.createIcons(); setTimeout(() => { iconP.setAttribute('data-lucide', 'copy'); iconP.classList.remove('text-green-500'); lucide.createIcons(); }, 1500); }" title="Copiar HEX">
                                <div class="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/5 transition-colors"></div>
                                <div class="flex flex-col">
                                    <span class="text-[9px] font-bold opacity-40 uppercase tracking-wider">Nombre</span>
                                    <span id="color-identity-name" class="text-xs sm:text-sm font-black opacity-100 truncate max-w-[150px] leading-tight min-h-[18px] text-violet-600 dark:text-violet-400">Loading...</span>
                                </div>
                                <div class="flex items-center gap-2">
                                     <span id="picker-hex-display" class="text-xl font-serif italic ${isDarkMode ? 'text-white' : 'text-black'}">${currentBaseColor}</span>
                                     <i data-lucide="copy" id="picker-copy-icon" class="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity"></i>
                                </div>
                            </div>

                            <!-- AURA READING -->
                            <div class="mt-4 px-2">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="text-lg animate-float inline-block">${aura.vibe}</span>
                                    <span class="text-xs font-bold uppercase tracking-widest opacity-80">${aura.title}</span>
                                </div>
                                <p class="text-[10px] opacity-50 leading-relaxed font-medium">${aura.desc}</p>
                            </div>

                            <script>
                                // Auto-load color name on render
                                setTimeout(async () => {
                                    const nameData = await import('./color-studio.js').then(m => m.fetchColorName('${currentBaseColor}'));
                                    const el = document.getElementById('color-identity-name');
                                    if(el) {
                                        el.textContent = nameData.name;
                                        el.title = nameData.exact_match ? 'Nombre Exacto' : 'Aproximado';
                                    }
                                }, 100);
                            </script>
                        </div>

                        <!-- Technical Data Accordion -->
                        <div class="${themePanel} border ${themeBorder} rounded-[1.5rem] overflow-hidden">
                             <details class="group">
                                <summary class="flex items-center justify-between p-6 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                    <span class="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Datos_Técnicos</span>
                                    <i data-lucide="chevron-down" class="w-4 h-4 opacity-40 transition-transform group-open:rotate-180"></i>
                                </summary>
                                <div class="px-6 pb-6 pt-2 grid grid-cols-2 gap-4">
                                     <div>
                                        <span class="block text-[9px] font-bold opacity-30 mb-1">RGB</span>
                                        <span class="font-mono text-xs font-bold">${rgb.r}, ${rgb.g}, ${rgb.b}</span>
                                     </div>
                                     <div>
                                        <span class="block text-[9px] font-bold opacity-30 mb-1">HSL</span>
                                        <span class="font-mono text-xs font-bold">${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%</span>
                                     </div>
                                     <div>
                                        <span class="block text-[9px] font-bold opacity-30 mb-1">CMYK (Approx)</span>
                                        <span class="font-mono text-xs font-bold">${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}</span>
                                     </div>
                                      <div>
                                        <span class="block text-[9px] font-bold opacity-30 mb-1">Familia</span>
                                        <span class="font-mono text-xs font-bold">${currentFamily}</span>
                                     </div>
                                </div>
                            </details>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: CREATIVE EXPANSION (Harmonies & A11y & Gradients) -->
                    <div class="lg:col-span-7 flex flex-col gap-6">
                        <div class="flex items-center gap-2 mb-2">
                             <div class="w-2 h-2 rounded-full bg-violet-400"></div>
                             <h3 class="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Creative_Expansión</h3>
                        </div>

                        <!-- Harmonies (Compact Grid) -->
                        <div class="${themePanel} border ${themeBorder} rounded-[2rem] p-6 sm:p-8 shadow-sm">
                             <span class="text-[9px] font-bold uppercase opacity-30 tracking-widest block mb-6">Armonías Cromáticas</span>
                             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                ${Object.entries(palettes).map(([name, colors]) => `
                                    <div class="border border-black/5 dark:border-white/5 rounded-xl p-4 hover:bg-black/5 transition-colors group">
                                        <div class="flex justify-between mb-3">
                                            <span class="text-[9px] font-bold uppercase tracking-wider opacity-60">${name}</span>
                                            <i data-lucide="copy" class="w-3 h-3 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" onclick="window.copyToClipboard('${colors.join(', ')}')"></i>
                                        </div>
                                        <div class="flex h-10 rounded-lg overflow-hidden ring-1 ring-black/5">
                                            ${colors.map(c => `
                                                <div class="flex-1 h-full cursor-pointer hover:opacity-90 transition-opacity" style="background-color: ${c}" onclick="updateColor('${c}')" title="${c}"></div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            

                            
                            <!-- A11y Doctor (Simplified Strip) -->
                            <div class="bg-black/5 dark:bg-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div class="flex items-center gap-3">
                                    <div class="p-2 bg-white dark:bg-black rounded-lg shadow-sm">
                                        <i data-lucide="eye" class="w-4 h-4 opacity-50"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-xs">Visibilidad WCAG 2.1</h4>
                                        <p class="text-[10px] opacity-50">Contraste vs Blanco/Negro</p>
                                    </div>
                                </div>
                                <div class="flex gap-3">
                                    <div class="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-stone-900 rounded-lg border border-black/5">
                                        <span class="w-2 h-2 rounded-full ${a11y.onWhite.aa === 'Pass' ? 'bg-green-500' : 'bg-red-500'}"></span>
                                        <span class="text-[10px] font-bold">vs Blanco (${a11y.onWhite.ratio})</span>
                                    </div>
                                    <div class="flex items-center gap-2 px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded-lg border border-white/5">
                                        <span class="w-2 h-2 rounded-full ${a11y.onBlack.aa === 'Pass' ? 'bg-green-500' : 'bg-red-500'}"></span>
                                        <span class="text-[10px] font-bold">vs Negro (${a11y.onBlack.ratio})</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                    </div>
                </div>

                <!-- MIDDLE: UI_Live_Playground (The Big Card - Centerpiece) -->
                 <div class="${themePanel} mb-20 border ${themeBorder} rounded-[2rem] p-8 md:p-12 theme-transition relative overflow-hidden flex flex-col items-center text-center">
                     <div class="absolute top-8 left-8 text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 z-10">UI_Live_Playground</div>
                     
                     <!-- Interactive Playground -->
                     <div class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-0 mt-8">
                        
                        <!-- 1. The Profile Card -->
                        <div class="flex justify-center">
                            <div class="w-72 ${isDarkMode ? 'bg-[#1A1844]' : 'bg-white'} rounded-3xl shadow-2xl overflow-hidden transform rotate-[-3deg] hover:rotate-0 transition-transform duration-500 border border-black/5">
                                <div class="h-32 w-full live-preview-bg flex items-center justify-center relative" style="background-color: ${currentBaseColor}">
                                    <div class="absolute inset-0 bg-black/10"></div>
                                </div>
                                <div class="p-6 relative -mt-12 text-center">
                                    <div class="w-24 h-24 ${isDarkMode ? 'bg-[#1A1844]' : 'bg-white'} rounded-full mx-auto p-1.5 shadow-lg mb-4 relative z-10">
                                        <div class="w-full h-full rounded-full bg-stone-200 bg-cover bg-center" style="background-image: url('assets/images/profile/perfil.png');"></div>
                                    </div>
                                    <h4 class="font-bold text-xl mb-1 dark:text-white font-serif italic">Karen Jefa</h4>
                                    <p class="text-xs opacity-50 mb-6 uppercase tracking-widest font-bold">Creative Director</p>
                                    
                                    <button class="w-full py-4 rounded-xl text-xs font-black text-white shadow-xl hover:scale-105 transition-transform live-preview-bg tracking-widest uppercase" style="background-color: ${currentBaseColor}">
                                        Follow Me
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 2. UI Controls & States -->
                        <div class="flex flex-col gap-6 w-full text-left">
                            <!-- Button States -->
                            <!-- Button States -->
                            <div class="${isDarkMode ? 'bg-white/5' : 'bg-stone-50'} p-6 rounded-3xl border border-black/5">
                                <span class="text-[9px] font-bold uppercase opacity-30 tracking-widest block mb-4">Button Ecosystem</span>
                                <div class="flex flex-col gap-4">
                                    <button class="w-full py-4 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-3 hover:-translate-y-1 transition-transform live-preview-bg" style="background-color: ${currentBaseColor}">
                                        <span class="tracking-widest uppercase text-xs">Primary Interaction</span>
                                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                                    </button>
                                    <button class="w-full py-4 rounded-xl font-bold text-sm bg-white dark:bg-transparent border-2 flex items-center justify-center gap-3 hover:bg-stone-50 transition-colors live-preview-text" style="border-color: ${currentBaseColor}; color: ${currentBaseColor}">
                                        <span class="tracking-widest uppercase text-xs">Secondary Outline</span>
                                    </button>
                                </div>
                            </div>

                             <!-- Progress & Toggles -->
                             <!-- Progress & Toggles -->
                            <div class="${isDarkMode ? 'bg-white/5' : 'bg-stone-50'} p-6 rounded-3xl border border-black/5">
                                <span class="text-[9px] font-bold uppercase opacity-30 tracking-widest block mb-4">System Elements</span>
                                <div class="space-y-6">
                                     <!-- Loading -->
                                     <div>
                                        <div class="flex justify-between text-[10px] font-bold opacity-60 mb-2">
                                            <span>Loading Assets...</span>
                                            <span>65%</span>
                                        </div>
                                        <div class="h-2 w-full bg-stone-200 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div class="h-full live-preview-bg rounded-full" style="width: 65%; background-color: ${currentBaseColor}"></div>
                                        </div>
                                     </div>
                                     <!-- Toggle -->
                                      <div class="flex items-center justify-between">
                                        <span class="text-xs font-bold">Enable Notifications</span>
                                        <div class="w-12 h-6 rounded-full p-1 transition-colors live-preview-bg opacity-40 bg-stone-300" style="background-color: ${currentBaseColor}">
                                            <div class="w-4 h-4 bg-white rounded-full shadow-sm translate-x-6"></div>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        </div>

                     </div>
                </div>

                <!-- BOTTOM: PRINT LAB (Physical) -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
                     <div class="lg:col-span-12">
                        <div class="flex items-center gap-2 mb-2">
                             <div class="w-2 h-2 rounded-full bg-stone-400"></div>
                             <h3 class="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Print_Lab (Physical)</h3>
                        </div>

                        <!-- Pantone Pro Card (Full Width Version) -->
                        <!-- Pantone Pro Card (Full Width Version) -->
                        <div class="${isDarkMode ? 'bg-[#1D1B4B]' : 'bg-white'} rounded-[2rem] shadow-xl overflow-hidden border ${themeBorder} grid grid-cols-1 md:grid-cols-2">
                            <!-- Left: Big Color Area -->
                            <div class="min-h-[300px] relative group flex items-end justify-between p-8" style="background-color: ${primaryMatch.hex}">
                                 <!-- Warning Ribbon Overlay -->
                                ${(primaryMatch.distance > 35 || currentFamily !== pantoneFamily) ? `
                                    <div class="absolute top-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 shadow-lg">
                                        <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                            <i data-lucide="alert-triangle" class="w-4 h-4"></i>
                                        </div>
                                        <div>
                                            <div class="text-[10px] font-bold uppercase tracking-widest text-amber-800">Mismatch Detectado</div>
                                            <div class="text-[10px] opacity-70 leading-tight">Pantone sugerido fuera de familia exacta (${currentFamily} vs ${pantoneFamily}).</div>
                                        </div>
                                    </div>
                                ` : ''}
                                
                                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm text-white font-bold text-xs uppercase cursor-pointer" onclick="window.copyToClipboard('${primaryMatch.code}')">
                                    Copiar ${primaryMatch.code}
                                </div>
                            </div>
                            
                            <!-- Right: Info -->
                            <div class="p-8 md:p-12 flex flex-col justify-between">
                                <div>
                                    <div class="flex justify-between items-start mb-8">
                                        <div>
                                            <span class="text-[10px] font-bold uppercase opacity-30 tracking-[0.2em] block mb-2">${matchLabel}</span>
                                            <h2 class="text-6xl font-serif italic ${isDarkMode ? 'text-white' : 'text-black'} leading-none mb-1">${primaryMatch.code.replace('C', '')}</h2>
                                            <span class="text-2xl opacity-40 font-bold stroke-text">C</span>
                                        </div>
                                        <div class="text-right">
                                            <div class="text-4xl font-bold ${confidence.text}">${confidence.score}%</div>
                                            <div class="text-[9px] font-bold opacity-30 uppercase tracking-widest mt-1">Match</div>
                                        </div>
                                    </div>
                                    <p class="text-sm font-medium opacity-60 mb-8 leading-relaxed">${subLabel}</p>
                                    
                                     <div class="flex gap-2 flex-wrap mb-8">
                                         ${!safety.safe ? `
                                            <div class="px-4 py-2 rounded-lg bg-red-100 text-red-600 shadow-sm flex items-center gap-2">
                                                <i data-lucide="alert-triangle" class="w-4 h-4"></i>
                                                <span class="text-[10px] font-bold uppercase tracking-wide">Fuera de Gama CMYK</span>
                                            </div>
                                        ` : `
                                             <div class="px-4 py-2 rounded-lg bg-green-100 text-green-700 shadow-sm flex items-center gap-2">
                                                <i data-lucide="printer" class="w-4 h-4"></i>
                                                <span class="text-[10px] font-bold uppercase tracking-wide">Seguro para Impresión</span>
                                            </div>
                                        `}
                                    </div>
                                </div>

                                <div>
                                     <span class="text-[9px] font-bold uppercase opacity-30 tracking-widest block mb-4">Alternativas Pantone</span>
                                     <div class="flex gap-3 overflow-x-auto custom-scrollbar">
                                        ${pantoneMatches.slice(1).map(p => `
                                            <div class="flex-shrink-0 flex gap-3 items-center bg-black/5 dark:bg-white/5 p-2 pr-5 rounded-xl cursor-pointer hover:bg-black/10 transition-colors opacity-70 hover:opacity-100" onclick="updateColor('${p.hex}')">
                                                <div class="w-10 h-10 rounded-lg shadow-sm" style="background-color: ${p.hex}"></div>
                                                <div>
                                                    <div class="text-xs font-bold">${p.code}</div>
                                                    <div class="text-[9px] opacity-50 uppercase">Dist: ${Math.round(p.distance)}</div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- NEW: Brand Moodboard (The 'Safe' Premium Option) -->
                        <div class="mt-12 border-t ${themeBorder} pt-12">
                            <div class="flex items-center justify-between mb-8">
                                <div class="flex items-center gap-2">
                                    <div class="w-2 h-2 rounded-full bg-stone-500"></div>
                                    <h3 class="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Dirección_Creativa</h3>
                                </div>
                                <span class="text-[9px] font-bold uppercase opacity-30 tracking-widest">Brand Moodboard</span>
                            </div>
                            
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 h-96 sm:h-64">
                                
                                <!-- 1. TYPOGRAPHY (The Voice) -->
                                <div class="relative rounded-2xl overflow-hidden bg-stone-100 flex items-center justify-center group border border-black/5">
                                    <span class="font-serif italic text-9xl absolute opacity-20 transform scale-150 translate-x-4 translate-y-4" style="color: ${currentBaseColor}">Aa</span>
                                    <span class="font-serif italic text-6xl relative z-10 text-black dark:text-black">Aa</span>
                                    <div class="absolute bottom-3 left-4 text-[8px] font-bold uppercase tracking-widest opacity-40 text-black">Tipografía</div>
                                </div>

                                <!-- 2. GRADIENT AURA (The Vibe) -->
                                <div class="relative rounded-2xl overflow-hidden bg-white border border-black/5 flex items-center justify-center">
                                    <div class="absolute inset-0 opacity-80" style="background: radial-gradient(circle at 70% 30%, ${currentBaseColor}, transparent 70%), radial-gradient(circle at 20% 80%, ${currentBaseColor}66, transparent 60%);"></div>
                                    <div class="w-24 h-24 bg-white/30 backdrop-blur-xl rounded-full border border-white/20 shadow-xl z-10 flex items-center justify-center">
                                         <div class="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
                                    </div>
                                    <div class="absolute bottom-3 left-4 text-[8px] font-bold uppercase tracking-widest opacity-40 mix-blend-overlay text-black">Aura</div>
                                </div>

                                <!-- 3. TEXTURE (The Feel) -->
                                <div class="relative rounded-2xl overflow-hidden bg-black flex items-center justify-center group border border-white/10">
                                    <!-- Noise/Texture Overlay -->
                                    <div class="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                                    <div class="absolute inset-0 opacity-60 mix-blend-color" style="background-color: ${currentBaseColor}"></div>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                    
                                    <span class="relative z-10 text-white font-mono text-xs border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">#Material</span>
                                    <div class="absolute bottom-3 left-4 text-[8px] font-bold uppercase tracking-widest opacity-60 text-white">Textura</div>
                                </div>

                                <!-- 4. BRAND MARK (The Icon) -->
                                <div class="relative rounded-2xl overflow-hidden flex items-center justify-center border border-black/5" style="background-color: ${currentBaseColor}">
                                    <div class="absolute inset-0 flex items-center justify-center opacity-30">
                                         <!-- Repeating Pattern -->
                                         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                                    <circle cx="2" cy="2" r="1" fill="white"/>
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#dotPattern)"/>
                                        </svg>
                                    </div>
                                    
                                    <div class="w-16 h-16 bg-white text-black rounded-lg shadow-2xl flex items-center justify-center font-black text-xl italic relative z-10 transform transition-transform group-hover:rotate-12 duration-500">
                                        kj.
                                    </div>
                                    <div class="absolute bottom-3 left-4 text-[8px] font-bold uppercase tracking-widest opacity-40 text-white">Sello</div>
                                </div>

                            </div>
                        </div>
                     </div>
                </div>

            </div>
        `;
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
    if (animate) {
        gsap.fromTo('.stagger-anim',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
        );
    }

    // Re-initialize picker logic if we just rendered the color tool
    if (activeTool === 'color') {
        initCustomPicker();
    }
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
    const inspector = document.getElementById('inspector');
    if (!inspector) return;

    if (!sidebarData) {
        console.warn("Sidebar Data not found");
        return;
    }

    const { profile, skills, education } = sidebarData;

    inspector.innerHTML = `
        <div class="p-8 border-b border-stone-300">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-8">${profile.label}</h3>
            <div class="space-y-6">
                ${profile.items.map(item => `
                    ${item.isStatus ? `
                        <div class="flex justify-between items-center p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                            <span class="text-[9px] opacity-40 uppercase font-bold">${item.label}</span>
                            <span class="text-[10px] text-green-600 font-black uppercase tracking-widest flex items-center gap-2">
                                <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> ${item.value}
                            </span>
                        </div>
                    ` : `
                        <div class="flex justify-between items-center text-[12px] font-bold">
                            <span class="opacity-40 uppercase text-[9px]">${item.label}</span>
                            <span class="tracking-tight">${item.value}</span>
                        </div>
                    `}
                `).join('')}
            </div>
        </div>

        <div class="p-8 border-b border-stone-300">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-8">Habilidades_Core</h3>
            <div class="space-y-6">
                <div class="space-y-4">
                    <span class="text-[10px] font-bold opacity-30 uppercase">${skills.creativeTitle}</span>
                    ${skills.creative.map(s => `
                        <div class="skill-item" data-label="${s.name}" data-level="${s.level}"></div>
                    `).join('')}
                </div>
                <div class="space-y-4 pt-4">
                    <span class="text-[10px] font-bold opacity-30 uppercase">${skills.professionalTitle}</span>
                    ${skills.professional.map(s => `
                        <div class="skill-item" data-label="${s.name}" data-level="${s.level}"></div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="p-8">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-8">Testimonios_Log</h3>
            <div class="space-y-4" id="testimonials-container">
            </div>
        </div>

        <div class="mt-auto p-8 bg-violet-600/5">
            <div class="flex items-center gap-3 mb-4">
                <i data-lucide="graduation-cap" class="text-violet-600 w-4 h-4"></i>
                <span class="text-[10px] font-bold uppercase tracking-widest">${education.title}</span>
            </div>
            <p class="text-[11px] leading-relaxed opacity-50 font-medium italic">
                “${education.text}”
            </p>
        </div>
    `;

    // Render Skill Bars
    setTimeout(() => {
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
                        <div style="width: ${level}%" class="h-full bg-violet-600/60 rounded-full theme-progress-bar transition-all duration-1000"></div>
                    </div>
                </div>
            `;
        });

        // Render Testimonials
        const aboutTool = tools.find(t => t.id === 'about');
        if (aboutTool && aboutTool.testimonials) {
            const container = document.getElementById('testimonials-container');
            if (container) {
                container.innerHTML = aboutTool.testimonials.map(quote => `
                    <div class="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 relative shadow-sm text-left italic">
                        <i data-lucide="quote" class="w-3 h-3 text-violet-600 opacity-20 absolute -top-1 -left-1"></i>
                        <p class="text-[10px] leading-relaxed opacity-60 font-medium">“${quote}”</p>
                    </div>
                 `).join('');
            }
        }
        lucide.createIcons();
    }, 50);
}
