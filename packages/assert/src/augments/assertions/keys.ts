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
    if (!((key as any) in (parent as any))) {
        throw new AssertionError(
            failureMessage || `'${String(key)}' is not a key of '${JSON5.stringify(parent)}'.`,
        );
    }
}

/** Helper type for `hasProperty`. */
type ExtractValue<Key extends PropertyKey, Parent> = Key extends keyof Parent
    ? SetRequired<Parent, Key>[Key]
    : Key extends keyof Extract<Parent, Record<Key, any>>
      ? SetRequired<Extract<Parent, Record<Key, any>>, Key>[Key]
      : never;

/** Helper type for `hasProperty`. */
type CombinedParentValue<Key extends PropertyKey, Parent> =
    ExtractValue<Key, Parent> extends never ? unknown : ExtractValue<Key, Parent>;

/** Helper type for `hasProperty`. */
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
    const message =
        failureMessage || `'${JSON5.stringify(parent)}' does not have key '${String(key)}'.`;
    if (!parent) {
        throw new AssertionError(message);
    }
    const doesHaveKey = hasKeyAttempts.some((attemptCallback) => {
        try {
            return attemptCallback(parent, key);
        } catch {
            return false;
        }
    });

    if (!doesHaveKey) {
        throw new AssertionError(message);
    }
}

const hasKeyCheck = createCheck(hasKey);

/** Check if an object has all the given properties. */
function hasKeys<const Keys extends PropertyKey, const Parent>(
    parent: Parent,
    keys: ReadonlyArray<Keys>,
    failureMessage?: string | undefined,
): asserts parent is CombineTypeWithKey<Keys, Parent> {
    const doesHaveKey = parent && keys.every((key) => hasKeyCheck(parent, key));

    if (!doesHaveKey) {
        throw new AssertionError(
            failureMessage ||
                `'${JSON5.stringify(parent)}' does not have keys '${keys.join(',')}'.`,
        );
    }
}

const assertions: {
    isKeyOf: typeof isKeyOf;
    hasKey: typeof hasKey;
    hasKeys: typeof hasKeys;
} = {
    isKeyOf,
    hasKey,
    hasKeys,
};

export const keyGuards = {
    assertions,
    checkOverrides: {
        isKeyOf:
            autoGuard<<const Parent>(key: PropertyKey, parent: Parent) => key is keyof Parent>(),
        hasKey: autoGuard<
            <const Parent, const Key extends PropertyKey>(
                parent: Parent,
                key: Key,
            ) => parent is CombineTypeWithKey<Key, Parent>
        >(),
        hasKeys:
            autoGuard<
                <const Keys extends PropertyKey, const Parent>(
                    parent: Parent,
                    keys: ReadonlyArray<Keys>,
                ) => parent is CombineTypeWithKey<Keys, Parent>
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
        hasKey: autoGuard<
            <const Parent, const Key extends PropertyKey>(
                parent: Parent,
                key: Key,
                failureMessage?: string | undefined,
            ) => CombineTypeWithKey<Key, Parent>
        >(),
        hasKeys:
            autoGuard<
                <const Keys extends PropertyKey, const Parent>(
                    parent: Parent,
                    keys: ReadonlyArray<Keys>,
                    failureMessage?: string | undefined,
                ) => CombineTypeWithKey<Keys, Parent>
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
        hasKey: autoGuard<
            <const Parent, const Key extends PropertyKey>(
                parent: Parent,
                key: Key,
            ) => CombineTypeWithKey<Key, Parent> | undefined
        >(),
        hasKeys:
            autoGuard<
                <const Keys extends PropertyKey, const Parent>(
                    parent: Parent,
                    keys: ReadonlyArray<Keys>,
                ) => CombineTypeWithKey<Keys, Parent> | undefined
            >(),
    },
    waitUntilOverrides: {
        isKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    parent: Parent,
                    callback: () => Key,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToExpected<Key, keyof Parent>>
            >(),
        hasKey: autoGuard<
            <const Parent, const Key extends PropertyKey>(
                key: Key,
                callback: () => Parent,
                options?: WaitUntilOptions | undefined,
                failureMessage?: string | undefined,
            ) => Promise<CombineTypeWithKey<Key, Parent>>
        >(),
        hasKeys:
            autoGuard<
                <const Keys extends PropertyKey, const Parent>(
                    keys: ReadonlyArray<Keys>,
                    callback: () => Parent,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<CombineTypeWithKey<Keys, Parent>>
            >(),
    },
} satisfies GuardGroup;
