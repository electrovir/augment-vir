import {CasingOptions} from './casing.js';

/**
 * Capitalize the first letter of the input _only if_ the given options specifies doing so.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function maybeCapitalize(
    input: string,
    casingOptions: Pick<CasingOptions, 'capitalizeFirstLetter'>,
): string {
    return casingOptions.capitalizeFirstLetter ? capitalizeFirstLetter(input) : input;
}

/**
 * Capitalize the first letter of the input.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
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
