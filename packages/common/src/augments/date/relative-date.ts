import {capitalizeFirstLetter, getObjectTypedKeys, hasKey, PartialAndUndefined} from '../..';
import {RequiredAndNotNull} from '../type';

export type RelativeDateCalculation = PartialAndUndefined<{
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    months: number;
    years: number;
}>;

type DateGetterKey = Extract<keyof Date, `getUTC${string}`>;
type DateSetterKey = Extract<keyof Date, `setUTC${string}`>;

type DateSetterGetterKeys = {
    getKey: DateGetterKey;
    setKey: DateSetterKey;
};

/**
 * For the properties that don't have setters and getters named directly after them. For example, to
 * modify "milliseconds", we can just use that string directly: getUTCMilliseconds. However, for
 * "Months", we have to use getUTCMonth.
 */
const differentlyNamedDateSettersAndGetterKeys: Readonly<{
    [DatePartName in keyof RequiredAndNotNull<RelativeDateCalculation> as `getUTC${Capitalize<DatePartName>}` extends keyof Date
        ? `setUTC${Capitalize<DatePartName>}` extends keyof Date
            ? never
            : DatePartName
        : DatePartName]: DateSetterGetterKeys;
}> = {
    days: {
        getKey: 'getUTCDate',
        setKey: 'setUTCDate',
    },
    months: {
        getKey: 'getUTCMonth',
        setKey: 'setUTCMonth',
    },
    years: {
        getKey: 'getUTCFullYear',
        setKey: 'setUTCFullYear',
    },
} as const;

export function calculateRelativeDate(
    startingDate: Date | number | string,
    calculations: RelativeDateCalculation,
) {
    if (!(startingDate instanceof Date)) {
        startingDate = new Date(startingDate);
    }

    let returnDate = new Date(startingDate);

    getObjectTypedKeys(calculations).forEach((calculationKey) => {
        const calculationValue = calculations[calculationKey];

        if (!calculationValue) {
            return;
        }

        const {getKey, setKey}: DateSetterGetterKeys = hasKey(
            differentlyNamedDateSettersAndGetterKeys,
            calculationKey,
        )
            ? differentlyNamedDateSettersAndGetterKeys[calculationKey]
            : {
                  getKey: `getUTC${capitalizeFirstLetter(calculationKey)}`,
                  setKey: `setUTC${capitalizeFirstLetter(calculationKey)}`,
              };

        const currentValue = returnDate[getKey]();

        returnDate[setKey](currentValue + calculationValue);
    });

    return returnDate;
}
