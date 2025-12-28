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
