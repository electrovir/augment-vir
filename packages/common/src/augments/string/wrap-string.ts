/** Wraps `value` on both sides with `wrapper`. */
export function wrapString({value, wrapper}: {value: string; wrapper: string}): string {
    return [
        wrapper,
        wrapper,
    ].join(value);
}
