import type {Tuple} from '@augment-vir/core';
import {AssertionError} from '../assertion.error.js';
import type {GuardGroup} from '../guard-types/guard-group.js';
import {autoGuard} from '../guard-types/guard-override.js';
import {WaitUntilOptions} from '../guard-types/wait-until-function.js';

export type AtLeastTuple<ArrayElementGeneric, LengthGeneric extends number> = readonly [
    ...Tuple<ArrayElementGeneric, LengthGeneric>,
    ...ArrayElementGeneric[],
];

function isLengthAtLeast<Element, Length extends number>(
    array: ReadonlyArray<Element | undefined>,
    length: Length,
    failureMessage?: string | undefined,
): asserts array is AtLeastTuple<Element, Length> {
    if (array.length < length) {
        throw new AssertionError(
            failureMessage ||
                `Array has length, '${array.length}', which is not at least '${length}'.`,
        );
    }
}

const assertions: {
    isLengthAtLeast: typeof isLengthAtLeast;
} = {
    isLengthAtLeast,
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
    },
    checkWrapOverrides: {
        isLengthAtLeast:
            autoGuard<
                <Element, Length extends number>(
                    array: ReadonlyArray<Element | undefined>,
                    length: Length,
                ) => AtLeastTuple<Element, Length> | undefined
            >(),
    },
    waitUntilOverrides: {
        isLengthAtLeast:
            autoGuard<
                <Element, Length extends number>(
                    length: Length,
                    callback: () => ReadonlyArray<Element | undefined>,
                    options?: WaitUntilOptions | undefined,
                    failureMessage?: string | undefined,
                ) => Promise<AtLeastTuple<Element, Length>>
            >(),
    },
} satisfies GuardGroup;
