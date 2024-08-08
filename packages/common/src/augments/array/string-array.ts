export function trimArrayStrings(input: ReadonlyArray<string>): string[] {
    return input.map((line) => line.trim()).filter((line) => line !== '');
}
