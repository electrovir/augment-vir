/**
 * Indent all lines in a string by 4 spaces * count.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function indent(value: string, count: number = 1): string {
    return value
        .split('\n')
        .map((line) => {
            return [
                '    '.repeat(Math.round(count)),
                line,
            ].join('');
        })
        .join('\n');
}
