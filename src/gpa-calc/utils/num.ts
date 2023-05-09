export function mapRange(num: number, originalMin: number, originalMax: number, newMin: number, newMax: number) {
    return ((num - originalMin) / (originalMax - originalMin)) * (newMax - newMin) + newMin;
}

export function clamp(num: number, min: number, max: number) {
    return Math.max(Math.min(num, max), min);
}