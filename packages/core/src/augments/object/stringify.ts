import JSON5 from 'json5';

/**
 * Internal sentinel used to preserve `undefined` values through JSON5 serialization. Chosen to be
 * extremely unlikely to appear in real user content. If it _does_ appear naturally it will be
 * incorrectly replaced (very low probability).
 */
const undefinedSentinel = '__@@augment-vir-undefined-sentinel@@__';
const undefinedSentinelStringRegExp = new RegExp(`['"]${undefinedSentinel}['"]`);

/**
 * Converts the input into a string. Tries first with JSON5 and, if that fails, falls back to a
 * regular `.toString()` conversion.
 *
 * @category Object
 * @category String
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function stringify(
    input: unknown,
    /** Passed directly to the `space` parameter of `JSON.stringify`. */
    space?: string | number,
) {
    try {
        const json5String = JSON5.stringify(
            input,
            // Use a replacer to turn undefined into a unique string so the key is kept.
            (_key, value) => {
                if (value === undefined) {
                    return undefinedSentinel;
                } else if (typeof value === 'bigint') {
                    return Number(value);
                }
                return value;
            },
            space || undefined,
        );

        return json5String.split(undefinedSentinelStringRegExp).join('undefined');
    } catch {
        return String(input);
    }
}
