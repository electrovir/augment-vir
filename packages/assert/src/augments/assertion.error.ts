import {combineErrorMessages} from '@augment-vir/core';

/** An Error thrown by failed assertions in `@augment-vir/assert`. */
export class AssertionError extends Error {
    public override name = 'AssertionError';
    constructor(baseMessage: string, userCustomizedMessage: string | undefined) {
        super(combineErrorMessages(userCustomizedMessage, baseMessage) || 'Assertion failed.');
    }
}
