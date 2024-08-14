import type {AnyFunction} from '@augment-vir/core';
import {AssertionError} from '../assertion.error.js';
import {tsTypeGuards} from '../assertions/equality/ts-type-equality.js';
import {extendableAssertions} from './extendable-assertions.js';

const allAssertions = {
    ...tsTypeGuards.assertions,
    ...extendableAssertions,
    fail(failureMessage?: string | undefined) {
        throw new AssertionError('Failure triggered.', failureMessage);
    },
};

export type Assert = ((input: unknown, failureMessage?: string | undefined) => void) &
    typeof allAssertions &
    Record<keyof AnyFunction, never>;

export const assert: Assert = Object.assign(
    (input: unknown, failureMessage?: string | undefined) => {
        if (!input) {
            throw new AssertionError('Assertion failed.', failureMessage);
        }
    },
    allAssertions,
);
