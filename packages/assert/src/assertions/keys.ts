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
     * Asserts that a key is contained within a parent value.
     *
     * Type guards the key.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isKeyof('a', {a: 0, b: 1}); // passes
     * assert.isKeyof('c', {a: 0, b: 1}); // fails
     * ```
     *
     * @throws {@link AssertionError} If the key is not in the parent.
     * @see
     * - {@link assert.isNotKeyOf} : the opposite assertion.
     */
    isKeyOf: typeof isKeyOf;
    /**
     * Asserts that a key is _not_ contained within a parent value.
     *
     * Type guards the key.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.isNotKeyOf('a', {a: 0, b: 1}); // fails
     * assert.isNotKeyOf('c', {a: 0, b: 1}); // passes
     * ```
     *
     * @throws {@link AssertionError} If the key is in the parent.
     * @see
     * - {@link assert.isKeyOf} : the opposite assertion.
     */
    isNotKeyOf: typeof isNotKeyOf;
    /**
     * Asserts that a parent value has the key.
     *
     * Type guards the parent value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.hasKey({a: 0, b: 1}, 'a'); // passes
     * assert.hasKey({a: 0, b: 1}, 'c'); // fails
     * ```
     *
     * @throws {@link AssertionError} If the parent does not have the key.
     * @see
     * - {@link assert.lacksKey} : the opposite assertion.
     * - {@link assert.hasKeys} : the multi-key assertion.
     */
    hasKey: typeof hasKey;
    /**
     * Asserts that a parent value does not have the key.
     *
     * Type guards the parent value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.lacksKey({a: 0, b: 1}, 'a'); // fails
     * assert.lacksKey({a: 0, b: 1}, 'c'); // passes
     * ```
     *
     * @throws {@link AssertionError} If the parent has the key.
     * @see
     * - {@link assert.hasKey} : the opposite assertion.
     * - {@link assert.lacksKeys} : the multi-key assertion.
     */
    lacksKey: typeof lacksKey;
    /**
     * Asserts that a parent value has all the keys.
     *
     * Type guards the parent value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.hasKeys({a: 0, b: 1}, [
     *     'a',
     *     'b',
     * ]); // passes
     * assert.hasKeys({a: 0, b: 1}, [
     *     'b',
     *     'c',
     * ]); // fails
     * ```
     *
     * @throws {@link AssertionError} If the parent does not have all the keys.
     * @see
     * - {@link assert.lacksKeys} : the opposite assertion.
     * - {@link assert.hasKey} : the single-key assertion.
     */
    hasKeys: typeof hasKeys;
    /**
     * Asserts that a parent value none of the keys.
     *
     * Type guards the parent value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.lacksKeys({a: 0, b: 1}, [
     *     'b',
     *     'c',
     * ]); // fails
     * assert.lacksKeys({a: 0, b: 1}, [
     *     'c',
     *     'd',
     * ]); // passes
     * ```
     *
     * @throws {@link AssertionError} If the parent has any of the keys.
     * @see
     * - {@link assert.hasKeys} : the opposite assertion.
     * - {@link assert.lacksKey} : the single-key assertion.
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
    assert: assertions,
    check: {
        /**
         * Checks that a key is contained within a parent value.
         *
         * Type guards the key.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isKeyof('a', {a: 0, b: 1}); // returns `true`
         * check.isKeyof('c', {a: 0, b: 1}); // returns `false`
         * ```
         *
         * @see
         * - {@link check.isNotKeyOf} : the opposite check.
         */
        isKeyOf:
            autoGuard<<const Parent>(key: PropertyKey, parent: Parent) => key is keyof Parent>(),
        /**
         * Checks that a key is _not_ contained within a parent value.
         *
         * Type guards the key.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.isNotKeyOf('a', {a: 0, b: 1}); // returns `false`
         * check.isNotKeyOf('c', {a: 0, b: 1}); // returns `true`
         * ```
         *
         * @see
         * - {@link check.isKeyOf} : the opposite check.
         */
        isNotKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    key: Key,
                    parent: Parent,
                    failureMessage?: string | undefined,
                ) => key is Exclude<Key, RequiredKeysOf<Parent>>
            >(),
        /**
         * Checks that a parent value has the key.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.hasKey({a: 0, b: 1}, 'a'); // returns `true`
         * check.hasKey({a: 0, b: 1}, 'c'); // returns `false`
         * ```
         *
         * @see
         * - {@link check.lacksKey} : the opposite check.
         * - {@link check.hasKeys} : the multi-key check.
         */
        hasKey: autoGuard<
            <const Parent, const Key extends PropertyKey>(
                parent: Parent,
                key: Key,
            ) => parent is CombineTypeWithKey<Key, Parent>
        >(),
        /**
         * Checks that a parent value does not have the key.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.lacksKey({a: 0, b: 1}, 'a'); // returns `false`
         * check.lacksKey({a: 0, b: 1}, 'c'); // returns `true`
         * ```
         *
         * @see
         * - {@link check.hasKey} : the opposite check.
         * - {@link check.lacksKeys} : the multi-key check.
         */
        lacksKey:
            autoGuard<
                <const Parent, const Key extends PropertyKey>(
                    parent: Parent,
                    key: Key,
                    failureMessage?: string | undefined,
                ) => parent is Exclude<Parent, Record<Key, any>>
            >(),
        /**
         * Checks that a parent value has all the keys.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.hasKeys({a: 0, b: 1}, [
         *     'a',
         *     'b',
         * ]); // returns `true`
         * check.hasKeys({a: 0, b: 1}, [
         *     'b',
         *     'c',
         * ]); // returns `false`
         * ```
         *
         * @see
         * - {@link check.lacksKeys} : the opposite check.
         * - {@link check.hasKey} : the single-key check.
         */
        hasKeys:
            autoGuard<
                <const Keys extends PropertyKey, const Parent>(
                    parent: Parent,
                    keys: ReadonlyArray<Keys>,
                ) => parent is CombineTypeWithKey<Keys, Parent>
            >(),
        /**
         * Checks that a parent value none of the keys.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.lacksKeys({a: 0, b: 1}, [
         *     'b',
         *     'c',
         * ]); // returns `false`
         * check.lacksKeys({a: 0, b: 1}, [
         *     'c',
         *     'd',
         * ]); // returns `true`
         * ```
         *
         * @see
         * - {@link check.hasKeys} : the opposite check.
         * - {@link check.lacksKey} : the single-key check.
         */
        lacksKeys:
            autoGuard<
                <const Parent, const Key extends PropertyKey>(
                    parent: Parent,
                    key: ReadonlyArray<Key>,
                ) => parent is Exclude<Parent, Partial<Record<Key, any>>>
            >(),
    },
    assertWrap: {
        /**
         * Asserts that a key is contained within a parent value. Returns the key if the assertion
         * passes.
         *
         * Type guards the key.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isKeyof('a', {a: 0, b: 1}); // returns `'a'`
         * assertWrap.isKeyof('c', {a: 0, b: 1}); // throws an error
         * ```
         *
         * @returns The key if it is in the parent.
         * @throws {@link AssertionError} If the key is not in the parent.
         * @see
         * - {@link assertWrap.isNotKeyOf} : the opposite assertion.
         */
        isKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    key: Key,
                    parent: Parent,
                    failureMessage?: string | undefined,
                ) => NarrowToExpected<Key, keyof Parent>
            >(),
        /**
         * Asserts that a key is _not_ contained within a parent value. Returns the key if the
         * assertion passes.
         *
         * Type guards the key.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.isNotKeyOf('a', {a: 0, b: 1}); // throws an error
         * assertWrap.isNotKeyOf('c', {a: 0, b: 1}); // returns `'c'`
         * ```
         *
         * @returns The key if it is not in the parent.
         * @throws {@link AssertionError} If the key is in the parent.
         * @see
         * - {@link assertWrap.isKeyOf} : the opposite assertion.
         */
        isNotKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    key: Key,
                    parent: Parent,
                    failureMessage?: string | undefined,
                ) => Exclude<Key, RequiredKeysOf<Parent>>
            >(),
        /**
         * Asserts that a parent value has the key. Returns the parent if the assertion passes.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.hasKey({a: 0, b: 1}, 'a'); // returns `{a: 0, b: 1}`
         * assertWrap.hasKey({a: 0, b: 1}, 'c'); // throws an error
         * ```
         *
         * @returns The parent if it has the key.
         * @throws {@link AssertionError} If the parent does not have the key.
         * @see
         * - {@link assertWrap.lacksKey} : the opposite assertion.
         * - {@link assertWrap.hasKeys} : the multi-key assertion.
         */
        hasKey: autoGuard<
            <const Parent, const Key extends PropertyKey>(
                parent: Parent,
                key: Key,
                failureMessage?: string | undefined,
            ) => CombineTypeWithKey<Key, Parent>
        >(),
        /**
         * Asserts that a parent value does not have the key. Returns the parent if the assertion
         * passes.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.lacksKey({a: 0, b: 1}, 'a'); // throws an error
         * assertWrap.lacksKey({a: 0, b: 1}, 'c'); // returns `{a: 0, b: 1}`
         * ```
         *
         * @returns The parent if it does not have the key.
         * @throws {@link AssertionError} If the parent has the key.
         * @see
         * - {@link assertWrap.hasKey} : the opposite assertion.
         * - {@link assertWrap.lacksKeys} : the multi-key assertion.
         */
        lacksKey:
            autoGuard<
                <const Parent, const Key extends PropertyKey>(
                    parent: Parent,
                    key: Key,
                    failureMessage?: string | undefined,
                ) => Exclude<Parent, Record<Key, any>>
            >(),
        /**
         * Asserts that a parent value has all the keys. Returns the parent if the assertion passes.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.hasKeys({a: 0, b: 1}, [
         *     'a',
         *     'b',
         * ]); // returns `{a: 0, b: 1}`
         * assertWrap.hasKeys({a: 0, b: 1}, [
         *     'b',
         *     'c',
         * ]); // throws an error
         * ```
         *
         * @returns The parent if it has all the keys.
         * @throws {@link AssertionError} If the parent does not have all the keys.
         * @see
         * - {@link assertWrap.lacksKeys} : the opposite assertion.
         * - {@link assertWrap.hasKey} : the single-key assertion.
         */
        hasKeys:
            autoGuard<
                <const Keys extends PropertyKey, const Parent>(
                    parent: Parent,
                    keys: ReadonlyArray<Keys>,
                    failureMessage?: string | undefined,
                ) => CombineTypeWithKey<Keys, Parent>
            >(),
        /**
         * Asserts that a parent value none of the keys. Returns the parent if the assertion passes.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.lacksKeys({a: 0, b: 1}, [
         *     'b',
         *     'c',
         * ]); // throws an error
         * assertWrap.lacksKeys({a: 0, b: 1}, [
         *     'c',
         *     'd',
         * ]); // returns `{a: 0, b: 1}`
         * ```
         *
         * @returns The parent if it does not have any of the keys.
         * @throws {@link AssertionError} If the parent has any of the keys.
         * @see
         * - {@link assertWrap.hasKeys} : the opposite assertion.
         * - {@link assertWrap.lacksKey} : the single-key assertion.
         */
        lacksKeys:
            autoGuard<
                <const Parent, const Key extends PropertyKey>(
                    parent: Parent,
                    key: ReadonlyArray<Key>,
                    failureMessage?: string | undefined,
                ) => Exclude<Parent, Partial<Record<Key, any>>>
            >(),
    },
    checkWrap: {
        /**
         * Checks that a key is contained within a parent value. Returns the key if the check
         * passes, otherwise `undefined`.
         *
         * Type guards the key.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isKeyof('a', {a: 0, b: 1}); // returns `'a'`
         * checkWrap.isKeyof('c', {a: 0, b: 1}); // returns `undefined`
         * ```
         *
         * @returns The key if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isNotKeyOf} : the opposite check.
         */
        isKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    key: Key,
                    parent: Parent,
                ) => NarrowToExpected<Key, keyof Parent> | undefined
            >(),
        /**
         * Checks that a key is _not_ contained within a parent value. Returns the key if the check
         * passes, otherwise `undefined`.
         *
         * Type guards the key.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.isNotKeyOf('a', {a: 0, b: 1}); // returns `undefined`
         * checkWrap.isNotKeyOf('c', {a: 0, b: 1}); // returns `'c'`
         * ```
         *
         * @returns The key if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.isKeyOf} : the opposite check.
         */
        isNotKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    key: Key,
                    parent: Parent,
                    failureMessage?: string | undefined,
                ) => Exclude<Key, RequiredKeysOf<Parent>> | undefined
            >(),
        /**
         * Checks that a parent value has the key. Returns the parent value if the check passes,
         * otherwise `undefined`.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.hasKey({a: 0, b: 1}, 'a'); // returns `{a: 0, b: 1}`
         * checkWrap.hasKey({a: 0, b: 1}, 'c'); // returns `undefined`
         * ```
         *
         * @returns The parent value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.lacksKey} : the opposite check.
         * - {@link checkWrap.hasKeys} : the multi-key check.
         */
        hasKey: autoGuard<
            <const Parent, const Key extends PropertyKey>(
                parent: Parent,
                key: Key,
            ) => CombineTypeWithKey<Key, Parent> | undefined
        >(),
        /**
         * Checks that a parent value does not have the key. Returns the parent value if the check
         * passes, otherwise `undefined`.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.lacksKey({a: 0, b: 1}, 'a'); // returns `undefined`
         * checkWrap.lacksKey({a: 0, b: 1}, 'c'); // returns `{a: 0, b: 1}`
         * ```
         *
         * @returns The parent value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.hasKey} : the opposite check.
         * - {@link checkWrap.lacksKeys} : the multi-key check.
         */
        lacksKey:
            autoGuard<
                <const Parent, const Key extends PropertyKey>(
                    parent: Parent,
                    key: Key,
                    failureMessage?: string | undefined,
                ) => Exclude<Parent, Record<Key, any>> | undefined
            >(),
        /**
         * Checks that a parent value has all the keys. Returns the parent value if the check
         * passes, otherwise `undefined`.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.hasKeys({a: 0, b: 1}, [
         *     'a',
         *     'b',
         * ]); // returns `{a: 0, b: 1}`
         * checkWrap.hasKeys({a: 0, b: 1}, [
         *     'b',
         *     'c',
         * ]); // returns `undefined`
         * ```
         *
         * @returns The parent value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.lacksKeys} : the opposite check.
         * - {@link checkWrap.hasKey} : the single-key check.
         */
        hasKeys:
            autoGuard<
                <const Keys extends PropertyKey, const Parent>(
                    parent: Parent,
                    keys: ReadonlyArray<Keys>,
                ) => CombineTypeWithKey<Keys, Parent> | undefined
            >(),
        /**
         * Checks that a parent value none of the keys. Returns the parent value if the check
         * passes, otherwise `undefined`.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.lacksKeys({a: 0, b: 1}, [
         *     'b',
         *     'c',
         * ]); // returns `undefined`
         * checkWrap.lacksKeys({a: 0, b: 1}, [
         *     'c',
         *     'd',
         * ]); // returns `{a: 0, b: 1}`
         * ```
         *
         * @returns The parent value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.hasKeys} : the opposite check.
         * - {@link checkWrap.lacksKey} : the single-key check.
         */
        lacksKeys:
            autoGuard<
                <const Parent, const Key extends PropertyKey>(
                    parent: Parent,
                    key: ReadonlyArray<Key>,
                ) => Exclude<Parent, Partial<Record<Key, any>>> | undefined
            >(),
    },
    waitUntil: {
        /**
         * Repeatedly calls a callback until its output is a key that is contained within the first,
         * parent value. Once the callback output passes, it is returned. If the attempts time out,
         * an error is thrown.
         *
         * Type guards the key.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isKeyof({a: 0, b: 1}, () => 'a'); // returns `'a'`
         * await waitUntil.isKeyof({a: 0, b: 1}, () => 'c'); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isNotKeyOf} : the opposite assertion.
         */
        isKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    parent: Parent,
                    callback: () => MaybePromise<Key>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<NarrowToExpected<Key, keyof Parent>>
            >(),
        /**
         * Repeatedly calls a callback until its output is a key that is _not_ contained within the
         * first, parent value. Once the callback output passes, it is returned. If the attempts
         * time out, an error is thrown.
         *
         * Type guards the key.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.isKeyof({a: 0, b: 1}, () => 'a'); // throws an error
         * await waitUntil.isKeyof({a: 0, b: 1}, () => 'c'); // returns `'c'`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.isNotKeyOf} : the opposite assertion.
         */
        isNotKeyOf:
            autoGuard<
                <const Key extends PropertyKey, const Parent>(
                    parent: Parent,
                    callback: () => MaybePromise<Key>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Key, RequiredKeysOf<Parent>>>
            >(),
        /**
         * Repeatedly calls a callback until its output is a parent value that has the first, key
         * input. Once the callback output passes, it is returned. If the attempts time out, an
         * error is thrown.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.hasKey('a', () => {
         *     return {a: 0, b: 1};
         * }); // returns `{a: 0, b: 1}`
         * await waitUntil.hasKey('c', () => {
         *     return {a: 0, b: 1};
         * }); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.lacksKey} : the opposite assertion.
         * - {@link waitUntil.hasKeys} : the multi-key assertion.
         */
        hasKey: autoGuard<
            <const Parent, const Key extends PropertyKey>(
                key: Key,
                callback: () => MaybePromise<Parent>,
                options?: WaitUntilOptions | undefined,
                failureMessage?: string | undefined,
            ) => Promise<CombineTypeWithKey<Key, Parent>>
        >(),
        /**
         * Repeatedly calls a callback until its output is a parent value that does not have the
         * first, key input. Once the callback output passes, it is returned. If the attempts time
         * out, an error is thrown.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.hasKey('a', () => {
         *     return {a: 0, b: 1};
         * }); // throws an error
         * await waitUntil.hasKey('c', () => {
         *     return {a: 0, b: 1};
         * }); // returns `{a: 0, b: 1}`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.hasKey} : the opposite assertion.
         * - {@link waitUntil.lacksKeys} : the multi-key assertion.
         */
        lacksKey:
            autoGuard<
                <const Parent, const Key extends PropertyKey>(
                    key: Key,
                    callback: () => MaybePromise<Parent>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Exclude<Parent, Record<Key, any>>>
            >(),
        /**
         * Repeatedly calls a callback until its output is a parent value that has all of the first,
         * keys input. Once the callback output passes, it is returned. If the attempts time out, an
         * error is thrown.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.hasKeys(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     () => {
         *         return {a: 0, b: 1};
         *     },
         * ); // returns `{a: 0, b: 1}`
         * await waitUntil.hasKeys(
         *     [
         *         'b',
         *         'c',
         *     ],
         *     () => {
         *         return {a: 0, b: 1};
         *     },
         * ); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.lacksKeys} : the opposite assertion.
         * - {@link waitUntil.hasKey} : the single-key assertion.
         */
        hasKeys:
            autoGuard<
                <const Keys extends PropertyKey, const Parent>(
                    keys: ReadonlyArray<Keys>,
                    callback: () => MaybePromise<Parent>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<CombineTypeWithKey<Keys, Parent>>
            >(),
        /**
         * Repeatedly calls a callback until its output is a parent value that does not have any of
         * the first, keys input. Once the callback output passes, it is returned. If the attempts
         * time out, an error is thrown.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.hasKeys(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     () => {
         *         return {a: 0, b: 1};
         *     },
         * ); // throws an error
         * await waitUntil.hasKeys(
         *     [
         *         'b',
         *         'c',
         *     ],
         *     () => {
         *         return {a: 0, b: 1};
         *     },
         * ); // returns `{a: 0, b: 1}`
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.hasKeys} : the opposite assertion.
         * - {@link waitUntil.lacksKey} : the single-key assertion.
         */
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
} satisfies GuardGroup<typeof assertions>;
