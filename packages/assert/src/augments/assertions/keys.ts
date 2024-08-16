import {MaybePromise} from '@augment-vir/core';
import JSON5 from 'json5';
import {SetRequired} from 'type-fest';
import {AssertionError} from '../assertion.error.js';
import {createCheck} from '../guard-types/check-function.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';
import {NarrowToExpected} from './narrow-type.js';

function isKeyOf<const Parent>(
    key: PropertyKey,
    parent: Parent,
    failureMessage?: string | undefined,
): asserts key is keyof Parent {
    try {
        hasKey(parent, key);
    } catch {
        throw new AssertionError(
            `'${String(key)}' is not a key of '${JSON5.stringify(parent)}'.`,
            failureMessage,
        );
    }
}
function isNotKeyOf<const Key extends PropertyKey, const Parent>(
    key: Key,
    parent: Parent,
    failureMessage?: string | undefined,
): asserts key is Exclude<Key, RequiredKeysOf<Parent>> {
    try {
        isKeyOf(key, parent);
    } catch {
        return;
    }

    throw new AssertionError(
        `'${String(key)}' is a key of '${JSON5.stringify(parent)}'.`,
        failureMessage,
    );
}

/**
 * Modified version of `RequiredKeys` from `type-fest` that does not require `BaseType` to extends
 * `object`.
 */
export type RequiredKeysOf<BaseType> = Exclude<
    {
        [Key in keyof BaseType]: BaseType extends Record<Key, BaseType[Key]> ? Key : never;
    }[keyof BaseType],
    undefined
>;
/** Helper type for `hasKey`. */
type ExtractValue<Key extends PropertyKey, Parent> = Key extends keyof Parent
    ? SetRequired<Parent, Key>[Key]
    : Key extends keyof Extract<Parent, Record<Key, any>>
      ? SetRequired<Extract<Parent, Record<Key, any>>, Key>[Key]
      : never;

/** Helper type for `hasKey`. */
type CombinedParentValue<Key extends PropertyKey, Parent> =
    ExtractValue<Key, Parent> extends never ? unknown : ExtractValue<Key, Parent>;

/** Helper type for `hasKey`. */
type CombineTypeWithKey<Key extends PropertyKey, Parent> = Parent &
    Record<Key, CombinedParentValue<Key, Parent>>;

const hasKeyAttempts: ReadonlyArray<(object: object, key: PropertyKey) => boolean> = [
    (object, key) => {
        return key in object;
    },
    (object, key) => {
        /** This handles cases where the input object can't use `in` directly, like string literals */
        return key in object.constructor.prototype;
    },
];

/** Check if an object has the given property. */
function hasKey<const Key extends PropertyKey, const Parent>(
    parent: Parent,
    key: Key,
    failureMessage?: string | undefined,
): asserts parent is CombineTypeWithKey<Key, Parent> {
    const message = `'${JSON5.stringify(parent)}' does not have key '${String(key)}'.`;
    const doesHaveKey = hasKeyAttempts.some((attemptCallback) => {
        try {
            return attemptCallback(parent as object, key);
        } catch {
            return false;
        }
    });

    if (!doesHaveKey) {
        throw new AssertionError(message, failureMessage);
    }
}
function lacksKey<const Parent, const Key extends PropertyKey>(
    parent: Parent,
    key: Key,
    failureMessage?: string | undefined,
): asserts parent is Exclude<Parent, Record<Key, any>> {
    try {
        hasKey(parent, key);
    } catch {
        return;
    }

    throw new AssertionError(
        `'${JSON5.stringify(parent)}' has key '${String(key)}'.`,
        failureMessage,
    );
}

const checkHasKey = createCheck(hasKey);

/** Check if an object has all the given properties. */
function hasKeys<const Keys extends PropertyKey, const Parent>(
    parent: Parent,
    keys: ReadonlyArray<Keys>,
    failureMessage?: string | undefined,
): asserts parent is CombineTypeWithKey<Keys, Parent> {
    const missingKeys = keys.filter((key) => !checkHasKey(parent, key));

    if (missingKeys.length) {
        throw new AssertionError(
            `'${JSON5.stringify(parent)}' does not have keys '${missingKeys.join(',')}'.`,
            failureMessage,
        );
    }
}
function lacksKeys<const Parent, const Key extends PropertyKey>(
    parent: Parent,
    keys: ReadonlyArray<Key>,
    failureMessage?: string | undefined,
): asserts parent is Exclude<Parent, Partial<Record<Key, any>>> {
    const existingKeys = keys.filter((key) => checkHasKey(parent, key));

    if (existingKeys.length) {
        throw new AssertionError(
            `'${JSON5.stringify(parent)}' does not lack keys '${existingKeys.join(',')}'.`,
            failureMessage,
        );
    }
}

const assertions: {
    isKeyOf: typeof isKeyOf;
    isNotKeyOf: typeof isNotKeyOf;
    hasKey: typeof hasKey;
    lacksKey: typeof lacksKey;
    hasKeys: typeof hasKeys;
    lacksKeys: typeof lacksKeys;
} = {
    isKeyOf,
    isNotKeyOf,
    hasKey,
    lacksKey,
    hasKeys,
    lacksKeys,
};

export const keyGuards = {
    assertions,
    checkOverrides: {
        isKeyOf:
            autoGuard<<const Parent>(key: PropertyKey, parent: Parent) => key is keyof Parent>(),
        isNotKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    key: Key,
                    parent: Parent,
                    failureMessage?: string | undefined,
                ) => key is Exclude<Key, RequiredKeysOf<Parent>>
            >(),
        hasKey: autoGuard<
            <const Parent, const Key extends PropertyKey>(
                parent: Parent,
                key: Key,
            ) => parent is CombineTypeWithKey<Key, Parent>
        >(),
        lacksKey:
            autoGuard<
                <const Parent, const Key extends PropertyKey>(
                    parent: Parent,
                    key: Key,
                    failureMessage?: string | undefined,
                ) => parent is Exclude<Parent, Record<Key, any>>
            >(),
        hasKeys:
            autoGuard<
                <const Keys extends PropertyKey, const Parent>(
                    parent: Parent,
                    keys: ReadonlyArray<Keys>,
                ) => parent is CombineTypeWithKey<Keys, Parent>
            >(),
        lacksKeys:
            autoGuard<
                <const Parent, const Key extends PropertyKey>(
                    parent: Parent,
                    key: ReadonlyArray<Key>,
                ) => parent is Exclude<Parent, Partial<Record<Key, any>>>
            >(),
    },
    assertWrapOverrides: {
        isKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    key: Key,
                    parent: Parent,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Key, keyof Parent>
            >(),
        isNotKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    key: Key,
                    parent: Parent,
                    failureMessage?: string | undefined,
                ) => Exclude<Key, RequiredKeysOf<Parent>>
            >(),
        hasKey: autoGuard<
            <const Parent, const Key extends PropertyKey>(
                parent: Parent,
                key: Key,
                failureMessage?: string | undefined,
            ) => CombineTypeWithKey<Key, Parent>
        >(),
        lacksKey:
            autoGuard<
                <const Parent, const Key extends PropertyKey>(
                    parent: Parent,
                    key: Key,
                    failureMessage?: string | undefined,
                ) => Exclude<Parent, Record<Key, any>>
            >(),
        hasKeys:
            autoGuard<
                <const Keys extends PropertyKey, const Parent>(
                    parent: Parent,
                    keys: ReadonlyArray<Keys>,
                    failureMessage?: string | undefined,
                ) => CombineTypeWithKey<Keys, Parent>
            >(),
        lacksKeys:
            autoGuard<
                <const Parent, const Key extends PropertyKey>(
                    parent: Parent,
                    key: ReadonlyArray<Key>,
                    failureMessage?: string | undefined,
                ) => Exclude<Parent, Partial<Record<Key, any>>>
            >(),
    },
    checkWrapOverrides: {
        isKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    key: Key,
                    parent: Parent,
                ) => NarrowToExpected<Key, keyof Parent> | undefined
            >(),
        isNotKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    key: Key,
                    parent: Parent,
                    failureMessage?: string | undefined,
                ) => Exclude<Key, RequiredKeysOf<Parent>> | undefined
            >(),
        hasKey: autoGuard<
            <const Parent, const Key extends PropertyKey>(
                parent: Parent,
                key: Key,
            ) => CombineTypeWithKey<Key, Parent> | undefined
        >(),
        lacksKey:
            autoGuard<
                <const Parent, const Key extends PropertyKey>(
                    parent: Parent,
                    key: Key,
                    failureMessage?: string | undefined,
                ) => Exclude<Parent, Record<Key, any>> | undefined
            >(),
        hasKeys:
            autoGuard<
                <const Keys extends PropertyKey, const Parent>(
                    parent: Parent,
                    keys: ReadonlyArray<Keys>,
                ) => CombineTypeWithKey<Keys, Parent> | undefined
            >(),
        lacksKeys:
            autoGuard<
                <const Parent, const Key extends PropertyKey>(
                    parent: Parent,
                    key: ReadonlyArray<Key>,
                ) => Exclude<Parent, Partial<Record<Key, any>>> | undefined
            >(),
    },
    waitUntilOverrides: {
        isKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    parent: Parent,
                    callback: () => MaybePromise<Key>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToExpected<Key, keyof Parent>>
            >(),
        isNotKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    parent: Parent,
                    callback: () => MaybePromise<Key>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Key, RequiredKeysOf<Parent>>>
            >(),
        hasKey: autoGuard<
            <const Parent, const Key extends PropertyKey>(
                key: Key,
                callback: () => MaybePromise<Parent>,
                options?: WaitUntilOptions | undefined,
                failureMessage?: string | undefined,
            ) => Promise<CombineTypeWithKey<Key, Parent>>
        >(),
        lacksKey:
            autoGuard<
                <const Parent, const Key extends PropertyKey>(
                    key: Key,
                    callback: () => MaybePromise<Parent>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Parent, Record<Key, any>>>
            >(),
        hasKeys:
            autoGuard<
                <const Keys extends PropertyKey, const Parent>(
                    keys: ReadonlyArray<Keys>,
                    callback: () => MaybePromise<Parent>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<CombineTypeWithKey<Keys, Parent>>
            >(),
        lacksKeys:
            autoGuard<
                <const Parent, const Keys extends PropertyKey>(
                    keys: ReadonlyArray<Keys>,
                    callback: () => MaybePromise<Parent>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Parent, Partial<Record<Keys, any>>>>
            >(),
    },
} satisfies GuardGroup;
