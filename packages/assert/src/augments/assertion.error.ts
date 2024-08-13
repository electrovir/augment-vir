/** An Error thrown by failed assertions in `@augment-vir/assert`. */
export class AssertionError extends Error {
    public override name = 'AssertionError';
    constructor(message?: string | undefined) {
        super(message || 'Assertion failed.');
    }
}
