import {check} from '@augment-vir/assert';
import {
    type AnyObject,
    type MaybePromise,
    type Values,
    ensureError,
    getObjectTypedKeys,
} from '@augment-vir/core';
import {filterMap} from '../array/filter.js';
import {getObjectTypedEntries, typedObjectFromEntries} from './object-entries.js';

export type InnerMappedValues<EntireInputGeneric extends object, MappedValueGeneric> = {
    [MappedProp in keyof EntireInputGeneric]: MappedValueGeneric;
};

export type MappedValues<EntireInputGeneric extends object, MappedValueGeneric> =
    MappedValueGeneric extends PromiseLike<unknown>
        ? Promise<InnerMappedValues<EntireInputGeneric, Awaited<MappedValueGeneric>>>
        : InnerMappedValues<EntireInputGeneric, Awaited<MappedValueGeneric>>;

/**
 * Map an object's keys to new values synchronously. This is different from plain mapObjectValues in
 * that this will not wrap the return value in a promise if any of the new object values are
 * promises. This function also requires currying in order to get the types correct. This allows you
 * to explicitly state the return type.
 *
 * @example
 *     mapObjectValuesSync({objectToIterateOver: 'initial value'})(callback);
 */
export function mapObjectValuesSync<EntireInputGeneric extends object>(
    inputObject: EntireInputGeneric,
) {
    function innerMap<OutputObjectGeneric extends object>(
        mapCallback: (
            inputKey: keyof EntireInputGeneric,
            keyValue: Required<EntireInputGeneric>[typeof inputKey],
            fullObject: EntireInputGeneric,
        ) => never extends Values<OutputObjectGeneric> ? any : Values<OutputObjectGeneric>,
    ): OutputObjectGeneric {
        return getObjectTypedKeys(inputObject).reduce<AnyObject>((accum, currentKey) => {
            const mappedValue = mapCallback(currentKey, inputObject[currentKey], inputObject);

            return {
                ...accum,
                [currentKey]: mappedValue,
            };
        }, {});
    }

    return innerMap;
}

/**
 * Creates a new object with the same properties as the input object, but with values set to the
 * result of mapCallback for each property.
 */
export function mapObjectValues<EntireInputGeneric extends object, MappedValueGeneric>(
    inputObject: EntireInputGeneric,
    mapCallback: (
        inputKey: keyof EntireInputGeneric,
        keyValue: Required<EntireInputGeneric>[typeof inputKey],
        fullObject: EntireInputGeneric,
    ) => MappedValueGeneric,
): MappedValues<EntireInputGeneric, MappedValueGeneric> {
    let gotAPromise = false as boolean;

    const mappedObject = getObjectTypedKeys(inputObject).reduce<AnyObject>((accum, currentKey) => {
        const mappedValue = mapCallback(currentKey, inputObject[currentKey], inputObject);
        if (mappedValue instanceof Promise) {
            gotAPromise = true;
        }
        accum[currentKey] = mappedValue;

        return accum;
    }, {});

    if (gotAPromise) {
        return new Promise<InnerMappedValues<EntireInputGeneric, Awaited<MappedValueGeneric>>>(
            async (resolve, reject) => {
                try {
                    await Promise.all(
                        getObjectTypedKeys(mappedObject).map(async (key) => {
                            const value = await mappedObject[key];
                            mappedObject[key] = value;
                        }),
                    );

                    resolve(
                        mappedObject as InnerMappedValues<
                            EntireInputGeneric,
                            Awaited<MappedValueGeneric>
                        >,
                    );
                } catch (error) {
                    reject(ensureError(error));
                }
            },
        ) as MappedValues<EntireInputGeneric, MappedValueGeneric>;
    } else {
        return mappedObject as unknown as MappedValues<EntireInputGeneric, MappedValueGeneric>;
    }
}

export function mapObject<const OriginalObject, const NewKey extends PropertyKey, const NewValue>(
    inputObject: OriginalObject,
    mapCallback: (
        originalKey: keyof OriginalObject,
        originalValue: Values<OriginalObject>,
        originalObject: OriginalObject,
    ) => Promise<{key: NewKey; value: NewValue} | undefined>,
): Promise<Record<NewKey, NewValue>>;
export function mapObject<const OriginalObject, const NewKey extends PropertyKey, const NewValue>(
    inputObject: OriginalObject,
    mapCallback: (
        originalKey: keyof OriginalObject,
        originalValue: Values<OriginalObject>,
        originalObject: OriginalObject,
    ) => {key: NewKey; value: NewValue} | undefined,
): Record<NewKey, NewValue>;
export function mapObject<const OriginalObject, const NewKey extends PropertyKey, const NewValue>(
    inputObject: OriginalObject,
    mapCallback: (
        originalKey: keyof OriginalObject,
        originalValue: Values<OriginalObject>,
        originalObject: OriginalObject,
    ) => MaybePromise<{key: NewKey; value: NewValue} | undefined>,
): MaybePromise<Record<NewKey, NewValue>>;
export function mapObject<
    const OriginalObject extends object,
    const NewKey extends PropertyKey,
    const NewValue,
>(
    originalObject: OriginalObject,
    mapCallback: (
        originalKey: keyof OriginalObject,
        originalValue: Values<OriginalObject>,
        originalObject: OriginalObject,
    ) => MaybePromise<{key: NewKey; value: NewValue} | undefined>,
): MaybePromise<Record<NewKey, NewValue>> {
    try {
        let gotAPromise = false as boolean;

        const mappedEntries = getObjectTypedEntries(originalObject)
            .map(
                ([
                    originalKey,
                    originalValue,
                ]) => {
                    const output = mapCallback(originalKey, originalValue, originalObject);
                    if (output instanceof Promise) {
                        gotAPromise = true;
                        return output;
                    } else if (output) {
                        return [
                            output.key,
                            output.value,
                        ] as [NewKey, NewValue];
                    } else {
                        return undefined;
                    }
                },
            )
            .filter(check.isTruthy);

        if (gotAPromise) {
            return new Promise<Record<NewKey, NewValue>>(async (resolve, reject) => {
                try {
                    const entries: [NewKey, NewValue][] = filterMap(
                        await Promise.all(mappedEntries),
                        (entry) => {
                            if (!entry) {
                                return undefined;
                            } else if (Array.isArray(entry)) {
                                return entry;
                            } else {
                                return [
                                    entry.key,
                                    entry.value,
                                ] as [NewKey, NewValue];
                            }
                        },
                        check.isTruthy,
                    );

                    resolve(typedObjectFromEntries(entries));
                } catch (error) {
                    reject(ensureError(error));
                }
            });
        } else {
            return typedObjectFromEntries(mappedEntries as [NewKey, NewValue][]);
        }
    } catch (error) {
        throw ensureError(error);
    }
}
