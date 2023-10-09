import {PropertyValueType, isObject} from './object';
import {UnionToIntersection} from './old-union-to-intersection';
import {typedHasProperty} from './typed-has-property';

// produces an array type where each subsequent entry must be a key in the previous entry's object
export type NestedSequentialKeys<ObjectGeneric extends object> = PropertyValueType<{
    [Prop in keyof ObjectGeneric]: NonNullable<ObjectGeneric[Prop]> extends object
        ? Readonly<[Prop, ...(NestedSequentialKeys<NonNullable<ObjectGeneric[Prop]>> | [])]>
        : Readonly<[Prop]>;
}>;

export type NestedKeys<ObjectGeneric extends object> = UnionToIntersection<
    Extract<PropertyValueType<ObjectGeneric>, object>
> extends object
    ? [
          keyof ObjectGeneric,
          ...(
              | NestedKeys<UnionToIntersection<Extract<PropertyValueType<ObjectGeneric>, object>>>
              | []
          ),
      ]
    : [keyof ObjectGeneric];

export type NestedValue<
    ObjectGeneric extends object,
    NestedKeysGeneric extends NestedSequentialKeys<ObjectGeneric>,
> = NestedKeysGeneric extends readonly [infer FirstEntry, ...infer FollowingEntries]
    ? FirstEntry extends keyof ObjectGeneric
        ? FollowingEntries extends never[]
            ? ObjectGeneric[FirstEntry]
            : ObjectGeneric[FirstEntry] extends object
            ? FollowingEntries extends NestedSequentialKeys<ObjectGeneric[FirstEntry]>
                ? NestedValue<ObjectGeneric[FirstEntry], FollowingEntries>
                : never
            : never
        : never
    : never;

export function setValueWithNestedKeys<
    const ObjectGeneric extends object,
    const KeysGeneric extends NestedSequentialKeys<ObjectGeneric>,
>(
    inputObject: ObjectGeneric,
    nestedKeys: KeysGeneric,
    value: NestedValue<ObjectGeneric, KeysGeneric>,
): void {
    /**
     * Lots of as any casts in here because these types are, under the hood, pretty complex. Since
     * the inputs and outputs of this function are well typed, these internal as any casts do not
     * affect the external API of this function.
     */

    const nextKey = nestedKeys[0];
    if (!(nextKey in inputObject)) {
        inputObject[nextKey] = {} as any;
    } else if (!isObject(inputObject[nextKey])) {
        throw new Error(`Cannot set value at key '${String(nextKey)}' as its not an object.`);
    }

    const nextParent = inputObject[nextKey];

    if (nestedKeys.length > 2) {
        setValueWithNestedKeys(
            nextParent as any,
            (nestedKeys as ReadonlyArray<string>).slice(1) as any,
            value,
        );
    } else {
        (nextParent as any)[(nestedKeys as ReadonlyArray<string>)[1]!] = value;
    }
}

export function getValueFromNestedKeys<
    const ObjectGeneric extends object,
    const KeysGeneric extends NestedSequentialKeys<ObjectGeneric>,
>(
    inputObject: ObjectGeneric,
    nestedKeys: KeysGeneric,
): NestedValue<ObjectGeneric, KeysGeneric> | undefined {
    /**
     * Lots of as any casts in here because these types are, under the hood, pretty complex. Since
     * the inputs and outputs of this function are well typed, these internal as any casts do not
     * affect the external API of this function.
     */

    const keyToAccess = nestedKeys[0];

    if (!typedHasProperty(inputObject, keyToAccess)) {
        return undefined;
    }

    const currentValue = inputObject[keyToAccess];

    if (nestedKeys.length > 1) {
        return getValueFromNestedKeys(
            currentValue as any,
            (nestedKeys as ReadonlyArray<any>).slice(1) as any,
        ) as any;
    } else {
        return currentValue as NestedValue<ObjectGeneric, KeysGeneric>;
    }
}
