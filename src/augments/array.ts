export function filterOutIndexes<T>(array: Readonly<T[]>, indexes: Readonly<number[]>): T[] {
    return array.filter((_, index) => !indexes.includes(index));
}

export function flatten2dArray<T>(array2d: T[][]): T[] {
    const flattened: T[] = array2d.reduce((accum: T[], row) => accum.concat(row), []);

    return flattened;
}

export function trimArrayStrings(input: string[]): string[] {
    return input.map((line) => line.trim()).filter((line) => line !== '');
}
