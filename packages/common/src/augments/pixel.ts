export type WithPx = `${string | number}px`;

export function addPx(input: number | string): WithPx {
    if (String(input).endsWith('px')) {
        return String(input) as WithPx;
    } else {
        return `${input}px`;
    }
}

export function removePx(input: WithPx | string): number {
    return Number(input.replace(/px$/, ''));
}
