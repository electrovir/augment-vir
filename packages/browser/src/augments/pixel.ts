export type WithPx = `${string | number}px`;

export function addPx(input: number | string): string {
    if (String(input).endsWith('px')) {
        return String(input);
    } else {
        return `${input}px`;
    }
}

export function removePx(input: WithPx | string): number {
    return Number(input.replace(/px$/, ''));
}
