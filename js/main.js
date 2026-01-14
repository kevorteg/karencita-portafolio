import { tools, projects, sidebarData, tutorialSteps, siteContent } from './data.js';
import { renderStrategyTool } from './quiz.js';
import { renderContactTool } from './contact.js';
import { renderWindows } from './window-manager.js';
import { renderAboutSection } from './sections/about.js';
import { renderColorLab } from './sections/color-lab.js';
import { renderGallery } from './sections/gallery.js';

import {
    hexToRgb, fetchColorName
} from './color-studio.js';

// --- UTILS ---
window.copyToClipboard = function (text) {
    navigator.clipboard.writeText(text).then(() => {
        // Create a temporary toast notification instead of modifying the DOM element
        // This prevents layout shifts and "flickering"
        const toast = document.createElement('div');
        toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest z-[99999] shadow-xl animate-pop flex items-center gap-2';
        toast.innerHTML = `<i data-lucide="check" class="w-3 h-3 text-green-400"></i> Copiado: ${text}`;

        document.body.appendChild(toast);
        lucide.createIcons();

        // Remove after 2 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, -20px)';
            toast.style.transition = 'all 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    });
};

// --- STATE ---
let activeTool = 'about';
let isDarkMode = false;
let currentBaseColor = '#5F259F'; // Nuevo morado predeterminado

// --- RENDER SITE CONTENT ---
function renderSiteContent() {
    if (!siteContent) return;

    // Meta
    document.title = siteContent.meta.title;

    // Booting
    const bootText = document.getElementById('boot-text');
    if (bootText) bootText.innerText = siteContent.booting.text;

    // Header
    const logoText = document.getElementById('header-logo-text');
    if (logoText) logoText.innerText = siteContent.header.logoText;
    const logoMobile = document.getElementById('header-logo-mobile');
    if (logoMobile) logoMobile.innerText = siteContent.header.mobileLogo;
    const statusText = document.getElementById('header-status-text');
    if (statusText) statusText.innerText = siteContent.header.status;
    const navBrand = document.getElementById('nav-brand-text');
    if (navBrand) navBrand.innerText = siteContent.header.navBrand;
    const navAbout = document.getElementById('nav-about-text');
    if (navAbout) navAbout.innerText = siteContent.header.navAbout;

    // Tabs
    const workText = document.getElementById('workspace-dtext');
    if (workText) workText.innerText = siteContent.tabs.workspace;

    // Welcome Modal
    const welcomeLabel = document.getElementById('welcome-label');
    if (welcomeLabel) welcomeLabel.innerText = siteContent.welcome.label;
    const welcomeTitle = document.getElementById('welcome-title');
    if (welcomeTitle) welcomeTitle.innerHTML = siteContent.welcome.title;
    const welcomeText = document.getElementById('welcome-text');
    if (welcomeText) welcomeText.innerText = siteContent.welcome.text;
    const welcomeBtn = document.getElementById('welcome-btn');
    if (welcomeBtn) welcomeBtn.innerText = siteContent.welcome.btn;
    const welcomeDev = document.getElementById('welcome-credits');
    if (welcomeDev) welcomeDev.innerText = siteContent.meta.credits;

    // Tutorial Buttons
    const tutSkip = document.getElementById('tut-skip-btn');
    if (tutSkip) tutSkip.innerText = siteContent.tutorial.skip;
    const tutNext = document.getElementById('tut-next-btn');
    if (tutNext) tutNext.innerText = siteContent.tutorial.next;
}

// --- INIT ---
window.onload = () => {
    // Secret System Message 
    console.log(
        "%c Karen Jefa System Loaded: Creative Perfection Detected. \n %c Developed by Kevin Ortega [github.com/kevorteg] \n %c The muse of this code is online.",
        "color: #7c3aed; font-weight: 900; font-size: 16px; font-family: 'Playfair Display', serif; padding: 10px 0;",
        "color: #stone-500; font-size: 11px; font-weight: bold; letter-spacing: 1px;",
        "color: #999; font-size: 11px; font-style: italic;"
    );

    setTimeout(() => {
        document.getElementById('booting-screen').style.display = 'none';
        const app = document.getElementById('app-container');
        app.style.opacity = '1';

        renderSiteContent();
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
        body.classList.replace('text-stone-800', 'text-white');
        elements.forEach(el => el && el.classList.replace('bg-[#EAEAE5]', 'bg-[#16143C]'));
        elements.forEach(el => el && el.classList.replace('border-stone-300', 'border-indigo-900/30'));
        document.getElementById('theme-icon').setAttribute('data-lucide', 'sun');
    } else {
        body.classList.replace('bg-[#1A1844]', 'bg-[#F5F5F0]');
        body.classList.replace('text-white', 'text-stone-800');
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
                id="mobile-tool-btn-${tool.id}"
                onclick="setActiveTool('${tool.id}')"
                class="group relative flex items-center justify-center w-12 h-12 rounded-full transition-all"
            >
                <div class="absolute inset-0 bg-violet-600 rounded-full opacity-0 scale-50 transition-all duration-300 ${activeTool === tool.id ? 'opacity-100 scale-100' : ''}"></div>
                <i data-lucide="${tool.icon}" class="relative z-10 w-5 h-5 transition-colors ${activeTool === tool.id ? 'text-white' : 'text-stone-400 dark:text-white'}"></i>
            </button>
        `).join('');
    }

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
    let targetId = step.target;

    // SMART MOBILE REDIRECT
    // If we are on mobile (and target is a generic tool button), try to find the mobile equivalent
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
        if (targetId === 'sidebar') targetId = 'mobile-nav';
        if (targetId.startsWith('tool-btn-')) {
            targetId = targetId.replace('tool-btn-', 'mobile-tool-btn-');
        }
    }

    let targetEl = document.getElementById(targetId);

    // Fallback: If mobile target not found, try original (or vice versa logic if needed)
    if (!targetEl) targetEl = document.getElementById(step.target);
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
    document.getElementById('tut-step-count').innerText = `${siteContent.tutorial.stepPrefix} ${currentStepIndex + 1}/${tutorialSteps.length}`;

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
    if (!container) return;

    if (!siteContent) {
        console.warn("Site Content Missing");
        return;
    }

    const tool = tools.find(t => t.id === activeTool);
    // Theme logic
    const themeBorder = isDarkMode ? 'border-indigo-900/30' : 'border-stone-300';
    const themePanel = isDarkMode ? 'bg-[#16143C]' : 'bg-[#EAEAE5]';
    const themeTextSub = isDarkMode ? 'text-white/60' : 'text-stone-500';

    const animClass = animate ? 'stagger-anim' : '';

    let html = `
        <div class="mb-12 sm:mb-20">
            <div class="${animClass} flex items-center gap-3 mb-6">
                 <div class="h-[1px] w-8 sm:w-12 bg-violet-600"></div>
                 <span class="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-violet-600">${tool.role}</span>
            </div>
            <h2 class="${animClass} text-3xl sm:text-6xl font-serif italic mb-6 sm:mb-8 leading-none dark:text-stone-100">${tool.label}</h2>
            ${activeTool !== 'about' ? `
                 <div class="${animClass} max-w-3xl border-l-4 border-violet-600 pl-6 sm:pl-8 py-2">
                    <p class="text-xl sm:text-2xl italic opacity-90 leading-relaxed font-serif mb-6">${tool.desc}</p>
                    <p class="text-xs sm:text-sm opacity-50 mt-4 leading-relaxed font-medium">${tool.manifesto}</p>
                </div>
            ` : ''}
        </div>
    `;

    // START MODULAR LOGIC
    if (activeTool === 'color') {
        container.innerHTML = html;
        const toolContent = document.createElement('div');
        container.appendChild(toolContent);
        // Note: pickerState is global below in this file
        renderColorLab(toolContent, currentBaseColor, isDarkMode, pickerState);

        // Picker needs the DOM to be ready. 
        // renderColorLab logic puts HTML into toolContent synchronously?
        // Yes, the await in renderColorLab is for fetchColorName which is detached.
        initCustomPicker();
        lucide.createIcons();
        if (animate) animateElements();
        return;
    }

    if (activeTool === 'strategy') {
        container.innerHTML = html;
        const toolContent = document.createElement('div');
        container.appendChild(toolContent);
        renderStrategyTool(toolContent, themePanel, themeBorder);
        lucide.createIcons();
        if (animate) animateElements();
        return;
    }

    if (activeTool === 'contact') {
        container.innerHTML = html;
        const toolContent = document.createElement('div');
        container.appendChild(toolContent);
        renderContactTool(toolContent, themePanel, themeBorder);
        lucide.createIcons();
        if (animate) animateElements();
        return;
    }

    if (activeTool === 'about') {
        container.innerHTML = html;
        const toolContent = document.createElement('div');
        container.appendChild(toolContent);
        renderAboutSection(toolContent, tool, siteContent, isDarkMode);
        lucide.createIcons();
        if (animate) animateElements();
        return;
    }

    if (activeTool === 'gallery') {
        container.innerHTML = html;
        const toolContent = document.createElement('div');
        container.appendChild(toolContent);
        renderGallery(toolContent);
        lucide.createIcons();
        if (animate) animateElements();
        return;
    }

    // Default: Projects (for 'design' etc if any)
    const projectsList = projects.filter(p => p.category === activeTool || activeTool === 'all');

    if (projectsList.length > 0) {
        html += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 items-stretch">`;
        projectsList.forEach(p => {
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

    if (animate) animateElements();
}

function animateElements() {
    gsap.fromTo('.stagger-anim',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );
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
            <div class="p-8 border-b border-stone-300" >
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
            <div class="space-y-2" >
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
            <div class="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 relative shadow-sm text-left italic" >
                        <i data-lucide="quote" class="w-3 h-3 text-violet-600 opacity-20 absolute -top-1 -left-1"></i>
                        <p class="text-[10px] leading-relaxed opacity-60 font-medium">“${quote}”</p>
                    </div>
            `).join('');
            }
        }
        lucide.createIcons();
    }, 50);
}
