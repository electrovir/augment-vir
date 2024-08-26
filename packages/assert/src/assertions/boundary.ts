import {MaybePromise, stringify} from '@augment-vir/core';
import {AssertionError} from '../augments/assertion.error.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

/* eslint-disable @typescript-eslint/no-unused-vars */

function endsWith<const ArrayElement>(
    parent: ReadonlyArray<ArrayElement>,
    child: ArrayElement,
    failureMessage?: string | undefined,
): void;
function endsWith(parent: string, child: string, failureMessage?: string | undefined): void;
function endsWith(
    parent: string | ReadonlyArray<string>,
    child: string,
    failureMessage?: string | undefined,
): void;
function endsWith<const ArrayElement>(
    parent: string | ReadonlyArray<ArrayElement>,
    child: string | ArrayElement,
    failureMessage?: string | undefined,
): void {
    const message = `${stringify(parent)} does not end with ${stringify(child)}}`;
    if (typeof parent === 'string') {
        if (!parent.endsWith(child as string)) {
            throw new AssertionError(message, failureMessage);
        }
    } else if (parent[parent.length - 1] !== child) {
        throw new AssertionError(message, failureMessage);
    }
}

/* node:coverage disable */
function boundaryCheck<const ArrayElement>(
    parent: ReadonlyArray<ArrayElement>,
    child: ArrayElement,
    failureMessage?: string | undefined,
): boolean;
function boundaryCheck(parent: string, child: string, failureMessage?: string | undefined): boolean;
function boundaryCheck(
    parent: string | ReadonlyArray<string>,
    child: string,
    failureMessage?: string | undefined,
): boolean;
function boundaryCheck(): any {
    /**
     * This function isn't actually used at run time, it's only used as a type for function
     * overloads.
     */
}
function boundaryAssertWrap<const ArrayElement>(
    parent: ReadonlyArray<ArrayElement>,
    child: ArrayElement,
    failureMessage?: string | undefined,
): typeof parent;
function boundaryAssertWrap(
    parent: string,
    child: string,
    failureMessage?: string | undefined,
): typeof parent;
function boundaryAssertWrap(
    parent: string | ReadonlyArray<string>,
    child: string,
    failureMessage?: string | undefined,
): typeof parent;
function boundaryAssertWrap(): any {
    /**
     * This function isn't actually used at run time, it's only used as a type for function
     * overloads.
     */
}
function boundaryCheckWrap<const ArrayElement>(
    parent: ReadonlyArray<ArrayElement>,
    child: ArrayElement,
    failureMessage?: string | undefined,
): typeof parent | undefined;
function boundaryCheckWrap(
    parent: string,
    child: string,
    failureMessage?: string | undefined,
): typeof parent | undefined;
function boundaryCheckWrap(
    parent: string | ReadonlyArray<string>,
    child: string,
    failureMessage?: string | undefined,
): typeof parent | undefined;
function boundaryCheckWrap(): any {
    /**
     * This function isn't actually used at run time, it's only used as a type for function
     * overloads.
     */
}
function boundaryWaitUntil<const ArrayElement>(
    child: ArrayElement,
    callback: () => MaybePromise<ReadonlyArray<ArrayElement>>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<ReadonlyArray<ArrayElement>>;
function boundaryWaitUntil(
    child: string,
    callback: () => MaybePromise<string>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<string>;
function boundaryWaitUntil(
    child: string,
    callback: () => MaybePromise<string | ReadonlyArray<string>>,
    options?: WaitUntilOptions | undefined,
    failureMessage?: string | undefined,
): Promise<string | ReadonlyArray<string>>;
function boundaryWaitUntil(): any {
    /**
     * This function isn't actually used at run time, it's only used as a type for function
     * overloads.
     */
}
/* node:coverage enable */

function endsWithout<const ArrayElement>(
    parent: ReadonlyArray<ArrayElement>,
    child: ArrayElement,
    failureMessage?: string | undefined,
): void;
function endsWithout(parent: string, child: string, failureMessage?: string | undefined): void;
function endsWithout(
    parent: string | ReadonlyArray<string>,
    child: string,
    failureMessage?: string | undefined,
): void;
function endsWithout<const ArrayElement>(
    parent: string | ReadonlyArray<ArrayElement>,
    child: string | ArrayElement,
    failureMessage?: string | undefined,
): void {
    const message = `${stringify(parent)} ends with ${stringify(child)}}`;
    if (typeof parent === 'string') {
        if (parent.endsWith(child as string)) {
            throw new AssertionError(message, failureMessage);
        }
    } else if (parent[parent.length - 1] === child) {
        throw new AssertionError(message, failureMessage);
    }
}

function startsWith<const ArrayElement>(
    parent: ReadonlyArray<ArrayElement>,
    child: ArrayElement,
    failureMessage?: string | undefined,
): void;
function startsWith(parent: string, child: string, failureMessage?: string | undefined): void;
function startsWith(
    parent: string | ReadonlyArray<string>,
    child: string,
    failureMessage?: string | undefined,
): void;
function startsWith<const ArrayElement>(
    parent: string | ReadonlyArray<ArrayElement>,
    child: string | ArrayElement,
    failureMessage?: string | undefined,
): void {
    const message = `${stringify(parent)} does not start with ${stringify(child)}}`;
    if (typeof parent === 'string') {
        if (!parent.startsWith(child as string)) {
            throw new AssertionError(message, failureMessage);
        }
    } else if (parent[0] !== child) {
        throw new AssertionError(message, failureMessage);
    }
}

function startsWithout<const ArrayElement>(
    parent: ReadonlyArray<ArrayElement>,
    child: ArrayElement,
    failureMessage?: string | undefined,
): void;
function startsWithout(parent: string, child: string, failureMessage?: string | undefined): void;
function startsWithout(
    parent: string | ReadonlyArray<string>,
    child: string,
    failureMessage?: string | undefined,
): void;
function startsWithout<const ArrayElement>(
    parent: string | ReadonlyArray<string>,
    child: string | ArrayElement,
    failureMessage?: string | undefined,
): void {
    const message = `${stringify(parent)} starts with ${stringify(child)}}`;
    if (typeof parent === 'string') {
        if (parent.startsWith(child as string)) {
            throw new AssertionError(message, failureMessage);
        }
    } else if (parent[0] === child) {
        throw new AssertionError(message, failureMessage);
    }
}

const assertions: {
    endsWith: typeof endsWith;
    endsWithout: typeof endsWithout;
    startsWith: typeof startsWith;
    startsWithout: typeof startsWithout;
} = {
    endsWith,
    endsWithout,
    startsWith,
    startsWithout,
};

export const boundaryGuards = {
    assertions,
    checkOverrides: {
        endsWith: autoGuard<typeof boundaryCheck>(),
        endsWithout: autoGuard<typeof boundaryCheck>(),
        startsWith: autoGuard<typeof boundaryCheck>(),
        startsWithout: autoGuard<typeof boundaryCheck>(),
    },
    assertWrapOverrides: {
        endsWith: autoGuard<typeof boundaryAssertWrap>(),
        endsWithout: autoGuard<typeof boundaryAssertWrap>(),
        startsWith: autoGuard<typeof boundaryAssertWrap>(),
        startsWithout: autoGuard<typeof boundaryAssertWrap>(),
    },
    checkWrapOverrides: {
        endsWith: autoGuard<typeof boundaryCheckWrap>(),
        endsWithout: autoGuard<typeof boundaryCheckWrap>(),
        startsWith: autoGuard<typeof boundaryCheckWrap>(),
        startsWithout: autoGuard<typeof boundaryCheckWrap>(),
    },
    waitUntilOverrides: {
        endsWith: autoGuard<typeof boundaryWaitUntil>(),
        endsWithout: autoGuard<typeof boundaryWaitUntil>(),
        startsWith: autoGuard<typeof boundaryWaitUntil>(),
        startsWithout: autoGuard<typeof boundaryWaitUntil>(),
    },
};
