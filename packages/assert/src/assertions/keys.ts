import {MaybePromise, NarrowToExpected, stringify, type RequiredKeysOf} from '@augment-vir/core';
import {SetRequired} from 'type-fest';
import {AssertionError} from '../augments/assertion.error.js';
import {createCheck} from '../guard-types/check-function.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

function isKeyOf<const Parent>(
    key: PropertyKey,
    parent: Parent,
    failureMessage?: string | undefined,
): asserts key is keyof Parent {
    try {
        hasKey(parent, key);
    } catch {
        throw new AssertionError(
            `'${String(key)}' is not a key of '${stringify(parent)}'.`,
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
        `'${String(key)}' is a key of '${stringify(parent)}'.`,
        failureMessage,
    );
}

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
    const message = `'${stringify(parent)}' does not have key '${String(key)}'.`;
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

    throw new AssertionError(`'${stringify(parent)}' has key '${String(key)}'.`, failureMessage);
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
            `'${stringify(parent)}' does not have keys '${missingKeys.join(',')}'.`,
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
            `'${stringify(parent)}' does not lack keys '${existingKeys.join(',')}'.`,
            failureMessage,
        );
    }
}

const assertions: {
    /**
     * Check if a key (or property) is contained within a parent value.
     *
     * Type guards the key.
     */
    isKeyOf: typeof isKeyOf;
    /**
     * Check if a key (or property) is _not_ contained within a parent value.
     *
     * Type guards the key.
     */
    isNotKeyOf: typeof isNotKeyOf;
    /**
     * Check if a parent value has a key (or property).
     *
     * Type guards the parent value.
     */
    hasKey: typeof hasKey;
    /**
     * Check if a parent value does _not_ have a key (or property).
     *
     * Type guards the parent value when possible.
     */
    lacksKey: typeof lacksKey;
    /**
     * Check if a parent value has multiple keys (or properties).
     *
     * Type guards the parent value.
     */
    hasKeys: typeof hasKeys;
    /**
     * Check if a parent value does _not_ have multiple keys (or properties).
     *
     * Type guards the parent value when possible.
     */
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
