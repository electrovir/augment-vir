import {indent, prettyDiff} from '@augment-vir/core';
import {AssertionError} from './assertion.error.js';

export class DiffError extends AssertionError {
    public override name = 'DiffError';
    constructor(
        baseMessage: string,
        actual: unknown,
        expected: unknown,
        userCustomizedMessage: string | undefined,
    ) {
        const diffString = prettyDiff({
            actual,
            expected,
        });

        super(
            [
                baseMessage,
                indent(diffString),
            ].join('\n'),
            userCustomizedMessage,
        );
    }
}
