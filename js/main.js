import { tools, projects, sidebarData, tutorialSteps, siteContent } from './data.js';
import { renderContactTool } from './contact.js';
import { renderWindows } from './window-manager.js';
import { renderAboutSection } from './sections/about.js';
import { renderCVSection } from './sections/cv.js';
import { renderColorLab } from './sections/color-lab.js';
import { renderGallery } from './sections/gallery.js';
import { renderSocialMediaSection } from './sections/social-media.js';
import { renderIllustrationsSection } from './sections/illustrations.js';
import { renderPhotographySection } from './sections/photography.js';

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
let activeTool = localStorage.getItem('lastActiveTab') || 'about';
let isDarkMode = true; // Default to Dark Mode
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
    const navCv = document.getElementById('nav-cv-text');
    if (navCv) navCv.innerText = siteContent.header.navCv;

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
        "%c Karen System Loaded: Creative Perfection Detected. \n %c Developed by Kevin Ortega [github.com/kevorteg] \n %c The muse of this code is online.",
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

        applyTheme(); // Apply default theme logic immediately

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
};

// Safety Fallback: Force open if something gets stuck (MOVED OUTSIDE ONLOAD for reliability)
setTimeout(() => {
    const boot = document.getElementById('booting-screen');
    if (boot && getComputedStyle(boot).display !== 'none') {
        console.warn('Boot sequence timeout - Forcing entry.');
        boot.style.display = 'none';
        document.getElementById('app-container').style.opacity = '1';

        // Ensure theme is correct on forced entry
        applyTheme();
    }
}, 3000); // Reduced to 3s for snapper feel

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

window.setActiveTool = function (id) {
    activeTool = id;
    localStorage.setItem('lastActiveTab', id);
    renderTools();
    renderContent(true);

    // Animation for new content
    gsap.fromTo("#main-content-render",
        { opacity: 0, scale: 0.98, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "expo.out" }
    );
};

function applyTheme() {
    // 1. Toggle Tailwind 'dark' class on HTML
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // 2. Manual DOM updates for elements that don't fully rely on Tailwind 'dark:' prefix yet
    const body = document.getElementById('body-main');
    const elements = [
        document.getElementById('header'),
        document.getElementById('sidebar'),
        document.getElementById('tabs-bar'),
        document.getElementById('inspector'),
        document.getElementById('modal-header')
    ];
    // Modal Panel has a different base color (white), so we handle it separately or add specific logic
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
            body.classList.replace('text-white', 'text-stone-800');
        }
        elements.forEach(el => {
            if (el) {
                el.classList.replace('bg-[#16143C]', 'bg-[#EAEAE5]');
                el.classList.replace('border-indigo-900/30', 'border-stone-300');
            }
        });
        if (modalPanel) {
            modalPanel.classList.replace('bg-[#1E1B4B]', 'bg-white');
            modalPanel.classList.replace('border-indigo-900/30', 'border-stone-300');
        }
        const icon = document.getElementById('theme-icon');
        if (icon) icon.setAttribute('data-lucide', 'moon');
    }

    lucide.createIcons();
    renderContent(false);
    renderWindows();
}
