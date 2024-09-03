/**
 * Escapes characters from the given string so that it can be used within a RegExp without being
 * parsed as RegExp syntax.
 *
 * @category RegExp
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export function escapeStringForRegExp(input: string): string {
    return input.replaceAll(/[\^$\\.*+?()[\]{}|]/g, String.raw`\$&`);
}
