import {isRunTimeType} from 'run-time-assertions';
import {PartialDeep} from 'type-fest';
import {isLengthAtLeast} from '../tuple';

/**
 * Accepts multiple objects and merges their key-value pairs recursively. Any values set to
 * undefined will be removed.
 *
 * Note that order matters! Each input object will overwrite the properties of the previous objects.
 */
export function mergeDeep<const T extends object>(
    ...inputs: (
        | Readonly<T>
        | Readonly<PartialDeep<T, {recurseIntoArrays: true}>>
        | Readonly<Partial<T>>
    )[]
): T {
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
        if (!isRunTimeType(individualInput, 'object')) {
            /** If not an object, we can't merge. So overwrite instead. */
            result = individualInput;
            return;
        } else if (!isRunTimeType(result, 'object')) {
            /** If result isn't an object then we need to make it into one. */
            result = {...individualInput};
        }

        Object.entries(individualInput).forEach(
            ([
                key,
                value,
            ]) => {
                if (!mergeProps[key]) {
                    mergeProps[key] = [];
                }
                mergeProps[key]!.push(value);
            },
        );
    });

    if (isRunTimeType(result, 'object')) {
        Object.entries(mergeProps).forEach(
            ([
                key,
                mergeValues,
            ]) => {
                const newValue = mergeDeep(...mergeValues);
                if (newValue === undefined && key in result) {
                    delete result[key];
                } else if (newValue !== undefined) {
                    result[key] = newValue;
                }
            },
        );
    }

    return result as T;
}
