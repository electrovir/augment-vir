import {
    ensureError,
    getObjectTypedKeys,
    type AnyObject,
    type MaybePromise,
} from '@augment-vir/core';
import {check} from './guards/check.js';

/**
 * Runs a custom provided checker that is applied deeply to any given variables. Automatically
 * handles async custom checkers.
 *
 * @category Assert
 */
export function checkCustomDeepQuality(
    a: unknown,
    b: unknown,
    customChecker: (a: unknown, b: unknown) => boolean,
): boolean;
/**
 * Runs a custom provided checker that is applied deeply to any given variables. Automatically
 * handles async custom checkers.
 *
 * @category Assert
 */
export function checkCustomDeepQuality(
    a: unknown,
    b: unknown,
    customChecker: (a: unknown, b: unknown) => Promise<boolean>,
): Promise<boolean>;
/**
 * Runs a custom provided checker that is applied deeply to any given variables. Automatically
 * handles async custom checkers.
 *
 * @category Assert
 */
export function checkCustomDeepQuality(
    a: unknown,
    b: unknown,
    customChecker: (a: unknown, b: unknown) => MaybePromise<boolean>,
): MaybePromise<boolean>;
/**
 * Runs a custom provided checker that is applied deeply to any given variables. Automatically
 * handles async custom checkers.
 *
 * @category Assert
 */
export function checkCustomDeepQuality(
    a: unknown,
    b: unknown,
    customChecker: (a: unknown, b: unknown) => MaybePromise<boolean>,
): MaybePromise<boolean> {
    a = flattenComplexObject(a);
    b = flattenComplexObject(b);

    if (check.isObject(a) && check.isObject(b)) {
        if (
            !checkCustomDeepQuality(
                getObjectTypedKeys(a).sort(),
                getObjectTypedKeys(b).sort(),
                customChecker,
            )
        ) {
            return false;
        }

        let receivedPromise = false as boolean;

        const results = getObjectTypedKeys(a).map((key) => {
            const result = checkCustomDeepQuality(
                (a as AnyObject)[key],
                (b as AnyObject)[key],
                customChecker,
            );
            if (check.isPromise(result)) {
                receivedPromise = true;
            }
            return result;
        });

        return handleMaybePromise(receivedPromise, results);
    } else if (check.isArray(a) && check.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }

        let receivedPromise = false as boolean;
        const results = a.map((entry, index) => {
            const result = checkCustomDeepQuality(entry, b[index], customChecker);
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
