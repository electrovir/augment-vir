import {
    stringify,
    type AnyObject,
    type MaybePromise,
    type NarrowToExpected,
    type RequiredKeysOf,
    type SetRequiredAndNotNull,
} from '@augment-vir/core';
import {type SetRequired} from 'type-fest';
import {AssertionError} from '../augments/assertion.error.js';
import {type GuardGroup} from '../guard-types/guard-group.js';
import {createWaitUntil, type WaitUntilOptions} from '../guard-types/wait-until-function.js';

/**
 * Helper type for `hasKey`.
 *
 * @category Assert : Util
 * @category Package : @augment-vir/assert
 * @package [`@augment-vir/assert`](https://www.npmjs.com/package/@augment-vir/assert)
 */
export type ExtractValue<Key extends PropertyKey, Parent> = Key extends keyof Parent
    ? Key extends keyof SetRequired<Parent, Key>
        ? SetRequired<Parent, Key>[Key]
        : never
    : Key extends keyof Extract<Parent, Record<Key, any>>
      ? Key extends keyof SetRequired<Extract<Parent, Record<Key, any>>, Key>
          ? SetRequired<Extract<Parent, Record<Key, any>>, Key>[Key]
          : never
      : never;

/**
 * Helper type for `hasKey`.
 *
 * @category Assert : Util
 * @category Package : @augment-vir/assert
 * @package [`@augment-vir/assert`](https://www.npmjs.com/package/@augment-vir/assert)
 */
export type CombinedParentValue<Key extends PropertyKey, Parent> =
    ExtractValue<Key, Parent> extends never ? unknown : ExtractValue<Key, Parent>;

/**
 * Helper type for `hasKey`.
 *
 * @category Assert : Util
 * @category Package : @augment-vir/assert
 * @package [`@augment-vir/assert`](https://www.npmjs.com/package/@augment-vir/assert)
 */
export type CombineTypeWithKey<Key extends PropertyKey, Parent> = Parent &
    Record<Key, CombinedParentValue<Key, Parent>>;

/**
 * Helper type for `hasDefinedProperty` and `hasDefinedProperties`.
 *
 * @category Assert : Util
 * @category Package : @augment-vir/assert
 * @package [`@augment-vir/assert`](https://www.npmjs.com/package/@augment-vir/assert)
 */
export type WithDefinedProperties<Parent extends AnyObject, Keys extends keyof Parent> = Parent &
    SetRequiredAndNotNull<Parent, Keys>;

const hasKeyAttempts: ReadonlyArray<(object: object, key: PropertyKey) => boolean> = [
    (object, key) => {
        return key in object;
    },
    (object, key) => {
        /** This handles cases where the input object can't use `in` directly, like string literals */
        return key in object.constructor.prototype;
    },
];

function hasKey<const Key extends PropertyKey, const Parent>(
    this: void,
    parent: Parent,
    key: Key,
): parent is CombineTypeWithKey<Key, Parent> {
    return hasKeyAttempts.some((attemptCallback) => {
        try {
            return attemptCallback(parent as object, key);
        } catch {
            return false;
        }
    });
}

const assertions = {
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
    isKeyOf<const Parent>(
        this: void,
        key: PropertyKey,
        parent: Parent,
        failureMessage?: string | undefined,
    ): asserts key is keyof Parent {
        if (!hasKey(parent, key)) {
            throw new AssertionError(
                `'${String(key)}' is not a key of '${stringify(parent)}'.`,
                failureMessage,
            );
        }
    },
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
    isNotKeyOf<const Key extends PropertyKey, const Parent>(
        this: void,
        key: Key,
        parent: Parent,
        failureMessage?: string | undefined,
    ): asserts key is Exclude<Key, RequiredKeysOf<Parent>> {
        if (hasKey(parent, key)) {
            throw new AssertionError(
                `'${String(key)}' is a key of '${stringify(parent)}'.`,
                failureMessage,
            );
        }
    },
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
    hasKey<const Key extends PropertyKey, const Parent>(
        this: void,
        parent: Parent,
        key: Key,
        failureMessage?: string | undefined,
    ): asserts parent is CombineTypeWithKey<Key, Parent> {
        if (!hasKey(parent, key)) {
            throw new AssertionError(
                `'${stringify(parent)}' does not have key '${String(key)}'.`,
                failureMessage,
            );
        }
    },
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
    lacksKey<const Parent, const Key extends PropertyKey>(
        this: void,
        parent: Parent,
        key: Key,
        failureMessage?: string | undefined,
    ): asserts parent is Exclude<Parent, Record<Key, any>> {
        if (hasKey(parent, key)) {
            throw new AssertionError(
                `'${stringify(parent)}' has key '${String(key)}'.`,
                failureMessage,
            );
        }
    },
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
    hasKeys<const Keys extends PropertyKey, const Parent>(
        this: void,
        parent: Parent,
        keys: ReadonlyArray<Keys>,
        failureMessage?: string | undefined,
    ): asserts parent is CombineTypeWithKey<Keys, Parent> {
        const missingKeys = keys.filter((key) => !hasKey(parent, key));

        if (missingKeys.length) {
            throw new AssertionError(
                `'${stringify(parent)}' does not have keys '${missingKeys.join(',')}'.`,
                failureMessage,
            );
        }
    },
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
    lacksKeys<const Parent, const Key extends PropertyKey>(
        this: void,
        parent: Parent,
        keys: ReadonlyArray<Key>,
        failureMessage?: string | undefined,
    ): asserts parent is Exclude<Parent, Partial<Record<Key, any>>> {
        const existingKeys = keys.filter((key) => hasKey(parent, key));

        if (existingKeys.length) {
            throw new AssertionError(
                `'${stringify(parent)}' does not lack keys '${existingKeys.join(',')}'.`,
                failureMessage,
            );
        }
    },
    /**
     * Asserts that a parent object has the given property and that its value is defined (not `null`
     * and not `undefined`).
     *
     * Type guards the parent value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.hasDefinedProperty({a: 0, b: 1}, 'a'); // passes
     * assert.hasDefinedProperty({a: undefined, b: 1}, 'a'); // fails
     * assert.hasDefinedProperty({a: 0, b: 1}, 'c'); // fails
     * ```
     *
     * @throws {@link AssertionError} If the property is missing or not defined.
     * @see
     * - {@link assert.hasDefinedProperties} : the multi-property assertion.
     */
    hasDefinedProperty<const Parent extends AnyObject, const Key extends keyof Parent>(
        this: void,
        parent: Parent,
        key: Key,
        failureMessage?: string | undefined,
    ): asserts parent is WithDefinedProperties<Parent, Key> {
        if (parent[key] == undefined) {
            throw new AssertionError(
                `'${stringify(parent)}' does not have a defined property '${String(key)}'.`,
                failureMessage,
            );
        }
    },
    /**
     * Asserts that a parent object has all the given properties and that each of their values is
     * defined (not `null` and not `undefined`).
     *
     * Type guards the parent value.
     *
     * @example
     *
     * ```ts
     * import {assert} from '@augment-vir/assert';
     *
     * assert.hasDefinedProperties({a: 0, b: 1}, [
     *     'a',
     *     'b',
     * ]); // passes
     * assert.hasDefinedProperties({a: 0, b: undefined}, [
     *     'a',
     *     'b',
     * ]); // fails
     * ```
     *
     * @throws {@link AssertionError} If any of the properties are missing or not defined.
     * @see
     * - {@link assert.hasDefinedProperty} : the single-property assertion.
     */
    hasDefinedProperties<const Parent extends AnyObject, const Keys extends keyof Parent>(
        this: void,
        parent: Parent,
        keys: ReadonlyArray<Keys>,
        failureMessage?: string | undefined,
    ): asserts parent is WithDefinedProperties<Parent, Keys> {
        const undefinedKeys = keys.filter((key) => parent[key] == undefined);

        if (undefinedKeys.length) {
            throw new AssertionError(
                `'${stringify(parent)}' does not have defined properties '${undefinedKeys.join(',')}'.`,
                failureMessage,
            );
        }
    },
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
        isKeyOf<const Parent>(this: void, key: PropertyKey, parent: Parent): key is keyof Parent {
            return hasKey(parent, key);
        },
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
        isNotKeyOf<const Key extends PropertyKey, const Parent>(
            this: void,
            key: Key,
            parent: Parent,
        ): key is Exclude<Key, RequiredKeysOf<Parent>> {
            return !hasKey(parent, key);
        },
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
        hasKey,
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
        lacksKey<const Parent, const Key extends PropertyKey>(
            this: void,
            parent: Parent,
            key: Key,
        ): parent is Exclude<Parent, Record<Key, any>> {
            return !hasKey(parent, key);
        },
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
        hasKeys<const Keys extends PropertyKey, const Parent>(
            this: void,
            parent: Parent,
            keys: ReadonlyArray<Keys>,
        ): parent is CombineTypeWithKey<Keys, Parent> {
            return keys.every((key) => hasKey(parent, key));
        },
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
        lacksKeys<const Parent, const Key extends PropertyKey>(
            this: void,
            parent: Parent,
            keys: ReadonlyArray<Key>,
        ): parent is Exclude<Parent, Partial<Record<Key, any>>> {
            return keys.every((key) => !hasKey(parent, key));
        },
        /**
         * Checks that a parent object has the given property and that its value is defined (not
         * `null` and not `undefined`).
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.hasDefinedProperty({a: 0, b: 1}, 'a'); // returns `true`
         * check.hasDefinedProperty({a: undefined, b: 1}, 'a'); // returns `false`
         * check.hasDefinedProperty({a: 0, b: 1}, 'c'); // returns `false`
         * ```
         *
         * @see
         * - {@link check.hasDefinedProperties} : the multi-property check.
         */
        hasDefinedProperty<const Parent extends AnyObject, const Key extends keyof Parent>(
            this: void,
            parent: Parent,
            key: Key,
        ): parent is WithDefinedProperties<Parent, Key> {
            return parent[key] != undefined;
        },
        /**
         * Checks that a parent object has all the given properties and that each of their values is
         * defined (not `null` and not `undefined`).
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {check} from '@augment-vir/assert';
         *
         * check.hasDefinedProperties({a: 0, b: 1}, [
         *     'a',
         *     'b',
         * ]); // returns `true`
         * check.hasDefinedProperties({a: 0, b: undefined}, [
         *     'a',
         *     'b',
         * ]); // returns `false`
         * ```
         *
         * @see
         * - {@link check.hasDefinedProperty} : the single-property check.
         */
        hasDefinedProperties<const Parent extends AnyObject, const Keys extends keyof Parent>(
            this: void,
            parent: Parent,
            keys: ReadonlyArray<Keys>,
        ): parent is WithDefinedProperties<Parent, Keys> {
            return keys.every((key) => parent[key] != undefined);
        },
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
        isKeyOf<const Key extends PropertyKey, const Parent>(
            this: void,
            key: Key,
            parent: Parent,
            failureMessage?: string | undefined,
        ): NarrowToExpected<Key, keyof Parent> {
            if (!hasKey(parent, key)) {
                throw new AssertionError(
                    `'${String(key)}' is not a key of '${stringify(parent)}'.`,
                    failureMessage,
                );
            }

            return key as NarrowToExpected<Key, keyof Parent>;
        },
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
        isNotKeyOf<const Key extends PropertyKey, const Parent>(
            this: void,
            key: Key,
            parent: Parent,
            failureMessage?: string | undefined,
        ): Exclude<Key, RequiredKeysOf<Parent>> {
            if (hasKey(parent, key)) {
                throw new AssertionError(
                    `'${String(key)}' is a key of '${stringify(parent)}'.`,
                    failureMessage,
                );
            }

            return key as Exclude<Key, RequiredKeysOf<Parent>>;
        },
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
        hasKey<const Parent, const Key extends PropertyKey>(
            this: void,
            parent: Parent,
            key: Key,
            failureMessage?: string | undefined,
        ): CombineTypeWithKey<Key, Parent> {
            if (!hasKey(parent, key)) {
                throw new AssertionError(
                    `'${stringify(parent)}' does not have key '${String(key)}'.`,
                    failureMessage,
                );
            }

            return parent;
        },
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
        lacksKey<const Parent, const Key extends PropertyKey>(
            this: void,
            parent: Parent,
            key: Key,
            failureMessage?: string | undefined,
        ): Exclude<Parent, Record<Key, any>> {
            if (hasKey(parent, key)) {
                throw new AssertionError(
                    `'${stringify(parent)}' has key '${String(key)}'.`,
                    failureMessage,
                );
            }

            return parent as Exclude<Parent, Record<Key, any>>;
        },
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
        hasKeys<const Keys extends PropertyKey, const Parent>(
            this: void,
            parent: Parent,
            keys: ReadonlyArray<Keys>,
            failureMessage?: string | undefined,
        ): CombineTypeWithKey<Keys, Parent> {
            const missingKeys = keys.filter((key) => !hasKey(parent, key));

            if (missingKeys.length) {
                throw new AssertionError(
                    `'${stringify(parent)}' does not have keys '${missingKeys.join(',')}'.`,
                    failureMessage,
                );
            }

            return parent as CombineTypeWithKey<Keys, Parent>;
        },
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
        lacksKeys<const Parent, const Key extends PropertyKey>(
            this: void,
            parent: Parent,
            keys: ReadonlyArray<Key>,
            failureMessage?: string | undefined,
        ): Exclude<Parent, Partial<Record<Key, any>>> {
            const existingKeys = keys.filter((key) => hasKey(parent, key));

            if (existingKeys.length) {
                throw new AssertionError(
                    `'${stringify(parent)}' does not lack keys '${existingKeys.join(',')}'.`,
                    failureMessage,
                );
            }

            return parent as Exclude<Parent, Partial<Record<Key, any>>>;
        },
        /**
         * Asserts that a parent object has the given property and that its value is defined (not
         * `null` and not `undefined`). Returns the parent if the assertion passes.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.hasDefinedProperty({a: 0, b: 1}, 'a'); // returns `{a: 0, b: 1}`
         * assertWrap.hasDefinedProperty({a: undefined, b: 1}, 'a'); // throws an error
         * ```
         *
         * @returns The parent if the assertion passes.
         * @throws {@link AssertionError} If the property is missing or not defined.
         * @see
         * - {@link assertWrap.hasDefinedProperties} : the multi-property assertion.
         */
        hasDefinedProperty<const Parent extends AnyObject, const Key extends keyof Parent>(
            this: void,
            parent: Parent,
            key: Key,
            failureMessage?: string | undefined,
        ): WithDefinedProperties<Parent, Key> {
            if (parent[key] == undefined) {
                throw new AssertionError(
                    `'${stringify(parent)}' does not have a defined property '${String(key)}'.`,
                    failureMessage,
                );
            }

            return parent as WithDefinedProperties<Parent, Key>;
        },
        /**
         * Asserts that a parent object has all the given properties and that each of their values
         * is defined (not `null` and not `undefined`). Returns the parent if the assertion passes.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {assertWrap} from '@augment-vir/assert';
         *
         * assertWrap.hasDefinedProperties({a: 0, b: 1}, [
         *     'a',
         *     'b',
         * ]); // returns `{a: 0, b: 1}`
         * assertWrap.hasDefinedProperties({a: 0, b: undefined}, [
         *     'a',
         *     'b',
         * ]); // throws an error
         * ```
         *
         * @returns The parent if the assertion passes.
         * @throws {@link AssertionError} If any of the properties are missing or not defined.
         * @see
         * - {@link assertWrap.hasDefinedProperty} : the single-property assertion.
         */
        hasDefinedProperties<const Parent extends AnyObject, const Keys extends keyof Parent>(
            this: void,
            parent: Parent,
            keys: ReadonlyArray<Keys>,
            failureMessage?: string | undefined,
        ): WithDefinedProperties<Parent, Keys> {
            const undefinedKeys = keys.filter((key) => parent[key] == undefined);

            if (undefinedKeys.length) {
                throw new AssertionError(
                    `'${stringify(parent)}' does not have defined properties '${undefinedKeys.join(',')}'.`,
                    failureMessage,
                );
            }

            return parent as WithDefinedProperties<Parent, Keys>;
        },
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
        isKeyOf<const Key extends PropertyKey, const Parent>(
            this: void,
            key: Key,
            parent: Parent,
        ): NarrowToExpected<Key, keyof Parent> | undefined {
            if (hasKey(parent, key)) {
                return key as NarrowToExpected<Key, keyof Parent>;
            } else {
                return undefined;
            }
        },
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
        isNotKeyOf<const Key extends PropertyKey, const Parent>(
            this: void,
            key: Key,
            parent: Parent,
        ): Exclude<Key, RequiredKeysOf<Parent>> | undefined {
            if (hasKey(parent, key)) {
                return undefined;
            } else {
                return key as Exclude<Key, RequiredKeysOf<Parent>>;
            }
        },
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
        hasKey<const Parent, const Key extends PropertyKey>(
            this: void,
            parent: Parent,
            key: Key,
        ): CombineTypeWithKey<Key, Parent> | undefined {
            if (hasKey(parent, key)) {
                return parent;
            } else {
                return undefined;
            }
        },
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
        lacksKey<const Parent, const Key extends PropertyKey>(
            this: void,
            parent: Parent,
            key: Key,
        ): Exclude<Parent, Record<Key, any>> | undefined {
            if (hasKey(parent, key)) {
                return undefined;
            } else {
                return parent as Exclude<Parent, Record<Key, any>>;
            }
        },
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
        hasKeys<const Keys extends PropertyKey, const Parent>(
            this: void,
            parent: Parent,
            keys: ReadonlyArray<Keys>,
        ): CombineTypeWithKey<Keys, Parent> | undefined {
            if (keys.every((key) => hasKey(parent, key))) {
                return parent as CombineTypeWithKey<Keys, Parent>;
            } else {
                return undefined;
            }
        },
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
        lacksKeys<const Parent, const Key extends PropertyKey>(
            this: void,
            parent: Parent,
            keys: ReadonlyArray<Key>,
        ): Exclude<Parent, Partial<Record<Key, any>>> | undefined {
            if (keys.every((key) => !hasKey(parent, key))) {
                return parent as Exclude<Parent, Partial<Record<Key, any>>>;
            } else {
                return undefined;
            }
        },
        /**
         * Checks that a parent object has the given property and that its value is defined (not
         * `null` and not `undefined`). Returns the parent value if the check passes, otherwise
         * `undefined`.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.hasDefinedProperty({a: 0, b: 1}, 'a'); // returns `{a: 0, b: 1}`
         * checkWrap.hasDefinedProperty({a: undefined, b: 1}, 'a'); // returns `undefined`
         * ```
         *
         * @returns The parent value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.hasDefinedProperties} : the multi-property check.
         */
        hasDefinedProperty<const Parent extends AnyObject, const Key extends keyof Parent>(
            this: void,
            parent: Parent,
            key: Key,
        ): WithDefinedProperties<Parent, Key> | undefined {
            if (parent[key] == undefined) {
                return undefined;
            } else {
                return parent as WithDefinedProperties<Parent, Key>;
            }
        },
        /**
         * Checks that a parent object has all the given properties and that each of their values is
         * defined (not `null` and not `undefined`). Returns the parent value if the check passes,
         * otherwise `undefined`.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {checkWrap} from '@augment-vir/assert';
         *
         * checkWrap.hasDefinedProperties({a: 0, b: 1}, [
         *     'a',
         *     'b',
         * ]); // returns `{a: 0, b: 1}`
         * checkWrap.hasDefinedProperties({a: 0, b: undefined}, [
         *     'a',
         *     'b',
         * ]); // returns `undefined`
         * ```
         *
         * @returns The parent value if the check passes, otherwise `undefined`.
         * @see
         * - {@link checkWrap.hasDefinedProperty} : the single-property check.
         */
        hasDefinedProperties<const Parent extends AnyObject, const Keys extends keyof Parent>(
            this: void,
            parent: Parent,
            keys: ReadonlyArray<Keys>,
        ): WithDefinedProperties<Parent, Keys> | undefined {
            if (keys.every((key) => parent[key] != undefined)) {
                return parent as WithDefinedProperties<Parent, Keys>;
            } else {
                return undefined;
            }
        },
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
        isKeyOf: createWaitUntil(assertions.isKeyOf) as <
            const Key extends PropertyKey,
            const Parent,
        >(
            this: void,
            parent: Parent,
            callback: () => MaybePromise<Key>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<NarrowToExpected<Key, keyof Parent>>,
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
        isNotKeyOf: createWaitUntil(assertions.isNotKeyOf) as <
            const Key extends PropertyKey,
            const Parent,
        >(
            this: void,
            parent: Parent,
            callback: () => MaybePromise<Key>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Key, RequiredKeysOf<Parent>>>,
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
        hasKey: createWaitUntil(assertions.hasKey) as <const Parent, const Key extends PropertyKey>(
            this: void,
            key: Key,
            callback: () => MaybePromise<Parent>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<CombineTypeWithKey<Key, Parent>>,
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
        lacksKey: createWaitUntil(assertions.lacksKey) as <
            const Parent,
            const Key extends PropertyKey,
        >(
            this: void,
            key: Key,
            callback: () => MaybePromise<Parent>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Parent, Record<Key, any>>>,
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
        hasKeys: createWaitUntil(assertions.hasKeys) as <
            const Keys extends PropertyKey,
            const Parent,
        >(
            this: void,
            keys: ReadonlyArray<Keys>,
            callback: () => MaybePromise<Parent>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<CombineTypeWithKey<Keys, Parent>>,
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
        lacksKeys: createWaitUntil(assertions.lacksKeys) as <
            const Parent,
            const Keys extends PropertyKey,
        >(
            this: void,
            keys: ReadonlyArray<Keys>,
            callback: () => MaybePromise<Parent>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<Exclude<Parent, Partial<Record<Keys, any>>>>,
        /**
         * Repeatedly calls a callback until its output is a parent object that has the first, key
         * input defined (not `null` and not `undefined`). Once the callback output passes, it is
         * returned. If the attempts time out, an error is thrown.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.hasDefinedProperty('a', () => {
         *     return {a: 0, b: 1};
         * }); // returns `{a: 0, b: 1}`
         * await waitUntil.hasDefinedProperty('a', () => {
         *     return {a: undefined, b: 1};
         * }); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.hasDefinedProperties} : the multi-property assertion.
         */
        hasDefinedProperty: createWaitUntil(assertions.hasDefinedProperty) as <
            const Parent extends AnyObject,
            const Key extends keyof Parent,
        >(
            this: void,
            key: Key,
            callback: () => MaybePromise<Parent>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<WithDefinedProperties<Parent, Key>>,
        /**
         * Repeatedly calls a callback until its output is a parent object that has all of the
         * first, keys input defined (not `null` and not `undefined`). Once the callback output
         * passes, it is returned. If the attempts time out, an error is thrown.
         *
         * Type guards the parent value.
         *
         * @example
         *
         * ```ts
         * import {waitUntil} from '@augment-vir/assert';
         *
         * await waitUntil.hasDefinedProperties(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     () => {
         *         return {a: 0, b: 1};
         *     },
         * ); // returns `{a: 0, b: 1}`
         * await waitUntil.hasDefinedProperties(
         *     [
         *         'a',
         *         'b',
         *     ],
         *     () => {
         *         return {a: 0, b: undefined};
         *     },
         * ); // throws an error
         * ```
         *
         * @returns The callback output once it passes.
         * @throws {@link AssertionError} On timeout.
         * @see
         * - {@link waitUntil.hasDefinedProperty} : the single-property assertion.
         */
        hasDefinedProperties: createWaitUntil(assertions.hasDefinedProperties) as <
            const Parent extends AnyObject,
            const Keys extends keyof Parent,
        >(
            this: void,
            keys: ReadonlyArray<Keys>,
            callback: () => MaybePromise<Parent>,
            options?: WaitUntilOptions | undefined,
            failureMessage?: string | undefined,
        ) => Promise<WithDefinedProperties<Parent, Keys>>,
    },
} satisfies GuardGroup<typeof assertions>;
