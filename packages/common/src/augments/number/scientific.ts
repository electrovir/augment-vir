export function doesRequireScientificNotation(input: number): boolean {
    return String(input).includes('e');
}
