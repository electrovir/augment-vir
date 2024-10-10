import {
    ensureError,
    getObjectTypedKeys,
    type AnyObject,
    type MaybePromise,
} from '@augment-vir/core';
import {check} from './guards/check.js';

/**
 * Deeply checks inputs for equality with a custom checker callback. All objects are recursed into
 * and the custom checker is only run on primitives. This function automatically handles async
 * custom checkers and circular references.
 *
 * @category Assert
 */
export function checkCustomDeepQuality(
    a: unknown,
    b: unknown,
    customChecker: (a: unknown, b: unknown) => boolean,
): boolean;
/**
 * Deeply checks inputs for equality with a custom checker callback. All objects are recursed into
 * and the custom checker is only run on primitives. This function automatically handles async
 * custom checkers and circular references.
 *
 * @category Assert
 */
export function checkCustomDeepQuality(
    a: unknown,
    b: unknown,
    customChecker: (a: unknown, b: unknown) => Promise<boolean>,
): Promise<boolean>;
/**
 * Deeply checks inputs for equality with a custom checker callback. All objects are recursed into
 * and the custom checker is only run on primitives. This function automatically handles async
 * custom checkers and circular references.
 *
 * @category Assert
 */
export function checkCustomDeepQuality(
    a: unknown,
    b: unknown,
    customChecker: (a: unknown, b: unknown) => MaybePromise<boolean>,
): MaybePromise<boolean>;
/**
 * Deeply checks inputs for equality with a custom checker callback. All objects are recursed into
 * and the custom checker is only run on primitives. This function automatically handles async
 * custom checkers and circular references.
 *
 * @category Assert
 */
export function checkCustomDeepQuality(
    a: unknown,
    b: unknown,
    customChecker: (a: unknown, b: unknown) => MaybePromise<boolean>,
): MaybePromise<boolean> {
    return recursiveCheckCustomDeepQuality(a, b, customChecker, new Set());
}

function recursiveCheckCustomDeepQuality(
    a: unknown,
    b: unknown,
    customChecker: (a: unknown, b: unknown) => MaybePromise<boolean>,
    checkedObjects: Set<AnyObject>,
): MaybePromise<boolean> {
    a = flattenComplexObject(a);
    b = flattenComplexObject(b);

    if (check.isObject(a) && check.isObject(b)) {
        if (checkedObjects.has(a) || checkedObjects.has(b)) {
            return true;
        }
        checkedObjects.add(a);
        checkedObjects.add(b);
        if (
            !recursiveCheckCustomDeepQuality(
                getObjectTypedKeys(a).sort(),
                getObjectTypedKeys(b).sort(),
                customChecker,
                checkedObjects,
            )
        ) {
            return false;
        }

        let receivedPromise = false as boolean;

        const results = getObjectTypedKeys(a).map((key) => {
            const result = recursiveCheckCustomDeepQuality(
                (a as AnyObject)[key],
                (b as AnyObject)[key],
                customChecker,
                checkedObjects,
            );
            if (check.isPromise(result)) {
                receivedPromise = true;
            }
            return result;
        });

        return handleMaybePromise(receivedPromise, results);
    } else if (check.isArray(a) && check.isArray(b)) {
        if (checkedObjects.has(a) || checkedObjects.has(b)) {
            return true;
        }
        checkedObjects.add(a);
        checkedObjects.add(b);
        if (a.length !== b.length) {
            return false;
        }

        let receivedPromise = false as boolean;
        const results = a.map((entry, index) => {
            const result = recursiveCheckCustomDeepQuality(
                entry,
                b[index],
                customChecker,
                checkedObjects,
            );
            if (check.isPromise(result)) {
                receivedPromise = true;
            }

            return result;
        });

        return handleMaybePromise(receivedPromise, results);
    } else {
        return customChecker(a, b);
    }
}

function flattenComplexObject(input: unknown): unknown {
    if (input instanceof Set) {
        return Array.from(input.entries()).sort();
    } else if (input instanceof Map) {
        return Object.fromEntries(input.entries());
    } else if (input instanceof RegExp) {
        return input.source;
    } else {
        return input;
    }
}

function handleMaybePromise(
    hasPromise: boolean,
    results: ReadonlyArray<MaybePromise<unknown>>,
): MaybePromise<boolean> {
    if (hasPromise) {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                const awaitedResult = await Promise.all(results);
                resolve(awaitedResult.every(check.isTrue));
            } catch (error) {
                reject(ensureError(error));
            }
        });
    } else {
        return results.every(check.isTrue);
    }
}
