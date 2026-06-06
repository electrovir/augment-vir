import {isPrimitive, stringify} from '@augment-vir/core';

/**
 * A suite of functions that each convert an `unknown` value into a specific type, throwing an error
 * if the conversion is not possible.
 *
 * @category Convert
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {convertTo} from '@augment-vir/common';
 *
 * convertTo.string(42); // `'42'`
 * convertTo.string(undefined); // throws an error
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export const convertTo = {
    /**
     * Converts anything into a string.
     *
     * @example
     *
     * ```ts
     * import {convertTo} from '@augment-vir/common';
     *
     * convertTo.string('hi'); // `'hi'`
     * convertTo.string(42); // `'42'`
     * convertTo.string(null); // `'hi'`
     * convertTo.string({}); // `'{}'`
     * ```
     */
    string(this: void, value: unknown): string {
        if (isPrimitive(value)) {
            return String(value);
        } else {
            return stringify(value);
        }
    },
    /**
     * Converts almost anything into a string but maps `null`, `undefined`, and empty string results
     * to `undefined`.
     *
     * @example
     *
     * ```ts
     * import {convertTo} from '@augment-vir/common';
     *
     * convertTo.string('hi'); // `'hi'`
     * convertTo.string(42); // `'42'`
     * convertTo.string(null); // `undefined`
     * convertTo.string(''); // `undefined`
     * convertTo.string({}); // `'{}'`
     * ```
     */
    maybeString(this: void, value: unknown): string | undefined {
        if (value == undefined) {
            return undefined;
        } else {
            return convertTo.string(value) || undefined;
        }
    },
    /**
     * Converts almost anything into a number but maps `null`, `undefined`, and any conversion that
     * results in `NaN` to `undefined`.
     *
     * @example
     *
     * ```ts
     * import {convertTo} from '@augment-vir/common';
     *
     * convertTo.maybeNumber('42'); // `42`
     * convertTo.maybeNumber(42); // `42`
     * convertTo.maybeNumber(null); // `undefined`
     * convertTo.maybeNumber('hello'); // `undefined`
     * ```
     */
    maybeNumber(this: void, value: unknown): number | undefined {
        if (value == undefined || value === '') {
            return undefined;
        } else {
            const converted = Number(value);
            return Number.isNaN(converted) ? undefined : converted;
        }
    },
};
