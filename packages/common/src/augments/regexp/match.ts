/**
 * Performs
 * [`''.match`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)
 * but falls back to an empty array if no match was found.
 *
 * @category RegExp : Common
 * @package @augment-vir/common
 */
export function safeMatch(input: string, regExp: RegExp): string[] {
    const match = input.match(regExp);
    return match ?? [];
}
