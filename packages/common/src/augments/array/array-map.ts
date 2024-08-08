import {Writable} from '../type/writable.js';
import {ArrayElement} from './array-element.js';

/**
 * This type should not be used outside of this file. This is used to match the
 * Array.prototype.map's callback type, which has insufficient type information, to our more
 * strictly typed MapCallbackType.
 */
type LibMapCallbackType<ArrayType extends ReadonlyArray<any>, OutputType> = (
    value: ArrayElement<ArrayType>,
    index: number,
    array: readonly ArrayElement<ArrayType>[],
) => OutputType;

/** Preserves tuple types. */
export function typedMap<const ArrayGeneric extends ReadonlyArray<any>, const OutputType>(
    arrayToMap: ArrayGeneric,
    mapCallback: (
        value: ArrayElement<NoInfer<ArrayGeneric>>,
        index: number,
        array: NoInfer<ArrayGeneric>,
    ) => OutputType,
): Writable<{[Index in keyof ArrayGeneric]: OutputType}> {
    return arrayToMap.map(mapCallback as LibMapCallbackType<ArrayGeneric, OutputType>) as Writable<{
        [Index in keyof ArrayGeneric]: OutputType;
    }>;
}
