/** An Error thrown by failed assertions in `@augment-vir/assert`. */
export class AssertionError extends Error {
    public override name = 'AssertionError';
    constructor(baseMessage: string, userCustomizedMessage: string | undefined) {
        super(combineAssertionMessages(baseMessage, userCustomizedMessage));
    }
}

export function combineAssertionMessages(
    baseMessage: string,
    userCustomizedMessage: string | undefined,
) {
    return (
        [
            userCustomizedMessage,
            baseMessage,
        ]
            .filter((entry) => !!entry)
            .join(': ') || 'Assertion failed.'
    );
}
