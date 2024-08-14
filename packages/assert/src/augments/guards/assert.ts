import type {AnyFunction} from '@augment-vir/core';
import {AssertionError} from '../assertion.error.js';
import {typeofAssertions} from '../assertions/type-of.js';
import {extendableAssertions} from './extendable-assertions.js';

const allAssertions = {
    ...typeofAssertions,
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
