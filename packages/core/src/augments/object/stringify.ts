import JSON5 from 'json5';

export function stringify(input: unknown) {
    try {
        return JSON5.stringify(input);
    } catch {
        return String(input);
    }
}
