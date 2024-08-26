import {check} from '@augment-vir/assert';
import {
    copyThroughJson,
    JsonCompatibleArray,
    JsonCompatibleObject,
    type JsonCompatibleValue,
} from '@augment-vir/common';

export function appendJson(
    ...entries: ReadonlyArray<JsonCompatibleObject | undefined>
): JsonCompatibleObject;
export function appendJson(
    ...entries: ReadonlyArray<JsonCompatibleArray | undefined>
): JsonCompatibleArray;
export function appendJson(
    ...entries: ReadonlyArray<JsonCompatibleObject | JsonCompatibleArray | undefined>
): JsonCompatibleObject | JsonCompatibleArray;
export function appendJson(
    ...entries: ReadonlyArray<JsonCompatibleValue | undefined>
): JsonCompatibleObject | JsonCompatibleArray;
export function appendJson(
    ...rawEntries: ReadonlyArray<
        JsonCompatibleObject | JsonCompatibleArray | JsonCompatibleValue | undefined
    >
): JsonCompatibleObject | JsonCompatibleArray {
    const entries: ReadonlyArray<JsonCompatibleObject | JsonCompatibleArray | JsonCompatibleValue> =
        rawEntries.filter(check.isTruthy);

    if (!check.isLengthAtLeast(entries, 1)) {
        return {};
    }

    const firstEntry = copyThroughJson(entries[0]);

    const combinedData: JsonCompatibleObject | JsonCompatibleArray =
        typeof firstEntry === 'object'
            ? (firstEntry as JsonCompatibleObject | JsonCompatibleArray)
            : [firstEntry];

    entries.slice(1).forEach((entry) => {
        if (check.isArray(combinedData)) {
            if (check.isArray(entry)) {
                combinedData.push(...entry);
            } else {
                combinedData.push(entry);
            }
        } else {
            Object.assign(combinedData, entry);
        }
    });

    return combinedData;
}
