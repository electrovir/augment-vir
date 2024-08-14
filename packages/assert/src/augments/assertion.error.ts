/** An Error thrown by failed assertions in `@augment-vir/assert`. */
export class AssertionError extends Error {
    public override name = 'AssertionError';
    constructor(baseMessage: string, userCustomizedMessage: string | undefined) {
        super(
            [
                userCustomizedMessage,
                baseMessage,
            ]
                .filter((entry) => !!entry)
                .join(': ') || 'Assertion failed.',
        );
    }
}
