import {addCommasToNumber, convertIntoNumber, doesRequireScientificNotation} from './common-number';
import {typedSplit} from './common-string';
import {safeMatch} from './regexp';

const defaultTruncationSuffixes = [
    'k', // thousand
    'M', // million
    'B', // billion
    'T', // trillion
    'P', // peta-, quadrillion
    'E', // exa- quintillion
    'Z', // zetta- sextillion
    'Y', // yotta- septillion
] as const;

function combineBeforeAndAfterDot({
    beforeDot,
    afterDot = '',
    maxLength,
}: {
    beforeDot: string;
    afterDot: string | undefined;
    maxLength: number;
}): string {
    if (afterDot.length) {
        const allowedAfterDotLength =
            maxLength -
            beforeDot.length -
            // 1 for the period
            1;
        if (allowedAfterDotLength > 0) {
            const slicedAfterDot = afterDot.slice(0, allowedAfterDotLength);
            // if slicedAfterDot is just a bunch of 0
            if (!Number(slicedAfterDot)) {
                return beforeDot;
            }
            return [
                beforeDot,
                slicedAfterDot,
            ].join('.');
        }
    }

    return beforeDot;
}

function truncateBigNumber(
    numberAsString: string,
    suffixes: ReadonlyArray<string>,
    maxLength: number,
): string {
    const [
        beforeDot,
        afterDot,
    ] = typedSplit(numberAsString, '.');

    const withCommas = addCommasToNumber(beforeDot);

    const truncationDepth = safeMatch(withCommas, /,/g).length;

    const suffix = suffixes[truncationDepth - 1];

    const [
        beforeComma,
        afterComma,
    ] = typedSplit(withCommas, ',');
    const trailing = [
        afterComma,
        afterDot,
    ].join('');

    if (beforeComma.length + 1 > maxLength) {
        // will look like 0.9M
        const minimumString = [
            '0.',
            beforeComma[0],
            suffixes[truncationDepth],
        ].join('');
        return minimumString;
    } else {
        const combined = combineBeforeAndAfterDot({
            beforeDot: beforeComma,
            afterDot: trailing,
            maxLength: maxLength - 1 /* -1 to account for the suffix*/,
        });
        return [
            combined,
            suffix,
        ].join('');
    }
}

const minScientificNotationLength = '1e+'.length;

function truncateScientificNotation({
    input,
    maxLength,
}: {
    input: number;
    maxLength: number;
}): string {
    const valueString = String(input);
    const [
        beforeExponent,
        rawExponent,
    ] = typedSplit(valueString, 'e') as [string, string];
    const exponent = rawExponent.replace(/^[\-\+]/, '')!;
    const plusOrMinus = rawExponent[0]!;

    const eSuffix = [
        'e',
        plusOrMinus,
        exponent,
    ].join('');

    const [
        beforeDot,
        afterDot,
    ] = typedSplit(beforeExponent, '.');

    const minLength = exponent.length + minScientificNotationLength;

    if (minLength === maxLength) {
        // this will look like "4e+4" or "5e-234"
        return [
            beforeDot,
            eSuffix,
        ].join('');
    } else if (minLength > maxLength) {
        // in this case the number is either way too big or way to small for its exponent to fit within the max length so we just jump to 0 or Infinity
        if (plusOrMinus === '-') {
            return '0';
        } else {
            return String(Infinity);
        }
    } else {
        // in this case we have room to add some decimal values to the number
        const beforeE = combineBeforeAndAfterDot({
            afterDot,
            beforeDot,
            maxLength: maxLength - exponent.length + minScientificNotationLength,
        });

        return [
            beforeE,
            eSuffix,
        ].join('');
    }
}

function handleSmallNumbers(numberAsString: string, maxLength: number): string | undefined {
    const [
        beforeDot,
        afterDot,
    ] = typedSplit(addCommasToNumber(numberAsString), '.');

    if (beforeDot.length <= maxLength) {
        return combineBeforeAndAfterDot({
            beforeDot,
            afterDot,
            maxLength,
        });
    }

    // in this case, the number is not small enough to be handled by this function
    return undefined;
}

/**
 * This truncates a number such that is will at a max have 6 characters including suffix, decimal
 * point, or comma.
 *
 * Default suffixes are:
 *
 *     'k', // thousand
 *     'M', // million
 *     'B', // billion
 *     'T', // trillion
 *     'P', // peta-, quadrillion
 *     'E', // exa- quintillion
 *     'Z', // zetta- sextillion
 *     'Y', // yotta- septillion
 */
export function truncateNumber(
    originalValue: Readonly<unknown>,
    {
        customSuffixes = defaultTruncationSuffixes,
        maxLength = 6,
    }: Partial<{
        customSuffixes: ReadonlyArray<string> | undefined;
        maxLength: number | undefined;
    }> = {},
): string {
    const inputNumber = convertIntoNumber(originalValue);

    // handle edge cases
    if (isNaN(inputNumber) || inputNumber === Infinity) {
        return String(inputNumber);
    }

    // handle too big or too small edge cases
    if (doesRequireScientificNotation(inputNumber)) {
        return truncateScientificNotation({input: inputNumber, maxLength});
    }

    const numberAsString = String(inputNumber);

    const smallResult = handleSmallNumbers(numberAsString, maxLength);

    if (smallResult != undefined) {
        return smallResult;
    }

    return truncateBigNumber(numberAsString, customSuffixes, maxLength);
}
