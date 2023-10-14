import {isRuntimeTypeOf} from '../runtime-type-of';
import {isLengthAtLeast} from '../tuple';
import {isObject} from './object';

/**
 * Accepts multiple objects and merges their key-value pairs recursively.
 *
 * Note that order matters! Each input object will overwrite the properties of the previous objects.
 */
export function mergeDeep<T extends object>(...inputs: (T | Partial<T>)[]): T {
    if (!isLengthAtLeast(inputs, 1)) {
        // nothing to merge if no inputs
        return {} as T;
    }
    if (inputs.length === 1) {
        // nothing to merge if only one input
        return inputs[0] as T;
    }

    let result: any = undefined;

    const mergeProps: Record<PropertyKey, any[]> = {};

    inputs.forEach((individualInput) => {
        try {
            if (!isObject(individualInput)) {
                /** If not an object, we can't merge. So overwrite instead. */
                result = individualInput;
                return;
            }

            Object.entries(individualInput).forEach(
                ([
                    key,
                    value,
                ]) => {
                    const mergePropsArray = mergeProps[key] || [];
                    if (!mergeProps[key]) {
                        mergeProps[key] = mergePropsArray;
                    }
                    mergePropsArray.push(value);
                },
            );
            if (result) {
                if (isRuntimeTypeOf(result, 'object')) {
                    result = {
                        ...result,
                        ...individualInput,
                    };
                }
            } else {
                result = individualInput;
            }
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
