import {check} from '@augment-vir/assert';
import {filterMap} from '../array/filter.js';

/**
 * Trim all lines within a string and keep it a string.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {trimLines} from '@augment-vir/common';
 *
 * const result = trimLines('   hi  \n   bye   \n\n abc'); // 'hi\nbye\nabc'
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function trimLines(value: string): string {
    return trimAndSplitLines(value).join('\n').trim();
}

/**
 * Split a string by newline and trim each line.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {trimLines} from '@augment-vir/common';
 *
 * const result = trimAndSplitLines('   hi  \n   bye   \n\n abc'); // ['hi', 'bye', 'abc']
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function trimAndSplitLines(value: string): string[] {
    return filterMap(value.trim().split('\n'), (line) => line.trim(), check.isTruthy);
}
