
import { siteContent } from '../data.js';
import {
    generateProPalettes, hexToHSL, findClosestPantone, hexToRgb, rgbToCmyk,
    getMatchConfidence, checkPrintSafety, getChromaticFamily, getAccessibilityReport,
    fetchColorName, generateAura, generateGradients
} from '../color-studio.js';

export async function renderColorLab(container, currentBaseColor, isDarkMode, pickerState) {
    const animClass = "animate-fade-in-up";
    const themePanel = isDarkMode ? 'bg-[#1D1B4B]' : 'bg-white';
    const themeBorder = isDarkMode ? 'border-indigo-900/30' : 'border-stone-300';

    // State Initialization
    // Note: window.pickerMode is managed globally in main.js usually, or attached to window
    window.pickerMode = window.pickerMode || 'manual';

    const palettes = generateProPalettes(currentBaseColor);
    const pantoneMatches = findClosestPantone(currentBaseColor);
    const primaryMatch = pantoneMatches[0];

    // Stats & Data
    const rgb = hexToRgb(currentBaseColor);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    const hsl = hexToHSL(currentBaseColor);
    // const confidence = getMatchConfidence(primaryMatch.distance); // Unsure if used in template, checking...
    // const safety = checkPrintSafety(rgb.r, rgb.g, rgb.b);
    const a11y = getAccessibilityReport(currentBaseColor);
    const aura = generateAura(currentBaseColor);
    // const cosmicGradients = generateGradients(currentBaseColor, palettes);

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
            <i data-lucide="monitor" class="w-3 h-3"></i> <span>Uso: Digital</span>
            <span class="mx-1">|</span>
            <i data-lucide="printer" class="w-3 h-3"></i> <span>Impresión: Variable</span>
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

    let html = `
        <div class="${animClass} mb-24">
            
            <!-- TOP BAR: History & Actions -->
            <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
                 <div class="flex items-center gap-2">
                    <span class="text-[9px] font-bold uppercase opacity-30 tracking-widest hidden sm:block">${siteContent.colorLab.recent}</span>
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
                            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">${siteContent.colorLab.digitalStudio}</h3>
                         </div>
                         <!-- MODE SWITCHER -->
                         <div class="flex bg-black/5 dark:bg-white/5 rounded-lg p-1 gap-1">
                            <button onclick="window.pickerMode='manual'; renderContent(false);" class="px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${window.pickerMode === 'manual' ? 'bg-white dark:bg-stone-800 shadow-sm opacity-100' : 'opacity-40 hover:opacity-100'}">${siteContent.colorLab.modes.manual}</button>
                            <button onclick="window.pickerMode='image'; renderContent(false);" class="px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${window.pickerMode === 'image' ? 'bg-white dark:bg-stone-800 shadow-sm opacity-100' : 'opacity-40 hover:opacity-100'}">${siteContent.colorLab.modes.image}</button>
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
                                        ${siteContent.colorLab.clickSelect}
                                    </div>
                                </div>
                            ` : `
                                <div id="drop-zone" class="w-full aspect-[4/3] rounded-xl mb-4 relative border-2 border-dashed border-stone-300 dark:border-indigo-900/50 flex flex-col items-center justify-center gap-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5 group cursor-pointer overflow-hidden">
                                    <input type="file" id="img-input" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer z-50" onchange="handleImageUpload(this)">
                                    <div class="w-12 h-12 rounded-full bg-violet-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <i data-lucide="image-plus" class="w-6 h-6 text-violet-600"></i>
                                    </div>
                                    <span class="text-[10px] font-bold uppercase tracking-widest opacity-40">${siteContent.colorLab.upload}</span>
                                    <img id="preview-img" class="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none transition-opacity" />
                                </div>
                            `}
                        `}

                        <!-- HEX Display -->
                        <div id="picker-hex-btn" class="flex items-center justify-between bg-black/5 dark:bg-white/5 rounded-xl px-4 py-3 cursor-pointer hover:bg-black/10 transition-colors relative overflow-hidden group" onclick="window.copyToClipboard(document.getElementById('picker-hex-display').textContent); const iconP = document.getElementById('picker-copy-icon'); if(iconP) { iconP.setAttribute('data-lucide', 'check'); iconP.classList.add('text-green-500'); lucide.createIcons(); setTimeout(() => { iconP.setAttribute('data-lucide', 'copy'); iconP.classList.remove('text-green-500'); lucide.createIcons(); }, 1500); }" title="Copiar HEX">
                            <div class="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/5 transition-colors"></div>
                            <div class="flex flex-col">
                                <span class="text-[9px] font-bold opacity-40 uppercase tracking-wider">${siteContent.colorLab.hexName}</span>
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
                    </div>

                    <!-- Technical Data Accordion -->
                    <div class="${themePanel} border ${themeBorder} rounded-[1.5rem] overflow-hidden">
                         <details class="group">
                            <summary class="flex items-center justify-between p-6 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <span class="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">${siteContent.colorLab.techData}</span>
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
    `;

    container.innerHTML = html;

    // Async load name
    const el = document.getElementById('color-identity-name');
    if (el) {
        fetchColorName(currentBaseColor).then(nameData => {
            el.textContent = nameData.name;
            el.title = nameData.exact_match ? 'Nombre Exacto' : 'Aproximado';
        });
    }
}
