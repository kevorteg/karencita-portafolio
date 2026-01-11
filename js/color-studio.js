import { pantoneColors } from './pantone_data.js';

export function hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max == min) h = s = 0;
    else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max == r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max == g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export function getContrast(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? 'black' : 'white';
}

export function generateProPalettes(currentBaseColor) {
    const base = hexToHSL(currentBaseColor);

    // Adobe Color style harmonies logic
    // We adjust not just Hue but also keep Saturation/Lightness in check for harmonious vibes

    const harmony = (hOffset, sMult = 1, lMult = 1) => {
        let newH = (base.h + hOffset) % 360;
        if (newH < 0) newH += 360;
        // Clamp S and L
        let newS = Math.min(100, Math.max(0, base.s * sMult));
        let newL = Math.min(100, Math.max(0, base.l * lMult));
        return hslToHex(newH, newS, newL);
    };

    return {
        Complementary: [harmony(180)], // Adobe usually shows base + 4 others, but simple comp is 1-1
        // Extended Complementary (Adobe style often has 5 colors: Base, Analagous left, Analagous right, Comp, Split Comp)
        // Let's stick to standard names but better colors
        Analogous: [harmony(-30), harmony(-15), harmony(15), harmony(30)],
        SplitComp: [harmony(150), harmony(210)],
        Triadic: [harmony(120), harmony(240)],
        Tetradic: [harmony(90), harmony(180), harmony(270)],
        Monochromatic: [ // Better stepping for mono
            hslToHex(base.h, base.s, Math.max(10, base.l - 40)),
            hslToHex(base.h, base.s, Math.max(20, base.l - 20)),
            hslToHex(base.h, base.s, Math.min(90, base.l + 20)),
            hslToHex(base.h, base.s, Math.min(95, base.l + 40))
        ]
    };
}

// ---------------- NEW METHODS ----------------

// Helper: RGB to LAB (CIE L*a*b*)
export function rgbToLab(r, g, b) {
    let r_ = r / 255, g_ = g / 255, b_ = b / 255;

    // 1. RGB to XYZ
    r_ = r_ > 0.04045 ? Math.pow((r_ + 0.055) / 1.055, 2.4) : r_ / 12.92;
    g_ = g_ > 0.04045 ? Math.pow((g_ + 0.055) / 1.055, 2.4) : g_ / 12.92;
    b_ = b_ > 0.04045 ? Math.pow((b_ + 0.055) / 1.055, 2.4) : b_ / 12.92;

    r_ *= 100; g_ *= 100; b_ *= 100;

    const x = r_ * 0.4124 + g_ * 0.3576 + b_ * 0.1805;
    const y = r_ * 0.2126 + g_ * 0.7152 + b_ * 0.0722;
    const z = r_ * 0.0193 + g_ * 0.1192 + b_ * 0.9505;

    // 2. XYZ to LAB
    let x_ = x / 95.047, y_ = y / 100.000, z_ = z / 108.883;

    x_ = x_ > 0.008856 ? Math.pow(x_, 1 / 3) : (7.787 * x_) + (16 / 116);
    y_ = y_ > 0.008856 ? Math.pow(y_, 1 / 3) : (7.787 * y_) + (16 / 116);
    z_ = z_ > 0.008856 ? Math.pow(z_, 1 / 3) : (7.787 * z_) + (16 / 116);

    const L = (116 * y_) - 16;
    const A = 500 * (x_ - y_);
    const B = 200 * (y_ - z_);

    return { l: L, a: A, b: B };
}

export function findClosestPantone(hex) {
    const r1 = parseInt(hex.slice(1, 3), 16);
    const g1 = parseInt(hex.slice(3, 5), 16);
    const b1 = parseInt(hex.slice(5, 7), 16);
    const lab1 = rgbToLab(r1, g1, b1);

    // Calculate distance for ALL colors
    const matches = pantoneColors.map(p => {
        const r2 = parseInt(p.hex.slice(1, 3), 16);
        const g2 = parseInt(p.hex.slice(3, 5), 16);
        const b2 = parseInt(p.hex.slice(5, 7), 16);

        // UPGRADE 1: Use LAB Space Distance (CIE76)
        // Ideally we'd use CIEDE2000, but CIE76 is a massive leap over RGB Euclidean
        const lab2 = rgbToLab(r2, g2, b2);

        const deltaL = lab1.l - lab2.l;
        const deltaA = lab1.a - lab2.a;
        const deltaB = lab1.b - lab2.b;

        const distance = Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
        return { ...p, distance };
    });

    // Sort by distance and take top 3
    matches.sort((a, b) => a.distance - b.distance);
    return matches.slice(0, 3);
}

export function getBlindnessSimulation(hex) {
    // RGB to Linear RGB
    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.slice(1), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };
    const rgb = hexToRgb(hex);

    // Simple matrix approximation for color blindness types
    // Using widely accepted conversion matrices

    // Protanopia (Red-Blind)
    const protanopia = [
        0.567 * rgb[0] + 0.433 * rgb[1] + 0.000 * rgb[2],
        0.558 * rgb[0] + 0.442 * rgb[1] + 0.000 * rgb[2],
        0.000 * rgb[0] + 0.242 * rgb[1] + 0.758 * rgb[2]
    ];

    // Deuteranopia (Green-Blind)
    const deuteranopia = [
        0.625 * rgb[0] + 0.375 * rgb[1] + 0.000 * rgb[2],
        0.700 * rgb[0] + 0.300 * rgb[1] + 0.000 * rgb[2],
        0.000 * rgb[0] + 0.300 * rgb[1] + 0.700 * rgb[2]
    ];

    const toHex = (arr) => {
        return "#" + arr.map(c => {
            // CRITICAL FIX: Strict clamping to 0-255 range
            const v = Math.min(255, Math.max(0, Math.round(c)));
            return v.toString(16).padStart(2, '0');
        }).join('');
    };

    return {
        protanopia: toHex(protanopia),
        deuteranopia: toHex(deuteranopia)
    };
}

export function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

export function rgbToCmyk(r, g, b) {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, Math.min(m, y));

    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);

    if (isNaN(c)) c = 0;
    if (isNaN(m)) m = 0;
    if (isNaN(y)) y = 0;
    if (isNaN(k)) k = 1;

    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
}

export function getMatchConfidence(distance) {
    // Distance 0 = 100% match.
    // Distance 50 = Poor match.
    // In RGB space (max dist approx 441), let's calibrate:
    // < 15: High (90%+)
    // < 40: Medium (75%+)
    // > 40: Low (<75%)

    if (distance < 15) return { label: 'Alta Similitud', score: 95, class: 'bg-green-500', text: 'text-green-600' };
    if (distance < 35) return { label: 'Media Similitud', score: 80, class: 'bg-yellow-500', text: 'text-yellow-600' };
    return { label: 'Baja Similitud', score: 60, class: 'bg-red-500', text: 'text-red-500' };
}

export function checkPrintSafety(r, g, b) {
    // Estimating out-of-gamut for CMYK.
    // Neon colors (Pure R/G/B or high saturation cyan/magenta mixes) are hard.
    // Simple heuristic: If (R,G,B > 240) in two channels, or pure Cyan/Magenta/Yellow is too bright?
    // Actually, print hazards are usually high saturation colors.

    // A simple approximate check:
    // If Saturation is very high (> 90%) AND Lightness is high (> 60%), tough for CMYK.
    // Or check if pure primary RGB is dominant.

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2 / 255;
    const s = (max === min) ? 0 : (max - min) / (1 - Math.abs(2 * l - 1)) / 255;

    if (s > 0.9 && l > 0.4 && l < 0.8) return { safe: false, msg: 'Fuera de Gama CMYK' };
    return { safe: true, msg: 'Seguro para Impresión' };
}

export function getChromaticFamily(h, s, l) {
    if (s < 10 && l > 85) return 'Blanco';
    if (s < 10 && l < 15) return 'Negro';
    if (s < 15) return 'Gris/Neutro';

    if (h >= 345 || h < 10) return 'Rojo';
    if (h >= 10 && h < 40) return 'Naranja';
    if (h >= 40 && h < 70) return 'Amarillo';
    if (h >= 70 && h < 160) return 'Verde';
    if (h >= 160 && h < 200) return 'Cian';
    if (h >= 200 && h < 260) return 'Azul';
    if (h >= 260 && h < 300) return 'Violeta';
    if (h >= 300 && h < 345) return 'Rosa';
    return 'Indefinido';
}

export function getAccessibilityReport(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Relative Luminance
    const getLuminance = (r, g, b) => {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const lum = getLuminance(r, g, b);

    // Check against White (1.05 / (lum + 0.05))
    const whiteRatio = 1.05 / (lum + 0.05);
    // Check against Black ((lum + 0.05) / 0.05)
    const blackRatio = (lum + 0.05) / 0.05;

    return {
        onWhite: {
            ratio: whiteRatio.toFixed(2),
            aa: whiteRatio >= 4.5 ? 'Pass' : 'Fail',
            aaa: whiteRatio >= 7 ? 'Pass' : 'Fail',
            visible: whiteRatio >= 3
        },
        onBlack: {
            ratio: blackRatio.toFixed(2),
            aa: blackRatio >= 4.5 ? 'Pass' : 'Fail',
            aaa: blackRatio >= 7 ? 'Pass' : 'Fail',
            visible: blackRatio >= 3
        },
    };
}

// --- API & UTILS ---
export async function fetchColorName(hex) {
    // Remove # if present
    const cleanHex = hex.replace('#', '');
    try {
        const response = await fetch(`https://www.thecolorapi.com/id?hex=${cleanHex}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return {
            name: data.name.value, // e.g., "Lavender"
            exact_match: data.name.exact_match_name
        };
    } catch (error) {
        console.warn('Color API failed:', error);
        return { name: 'Unknown', exact_match: false };
    }
}
// --- NEW CREATIVE FEATURES ---

export function generateAura(hex) {
    const { h, s, l } = hexToHSL(hex);
    let aura = { title: "Energía Latente", desc: "Equilibrio neutral.", vibe: "✨" };

    // 1. By Lightness/Saturation (Mood)
    if (l < 15) aura = { title: "Sombra Profunda", desc: "Misterio, elegancia y autoridad absoluta.", vibe: "🌑" };
    else if (l > 90) aura = { title: "Luz Pura", desc: "Claridad, limpieza y nuevos comienzos.", vibe: "☁️" };
    else if (s < 10) aura = { title: "Neutralidad Zen", desc: "Calma, estabilidad y minimalismo.", vibe: "🧘" };
    else {
        // 2. By Hue (Personality)
        if (h >= 345 || h < 10) aura = { title: "Fuego Interior", desc: "Pasión, urgencia y alta energía vital.", vibe: "🔥" };
        else if (h >= 10 && h < 40) aura = { title: "Entusiasmo Solar", desc: "Creatividad, amistad y confianza.", vibe: "🍊" };
        else if (h >= 40 && h < 70) aura = { title: "Optimismo Radiante", desc: "Felicidad, intelecto y precaución.", vibe: "☀️" };
        else if (h >= 70 && h < 160) aura = { title: "Crecimiento Vital", desc: "Naturaleza, frescura y prosperidad.", vibe: "🌿" };
        else if (h >= 160 && h < 200) aura = { title: "Mente Clara", desc: "Innovación, fluidez y tecnología.", vibe: "💧" };
        else if (h >= 200 && h < 260) aura = { title: "Profundidad Cósmica", desc: "Confianza, lógica y paz interior.", vibe: "🌌" };
        else if (h >= 260 && h < 300) aura = { title: "Visión Mística", desc: "Lujo, espiritualidad y creatividad.", vibe: "🔮" };
        else if (h >= 300 && h < 345) aura = { title: "Encanto Magnético", desc: "Romance, dulzura y diversión.", vibe: "🌸" };
    }
    return aura;
}

export function generateGradients(hex, harmonies) {
    // Generate simple but pro gradients
    const colors = harmonies.Analogous || [hex, '#ffffff'];
    const c1 = hex;
    const c2 = colors[0];
    const c3 = colors[2] || colors[1] || '#000000';

    return [
        { name: "Cosmic Mesh", css: `radial-gradient(at 0% 0%, ${c1} 0px, transparent 50%), radial-gradient(at 100% 0%, ${c2} 0px, transparent 50%), radial-gradient(at 100% 100%, ${c3} 0px, transparent 50%), radial-gradient(at 0% 100%, ${c1} 0px, transparent 50%), #000000` },
        { name: "Deep Linear", css: `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)` },
        { name: "Glass Aura", css: `radial-gradient(circle, ${c1} 0%, ${c1}00 70%)` }
    ];
}

export async function extractColorsFromImage(imageSrc) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        // Removed crossOrigin to avoid Tainted Canvas issues with local/data URLs
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Resize for efficient processing
            const targetWidth = 150;
            const scale = targetWidth / img.width;
            canvas.width = targetWidth;
            canvas.height = img.height * scale;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            try {
                const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                const colorCounts = {};

                // Scan pixels (Step 10 for speed)
                const step = 4 * 10;
                for (let i = 0; i < data.length; i += step) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const alpha = data[i + 3];

                    if (alpha < 128) continue;

                    // 2. Safe Quantization (Clamp to 255)
                    const rQ = Math.min(255, Math.round(r / 10) * 10);
                    const gQ = Math.min(255, Math.round(g / 10) * 10);
                    const bQ = Math.min(255, Math.round(b / 10) * 10);

                    // 3. Safe Hex Conversion
                    const toHex = (c) => c.toString(16).padStart(2, '0');
                    const hex = `#${toHex(rQ)}${toHex(gQ)}${toHex(bQ)}`;

                    colorCounts[hex] = (colorCounts[hex] || 0) + 1;
                }

                const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
                const result = sorted.slice(0, 5).map(x => x[0]);

                if (result.length === 0) resolve(['#888888']);
                else resolve(result);

            } catch (e) {
                console.warn("Canvas Read Error", e);
                resolve(['#888888']);
            }
        };
        img.onerror = (e) => {
            console.error("Image Load Failed", e);
            resolve(['#888888']);
        };
        img.src = imageSrc;
    });
}
