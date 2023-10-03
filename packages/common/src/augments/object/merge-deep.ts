import {isRuntimeTypeOf} from '../runtime-type-of';
import {isLengthAtLeast} from '../tuple';

export type BaseObject = Record<PropertyKey, unknown>;

/**
 * Accepts multiple objects and merges their key-value pairs recursively.
 *
 * Note that order matters! Each input object will overwrite the properties of the previous objects.
 */
export function mergeDeep<T extends BaseObject>(...inputs: (T | Partial<T>)[]): T {
    if (!isLengthAtLeast(inputs, 1)) {
        return {} as T;
    }
    if (inputs.length === 1) {
        return inputs[0] as T;
    }

    let result: BaseObject = {};

    const mergeProps: Record<PropertyKey, BaseObject[]> = {};

    inputs.forEach((individualInput) => {
        try {
            Object.entries(individualInput).forEach(
                ([
                    key,
                    value,
                ]) => {
                    if (isRuntimeTypeOf(value, 'object')) {
                        const mergePropsArray = mergeProps[key] || [];
                        if (!mergeProps[key]) {
                            mergeProps[key] = mergePropsArray;
                        }
                        mergePropsArray.push(value);
                    }
                },
            );
            result = {
                ...result,
                ...individualInput,
            };
        } catch (error) {
            /** Ignore errors, such as individualInput not actually being an object. */
        }
    });

    Object.entries(mergeProps).forEach(
        ([
            key,
            mergeValues,
        ]) => {
            result[key] = mergeDeep(...mergeValues);
        },
    );

    return result as T;
}
