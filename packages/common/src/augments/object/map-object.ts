import {getObjectTypedKeys, PropertyValueType, UnPromise} from '../..';

export type InnerMappedValues<EntireInputGeneric extends object, MappedValueGeneric> = {
    [MappedProp in keyof EntireInputGeneric]: MappedValueGeneric;
};

export type MappedValues<
    EntireInputGeneric extends object,
    MappedValueGeneric,
> = MappedValueGeneric extends PromiseLike<unknown>
    ? Promise<InnerMappedValues<EntireInputGeneric, UnPromise<MappedValueGeneric>>>
    : InnerMappedValues<EntireInputGeneric, UnPromise<MappedValueGeneric>>;

/**
 * Map an object's keys to new values synchronously. This is different from plain mapObjectValues in
 * that this will not wrap the return value in a promise if any of the new object values are
 * promises. This function also requires currying in order to get the types correct. This allows you
 * to explicitly state the return type.
 *
 * @example
 *     mapObjectValuesSync({objectToIterateOver: 'initial value'})<{objectToIterateOver: number}>(
 *         (key, value) => ({
 *             newValue: value.length,
 *         }),
 *     );
 */
export function mapObjectValuesSync<EntireInputGeneric extends object>(
    inputObject: EntireInputGeneric,
) {
    function innerMap<OutputObjectGeneric extends object>(
        mapCallback: (
            inputKey: keyof EntireInputGeneric,
            keyValue: EntireInputGeneric[typeof inputKey],
            fullObject: EntireInputGeneric,
        ) => never extends PropertyValueType<OutputObjectGeneric>
            ? any
            : PropertyValueType<OutputObjectGeneric>,
    ): OutputObjectGeneric {
        const mappedObject: OutputObjectGeneric = getObjectTypedKeys(inputObject).reduce(
            (accum, currentKey) => {
                const mappedValue = mapCallback(currentKey, inputObject[currentKey], inputObject);

                return {
                    ...accum,
                    [currentKey]: mappedValue,
                };
            },
            {} as OutputObjectGeneric,
        );

        return mappedObject;
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
        keyValue: EntireInputGeneric[typeof inputKey],
        fullObject: EntireInputGeneric,
    ) => MappedValueGeneric,
): MappedValues<EntireInputGeneric, MappedValueGeneric> {
    let gotAPromise = false;

    const mappedObject = getObjectTypedKeys(inputObject).reduce((accum, currentKey) => {
        const mappedValue = mapCallback(currentKey, inputObject[currentKey], inputObject);
        if (mappedValue instanceof Promise) {
            gotAPromise = true;
        }
        return {
            ...accum,
            [currentKey]: mappedValue,
        };
    }, {} as MappedValues<EntireInputGeneric, UnPromise<MappedValueGeneric>>);

    if (gotAPromise) {
        return new Promise<InnerMappedValues<EntireInputGeneric, UnPromise<MappedValueGeneric>>>(
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
                            UnPromise<MappedValueGeneric>
                        >,
                    );
                } catch (error) {
                    reject(error);
                }
            },
        ) as MappedValues<EntireInputGeneric, MappedValueGeneric>;
    } else {
        return mappedObject as unknown as MappedValues<EntireInputGeneric, MappedValueGeneric>;
    }
}
