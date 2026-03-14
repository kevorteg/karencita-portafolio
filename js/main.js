import { tools, projects, sidebarData, tutorialSteps, siteContent } from './data.js?v=2';
import { renderContactTool } from './contact.js?v=2';
import { renderWindows } from './window-manager.js?v=2';
import { renderAboutSection } from './sections/about.js?v=2';
import { renderCVSection } from './sections/cv.js?v=2';
import { renderColorLab } from './sections/color-lab.js?v=2';
import { renderGallery } from './sections/gallery.js?v=2';
import { renderSocialMediaSection } from './sections/social-media.js?v=2';
import { renderIllustrationsSection } from './sections/illustrations.js?v=2';
import { renderPhotographySection } from './sections/photography.js?v=2';

import {
    hexToRgb, fetchColorName
} from './color-studio.js?v=2';

// --- UTILS ---
window.copyToClipboard = function (text) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.createElement('div');
        toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest z-[99999] shadow-xl animate-pop flex items-center gap-2';
        toast.innerHTML = `<i data-lucide="check" class="w-3 h-3 text-green-400"></i> Copiado: ${text}`;
        document.body.appendChild(toast);
        if (window.lucide) lucide.createIcons();
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, -20px)';
            toast.style.transition = 'all 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    });
};

// --- STATE ---
let activeTool = localStorage.getItem('lastActiveTab') || 'about';
let isDarkMode = true;
let currentBaseColor = '#5F259F';
let currentTutorialStep = 0;

// --- RENDER SITE CONTENT ---
// --- RENDER SITE CONTENT ---
window.renderSiteContent = function () {
    if (!siteContent) return;
    document.title = siteContent.meta.title;
    const bootText = document.getElementById('boot-text');
    if (bootText) bootText.innerText = siteContent.booting.text;
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
    const navCv = document.getElementById('nav-cv-text');
    if (navCv) navCv.innerText = siteContent.header.navCv;
    const workText = document.getElementById('workspace-dtext');
    if (workText) workText.innerText = siteContent.tabs.workspace;
    
    // Welcome modal content
    const welcomeTitle = document.getElementById('welcome-title');
    if (welcomeTitle) welcomeTitle.innerHTML = siteContent.welcome.title;
    const welcomeText = document.getElementById('welcome-text');
    if (welcomeText) welcomeText.innerHTML = siteContent.welcome.text;
    const welcomeBtn = document.getElementById('welcome-btn');
    if (welcomeBtn) welcomeBtn.innerText = siteContent.welcome.btn;
    const welcomeLabel = document.getElementById('welcome-label');
    if (welcomeLabel) welcomeLabel.innerText = siteContent.welcome.label;
    const welcomeCredits = document.getElementById('welcome-credits');
    if (welcomeCredits) welcomeCredits.innerText = "Made with ❤️ and Code";
};

// --- CORE RENDERERS ---
window.renderTools = function () {
    const container = document.getElementById('tool-buttons');
    if (!container) return;

    // Sort tools by category order or just render them all
    const catOrder = ['system', 'creative', 'info'];
    const sortedTools = [...tools].sort((a, b) => catOrder.indexOf(a.category) - catOrder.indexOf(b.category));

    container.innerHTML = sortedTools.map(tool => `
        <button onclick="setActiveTool('${tool.id}')" id="tool-btn-${tool.id}"
            class="w-full flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl transition-all duration-300
            ${activeTool === tool.id
            ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
            : 'text-stone-400 dark:text-white/70 hover:bg-violet-600/10 hover:text-violet-600 dark:hover:text-violet-300'}">
            <i data-lucide="${tool.icon}" class="w-5 h-5 shrink-0"></i>
            <span class="text-[7px] font-bold uppercase tracking-wide leading-tight text-center w-full px-1">${tool.label}</span>
        </button>
    `).join('');

    // Also render mobile nav if needed
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        mobileNav.innerHTML = sortedTools.filter(t => t.category !== 'info').map(tool => `
            <button onclick="setActiveTool('${tool.id}')"
                class="flex flex-col items-center gap-1 ${activeTool === tool.id ? 'text-violet-500' : 'text-stone-500'}">
                <i data-lucide="${tool.icon}" class="w-5 h-5"></i>
                <span class="text-[8px] font-bold uppercase">${tool.label}</span>
            </button>
        `).join('');
    }

    if (window.lucide) lucide.createIcons();
};

window.renderContent = function (animate = false) {
    const container = document.getElementById('main-content-render');
    if (!container) return;

    const themePanel = isDarkMode ? 'bg-[#1E1B4B]' : 'bg-white';
    const themeBorder = isDarkMode ? 'border-indigo-900/30' : 'border-stone-200';

    switch (activeTool) {
        case 'about': renderAboutSection(container, themePanel, themeBorder); break;
        case 'cv': renderCVSection(container, themePanel, themeBorder); break;
        case 'color':
        case 'color-lab': renderColorLab(container, currentBaseColor, isDarkMode, window._pickerState || { h: 280, s: 70, v: 70 }); break;
        case 'social':
        case 'social-media':
        case 'marketing': renderSocialMediaSection(container, themePanel, themeBorder); break;
        case 'design':
        case 'illustrations': renderIllustrationsSection(container, themePanel, themeBorder); break;
        case 'gallery':
        case 'photography': renderPhotographySection(container, themePanel, themeBorder); break;
        case 'contact': renderContactTool(container, themePanel, themeBorder); break;
        default: container.innerHTML = `<div class="flex items-center justify-center h-full opacity-20"><p>Section ${activeTool} not found</p></div>`;
    }
};

window.renderInspector = function () {
    const container = document.getElementById('inspector');
    if (!container) return;

    const profileData = sidebarData.profile;
    const skillsData = sidebarData.skills;

    container.innerHTML = `
        <div class="p-5 space-y-8">
            <!-- Properties Panel -->
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">Propiedades_Global</span>
                    <i data-lucide="settings-2" class="w-3 h-3 opacity-40"></i>
                </div>
                <div class="p-4 rounded-2xl bg-stone-100 dark:bg-[#13114A] border border-stone-200 dark:border-indigo-900/50 space-y-3">
                    ${profileData.items.map(item => `
                        <div class="flex items-center justify-between">
                            <span class="text-[9px] text-stone-400 dark:text-stone-400 uppercase font-semibold tracking-widest">${item.label}</span>
                            ${item.isStatus ? `
                                <div class="flex items-center gap-2">
                                     <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                     <span class="text-[9px] font-bold uppercase text-green-500">${item.value}</span>
                                </div>
                            ` : `
                                <span class="text-[9px] font-bold uppercase text-stone-700 dark:text-white">${item.value}</span>
                            `}
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Skills Progress -->
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">${skillsData.creativeTitle}</span>
                    <i data-lucide="cpu" class="w-3 h-3 opacity-40"></i>
                </div>
                <div class="space-y-4">
                    ${skillsData.creative.map(skill => `
                        <div class="space-y-1.5">
                            <div class="flex justify-between text-[9px] uppercase font-bold tracking-wider">
                                <span>${skill.name}</span>
                                <span class="opacity-40">${skill.level}%</span>
                            </div>
                            <div class="h-1 bg-stone-200 dark:bg-white/5 rounded-full overflow-hidden">
                                <div class="h-full bg-violet-600 rounded-full" style="width: ${skill.level}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="space-y-4 pt-4">
                <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">${skillsData.professionalTitle}</span>
                    <i data-lucide="shield-check" class="w-3 h-3 opacity-40"></i>
                </div>
                <div class="space-y-4">
                    ${skillsData.professional.map(skill => `
                        <div class="space-y-1.5">
                            <div class="flex justify-between text-[9px] uppercase font-bold tracking-wider">
                                <span>${skill.name}</span>
                                <span class="opacity-40">${skill.level}%</span>
                            </div>
                            <div class="h-1 bg-stone-200 dark:bg-white/5 rounded-full overflow-hidden">
                                <div class="h-full bg-violet-600 rounded-full" style="width: ${skill.level}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    if (window.lucide) lucide.createIcons();
};

// --- INIT ---
window.onload = () => {
    setTimeout(() => {
        document.getElementById('booting-screen').style.display = 'none';
        const app = document.getElementById('app-container');
        if (app) app.style.opacity = '1';

        renderSiteContent();
        renderTools();
        renderContent();
        renderInspector();
        applyTheme();

        if (window.lucide) lucide.createIcons();

        const waBtn = document.createElement('a');
        waBtn.href = "https://wa.me/573164321424";
        waBtn.target = "_blank";
        waBtn.className = "fixed bottom-20 right-5 sm:bottom-8 sm:right-8 z-50 w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95 animate-pop cursor-pointer";
        waBtn.innerHTML = '<i data-lucide="message-circle" class="w-6 h-6 sm:w-8 sm:h-8"></i>';
        document.body.appendChild(waBtn);
        if (window.lucide) lucide.createIcons();

        if (!localStorage.getItem('tutorialShown')) {
            setTimeout(() => {
                startTutorial();
                localStorage.setItem('tutorialShown', 'true');
            }, 1000);
        } else if (!sessionStorage.getItem('welcomeShown')) {
            setTimeout(() => toggleWelcome(true), 500);
            sessionStorage.setItem('welcomeShown', 'true');
        }
    }, 1200);
};

// Safety Fallback
setTimeout(() => {
    const boot = document.getElementById('booting-screen');
    if (boot && getComputedStyle(boot).display !== 'none') {
        boot.style.display = 'none';
        document.getElementById('app-container').style.opacity = '1';
        applyTheme();
    }
}, 3000);

window.setActiveTool = function (id) {
    activeTool = id;
    localStorage.setItem('lastActiveTab', id);
    renderTools();
    renderContent(true);
    gsap.fromTo("#main-content-render",
        { opacity: 0, scale: 0.98, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "expo.out" }
    );
};

// Initialize picker state for Color Lab
window._pickerState = window._pickerState || hexToHSV('#5F259F');

function hexToHSV(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(max === 0 ? 0 : (d / max) * 100),
        v: Math.round(max * 100)
    };
}

// Silent update — updates currentBaseColor WITHOUT re-rendering (used during picker drag)
window.setColorSilent = function (hex) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;
    currentBaseColor = hex;
    window._pickerState = hexToHSV(hex);
};

window.updateColor = function (hex) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return;
    currentBaseColor = hex;
    window._pickerState = hexToHSV(hex);
    if (activeTool === 'color' || activeTool === 'color-lab') {
        renderContent(false);
    }
    // Save to history
    try {
        let history = JSON.parse(localStorage.getItem('colorHistory')) || [];
        history = [hex, ...history.filter(c => c !== hex)].slice(0, 5);
        localStorage.setItem('colorHistory', JSON.stringify(history));
    } catch (e) { }
};


function applyTheme() {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    const body = document.getElementById('body-main');
    const elements = [
        document.getElementById('header'),
        document.getElementById('sidebar'),
        document.getElementById('tabs-bar'),
        document.getElementById('inspector'),
        document.getElementById('modal-header')
    ];
    const modalPanel = document.getElementById('modal-panel');

    if (isDarkMode) {
        if (body) {
            body.classList.replace('bg-[#F5F5F0]', 'bg-[#1A1844]');
            body.classList.replace('text-stone-800', 'text-white');
        }
        elements.forEach(el => {
            if (el) {
                el.classList.replace('bg-[#EAEAE5]', 'bg-[#16143C]');
                el.classList.replace('border-stone-300', 'border-indigo-900/30');
            }
        });
        if (modalPanel) {
            modalPanel.classList.replace('bg-white', 'bg-[#1E1B4B]');
            modalPanel.classList.replace('border-stone-300', 'border-indigo-900/30');
        }
        const icon = document.getElementById('theme-icon');
        if (icon) icon.setAttribute('data-lucide', 'sun');
    } else {
        if (body) {
            body.classList.replace('bg-[#1A1844]', 'bg-[#F5F5F0]');
            body.classList.replace('text-white', 'text-stone-900');
        }
        elements.forEach(el => {
            if (el) {
                el.classList.replace('bg-[#16143C]', 'bg-[#EAEAE5]');
                el.classList.replace('border-indigo-900/30', 'border-stone-300');
                el.classList.remove('text-white');
                el.classList.add('text-stone-900');
            }
        });
        if (modalPanel) {
            modalPanel.classList.replace('bg-[#1E1B4B]', 'bg-white');
            modalPanel.classList.replace('border-indigo-900/30', 'border-stone-300');
        }
        const icon = document.getElementById('theme-icon');
        if (icon) icon.setAttribute('data-lucide', 'moon');
    }
    if (window.lucide) lucide.createIcons();
    renderContent(false);
    renderWindows();
}

window.toggleDarkMode = function () {
    isDarkMode = !isDarkMode;
    applyTheme();
};

window.toggleWelcome = function (show) {
    const modal = document.getElementById('welcome-modal');
    if (modal) modal.style.display = show ? 'flex' : 'none';
};

window.startTutorial = function () {
    currentTutorialStep = 0;
    const tutOverlay = document.getElementById('tutorial-overlay');
    if (tutOverlay) {
        tutOverlay.classList.remove('hidden');
        tutOverlay.style.display = 'block';
    }
    window.updateTutorialStep();
};

window.updateTutorialStep = function () {
    const step = tutorialSteps[currentTutorialStep];
    if (!step) return;

    const title = document.getElementById('tut-title');
    const content = document.getElementById('tut-text');
    const stepCount = document.getElementById('tut-step-count');
    const nextBtn = document.getElementById('tut-next-btn');
    const skipBtn = document.getElementById('tut-skip-btn');

    if (title) title.innerText = step.title;
    if (content) content.innerText = step.text;
    if (stepCount) stepCount.innerText = `Paso ${currentTutorialStep + 1}/${tutorialSteps.length}`;
    if (nextBtn) nextBtn.innerText = currentTutorialStep === tutorialSteps.length - 1 ? 'Finalizar' : 'Siguiente';
    if (skipBtn) skipBtn.innerText = 'Saltar';

    // Navigate to the relevant section if step has a toolId
    if (step.toolId && step.toolId !== activeTool) {
        activeTool = step.toolId;
        localStorage.setItem('lastActiveTab', activeTool);
        renderTools();
        renderContent(false);
    }

    // Highlight target element after possible re-render
    setTimeout(() => {
        const target = document.getElementById(step.target);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.classList.add('ring-4', 'ring-violet-600', 'ring-offset-4', 'ring-offset-transparent');
            setTimeout(() => target.classList.remove('ring-4', 'ring-violet-600', 'ring-offset-4', 'ring-offset-transparent'), 2500);
        }
        // Position tutorial card next to the target
        const card = document.getElementById('tutorial-card');
        if (card && target) {
            const rect = target.getBoundingClientRect();
            const cardW = 288; // w-72
            const margin = 12;
            let left = rect.right + margin;
            let top = rect.top + rect.height / 2 - 100;
            if (left + cardW > window.innerWidth) left = rect.left - cardW - margin;
            if (left < 8) left = 8;
            if (top < 8) top = 8;
            if (top + 220 > window.innerHeight) top = window.innerHeight - 230;
            card.style.left = left + 'px';
            card.style.top = top + 'px';
            card.style.right = 'auto';
        } else if (card) {
            card.style.left = '50%';
            card.style.top = '50%';
            card.style.transform = 'translate(-50%, -50%)';
        }
    }, 150);

    // Animate card in
    const card = document.getElementById('tutorial-card');
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(8px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.3s, transform 0.3s';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    }
}

window.nextStep = function () {
    currentTutorialStep++;
    if (currentTutorialStep >= tutorialSteps.length) {
        window.endTutorial();
    } else {
        updateTutorialStep();
    }
};

window.endTutorial = function () {
    const tutOverlay = document.getElementById('tutorial-overlay');
    if (tutOverlay) {
        tutOverlay.classList.add('hidden');
        tutOverlay.style.display = 'none';
    }
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
