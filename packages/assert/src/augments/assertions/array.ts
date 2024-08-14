import {MaybePromise, Tuple} from '@augment-vir/core';
import {AssertionError} from '../assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

export type AtLeastTuple<ArrayElementGeneric, LengthGeneric extends number> = readonly [
    ...Tuple<ArrayElementGeneric, LengthGeneric>,
    ...ArrayElementGeneric[],
];

function isLengthAtLeast<const Element, const Length extends number>(
    array: ReadonlyArray<Element | undefined>,
    length: Length,
    failureMessage?: string | undefined,
): asserts array is AtLeastTuple<Element, Length> {
    if (array.length < length) {
        throw new AssertionError(
            failureMessage || `Array has length '${array.length}' is not at least '${length}'.`,
        );
    }
}
function isLengthExactly<const Element, const Length extends number>(
    array: ReadonlyArray<Element | undefined>,
    length: Length,
    failureMessage?: string | undefined,
): asserts array is Tuple<Element, Length> {
    if (array.length !== length) {
        throw new AssertionError(
            failureMessage || `Array has length '${array.length}' is not exactly '${length}'.`,
        );
    }
}

const assertions: {
    isLengthAtLeast: typeof isLengthAtLeast;
    isLengthExactly: typeof isLengthExactly;
} = {
    isLengthAtLeast,
    isLengthExactly,
};

export const arrayGuards = {
    assertions,
    checkOverrides: {
        isLengthAtLeast:
            autoGuard<
                <Element, Length extends number>(
                    array: ReadonlyArray<Element | undefined>,
                    length: Length,
                ) => array is AtLeastTuple<Element, Length>
            >(),
        isLengthExactly:
            autoGuard<
                <Element, Length extends number>(
                    array: ReadonlyArray<Element | undefined>,
                    length: Length,
                ) => array is Tuple<Element, Length>
            >(),
    },
    assertWrapOverrides: {
        isLengthAtLeast:
            autoGuard<
                <Element, Length extends number>(
                    array: ReadonlyArray<Element | undefined>,
                    length: Length,
                    failureMessage?: string | undefined,
                ) => AtLeastTuple<Element, Length>
            >(),
        isLengthExactly:
            autoGuard<
                <Element, Length extends number>(
                    array: ReadonlyArray<Element | undefined>,
                    length: Length,
                    failureMessage?: string | undefined,
                ) => Tuple<Element, Length>
            >(),
    },
    checkWrapOverrides: {
        isLengthAtLeast:
            autoGuard<
                <Element, Length extends number>(
                    array: ReadonlyArray<Element | undefined>,
                    length: Length,
                ) => AtLeastTuple<Element, Length> | undefined
            >(),
        isLengthExactly:
            autoGuard<
                <Element, Length extends number>(
                    array: ReadonlyArray<Element | undefined>,
                    length: Length,
                ) => Tuple<Element, Length> | undefined
            >(),
    },
    waitUntilOverrides: {
        isLengthAtLeast:
            autoGuard<
                <Element, Length extends number>(
                    length: Length,
                    callback: () => MaybePromise<ReadonlyArray<Element | undefined>>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<AtLeastTuple<Element, Length>>
            >(),
        isLengthExactly:
            autoGuard<
                <Element, Length extends number>(
                    length: Length,
                    callback: () => MaybePromise<ReadonlyArray<Element | undefined>>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<Tuple<Element, Length>>
            >(),
    },
} satisfies GuardGroup;
