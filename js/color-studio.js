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

export function findClosestPantone(hex) {
    const r1 = parseInt(hex.slice(1, 3), 16);
    const g1 = parseInt(hex.slice(3, 5), 16);
    const b1 = parseInt(hex.slice(5, 7), 16);

    // Calculate distance for ALL colors
    const matches = pantoneColors.map(p => {
        const r2 = parseInt(p.hex.slice(1, 3), 16);
        const g2 = parseInt(p.hex.slice(3, 5), 16);
        const b2 = parseInt(p.hex.slice(5, 7), 16);
        const distance = Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
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
