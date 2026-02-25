import {configure} from '../../safe-stable-stringify.js';

const safeStringify = configure({
    maximumDepth: 15,
    maximumBreadth: 50,
});

/**
 * A safe value -> JSON serializer that handles circular references and truncates the depth and
 * breadth of the given value's serialization.
 *
 * @category JSON : Common
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {safeJsonStringify} from '@augment-vir/common';
 *
 * safeJsonStringify({some: 'value'});
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function safeJsonStringify(...params: Parameters<typeof JSON.stringify>): string {
    /* node:coverage disable: idk how to get this to return `undefined`. */
    return safeStringify(...params) || '';
}
