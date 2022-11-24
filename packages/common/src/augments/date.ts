export const englishFullMonthNames = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
] as const;

export const englishShortMonthNames = englishFullMonthNames.map((longMonthName) =>
    longMonthName.slice(0, 3),
);

export class InvalidDateError extends Error {
    public override readonly name = 'InvalidDateError';
}

/**
 * @param slashFormatString String that should be of format "MM/DD/YY", "MM/DD/YYYY". When the year
 *   portion only contains 2 numbers ("MM/DD/YY") the century must be provided in the form of the
 *   yearPrefix input.
 * @param yearPrefix String or number that is used to prefix slash format strings that only contain
 *   2 digits ("MM/DD/YY"). If the year is entirely missing form the given slash format string, the
 *   year will default to year 00 of the given century. See test file for examples.
 */
export function createDateFromSlashFormat(
    slashFormatString: string,
    yearPrefix: number | string = '',
) {
    const [
        month,
        day,
        rawYearEnding = '',
    ] = slashFormatString.split('/');

    if (!month || !day) {
        throw new Error(`Unable to extract month or day from "${slashFormatString}"`);
    }

    const yearEnding =
        rawYearEnding.length < 4 ? `${yearPrefix}${rawYearEnding.padStart(2, '0')}` : rawYearEnding;

    const returnDate = createDateFromUtcIsoFormat(
        `${yearEnding.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
    );
    return returnDate;
}

/**
 * @param commaFormatString Should be at string of the form "monthName dayNumber, fullYear" Example:
 *   "May 19, 2005"
 * @param ignoreInvalidMonth Set to true to ignore invalid months and just use the current UTC month
 */
export function createDateFromNamedCommaFormat(
    commaFormatString: string,
    ignoreInvalidMonth = false,
) {
    const [
        monthName,
        dayNumber,
        fullYear,
    ] = commaFormatString.replace(',', '').split(' ');
    if (!monthName || !dayNumber || !fullYear) {
        throw new InvalidDateError(
            `Invalid ${createDateFromNamedCommaFormat.name} input: ${commaFormatString}`,
        );
    }

    const longMonthIndex = (englishFullMonthNames as ReadonlyArray<string>).indexOf(
        monthName.toLowerCase(),
    );
    const shortMonthIndex = englishShortMonthNames.indexOf(monthName.toLowerCase());

    let monthIndex = longMonthIndex === -1 ? shortMonthIndex : longMonthIndex;

    if (monthIndex === -1) {
        if (ignoreInvalidMonth) {
            monthIndex = new Date().getUTCMonth();
        } else {
            throw new InvalidDateError(`Month name ${monthName} was not found.`);
        }
    }

    const returnDate = createDateFromUtcIsoFormat(
        `${fullYear.padStart(4, '0')}-${String(monthIndex + 1).padStart(
            2,
            '0',
        )}-${dayNumber.padStart(2, '0')}`,
    );

    return returnDate;
}

/**
 * Converts an iso-formatted string to a UTC date object. The time is nulled out to all zeros.
 *
 * @param isoFormatString Should be a date in the format YYYY-MM-DD.
 */
export function createDateFromUtcIsoFormat(isoFormatString: string): Date {
    const utcDate = new Date(isoFormatString + 'T00:00:00.000Z');

    if (isNaN(Number(utcDate))) {
        throw new InvalidDateError(`Invalid utc date formed from input "${isoFormatString}"`);
    }
    return utcDate;
}
