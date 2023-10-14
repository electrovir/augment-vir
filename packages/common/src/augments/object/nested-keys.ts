import {isRuntimeTypeOf} from '../runtime-type-of';
import {ArrayElement} from '../type';
import {PropertyValueType, isObject} from './object';
import {UnionToIntersection} from './old-union-to-intersection';
import {typedHasProperty} from './typed-has-property';

// produces an array type where each subsequent entry must be a key in the previous entry's object
export type NestedSequentialKeys<ObjectGeneric extends object> =
    NonNullable<ObjectGeneric> extends ReadonlyArray<any>
        ? NestedSequentialKeys<Extract<NonNullable<ObjectGeneric>[number], object>>
        : PropertyValueType<{
              [Prop in keyof ObjectGeneric]: NonNullable<ObjectGeneric[Prop]> extends object
                  ? Readonly<
                        [Prop, ...(NestedSequentialKeys<NonNullable<ObjectGeneric[Prop]>> | [])]
                    >
                  : Readonly<[Prop]>;
          }>;

export type NestedKeys<ObjectGeneric extends object> = ObjectGeneric extends ReadonlyArray<any>
    ? NestedKeys<ArrayElement<ObjectGeneric>>
    : UnionToIntersection<Extract<PropertyValueType<ObjectGeneric>, object>> extends object
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
> = ObjectGeneric extends ReadonlyArray<any>
    ? NestedValue<Extract<ObjectGeneric[number], object>, NestedKeysGeneric>[]
    : NestedKeysGeneric extends readonly [infer FirstEntry, ...infer FollowingEntries]
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
    originalObject: ObjectGeneric,
    nestedKeys: KeysGeneric,
    value: NestedValue<ObjectGeneric, KeysGeneric>,
): void {
    /**
     * Lots of as any casts in here because these types are, under the hood, pretty complex. Since
     * the inputs and outputs of this function are well typed, these internal as any casts do not
     * affect the external API of this function.
     */
    const nestedKeysInput = nestedKeys as string[];
    const inputObject = originalObject as Record<PropertyKey, any>;

    if (isRuntimeTypeOf(inputObject, 'array')) {
        inputObject.forEach((entry) => {
            if (isObject(entry)) {
                (setValueWithNestedKeys as any)(entry, nestedKeysInput, value);
            }
        });
        return;
    }

    const nextKey = nestedKeysInput[0]!;
    if (!(nextKey in inputObject)) {
        inputObject[nextKey] = {} as any;
    } else if (!isObject(inputObject[nextKey])) {
        throw new Error(`Cannot set value at key '${String(nextKey)}' as its not an object.`);
    }

    const nextParent = inputObject[nextKey];

    if (nestedKeysInput.length > 2) {
        (setValueWithNestedKeys as any)(nextParent, nestedKeysInput.slice(1), value);
    } else {
        (nextParent as any)[nestedKeysInput[1]!] = value;
    }
}

export function getValueFromNestedKeys<
    const ObjectGeneric extends object,
    const KeysGeneric extends NestedSequentialKeys<ObjectGeneric>,
>(originalObject: ObjectGeneric, nestedKeys: KeysGeneric): NestedValue<ObjectGeneric, KeysGeneric> {
    /**
     * Lots of as any casts in here because these types are, under the hood, pretty complex. Since
     * the inputs and outputs of this function are well typed, these internal as any casts do not
     * affect the external API of this function.
     */
    const nestedKeysInput = nestedKeys as string[];
    const inputObject = originalObject as Record<PropertyKey, any>;

    if (isRuntimeTypeOf(inputObject, 'array')) {
        return inputObject.map((entry) =>
            (getValueFromNestedKeys as any)(entry, nestedKeys),
        ) as NestedValue<ObjectGeneric, KeysGeneric>;
    }

    const keyToAccess = nestedKeysInput[0]!;

    if (!typedHasProperty(inputObject, keyToAccess)) {
        return undefined as NestedValue<ObjectGeneric, KeysGeneric>;
    }

    const currentValue = inputObject[keyToAccess];

    if (nestedKeysInput.length > 1) {
        return (getValueFromNestedKeys as any)(currentValue, nestedKeysInput.slice(1)) as any;
    } else {
        return currentValue as NestedValue<ObjectGeneric, KeysGeneric>;
    }
}
