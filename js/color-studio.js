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
    return {
        Monochromatic: [20, 40, 60, 80].map(l => hslToHex(base.h, base.s, l)),
        Analogous: [-30, -15, 15, 30].map(off => hslToHex((base.h + off + 360) % 360, base.s, base.l)),
        SplitComp: [150, 180, 210].map(off => hslToHex((base.h + off) % 360, base.s, base.l)),
        Triadic: [120, 240].map(off => hslToHex((base.h + off) % 360, base.s, base.l)),
        Tetradic: [90, 180, 270].map(off => hslToHex((base.h + off) % 360, base.s, base.l)),
        Shades: [10, 25, 40, 55, 70, 85].map(l => hslToHex(base.h, base.s, l))
    };
}
