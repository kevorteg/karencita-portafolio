
import { projects } from './data.js';

// --- STATE ---
let openProjects = [];
let minimizedProjects = []; // Store IDs of minimized projects
let maximizedProjects = []; // Store IDs of maximized projects
let preMaximizedPositions = {}; // Store {left, top} before maximizing
let focusedProject = null;
let zIndexCounter = 200;
let isDragging = false;
let currentTarget = null;
let startX, startY, initialLeft, initialTop;

// --- WINDOW MANAGMENT API ---

// Identify Mobile
const isMobileDevice = () => window.innerWidth < 640;

export function toggleMaximize(id) {
    if (maximizedProjects.includes(id)) {
        // Restore
        maximizedProjects = maximizedProjects.filter(pid => pid !== id);
    } else {
        // Maximize
        const el = document.getElementById(`win-${id}`);
        if (el) {
            preMaximizedPositions[id] = {
                left: el.style.left,
                top: el.style.top
            };
        }
        maximizedProjects.push(id);
        // Ensure it is focused
        focusProject(id);
    }
    renderWindows();
}

export function openProject(id) {
    const project = projects.find(p => p.id === id);
    if (!openProjects.find(p => p.id === id)) {
        openProjects.push(project);
    }
    // Auto-focus the new project
    focusProject(id);
}

export function closeProject(id) {
    console.log("Closing Project ID:", id);
    openProjects = openProjects.filter(p => p.id !== id);
    minimizedProjects = minimizedProjects.filter(pid => pid !== id);
    maximizedProjects = maximizedProjects.filter(pid => pid !== id);
    delete preMaximizedPositions[id];

    if (focusedProject === id) focusedProject = openProjects.length > 0 ? openProjects[openProjects.length - 1].id : null;
    renderTabs();
    renderWindows();
}

export function minimizeProject(id) {
    console.log("Minimizing Project ID:", id);
    if (!minimizedProjects.includes(id)) {
        minimizedProjects.push(id);
    }
    // Remove focus if minimized
    if (focusedProject === id) {
        focusedProject = null;
    }
    renderWindows();
    renderTabs(); // Update tabs to show minimized state
}

export function focusProject(id) {
    // Un-minimize if it was minimized
    if (minimizedProjects.includes(id)) {
        minimizedProjects = minimizedProjects.filter(pid => pid !== id);
    }

    focusedProject = id;
    zIndexCounter++;
    const win = document.getElementById(`win-${id}`);
    if (win) {
        win.style.zIndex = zIndexCounter;

        // Ensure it's visible if we just restored it (though renderWindows handles this usually)
        if (win.style.display === 'none') {
            win.style.display = 'flex';
        }
    }
    renderTabs();
    renderWindows();
}

// --- RENDERING ---

export function renderWindows() {
    const container = document.getElementById('windows-layer');
    // Check dark mode via DOM since we don't have access to main.js state directly, standardizing on class check
    const isDarkMode = document.documentElement.classList.contains('dark');

    const themePanel = isDarkMode ? 'bg-[#1D1B4B]' : 'bg-white';
    const themeBorder = isDarkMode ? 'border-indigo-900/30' : 'border-stone-300';
    const themeSidebar = isDarkMode ? 'bg-[#16143C]' : 'bg-[#EAEAE5]';

    // Mobile Detection
    const isMobile = isMobileDevice();

    const existingPositions = {};
    // Capture current positions to prevent jumping on re-render
    openProjects.forEach(p => {
        const el = document.getElementById(`win-${p.id}`);
        if (el) {
            existingPositions[p.id] = {
                left: el.style.left,
                top: el.style.top
            };
        }
    });

    const html = openProjects.map((p, index) => {
        const isMinimized = minimizedProjects.includes(p.id);
        const isMaximized = maximizedProjects.includes(p.id);

        // Starting Position Stagger (Cascade effect) if not already set
        // Updated Default Position: Center-ish
        const defaultLeft = isMobile ? '4%' : `${5 + (index * 2)}%`; // Mobile: Centered-ish (4% margin for 92vw width)
        const defaultTop = isMobile ? '10%' : `5%`; // Mobile: Lower down

        // Position Logic: 1. Existing DOM (if not max) 2. Pre-max (if restore) 3. Default
        let targetPos = existingPositions[p.id] || { left: defaultLeft, top: defaultTop };

        if (!isMaximized && preMaximizedPositions[p.id]) {
            // Restore to pre-maximized position if we are not currently maximized but have history
            if (targetPos.left === '0px' && targetPos.top === '0px') {
                targetPos = preMaximizedPositions[p.id];
            } else if (targetPos.left === '0 !important') { // sometimes style string persists
                targetPos = preMaximizedPositions[p.id];
            }
        }

        const displayStyle = isMinimized ? 'display: none;' : 'display: flex;';

        // Z-Index Logic
        const zIndex = (focusedProject === p.id) ? zIndexCounter : 100 + index;

        // Dynamic Classes/Styles for Maximization
        let windowClasses = `fixed flex flex-col shadow-2xl overflow-hidden border ${themeBorder} ${themePanel} transition-all duration-300 animate-pop`;
        let windowStyles = `z-index: ${zIndex}; ${displayStyle} touch-action: none;`;

        if (isMaximized) {
            windowClasses += " inset-0 w-full h-full rounded-none z-[500]";
            windowStyles += " left: 0 !important; top: 0 !important; width: 100% !important; height: 100% !important; transform: none !important; border-radius: 0 !important;";
        } else {
            // NEW SIZE: Bigger by default (90vw width on desktop, 85vh height)
            // Mobile: 92vw width, 70vh height, Fully rounded corners
            windowClasses += " w-[92vw] sm:w-[90vw] md:w-[85vw] lg:w-[1000px] h-[70vh] sm:h-[85vh] rounded-[1.5rem] sm:rounded-[2rem]";
            windowStyles += ` left: ${targetPos.left}; top: ${targetPos.top};`;
        }

        // Button sizing logic - INCREASED FOR MOBILE
        // Using a larger touch target wrapper instead of just larger icons
        const btnSize = isMobile ? "w-6 h-6" : "w-3 h-3";
        const btnContainerGap = isMobile ? "gap-6" : "gap-2";
        const btnIconSize = isMobile ? "w-3 h-3" : "w-2 h-2";

        return `
        <div 
            id="win-${p.id}"
            onmousedown="focusProject(${p.id})"
            class="${windowClasses}"
            style="${windowStyles}"
        >
            <!-- Window Header -->
            <div 
                class="window-header h-16 sm:h-12 flex items-center justify-between px-6 border-b ${themeBorder} ${themeSidebar} cursor-grab active:cursor-grabbing select-none relative"
                onmousedown="initDrag(event, ${p.id})"
                ontouchstart="initDrag(event, ${p.id})"
            >
                <div class="flex items-center gap-3 w-full">
                    <!-- BUTTONS CONTAINER -->
                     <div class="flex ${btnContainerGap} group relative z-[500] pointer-events-auto items-center">
                         <!-- STOP PROPAGATION WRAPPER -->
                        <button 
                            onmousedown="event.stopPropagation()" 
                            ontouchstart="event.stopPropagation()" 
                            onclick="closeProject(${p.id}); event.stopPropagation();" 
                            class="${btnSize} rounded-full bg-red-400 hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center group/btn shadow-sm"
                            title="Cerrar"
                        >
                            <i data-lucide="x" class="${btnIconSize} text-red-900 opacity-0 group-hover/btn:opacity-100 transition-opacity"></i>
                        </button>
                        <button 
                            onmousedown="event.stopPropagation()" 
                            ontouchstart="event.stopPropagation()" 
                            onclick="minimizeProject(${p.id}); event.stopPropagation();" 
                            class="${btnSize} rounded-full bg-yellow-400 hover:bg-yellow-600 transition-colors cursor-pointer flex items-center justify-center group/btn shadow-sm"
                            title="Minimizar"
                        >
                             <i data-lucide="minus" class="${btnIconSize} text-yellow-900 opacity-0 group-hover/btn:opacity-100 transition-opacity"></i>
                        </button>
                        <button 
                            onmousedown="event.stopPropagation()" 
                            ontouchstart="event.stopPropagation()" 
                            onclick="toggleMaximize(${p.id}); event.stopPropagation();" 
                            class="${btnSize} rounded-full bg-green-400 hover:bg-green-600 transition-colors cursor-pointer flex items-center justify-center group/btn shadow-sm"
                            title="Maximizar"
                        >
                            <i data-lucide="${isMaximized ? 'minimize-2' : 'maximize-2'}" class="${btnIconSize} text-green-900 opacity-0 group-hover/btn:opacity-100 transition-opacity"></i>
                        </button>
                    </div>
                    <span class="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2 truncate flex-1 ${isMobile ? 'text-right pr-2' : ''}">${p.title}</span>
                </div>
                
                <!-- Desktop Only Icon (Decoration) -->
                ${!isMobile ? `
                <div class="opacity-30 flex-shrink-0">
                    <i data-lucide="${isMaximized ? 'minimize-2' : 'maximize-2'}" class="w-4 h-4"></i>
                </div>` : ''}
            </div>

            <!-- Window Content -->
            <div class="flex-1 overflow-y-auto p-0 scrollbar-hide relative bg-white dark:bg-[#0F0E24] overscroll-contain">
                 <!-- Hero Image -->
                 <div class="h-64 sm:h-80 w-full relative shrink-0">
                    <img src="${p.img}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                         <div class="text-white">
                            <span class="px-3 py-1 bg-violet-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4 inline-block shadow-lg shadow-violet-600/50">Case Study 0${p.id}</span>
                            <h1 class="text-3xl sm:text-5xl font-serif italic leading-tight">${p.title}</h1>
                         </div>
                    </div>
                 </div>

                 <!-- Content Body -->
                 <div class="p-8 sm:p-12 max-w-4xl mx-auto dark:text-gray-300 pb-24">
                    <p class="text-lg sm:text-xl leading-relaxed font-serif italic opacity-80 mb-12 border-l-4 border-violet-600 pl-6">
                        "${p.description}"
                    </p>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-12">
                        <div>
                            <h3 class="text-xs font-black uppercase tracking-widest mb-4 opacity-50">El Reto</h3>
                            <p class="text-sm leading-7 opacity-80">
                                Crear una identidad visual que rompiera con los esquemas tradicionales del sector, utilizando una paleta de colores arriesgada pero funcional.
                            </p>
                        </div>
                        <div>
                             <h3 class="text-xs font-black uppercase tracking-widest mb-4 opacity-50">La Solución</h3>
                            <p class="text-sm leading-7 opacity-80">
                                Un sistema de diseño modular que permite a la marca adaptarse a diferentes formatos sin perder su esencia reconocible.
                            </p>
                        </div>
                    </div>

                    <div class="rounded-2xl overflow-hidden mb-12 shadow-xl">
                        <img src="assets/images/projects/neon.jpg" class="w-full h-auto" onerror="this.src='https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'">
                    </div>

                    <div class="flex flex-wrap gap-3 mb-12">
                        <span class="px-4 py-2 border border-stone-200 dark:border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider">Branding</span>
                        <span class="px-4 py-2 border border-stone-200 dark:border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider">UX/UI</span>
                        <span class="px-4 py-2 border border-stone-200 dark:border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider">Strategy</span>
                    </div>

                    <div class="border-t border-stone-200 dark:border-indigo-900/30 pt-12 text-center">
                        <button class="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
                            Ver Proyecto Completo
                        </button>
                    </div>
                 </div>
            </div>
        </div>
    `;
    }).join('');

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
}

export function renderTabs() {
    const container = document.getElementById('active-tabs-container');
    const isDarkMode = document.documentElement.classList.contains('dark');
    const themeBorder = isDarkMode ? 'border-indigo-900/30' : 'border-stone-300';
    const themePanel = isDarkMode ? 'bg-[#1D1B4B]' : 'bg-white';

    container.innerHTML = openProjects.map(p => {
        const isMinimized = minimizedProjects.includes(p.id);
        const isActive = focusedProject === p.id;

        // Style logic: Active gets themePanel, Minimized gets opacity, Inactive gets hover effect
        let tabStyle = 'opacity-40 hover:opacity-80';
        if (isActive) tabStyle = themePanel + ' opacity-100 shadow-sm';
        if (isMinimized) tabStyle = 'opacity-50 grayscale border-b-2 border-transparent';

        return `
        <div 
            onmousedown="focusProject(${p.id})"
            class="h-full flex items-center gap-3 px-5 cursor-pointer transition-all border-r ${themeBorder} ${tabStyle} whitespace-nowrap relative group"
        >
            ${isMinimized ? `<div class="w-1.5 h-1.5 rounded-full bg-stone-400"></div>` : ''}
            <span class="text-[10px] font-bold uppercase tracking-tight">${p.title}</span>
            <button 
                onmousedown="event.stopPropagation();"
                onclick="event.stopPropagation(); closeProject(${p.id});"
                class="p-1 hover:bg-red-500 hover:text-white rounded-md transition-all flex items-center justify-center ml-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
                <i data-lucide="x" class="w-3 h-3"></i>
            </button>
        </div>
    `}).join('');
    if (window.lucide) window.lucide.createIcons();
}

// --- DRAG LOGIC ---

export function initDrag(e, id) {
    // Check if the interaction is on a button (like the close button)
    // Using closest to check if the target is inside a button or is a button
    if (e.target.closest('button')) return;

    isDragging = true;
    currentTarget = document.getElementById(`win-${id}`);

    // DISABLE TRANSITIONS to prevent flickering/lag during drag
    if (currentTarget) currentTarget.style.transition = 'none';

    // Handle touch vs mouse
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    startX = clientX;
    startY = clientY;

    // Get current calculated position
    const rect = currentTarget.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    // Reset any percentage-based positioning to pixels for smooth dragging
    currentTarget.style.left = `${initialLeft}px`;
    currentTarget.style.top = `${initialTop}px`;
    currentTarget.style.transform = 'none';

    if (e.touches) {
        document.addEventListener('touchmove', handleDrag, { passive: false });
        document.addEventListener('touchend', stopDrag);
    } else {
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
    }
}

function handleDrag(e) {
    if (!isDragging || !currentTarget) return;

    // Prevent default scrolling on touch
    if (e.preventDefault) e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - startX;
    const dy = clientY - startY;
    currentTarget.style.left = `${initialLeft + dx}px`;
    currentTarget.style.top = `${initialTop + dy}px`;
}

function stopDrag() {
    isDragging = false;
    // RESTORE TRANSITIONS
    if (currentTarget) currentTarget.style.transition = '';

    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', stopDrag);
}

// Attach to window for HTML accessibility
// Use a safe check for SSR (though this is client side)
if (typeof window !== 'undefined') {
    window.openProject = openProject;
    window.closeProject = closeProject;
    window.maximizeProject = toggleMaximize; // Alias for consistency
    window.toggleMaximize = toggleMaximize;
    window.minimizeProject = minimizeProject;
    window.focusProject = focusProject;
    window.initDrag = initDrag;
    window.renderWindows = renderWindows;
}
