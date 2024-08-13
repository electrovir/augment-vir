import {UuidV4} from '@augment-vir/core';
import {AssertionError} from '../assertion.error.js';
import {GuardGroup} from '../guard-types/guard-group.js';

const uuidRegExp = /^[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}$/;

/** Checks if the input string is a valid v4 UUID. */
function isUuid(input: unknown, failureMessage?: string | undefined): asserts input is UuidV4 {
    if (!String(input).match(uuidRegExp)) {
        throw new AssertionError(failureMessage || `'${String(input)}' is not a UUID.`);
    }
}

const assertions: {isUuid: typeof isUuid} = {
    isUuid,
};

export const uuidGuards = {
    assertions,
} satisfies GuardGroup;
