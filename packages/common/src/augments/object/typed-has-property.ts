import {RequiredBy} from '../type';

type ExtractValue<
    KeyGeneric extends PropertyKey,
    ParentGeneric,
> = KeyGeneric extends keyof ParentGeneric
    ? RequiredBy<ParentGeneric, KeyGeneric>[KeyGeneric]
    : KeyGeneric extends keyof Extract<ParentGeneric, Record<KeyGeneric, any>>
    ? RequiredBy<Extract<ParentGeneric, Record<KeyGeneric, any>>, KeyGeneric>[KeyGeneric]
    : never;

type CombinedParentValue<KeyGeneric extends PropertyKey, ParentGeneric> = ExtractValue<
    KeyGeneric,
    ParentGeneric
> extends never
    ? unknown
    : ExtractValue<KeyGeneric, ParentGeneric>;

type CombineTypeWithKey<KeyGeneric extends PropertyKey, ParentGeneric> = ParentGeneric &
    Record<KeyGeneric, CombinedParentValue<KeyGeneric, ParentGeneric>>;

const hasPropertyAttempts: ReadonlyArray<(object: object, key: PropertyKey) => boolean> = [
    (object, key) => {
        return key in object;
    },
    (object, key) => {
        /** This handles cases where the input object can't use `in` directly, like string literals */
        return key in object.constructor.prototype;
    },
];

export function typedHasProperty<KeyGeneric extends PropertyKey, ParentGeneric>(
    inputObject: ParentGeneric,
    inputKey: KeyGeneric,
): inputObject is CombineTypeWithKey<KeyGeneric, ParentGeneric> {
    if (!inputObject) {
        return false;
    }
    return hasPropertyAttempts.some((attemptCallback) => {
        try {
            return attemptCallback(inputObject, inputKey);
        } catch (error) {
            return false;
        }
    });
}

export function typedHasProperties<KeyGeneric extends PropertyKey, ParentGeneric>(
    inputObject: ParentGeneric,
    inputKeys: ReadonlyArray<KeyGeneric>,
): inputObject is CombineTypeWithKey<KeyGeneric, ParentGeneric> {
    return inputObject && inputKeys.every((key) => typedHasProperty(inputObject, key));
}
