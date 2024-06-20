import {isRunTimeType} from 'run-time-assertions';
import {isLengthAtLeast} from '../tuple';
import {ArrayElement} from '../type';
import {
    TsRecurse,
    TsRecursionStart,
    TsRecursionTracker,
    TsTooMuchRecursion,
} from '../type-recursion';
import {AnyObject} from './any-object';
import {PropertyValueType, isObject} from './object';
import {UnionToIntersection} from './old-union-to-intersection';
import {typedHasProperty} from './typed-has-property';

// produces an array type where each subsequent entry must be a key in the previous entry's object
export type NestedSequentialKeys<
    ObjectGeneric extends object,
    Depth extends TsRecursionTracker = TsRecursionStart,
> = Depth extends TsTooMuchRecursion
    ? ['Error: recursive object depth is too deep.']
    : NonNullable<ObjectGeneric> extends ReadonlyArray<any>
      ? Extract<NonNullable<ObjectGeneric>[number], object> extends never
          ? [number]
          : NestedSequentialKeys<
                Extract<NonNullable<ObjectGeneric>[number], object>,
                TsRecurse<Depth>
            >
      : PropertyValueType<{
            [Prop in keyof ObjectGeneric]: NonNullable<ObjectGeneric[Prop]> extends object
                ? Readonly<
                      [
                          Prop,
                          ...(
                              | NestedSequentialKeys<
                                    NonNullable<ObjectGeneric[Prop]>,
                                    TsRecurse<Depth>
                                >
                              | []
                          ),
                      ]
                  >
                : Readonly<[Prop]>;
        }>;

export type NestedKeys<
    ObjectGeneric extends object,
    Depth extends TsRecursionTracker = TsRecursionStart,
> = Depth extends TsTooMuchRecursion
    ? ['Error: recursive object depth is too deep.']
    : ObjectGeneric extends ReadonlyArray<any>
      ? NestedKeys<ArrayElement<ObjectGeneric>, TsRecurse<Depth>>
      : UnionToIntersection<Extract<PropertyValueType<ObjectGeneric>, object>> extends object
        ? [
              keyof ObjectGeneric,
              ...(
                  | NestedKeys<
                        UnionToIntersection<Extract<PropertyValueType<ObjectGeneric>, object>>,
                        TsRecurse<Depth>
                    >
                  | []
              ),
          ]
        : [keyof ObjectGeneric];

export type NestedValue<
    ObjectGeneric extends object,
    NestedKeysGeneric extends NestedSequentialKeys<ObjectGeneric>,
> =
    ObjectGeneric extends ReadonlyArray<any>
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

/** This mutates the {@link originalObject} input. */
export function setValueWithNestedKeys<
    const ObjectGeneric extends object,
    const KeysGeneric extends NestedSequentialKeys<ObjectGeneric>,
>(
    originalObject: ObjectGeneric,
    nestedKeys: Readonly<KeysGeneric>,
    value: Readonly<NestedValue<ObjectGeneric, KeysGeneric>>,
): void {
    /**
     * Lots of as any casts in here because these types are, under the hood, pretty complex. Since
     * the inputs and outputs of this function are well typed, these internal as any casts do not
     * affect the external API of this function.
     */
    const nestedKeysInput = nestedKeys as ReadonlyArray<string>;
    const inputObject = originalObject as AnyObject;

    if (isRunTimeType(inputObject, 'array')) {
        inputObject.forEach((entry) => {
            if (isObject(entry)) {
                (setValueWithNestedKeys as any)(entry, nestedKeysInput, value);
            }
        });
    } else if (isLengthAtLeast(nestedKeysInput, 2)) {
        /** If there are more keys to traverse into. */
        const nextKey = nestedKeysInput[0];
        if (!(nextKey in inputObject)) {
            inputObject[nextKey] = {} as any;
        }
        const nextParent = inputObject[nextKey];

        (setValueWithNestedKeys as any)(nextParent, nestedKeysInput.slice(1), value);
    } else if (isLengthAtLeast(nestedKeysInput, 1)) {
        inputObject[nestedKeysInput[0]] = value;
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

    if (isRunTimeType(inputObject, 'array')) {
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
