import {CasingOptions} from './casing.js';

export function maybeCapitalize(input: string, casingOptions: Partial<CasingOptions>): string {
    return casingOptions.capitalizeFirstLetter ? capitalizeFirstLetter(input) : input;
}

export function capitalizeFirstLetter<InputGeneric extends string>(
    input: InputGeneric,
): Capitalize<InputGeneric> {
    if (!input.length) {
        return '' as Capitalize<InputGeneric>;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const firstLetter: string = input[0]!;
    return (firstLetter.toUpperCase() + input.slice(1)) as Capitalize<InputGeneric>;
}
