export function repeatArray<T>(repeatCount: number, array: T[]): T[] {
    return Array.from({length: repeatCount}, () => [...array]).flat();
}
