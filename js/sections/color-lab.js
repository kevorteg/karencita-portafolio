
import { siteContent } from '../data.js';
import {
    generateProPalettes, hexToHSL, findClosestPantone, hexToRgb, rgbToCmyk,
    getChromaticFamily, getAccessibilityReport,
    fetchColorName, generateAura
} from '../color-studio.js';

window._colorLabTab = window._colorLabTab || 'visualize';

// ── 150+ Named Colors for search ──────────────────────────────────────────────
const NAMED_COLORS = [
    // Reds
    { name: 'Rojo Carmesí', hex: '#DC143C' }, { name: 'Rojo Vino', hex: '#722F37' },
    { name: 'Rojo Rubí', hex: '#9B111E' }, { name: 'Rojo Tomate', hex: '#FF6347' },
    { name: 'Rojo Coral', hex: '#FF4444' }, { name: 'Rojo Ladrillo', hex: '#CB4154' },
    { name: 'Rojo Borgoña', hex: '#800020' }, { name: 'Rojo Frambuesa', hex: '#E30B5C' },
    { name: 'Rojo Fuego', hex: '#B22222' }, { name: 'Rojo Oscuro', hex: '#8B0000' },
    // Pinks
    { name: 'Rosa Fuerte', hex: '#FF1493' }, { name: 'Rosa Neón', hex: '#FF69B4' },
    { name: 'Rosa Pastel', hex: '#FFB3C6' }, { name: 'Rosa Salmón', hex: '#FA8072' },
    { name: 'Rosa Chicle', hex: '#FF007F' }, { name: 'Rosa Polvos', hex: '#F4B8C1' },
    { name: 'Rosa Antiguo', hex: '#C08081' }, { name: 'Rosa Bebé', hex: '#F4C2C2' },
    // Oranges
    { name: 'Naranja Vivo', hex: '#FF8C00' }, { name: 'Naranja Calabaza', hex: '#FF7518' },
    { name: 'Naranja Coral', hex: '#FF4500' }, { name: 'Naranja Durazno', hex: '#FFDAB9' },
    { name: 'Naranja Mango', hex: '#FF8243' }, { name: 'Naranja Quemado', hex: '#BF5700' },
    { name: 'Naranja Ámbar', hex: '#FFBF00' }, { name: 'Terracota', hex: '#E2725B' },
    // Yellows
    { name: 'Amarillo Dorado', hex: '#FFD700' }, { name: 'Amarillo Limón', hex: '#FFF44F' },
    { name: 'Amarillo Canario', hex: '#FFFF00' }, { name: 'Amarillo Mostaza', hex: '#E1AD21' },
    { name: 'Amarillo Crema', hex: '#FFFDD0' }, { name: 'Amarillo Mantequilla', hex: '#FFE066' },
    { name: 'Amarillo Paja', hex: '#E4D96F' }, { name: 'Amarillo Ocre', hex: '#CC7722' },
    // Greens
    { name: 'Verde Lima', hex: '#32CD32' }, { name: 'Verde Menta', hex: '#98FF98' },
    { name: 'Verde Esmeralda', hex: '#50C878' }, { name: 'Verde Oliva', hex: '#808000' },
    { name: 'Verde Selva', hex: '#228B22' }, { name: 'Verde Bosque', hex: '#014421' },
    { name: 'Verde Neon', hex: '#39FF14' }, { name: 'Verde Aguacate', hex: '#568203' },
    { name: 'Verde Salvia', hex: '#B2AC88' }, { name: 'Verde Musgo', hex: '#8A9A5B' },
    { name: 'Verde Primavera', hex: '#00FF7F' }, { name: 'Verde Jade', hex: '#00A36C' },
    // Blues
    { name: 'Azul Cielo', hex: '#87CEEB' }, { name: 'Azul Claro', hex: '#ADD8E6' },
    { name: 'Azul Acero', hex: '#4682B4' }, { name: 'Azul Royal', hex: '#4169E1' },
    { name: 'Azul Marino', hex: '#001F5B' }, { name: 'Azul Océano', hex: '#0077B6' },
    { name: 'Azul Neón', hex: '#00BFFF' }, { name: 'Azul Pizarra', hex: '#6A5ACD' },
    { name: 'Azul Cobalto', hex: '#0047AB' }, { name: 'Azul Electrico', hex: '#7DF9FF' },
    { name: 'Azul Profundo', hex: '#00008B' }, { name: 'Azul Petróleo', hex: '#023E8A' },
    { name: 'Azul Pastel', hex: '#AEC6CF' }, { name: 'Azul Polvos', hex: '#B0E0E6' },
    { name: 'Azul Turquesa', hex: '#40E0D0' }, { name: 'Azul Índigo', hex: '#4B0082' },
    { name: 'Azul Bebé', hex: '#89CFF0' }, { name: 'Azul Medianoche', hex: '#191970' },
    // Purples
    { name: 'Púrpura Violeta', hex: '#5F259F' }, { name: 'Púrpura Lavanda', hex: '#967BB6' },
    { name: 'Magenta', hex: '#FF00FF' }, { name: 'Índigo', hex: '#4B0082' },
    { name: 'Violeta Oscuro', hex: '#6600AA' }, { name: 'Orquídea', hex: '#DA70D6' },
    { name: 'Morado Uva', hex: '#6F2DA8' }, { name: 'Lila', hex: '#C8A2C8' },
    { name: 'Malva', hex: '#E0B0FF' }, { name: 'Berenjena', hex: '#614051' },
    // Browns / Neutrals
    { name: 'Beige Cálido', hex: '#F5E6C8' }, { name: 'Crema Suave', hex: '#FFFDD0' },
    { name: 'Caramelo', hex: '#C68642' }, { name: 'Chocolate', hex: '#7B3F00' },
    { name: 'Café Expreso', hex: '#3B2314' }, { name: 'Avellana', hex: '#946F55' },
    { name: 'Arena', hex: '#C2B280' }, { name: 'Canela', hex: '#D2691E' },
    { name: 'Cobre', hex: '#B87333' }, { name: 'Tostado', hex: '#CD853F' },
    // Grays
    { name: 'Gris Plata', hex: '#C0C0C0' }, { name: 'Gris Pizarra', hex: '#708090' },
    { name: 'Gris Perla', hex: '#E8E8E8' }, { name: 'Gris Carbón', hex: '#36454F' },
    { name: 'Gris Marengo', hex: '#4C5866' }, { name: 'Gris Humo', hex: '#9A9A9A' },
    { name: 'Gris Gamuza', hex: '#787674' }, { name: 'Negro Azabache', hex: '#0A0A0A' },
    // Metallics
    { name: 'Oro', hex: '#CFB53B' }, { name: 'Oro Rosa', hex: '#B76E79' },
    { name: 'Platino', hex: '#E5E4E2' }, { name: 'Bronce', hex: '#CD7F32' },
    { name: 'Champagne', hex: '#F7E7CE' }, { name: 'Plomo', hex: '#6C757D' },
    // Basics
    { name: 'Negro', hex: '#000000' }, { name: 'Blanco Puro', hex: '#FFFFFF' },
    { name: 'Blanco Hueso', hex: '#FFFFF0' }, { name: 'Blanco Nieve', hex: '#FFFAFA' },
    // Teals & Cyans
    { name: 'Cian', hex: '#00FFFF' }, { name: 'Cian Oscuro', hex: '#008B8B' },
    { name: 'Teal', hex: '#008080' }, { name: 'Turquesa', hex: '#00CED1' },
    { name: 'Menta Fresca', hex: '#16C79A' }, { name: 'Aquamarina', hex: '#7FFFD4' },
];

// ── Main renderer ─────────────────────────────────────────────────────────────
export async function renderColorLab(container, currentBaseColor, isDarkMode, pickerState) {
    const themePanel = isDarkMode ? 'bg-[#1D1B4B]' : 'bg-white';
    const themeBorder = isDarkMode ? 'border-indigo-900/30' : 'border-stone-300';
    const pickerBg = isDarkMode ? '#1D1B4B' : '#f8f8f8';

    window.pickerMode = window.pickerMode || 'manual';

    const palettes = generateProPalettes(currentBaseColor);
    const pantoneMatches = findClosestPantone(currentBaseColor);
    const primaryMatch = pantoneMatches[0];
    const rgb = hexToRgb(currentBaseColor);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    const hsl = hexToHSL(currentBaseColor);
    const a11y = getAccessibilityReport(currentBaseColor);
    const aura = generateAura(currentBaseColor);
    const currentFamily = getChromaticFamily(hsl.h, hsl.s, hsl.l);
    const shades = generateShades(currentBaseColor);
    const svgPatterns = generateSVGPatterns(currentBaseColor);

    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    const textOnColor = brightness > 128 ? '#000000' : '#FFFFFF';

    const tabs = [
        { id: 'visualize', label: 'Visualizar', icon: 'eye' },
        { id: 'codes', label: 'Códigos', icon: 'code-2' },
        { id: 'shades', label: 'Sombras', icon: 'layers' },
        { id: 'palettes', label: 'Paletas', icon: 'swatch-book' },
        { id: 'patterns', label: 'Patrones', icon: 'grid-3x3' },
    ];
    const activeTab = window._colorLabTab;


    container.innerHTML = `
    <div class="animate-fade-in-up pb-10">

        <!-- ╔═ COLOR SEARCH BAR ══════════════════════╗ -->
        <div class="mb-6 relative" id="color-search-wrapper">
            <div class="${themePanel} border ${themeBorder} rounded-2xl flex items-center gap-3 px-4 py-3 shadow-sm focus-within:border-violet-500/60 focus-within:shadow-violet-500/10 focus-within:shadow-lg transition-all">
                <i data-lucide="search" class="w-4 h-4 opacity-40 shrink-0"></i>
                <input id="color-search-input" type="text"
                    placeholder="Busca por nombre: 'Azul Océano', 'Terracota'... o escribe un HEX: #FF5733"
                    class="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40 font-medium" autocomplete="off" />
                <div class="w-7 h-7 rounded-lg border border-black/10 dark:border-white/10 shrink-0 transition-colors" style="background:${currentBaseColor}"></div>
            </div>
            <div id="color-search-suggestions"
                class="absolute left-0 right-0 top-full mt-2 ${themePanel} border ${themeBorder} rounded-2xl shadow-2xl z-50 hidden overflow-hidden max-h-72 overflow-y-auto">
            </div>
        </div>

        <!-- ╔═ MAIN LAYOUT ═══════════════════════════╗ -->
        <div class="flex flex-col lg:flex-row gap-6 items-start">

            <!-- LEFT COLUMN: swatch + picker + aura -->
            <div class="w-full lg:w-64 shrink-0 space-y-4">

                <!-- Color Swatch Hero -->
                <div class="rounded-3xl shadow-2xl relative overflow-hidden" style="background:${currentBaseColor}; min-height:148px;">
                    <div class="absolute inset-0 flex flex-col justify-end p-5">
                        <span id="color-identity-name" class="font-black text-xl leading-tight drop-shadow-md" style="color:${textOnColor}; text-shadow: 0 1px 4px rgba(0,0,0,0.3)">...</span>
                        <span class="text-sm font-mono mt-1 opacity-80" style="color:${textOnColor}">${currentBaseColor.toUpperCase()}</span>
                    </div>
                    <button onclick="window.copyToClipboard('${currentBaseColor}')"
                        class="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                        style="background:${textOnColor}20; color:${textOnColor}">
                        <i data-lucide="copy" class="w-3 h-3"></i> Copiar
                    </button>
                </div>

                <!-- Picker -->
                <div class="${themePanel} border ${themeBorder} rounded-2xl p-4 space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-[9px] font-bold uppercase tracking-widest opacity-40">Selector de Color</span>
                        <div class="flex gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-0.5">
                            <button onclick="window.pickerMode='manual'; renderContent(false);" class="text-[9px] font-bold uppercase px-2.5 py-1 rounded-md transition-all ${window.pickerMode === 'manual' ? 'bg-violet-600 text-white' : 'opacity-50 hover:opacity-100'}">Manual</button>
                            <button onclick="window.pickerMode='image'; renderContent(false);" class="text-[9px] font-bold uppercase px-2.5 py-1 rounded-md transition-all ${window.pickerMode === 'image' ? 'bg-violet-600 text-white' : 'opacity-50 hover:opacity-100'}">Imagen</button>
                        </div>
                    </div>

                    ${window.pickerMode === 'manual' ? `
                    <div id="picker-sl" class="w-full h-36 rounded-xl relative picker-saturation cursor-crosshair select-none"
                        style="background-color: hsl(${pickerState.h}, 100%, 50%);">
                        <div id="picker-sl-handle"
                            class="w-4 h-4 rounded-full border-2 border-white shadow-lg absolute pointer-events-none"
                            style="background:${currentBaseColor}; left:${pickerState.s}%; top:${100 - pickerState.v}%; transform: translate(-50%,-50%);">
                        </div>
                    </div>
                    <div id="picker-hue" class="w-full h-4 rounded-full relative picker-hue cursor-pointer select-none">
                        <div id="picker-hue-handle"
                            class="w-5 h-5 rounded-full border-2 border-white shadow-lg absolute top-1/2 pointer-events-none"
                            style="background: hsl(${pickerState.h}, 100%, 50%); left:${pickerState.h / 3.6}%; transform: translate(-50%,-50%);">
                        </div>
                    </div>
                    <!-- HEX direct input -->
                    <div class="flex items-center gap-2 bg-black/5 dark:bg-white/5 rounded-xl px-3 py-2">
                        <div class="w-5 h-5 rounded-md border border-black/10 shrink-0" style="background:${currentBaseColor}"></div>
                        <input id="hex-input-direct" type="text" value="${currentBaseColor.toUpperCase()}" maxlength="7"
                            class="flex-1 bg-transparent font-mono text-xs font-bold uppercase tracking-widest outline-none"
                            placeholder="#000000" />
                        <button id="hex-input-ok" class="text-[9px] font-bold uppercase text-violet-600 hover:text-violet-400 transition-colors">OK</button>
                    </div>
                    ` : `
                    <div id="drop-zone" class="w-full h-40 rounded-xl relative border-2 border-dashed ${themeBorder} flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden hover:bg-black/5 transition-colors">
                        <input type="file" id="img-input" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer z-50" onchange="handleImageUpload(this)">
                        ${window.currentImageURL ? `
                            <img src="${window.currentImageURL}" onclick="handleImageClick(event)" class="w-full h-full object-contain cursor-crosshair absolute inset-0" id="interactive-img" />
                            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-[9px] font-bold uppercase tracking-widest pointer-events-none">Click para extraer</div>
                        ` : `
                            <i data-lucide="image-plus" class="w-8 h-8 text-violet-600 opacity-60"></i>
                            <span class="text-[10px] font-bold uppercase tracking-widest opacity-40">Arrastra o click</span>
                        `}
                    </div>
                    `}
                </div>

                <!-- Aura -->
                <div class="${themePanel} border ${themeBorder} rounded-2xl p-4">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-xl animate-float inline-block">${aura.vibe}</span>
                        <span class="text-xs font-bold uppercase tracking-widest">${aura.title}</span>
                    </div>
                    <p class="text-[10px] opacity-50 leading-relaxed">${aura.desc}</p>
                </div>
            </div>

            <!-- RIGHT COLUMN: tabs -->
            <div class="flex-1 min-w-0">
                <div class="flex gap-1.5 mb-5 overflow-x-auto no-scrollbar pb-1">
                    ${tabs.map(t => `
                        <button onclick="window._colorLabTab='${t.id}'; renderContent(false);"
                            class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all shrink-0
                            ${activeTab === t.id
            ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
            : `${themePanel} border ${themeBorder} opacity-60 hover:opacity-100 hover:border-violet-500/40`}">
                            <i data-lucide="${t.icon}" class="w-3.5 h-3.5"></i>${t.label}
                        </button>
                    `).join('')}
                </div>

                <div>
                    ${activeTab === 'visualize' ? renderVisualize(currentBaseColor, themePanel, themeBorder) : ''}
                    ${activeTab === 'codes' ? renderCodes(currentBaseColor, rgb, cmyk, hsl, primaryMatch, a11y, currentFamily, themePanel, themeBorder) : ''}
                    ${activeTab === 'shades' ? renderShades(shades, currentBaseColor, themePanel, themeBorder) : ''}
                    ${activeTab === 'palettes' ? renderPalettes(palettes, themePanel, themeBorder) : ''}
                    ${activeTab === 'patterns' ? renderPatterns(svgPatterns, themePanel, themeBorder) : ''}
                </div>
            </div>
        </div>
    </div>`;

    if (window.lucide) lucide.createIcons();

    // Async: color name
    const nameEl = document.getElementById('color-identity-name');
    if (nameEl) fetchColorName(currentBaseColor).then(d => { nameEl.textContent = d.name; });

    // Init picker (drag without re-render)
    if (window.pickerMode === 'manual') initPickerEvents(pickerState);

    // Init search
    initColorSearch();

    // Hex input
    const hexOk = document.getElementById('hex-input-ok');
    const hexIn = document.getElementById('hex-input-direct');
    function applyHex() {
        if (!hexIn) return;
        let v = hexIn.value.trim();
        if (!v.startsWith('#')) v = '#' + v;
        if (/^#[0-9A-Fa-f]{6}$/.test(v)) window.updateColor(v);
    }
    if (hexOk) hexOk.addEventListener('click', applyHex);
    if (hexIn) hexIn.addEventListener('keydown', e => { if (e.key === 'Enter') applyHex(); });
}

// ── TAB: VISUALIZE — SVG Product Mockups ─────────────────────────────────────
function renderVisualize(color, themePanel, themeBorder) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const clamp = v => Math.max(0, Math.min(255, v));
    const darkColor = `rgb(${clamp(r - 70)},${clamp(g - 70)},${clamp(b - 70)})`;
    const deepColor = `rgb(${clamp(r - 110)},${clamp(g - 110)},${clamp(b - 110)})`;
    const lightColor = `rgb(${clamp(r + 60)},${clamp(g + 60)},${clamp(b + 60)})`;

    const uid = Date.now().toString(36);

    // Inspiration row photos (real, no filter)
    const photos = [
        { label: 'Moda', img: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=200&q=70&fit=crop' },
        { label: 'Interior', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=70&fit=crop' },
        { label: 'Calzado', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=70&fit=crop' },
        { label: 'Packaging', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&q=70&fit=crop' },
    ];

    return `
    <div>
        <p class="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-4">Vista previa del color en productos</p>

        <!-- SVG MOCKUP GRID -->
        <div class="grid grid-cols-3 gap-3 mb-6">

            <!-- T-SHIRT -->
            <div class="flex flex-col items-center gap-2">
                <div class="w-full rounded-2xl p-4 shadow-md flex items-center justify-center ${themePanel} border border-black/8 dark:border-white/8" style="aspect-ratio:1/1">
                    ${svgTshirt(color, darkColor, deepColor, lightColor, uid)}
                </div>
                <span class="text-[9px] font-bold uppercase tracking-widest opacity-40">Camiseta</span>
            </div>

            <!-- MUG -->
            <div class="flex flex-col items-center gap-2">
                <div class="w-full rounded-2xl p-4 shadow-md flex items-center justify-center ${themePanel} border border-black/8 dark:border-white/8" style="aspect-ratio:1/1">
                    ${svgMug(color, darkColor, deepColor, lightColor, uid)}
                </div>
                <span class="text-[9px] font-bold uppercase tracking-widest opacity-40">Taza</span>
            </div>

            <!-- TOTE BAG -->
            <div class="flex flex-col items-center gap-2">
                <div class="w-full rounded-2xl p-4 shadow-md flex items-center justify-center ${themePanel} border border-black/8 dark:border-white/8" style="aspect-ratio:1/1">
                    ${svgTote(color, darkColor, deepColor, lightColor, uid)}
                </div>
                <span class="text-[9px] font-bold uppercase tracking-widest opacity-40">Bolsa</span>
            </div>

            <!-- SNEAKER -->
            <div class="flex flex-col items-center gap-2">
                <div class="w-full rounded-2xl p-4 shadow-md flex items-center justify-center ${themePanel} border border-black/8 dark:border-white/8" style="aspect-ratio:1/1">
                    ${svgSneaker(color, darkColor, deepColor, lightColor, uid)}
                </div>
                <span class="text-[9px] font-bold uppercase tracking-widest opacity-40">Calzado</span>
            </div>

            <!-- PILLOW -->
            <div class="flex flex-col items-center gap-2">
                <div class="w-full rounded-2xl p-4 shadow-md flex items-center justify-center ${themePanel} border border-black/8 dark:border-white/8" style="aspect-ratio:1/1">
                    ${svgPillow(color, darkColor, deepColor, lightColor, uid)}
                </div>
                <span class="text-[9px] font-bold uppercase tracking-widest opacity-40">Almohada</span>
            </div>

            <!-- PHONE -->
            <div class="flex flex-col items-center gap-2">
                <div class="w-full rounded-2xl p-4 shadow-md flex items-center justify-center ${themePanel} border border-black/8 dark:border-white/8" style="aspect-ratio:1/1">
                    ${svgPhone(color, darkColor, deepColor, lightColor, uid)}
                </div>
                <span class="text-[9px] font-bold uppercase tracking-widest opacity-40">Funda</span>
            </div>

        </div>

        <!-- INSPIRATION ROW -->
        <p class="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-2">Inspiración real</p>
        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            ${photos.map(p => `
                <div class="shrink-0 rounded-xl overflow-hidden shadow-sm relative group" style="width:110px; height:80px;">
                    <img src="${p.img}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" alt="${p.label}" />
                    <div class="absolute bottom-0 inset-x-0 px-2 py-1 bg-black/50 backdrop-blur-sm">
                        <span class="text-white text-[8px] font-bold uppercase tracking-widest">${p.label}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>`;
}

// ── SVG PRODUCT GENERATORS ────────────────────────────────────────────────────
function svgTshirt(c, dark, deep, light, uid) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:90%;height:90%;">
        <defs>
            <linearGradient id="ts-side-${uid}" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="${deep}" stop-opacity="0.5"/>
                <stop offset="30%" stop-color="${deep}" stop-opacity="0"/>
                <stop offset="70%" stop-color="${deep}" stop-opacity="0"/>
                <stop offset="100%" stop-color="${deep}" stop-opacity="0.4"/>
            </linearGradient>
            <radialGradient id="ts-hi-${uid}" cx="50%" cy="15%" r="45%">
                <stop offset="0%" stop-color="${light}" stop-opacity="0.5"/>
                <stop offset="100%" stop-color="${light}" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <!-- Base body -->
        <path d="M65,20 C80,32 120,32 135,20 L185,52 L170,70 L143,57 L143,182 L57,182 L57,57 L30,70 L15,52 Z" fill="${c}"/>
        <!-- Side shadows -->
        <path d="M65,20 C80,32 120,32 135,20 L185,52 L170,70 L143,57 L143,182 L57,182 L57,57 L30,70 L15,52 Z" fill="url(#ts-side-${uid})"/>
        <!-- Top highlight -->
        <path d="M65,20 C80,32 120,32 135,20 L185,52 L170,70 L143,57 L143,182 L57,182 L57,57 L30,70 L15,52 Z" fill="url(#ts-hi-${uid})"/>
        <!-- Collar shadow -->
        <path d="M65,20 C80,32 120,32 135,20 C120,26 80,26 65,20 Z" fill="${deep}" fill-opacity="0.3"/>
        <!-- Fold lines -->
        <line x1="100" y1="60" x2="95" y2="182" stroke="${deep}" stroke-opacity="0.15" stroke-width="2"/>
        <line x1="75" y1="80" x2="72" y2="182" stroke="${deep}" stroke-opacity="0.1" stroke-width="1.5"/>
        <line x1="125" y1="80" x2="128" y2="182" stroke="${deep}" stroke-opacity="0.1" stroke-width="1.5"/>
    </svg>`;
}

function svgMug(c, dark, deep, light, uid) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:90%;height:90%;">
        <defs>
            <linearGradient id="mg-grad-${uid}" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="${deep}" stop-opacity="0.5"/>
                <stop offset="25%" stop-color="${light}" stop-opacity="0.3"/>
                <stop offset="70%" stop-color="${c}" stop-opacity="0"/>
                <stop offset="100%" stop-color="${deep}" stop-opacity="0.5"/>
            </linearGradient>
            <linearGradient id="mg-top-${uid}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${light}" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="${light}" stop-opacity="0"/>
            </linearGradient>
        </defs>
        <!-- Mug body -->
        <path d="M45,55 Q40,55 38,65 L35,175 Q35,188 52,188 L148,188 Q165,188 165,175 L162,65 Q162,55 155,55 Z" fill="${c}"/>
        <!-- Gradient overlay -->
        <path d="M45,55 Q40,55 38,65 L35,175 Q35,188 52,188 L148,188 Q165,188 165,175 L162,65 Q162,55 155,55 Z" fill="url(#mg-grad-${uid})"/>
        <!-- Handle -->
        <path d="M165,85 Q205,90 205,130 Q205,170 165,158" fill="none" stroke="${dark}" stroke-width="14" stroke-linecap="round"/>
        <path d="M165,85 Q198,90 198,130 Q198,165 165,158" fill="none" stroke="${light}" stroke-width="5" stroke-linecap="round" stroke-opacity="0.5"/>
        <!-- Rim -->
        <ellipse cx="100" cy="55" rx="60" ry="10" fill="${dark}"/>
        <ellipse cx="100" cy="53" rx="60" ry="10" fill="${light}" fill-opacity="0.3"/>
        <!-- Rim top highlight -->
        <path d="M42,48 Q100,38 158,48" fill="none" stroke="${light}" stroke-width="3" stroke-opacity="0.6"/>
    </svg>`;
}

function svgTote(c, dark, deep, light, uid) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:90%;height:90%;">
        <defs>
            <linearGradient id="tb-grad-${uid}" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="${deep}" stop-opacity="0.45"/>
                <stop offset="30%" stop-color="${light}" stop-opacity="0.25"/>
                <stop offset="70%" stop-color="${c}" stop-opacity="0"/>
                <stop offset="100%" stop-color="${deep}" stop-opacity="0.4"/>
            </linearGradient>
        </defs>
        <!-- Handles -->
        <path d="M68,72 Q62,20 82,15 Q100,10 105,72" fill="none" stroke="${dark}" stroke-width="10" stroke-linecap="round"/>
        <path d="M95,72 Q100,20 118,15 Q138,10 132,72" fill="none" stroke="${dark}" stroke-width="10" stroke-linecap="round"/>
        <!-- Bag body -->
        <path d="M25,72 L32,188 L168,188 L175,72 Z" fill="${c}"/>
        <path d="M25,72 L32,188 L168,188 L175,72 Z" fill="url(#tb-grad-${uid})"/>
        <!-- Bottom fold shadow -->
        <path d="M32,188 L35,175 L165,175 L168,188 Z" fill="${deep}" fill-opacity="0.2"/>
        <!-- Top edge -->
        <rect x="22" y="68" width="156" height="10" rx="3" fill="${dark}"/>
        <rect x="22" y="68" width="80" height="5" rx="3" fill="${light}" fill-opacity="0.3"/>
        <!-- Center seam -->
        <line x1="100" y1="78" x2="100" y2="180" stroke="${deep}" stroke-opacity="0.15" stroke-width="1.5" stroke-dasharray="4 3"/>
    </svg>`;
}

function svgSneaker(c, dark, deep, light, uid) {
    return `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:90%;">
        <defs>
            <linearGradient id="sk-grad-${uid}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${light}" stop-opacity="0.5"/>
                <stop offset="60%" stop-color="${c}" stop-opacity="0"/>
                <stop offset="100%" stop-color="${deep}" stop-opacity="0.3"/>
            </linearGradient>
        </defs>
        <!-- Sole -->
        <path d="M15,130 Q15,148 35,148 L170,148 Q195,148 195,132 L195,125 L15,122 Z" fill="${deep}"/>
        <!-- Midsole -->
        <path d="M15,122 L195,122 L195,130 L15,130 Z" fill="${dark}" fill-opacity="0.7"/>
        <!-- Upper body -->
        <path d="M28,122 Q30,75 60,60 Q95,48 130,55 Q165,62 182,90 L182,122 Z" fill="${c}"/>
        <path d="M28,122 Q30,75 60,60 Q95,48 130,55 Q165,62 182,90 L182,122 Z" fill="url(#sk-grad-${uid})"/>
        <!-- Toe box -->
        <path d="M28,122 Q28,80 55,68 Q45,80 42,122 Z" fill="${deep}" fill-opacity="0.25"/>
        <!-- Tongue -->
        <path d="M88,58 Q96,55 104,58 L108,118 L84,118 Z" fill="${light}" fill-opacity="0.5"/>
        <!-- Laces -->
        <line x1="86" y1="75" x2="110" y2="72" stroke="white" stroke-width="2" stroke-opacity="0.7"/>
        <line x1="88" y1="88" x2="110" y2="85" stroke="white" stroke-width="2" stroke-opacity="0.7"/>
        <line x1="89" y1="101" x2="109" y2="99" stroke="white" stroke-width="2" stroke-opacity="0.7"/>
        <!-- Side swoosh-like detail -->
        <path d="M55,100 Q90,85 155,95" fill="none" stroke="${light}" stroke-width="3" stroke-opacity="0.4" stroke-linecap="round"/>
    </svg>`;
}

function svgPillow(c, dark, deep, light, uid) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:90%;height:90%;">
        <defs>
            <radialGradient id="pw-hi-${uid}" cx="40%" cy="35%" r="50%">
                <stop offset="0%" stop-color="${light}" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="${light}" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="pw-sh-${uid}" cx="80%" cy="75%" r="45%">
                <stop offset="0%" stop-color="${deep}" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="${deep}" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <!-- Pillow shadow (ground) -->
        <ellipse cx="100" cy="180" rx="70" ry="10" fill="black" fill-opacity="0.12"/>
        <!-- Pillow body -->
        <path d="M22,75 Q22,25 100,25 Q178,25 178,75 L178,135 Q178,182 100,182 Q22,182 22,135 Z" fill="${c}"/>
        <!-- Edge piping -->
        <path d="M22,75 Q22,25 100,25 Q178,25 178,75 L178,135 Q178,182 100,182 Q22,182 22,135 Z" fill="none" stroke="${dark}" stroke-width="6"/>
        <!-- Highlight -->
        <path d="M22,75 Q22,25 100,25 Q178,25 178,75 L178,135 Q178,182 100,182 Q22,182 22,135 Z" fill="url(#pw-hi-${uid})"/>
        <!-- Shadow corner -->
        <path d="M22,75 Q22,25 100,25 Q178,25 178,75 L178,135 Q178,182 100,182 Q22,182 22,135 Z" fill="url(#pw-sh-${uid})"/>
        <!-- Center button -->
        <circle cx="100" cy="103" r="6" fill="${deep}" fill-opacity="0.4"/>
        <circle cx="100" cy="103" r="3" fill="${deep}" fill-opacity="0.6"/>
        <!-- Gather lines -->
        <path d="M100,103 Q65,80 30,90" fill="none" stroke="${deep}" stroke-opacity="0.12" stroke-width="1.5"/>
        <path d="M100,103 Q135,80 170,90" fill="none" stroke="${deep}" stroke-opacity="0.12" stroke-width="1.5"/>
        <path d="M100,103 Q65,130 30,118" fill="none" stroke="${deep}" stroke-opacity="0.12" stroke-width="1.5"/>
        <path d="M100,103 Q135,130 170,118" fill="none" stroke="${deep}" stroke-opacity="0.12" stroke-width="1.5"/>
    </svg>`;
}

function svgPhone(c, dark, deep, light, uid) {
    return `<svg viewBox="0 0 140 200" xmlns="http://www.w3.org/2000/svg" style="width:70%;height:90%;">
        <defs>
            <linearGradient id="ph-grad-${uid}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${light}" stop-opacity="0.5"/>
                <stop offset="50%" stop-color="${c}" stop-opacity="0"/>
                <stop offset="100%" stop-color="${deep}" stop-opacity="0.4"/>
            </linearGradient>
        </defs>
        <!-- Phone body -->
        <rect x="10" y="10" width="120" height="180" rx="22" ry="22" fill="${c}"/>
        <rect x="10" y="10" width="120" height="180" rx="22" ry="22" fill="url(#ph-grad-${uid})"/>
        <!-- Screen inset -->
        <rect x="18" y="22" width="104" height="156" rx="16" ry="16" fill="${deep}" fill-opacity="0.35"/>
        <rect x="20" y="24" width="100" height="152" rx="14" ry="14" fill="black" fill-opacity="0.45"/>
        <!-- Camera notch -->
        <rect x="48" y="16" width="44" height="12" rx="6" fill="${deep}" fill-opacity="0.5"/>
        <!-- Side button -->
        <rect x="130" y="65" width="5" height="28" rx="3" fill="${dark}"/>
        <!-- Volume buttons -->
        <rect x="5" y="60" width="5" height="18" rx="3" fill="${dark}"/>
        <rect x="5" y="85" width="5" height="18" rx="3" fill="${dark}"/>
        <!-- Screen shine -->
        <path d="M26,30 Q32,26 40,28 L26,55 Z" fill="white" fill-opacity="0.08"/>
        <!-- Edge gloss -->
        <rect x="10" y="10" width="120" height="180" rx="22" ry="22" fill="none" stroke="${light}" stroke-width="1.5" stroke-opacity="0.4"/>
    </svg>`;
}

// ── TAB: CODES ────────────────────────────────────────────────────────────────
function renderCodes(hex, rgb, cmyk, hsl, pantone, a11y, family, themePanel, themeBorder) {
    const rows = [
        { label: 'HEX', value: hex.toUpperCase() },
        { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
        { label: 'HSL', value: `hsl(${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)` },
        { label: 'CMYK', value: `C:${cmyk.c} M:${cmyk.m} Y:${cmyk.y} K:${cmyk.k}` },
        { label: 'Pantone (aprox)', value: pantone.name },
        { label: 'Familia cromática', value: family },
    ];
    return `
        <div class="space-y-2">
            ${rows.map(r => `
                <div class="${themePanel} border ${themeBorder} rounded-2xl px-4 py-3 flex items-center justify-between group hover:border-violet-500/50 transition-all cursor-default">
                    <div>
                        <span class="text-[8px] font-bold uppercase tracking-widest opacity-40 block">${r.label}</span>
                        <span class="font-mono text-sm font-bold mt-0.5 block">${r.value}</span>
                    </div>
                    <button onclick="window.copyToClipboard('${r.value}')" class="opacity-0 group-hover:opacity-100 transition-all p-2 rounded-xl hover:bg-violet-600 hover:text-white active:scale-95">
                        <i data-lucide="copy" class="w-4 h-4"></i>
                    </button>
                </div>
            `).join('')}
            <div class="${themePanel} border ${themeBorder} rounded-2xl p-4">
                <span class="text-[9px] font-bold uppercase tracking-widest opacity-40 block mb-3">Accesibilidad WCAG 2.1</span>
                <div class="flex gap-2">
                    <div class="flex-1 flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-black">
                        <span class="w-2.5 h-2.5 rounded-full ${a11y.onWhite.aa === 'Pass' ? 'bg-green-500' : 'bg-red-500'}"></span>
                        <div><div class="text-[8px] opacity-40 uppercase font-bold">vs Blanco</div><div class="text-xs font-bold">${a11y.onWhite.ratio} · ${a11y.onWhite.aa}</div></div>
                    </div>
                    <div class="flex-1 flex items-center gap-2 p-3 rounded-xl bg-black dark:bg-white">
                        <span class="w-2.5 h-2.5 rounded-full ${a11y.onBlack.aa === 'Pass' ? 'bg-green-500' : 'bg-red-500'}"></span>
                        <div><div class="text-[8px] opacity-40 uppercase font-bold text-white dark:text-black">vs Negro</div><div class="text-xs font-bold text-white dark:text-black">${a11y.onBlack.ratio} · ${a11y.onBlack.aa}</div></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ── TAB: SHADES ───────────────────────────────────────────────────────────────
function renderShades(shades, baseColor, themePanel, themeBorder) {
    return `
        <div>
            <p class="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-4">Tints · Base · Shades · Click para aplicar</p>
            <div class="grid grid-cols-5 gap-2 mb-5">
                ${shades.map((s, i) => `
                    <button onclick="window.updateColor('${s.hex}')" class="group flex flex-col items-center gap-1">
                        <div class="w-full aspect-square rounded-xl shadow-md transition-all group-hover:scale-110 group-hover:shadow-xl relative" style="background:${s.hex}">
                            ${s.hex.toLowerCase() === baseColor.toLowerCase() ? `<div class="absolute inset-0 ring-2 ring-white/70 rounded-xl ring-offset-1 ring-offset-indigo-900"></div>` : ''}
                        </div>
                        <span class="text-[7px] font-mono opacity-40 group-hover:opacity-100 transition-opacity text-center">${s.hex}</span>
                    </button>
                `).join('')}
            </div>
            <div class="h-10 rounded-2xl overflow-hidden shadow-lg" style="background: linear-gradient(to right, ${shades.map(s => s.hex).join(', ')})"></div>
        </div>
    `;
}

// ── TAB: PALETTES ─────────────────────────────────────────────────────────────
function renderPalettes(palettes, themePanel, themeBorder) {
    return `
        <div class="space-y-3">
            ${Object.entries(palettes).map(([name, colors]) => `
                <div class="${themePanel} border ${themeBorder} rounded-2xl p-4">
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-[10px] font-bold uppercase tracking-widest opacity-60">${name}</span>
                        <button onclick="window.copyToClipboard('${colors.join(', ')}')" class="opacity-30 hover:opacity-100 transition-opacity p-1">
                            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                    <div class="flex h-12 rounded-xl overflow-hidden shadow-sm">
                        ${colors.map(c => `
                            <div class="flex-1 hover:flex-[2] transition-[flex] duration-300 cursor-pointer" style="background:${c}" onclick="window.updateColor('${c}')" title="${c}"></div>
                        `).join('')}
                    </div>
                    <div class="flex mt-1.5 gap-px">
                        ${colors.map(c => `<span class="flex-1 text-center text-[7px] font-mono opacity-40 hover:opacity-100 cursor-pointer transition-opacity" onclick="window.copyToClipboard('${c}')">${c}</span>`).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ── TAB: PATTERNS ─────────────────────────────────────────────────────────────
function renderPatterns(patterns, themePanel, themeBorder) {
    return `
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            ${patterns.map(p => `
                <div class="${themePanel} border ${themeBorder} rounded-2xl overflow-hidden">
                    <div class="aspect-square" style="${p.style}"></div>
                    <div class="p-3 flex items-center justify-between">
                        <span class="text-[9px] font-bold uppercase tracking-widest opacity-50">${p.name}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ── PICKER EVENTS (fixed: removes old listeners, guards stale DOM refs) ───────
function initPickerEvents(pickerState) {
    // ── CRITICAL: remove accumulated listeners from previous renders ──────────
    if (window._clabOnMove) {
        window.removeEventListener('mousemove', window._clabOnMove);
        window.removeEventListener('touchmove', window._clabOnMove);
    }
    if (window._clabOnUp) {
        window.removeEventListener('mouseup', window._clabOnUp);
        window.removeEventListener('touchend', window._clabOnUp);
    }

    const slArea = document.getElementById('picker-sl');
    const hueBar = document.getElementById('picker-hue');
    if (!slArea || !hueBar) return;

    // Local mutable state copy — persists across moves within this drag session
    const state = { h: pickerState.h, s: pickerState.s, v: pickerState.v };
    let dragging = null;

    function hsvToHex(h, s, v) {
        s = Math.max(0, Math.min(100, s)) / 100;
        v = Math.max(0, Math.min(100, v)) / 100;
        h = ((h % 360) + 360) % 360;
        const k = n => (n + h / 60) % 6;
        const f = n => v - v * s * Math.max(0, Math.min(k(n), 4 - k(n), 1));
        const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
        return '#' + toHex(f(5)) + toHex(f(3)) + toHex(f(1));
    }

    // ── DOM update: always fetches element by ID — never uses stale refs ──────
    function updateDOM() {
        const slEl = document.getElementById('picker-sl');
        const hueEl = document.getElementById('picker-hue');
        if (!slEl || !hueEl) return; // element was removed from DOM, stop

        const hex = hsvToHex(state.h, state.s, state.v);
        const slHandle = document.getElementById('picker-sl-handle');
        const hHandle = document.getElementById('picker-hue-handle');
        const hexInput = document.getElementById('hex-input-direct');

        slEl.style.backgroundColor = `hsl(${state.h}, 100%, 50%)`;
        if (slHandle) {
            slHandle.style.left = state.s + '%';
            slHandle.style.top = (100 - state.v) + '%';
            slHandle.style.background = hex;
        }
        if (hHandle) {
            hHandle.style.left = (state.h / 3.6) + '%';
            hHandle.style.background = `hsl(${state.h}, 100%, 50%)`;
        }
        if (hexInput) hexInput.value = hex.toUpperCase();

        // Update big swatch background without re-render
        const heroSwatch = document.querySelector('.rounded-3xl[style*="background"]');
        if (heroSwatch) heroSwatch.style.background = hex;

        // Silent global update (no re-render)
        if (window.setColorSilent) window.setColorSilent(hex);
    }

    // ── Safe position calculators (fetch element fresh, guard zero-size) ──────
    function getSLPos(e) {
        const el = document.getElementById('picker-sl');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return null;
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            s: Math.max(0, Math.min(100, ((cx - rect.left) / rect.width) * 100)),
            v: Math.max(0, Math.min(100, 100 - ((cy - rect.top) / rect.height) * 100))
        };
    }

    function getHuePos(e) {
        const el = document.getElementById('picker-hue');
        if (!el) return state.h;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0) return state.h;
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        return Math.max(0, Math.min(360, ((cx - rect.left) / rect.width) * 360));
    }

    // Mousedown on picker areas
    slArea.addEventListener('mousedown', e => {
        e.preventDefault();
        dragging = 'sl';
        const p = getSLPos(e);
        if (p) { state.s = p.s; state.v = p.v; updateDOM(); }
    });
    slArea.addEventListener('touchstart', e => {
        dragging = 'sl';
        const p = getSLPos(e);
        if (p) { state.s = p.s; state.v = p.v; updateDOM(); }
    }, { passive: true });
    hueBar.addEventListener('mousedown', e => {
        e.preventDefault();
        dragging = 'hue';
        state.h = getHuePos(e);
        updateDOM();
    });
    hueBar.addEventListener('touchstart', e => {
        dragging = 'hue';
        state.h = getHuePos(e);
        updateDOM();
    }, { passive: true });

    // ── Global move handler — stored on window so it can be removed ───────────
    window._clabOnMove = function (e) {
        if (!dragging) return;
        if (dragging === 'sl') {
            const p = getSLPos(e);
            if (p) { state.s = p.s; state.v = p.v; }
        } else {
            state.h = getHuePos(e);
        }
        updateDOM();
    };

    // ── Global up handler — triggers re-render ONCE when drag ends ────────────
    window._clabOnUp = function () {
        if (!dragging) return;
        dragging = null;
        const hex = hsvToHex(state.h, state.s, state.v);
        if (window.updateColor) window.updateColor(hex); // re-render now
    };

    window.addEventListener('mousemove', window._clabOnMove);
    window.addEventListener('touchmove', window._clabOnMove, { passive: true });
    window.addEventListener('mouseup', window._clabOnUp);
    window.addEventListener('touchend', window._clabOnUp);
}

// ── COLOR SEARCH ──────────────────────────────────────────────────────────────
function initColorSearch() {
    const input = document.getElementById('color-search-input');
    const dropdown = document.getElementById('color-search-suggestions');
    if (!input || !dropdown) return;

    function show(query) {
        query = query.trim();
        if (!query) { dropdown.classList.add('hidden'); return; }

        let matches = [];

        // HEX input
        if (query.startsWith('#')) {
            const padded = (query + '000000').slice(0, 7);
            if (/^#[0-9A-Fa-f]{6}$/.test(padded)) {
                matches = [{ name: padded.toUpperCase(), hex: padded }];
            }
        } else {
            // Score-based match: exact start > contains
            matches = NAMED_COLORS
                .map(c => {
                    const nl = c.name.toLowerCase(), ql = query.toLowerCase();
                    const score = nl.startsWith(ql) ? 2 : nl.includes(ql) ? 1 : 0;
                    return { ...c, score };
                })
                .filter(c => c.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, 12);
        }

        if (!matches.length) { dropdown.classList.add('hidden'); return; }

        dropdown.innerHTML = `<div class="p-2 grid grid-cols-2 gap-1">
            ${matches.map(c => `
                <button onclick="window.updateColor('${c.hex}'); document.getElementById('color-search-input').value='${c.name}'; document.getElementById('color-search-suggestions').classList.add('hidden');"
                    class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-violet-600/10 transition-colors text-left group">
                    <div class="w-8 h-8 rounded-xl shadow-sm shrink-0 border border-black/10 dark:border-white/10" style="background:${c.hex}"></div>
                    <div class="min-w-0">
                        <span class="text-xs font-bold block leading-tight truncate">${c.name}</span>
                        <span class="text-[9px] font-mono opacity-40">${c.hex.toUpperCase()}</span>
                    </div>
                </button>
            `).join('')}
        </div>`;

        dropdown.classList.remove('hidden');
        if (window.lucide) lucide.createIcons();
    }

    input.addEventListener('input', e => show(e.target.value));
    input.addEventListener('focus', e => { if (e.target.value) show(e.target.value); });
    document.addEventListener('click', e => {
        if (!document.getElementById('color-search-wrapper')?.contains(e.target)) {
            dropdown?.classList.add('hidden');
        }
    });
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function generateShades(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return Array.from({ length: 10 }, (_, i) => {
        const t = i / 9;
        let fr, fg, fb;
        if (t < 0.5) {
            const f = t * 2;
            fr = Math.round(255 + (r - 255) * f);
            fg = Math.round(255 + (g - 255) * f);
            fb = Math.round(255 + (b - 255) * f);
        } else {
            const f = (t - 0.5) * 2;
            fr = Math.round(r * (1 - f));
            fg = Math.round(g * (1 - f));
            fb = Math.round(b * (1 - f));
        }
        const clamp = x => Math.max(0, Math.min(255, x));
        const toH = x => clamp(x).toString(16).padStart(2, '0');
        return { hex: `#${toH(fr)}${toH(fg)}${toH(fb)}` };
    });
}

function generateSVGPatterns(color) {
    const light = color + '25';
    return [
        { name: 'Puntos', style: `background-image: radial-gradient(circle, ${color} 22%, transparent 22%); background-size: 18px 18px; background-color: ${light};` },
        { name: 'Rayas 45°', style: `background: repeating-linear-gradient(45deg, ${color} 0, ${color} 2px, transparent 2px, transparent 14px); background-color: ${light};` },
        { name: 'Cuadrícula', style: `background-image: linear-gradient(${color}80 1px, transparent 1px), linear-gradient(90deg, ${color}80 1px, transparent 1px); background-size: 20px 20px; background-color: ${light};` },
        { name: 'Diagonal', style: `background: repeating-linear-gradient(-45deg, ${color} 0, ${color} 1.5px, transparent 0, transparent 50%); background-size: 12px 12px; background-color: ${light};` },
        { name: 'Rombos', style: `background-color: ${light}; background-image: linear-gradient(135deg, ${color} 25%, transparent 25%), linear-gradient(225deg, ${color} 25%, transparent 25%), linear-gradient(315deg, ${color} 25%, transparent 25%), linear-gradient(45deg, ${color} 25%, transparent 25%); background-size: 20px 20px; background-position: 10px 0, 10px 0, 0 0, 0 0;` },
        { name: 'Ondas', style: `background: radial-gradient(ellipse 80% 50% at 50% -20%, ${color}60 0%, transparent 100%); background-color: ${light}; background-size: 28px 14px; background-image: repeating-radial-gradient(ellipse at 0 0, ${color}40, ${color}30 5px, transparent 5px, transparent 100%);` },
    ];
}
