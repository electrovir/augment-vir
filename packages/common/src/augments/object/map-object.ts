import {UnPromise} from '../type';
import {getObjectTypedKeys} from './object-entries';

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
