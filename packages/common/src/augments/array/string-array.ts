/**
 * Trims all entries in an array.
 *
 * @category Array : Common
 * @returns A new array (does not mutate).
 * @package @augment-vir/common
 */
export function trimArrayStrings(input: ReadonlyArray<string>): string[] {
    return input.map((line) => line.trim()).filter((line) => line !== '');
}
