export function combineFailureMessage(
    explanationMessage: string,
    failureMessage: string | undefined,
) {
    return [
        failureMessage,
        explanationMessage,
    ]
        .filter((entry) => !!entry)
        .join(': ');
}
