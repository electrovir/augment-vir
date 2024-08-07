import {isVirEnv, VirEnv} from '@augment-vir/env';
import {describe as MochaDescribe} from 'mocha';
import {describe as NodeDescribe} from 'node:test';
import {CustomAsserter} from '../function/assert-output.js';
import {AnyFunction} from '../function/generic-function-types.js';
import {NestedItError} from './nested-it.error.js';
import {createItCases, FunctionTestCase} from './universal-it-cases.js';
import {UniversalBareIt, UniversalIt} from './universal-it.js';

/**
 * This is not exported because if it is used as a direct import, using `await` is required or Node
 * tests get tripped up and throws "test could not be started because its parent finished" errors.
 */
const universalIt: UniversalIt = (doesThis, callback) => {
    if (isVirEnv(VirEnv.Node)) {
        return import('node:test').then(async (nodeTest) => {
            await nodeTest.it(doesThis, callback);
        }) as unknown as void;
    } else {
        return globalThis.it(doesThis, callback as () => void);
    }
};

universalIt.only = (doesThis, callback) => {
    if (isVirEnv(VirEnv.Node)) {
        return import('node:test').then(async (nodeTest) => {
            await nodeTest.it.only(doesThis, callback);
        }) as unknown as void;
    } else {
        return globalThis.it.only(doesThis, callback as () => void);
    }
};
universalIt.skip = (doesThis, callback) => {
    if (isVirEnv(VirEnv.Node)) {
        return import('node:test').then(async (nodeTest) => {
            await nodeTest.it.skip(doesThis, callback);
        }) as unknown as void;
    } else {
        return globalThis.it.skip(doesThis, callback as () => void);
    }
};

/**
 * An interface for an `describe` callback that is compatible with both Mocha ({@link MochaDescribe})
 * and Node.js's built-in test runner ({@link NodeDescribe}) and used in {@link UniversalDescribe}.
 *
 * @category Testing:Common
 */
export type UniversalDescribeCallback = (
    this: void,
    context: Readonly<UniversalDescribeCallbackContext>,
) => void;

/**
 * A context object passed to the callback within {@link UniversalDescribe}
 * ({@link UniversalDescribeCallback}). This context object should be used to extract `it`.
 *
 * @category Testing:Common
 */
export type UniversalDescribeCallbackContext = {
    it: UniversalIt;
    itCases<FunctionToTest extends AnyFunction>(
        functionToTest: FunctionToTest,
        testCases: ReadonlyArray<FunctionTestCase<typeof functionToTest>>,
    ): unknown[];
    itCases<FunctionToTest extends AnyFunction>(
        functionToTest: FunctionToTest,
        customAsserter: CustomAsserter<typeof functionToTest>,
        testCases: ReadonlyArray<FunctionTestCase<typeof functionToTest>>,
    ): unknown[];
    itCases<FunctionToTest extends AnyFunction>(
        functionToTest: FunctionToTest,
        testCasesOrCustomAsserter:
            | CustomAsserter<typeof functionToTest>
            | ReadonlyArray<FunctionTestCase<typeof functionToTest>>,
        maybeTestCases?: ReadonlyArray<FunctionTestCase<typeof functionToTest>> | undefined,
    ): unknown[];
};

/**
 * An interface for the `describe` test function that is compatible with both Mocha
 * ({@link MochaDescribe}) and Node.js's built-in test runner ({@link NodeDescribe}). This is used in
 * {@link UniversalDescribe}. The only difference is that this type does not include `only` and
 * `skip`.
 *
 * @category Testing:Common
 */
export type UniversalBareDescribe = {
    (this: void, describeThis: string, callback: UniversalDescribeCallback): void;
};

/**
 * A minimal interface for `describe` that is compatible with both Mocha ({@link MochaDescribe}) and
 * Node.js's built-in test runner ({@link NodeDescribe}). This is used for {@link describe}.
 *
 * @category Testing:Common
 */
export type UniversalDescribe = UniversalBareDescribe & {
    only: UniversalBareDescribe;
    skip: UniversalBareDescribe;
};

function wrapDescribeCallback(
    describeCallback: UniversalDescribeCallback,
): () => Promise<void> | void {
    const itPromises: unknown[] = [];
    let alreadyAwaited = false;
    function createIt(givenIt: AnyFunction): UniversalBareIt {
        return (doesThis, itCallback) => {
            if (alreadyAwaited) {
                throw new NestedItError("Cannot call 'it' inside of another 'it' or 'itCases'.");
            }
            const itPromise = givenIt(doesThis, itCallback);
            itPromises.push(itPromise);
            return itPromise;
        };
    }

    const innerIt: UniversalIt = createIt(universalIt) as UniversalIt;
    innerIt.skip = createIt(universalIt.skip);
    innerIt.only = createIt(universalIt.only);
    const context: UniversalDescribeCallbackContext = {
        it: innerIt,
        itCases: createItCases(innerIt),
    };
    return () => {
        const result = describeCallback(context);

        if ((result as unknown) instanceof Promise) {
            throw new TypeError(`Invalid describe callback: cannot be async.`);
        }

        if (isVirEnv(VirEnv.Node)) {
            /** Since `it` has to be async in the Node env, we must await all its calls. */
            return Promise.all(itPromises).then((): void => {
                alreadyAwaited = true;
            });
        }

        return result;
    };
}

/**
 * A `describe` that is compatible with both Mocha ({@link MochaDescribe}) and Node.js's built-in
 * test runner ({@link NodeDescribe}). The test runner is chosen based on the current environment.
 *
 * @category Testing:Common
 */
export const describe: UniversalDescribe = (description, callback): void => {
    /**
     * - In the Node case, this function will be async, which Node.js can handle.
     * - In the Web case, this function will be sync, which is required because Mocha won't await an
     *   async describe.
     */
    if (isVirEnv(VirEnv.Node)) {
        return import('node:test').then(async (nodeTest) => {
            await nodeTest.describe(description, wrapDescribeCallback(callback));
        }) as unknown as void;
    } else {
        globalThis.describe(description, wrapDescribeCallback(callback) as () => void);
    }
};

describe.only = (description, callback): void => {
    /**
     * - In the Node case, this function will be async, which Node.js can handle.
     * - In the Web case, this function will be sync, which is required because Mocha won't await an
     *   async describe.
     */
    if (isVirEnv(VirEnv.Node)) {
        return import('node:test').then(async (nodeTest) => {
            await nodeTest.describe.only(description, wrapDescribeCallback(callback));
        }) as unknown as void;
    } else {
        globalThis.describe.only(description, wrapDescribeCallback(callback) as () => void);
    }
};
describe.skip = (description, callback): void => {
    /**
     * - In the Node case, this function will be async, which Node.js can handle.
     * - In the Web case, this function will be sync, which is required because Mocha won't await an
     *   async describe.
     */
    if (isVirEnv(VirEnv.Node)) {
        return import('node:test').then(async (nodeTest) => {
            await nodeTest.describe.skip(description, wrapDescribeCallback(callback));
        }) as unknown as void;
    } else {
        globalThis.describe.skip(description, wrapDescribeCallback(callback) as () => void);
    }
};
