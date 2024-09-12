/**
 * Performs
 * [`''.match`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/match)
 * but falls back to an empty array if no match was found.
 *
 * @category RegExp
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function safeMatch(input: string, regExp: RegExp): string[] {
    const match = input.match(regExp);
    return match ?? [];
}
