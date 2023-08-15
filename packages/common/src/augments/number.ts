export function toEnsuredNumber(input: any): number {
    const numeric = Number(input);

    if (isNaN(numeric)) {
        throw new Error(`Cannot convert given input to a number: ${input}`);
    } else {
        return numeric;
    }
}
