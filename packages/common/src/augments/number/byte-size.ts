import {type PartialWithUndefined} from '@augment-vir/core';
import {arrayToObject} from '../array/array-to-object.js';

/**
 * Units of digital storage size. Each unit is 1024 of the unit below it, not 1000, matching how
 * operating systems, AWS, and most file APIs count storage.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export enum ByteUnit {
    Bytes = 'bytes',
    Kilobytes = 'kilobytes',
    Megabytes = 'megabytes',
    Gigabytes = 'gigabytes',
    Terabytes = 'terabytes',
}

/**
 * Every {@link ByteUnit}, smallest to largest. Each unit's index sets its multiplier in
 * {@link bytesPerUnit}: `1024 ** index`.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export const orderedByteUnits: ReadonlyArray<ByteUnit> = [
    ByteUnit.Bytes,
    ByteUnit.Kilobytes,
    ByteUnit.Megabytes,
    ByteUnit.Gigabytes,
    ByteUnit.Terabytes,
];

/**
 * The number of bytes in one of each {@link ByteUnit}.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export const bytesPerUnit: Readonly<Record<ByteUnit, number>> = arrayToObject(
    orderedByteUnits,
    (unit, index) => {
        return {
            key: unit,
            value: 1024 ** index,
        };
    },
    {
        useRequired: true,
    },
);

/**
 * A storage size given in any combination of {@link ByteUnit} values, which are summed. Like
 * `date-vir`'s `AnyDuration`, but for bytes.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type AnyByteSize = PartialWithUndefined<Record<ByteUnit, number>>;

/**
 * A storage size that requires exactly the given {@link ByteUnit} keys. Pass `true` to allow any
 * unit, as in {@link AnyByteSize}. Like `date-vir`'s `Duration`, but for bytes.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {type ByteSize, ByteUnit} from '@augment-vir/common';
 *
 * const maxUpload: ByteSize<ByteUnit.Megabytes> = {
 *     megabytes: 10,
 * };
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ByteSize<Unit extends ByteUnit | true> = (true extends Unit ? AnyByteSize : unknown) &
    Record<Exclude<Unit, true>, number>;

/**
 * Selects which {@link ByteUnit} keys {@link convertByteSize} outputs. Like `date-vir`'s
 * `DurationUnitSelection`, but for bytes.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ByteUnitSelection = PartialWithUndefined<Record<ByteUnit, boolean>>;

/**
 * The output of {@link convertByteSize} for the given {@link ByteUnitSelection}. Falls back to
 * {@link AnyByteSize} when no unit is statically known to be selected.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ByteSizeBySelection<Selection extends Readonly<ByteUnitSelection>> = {
    [Unit in ByteUnit]: Selection[Unit] extends true ? Unit : never;
}[ByteUnit] extends infer SelectedUnit extends ByteUnit
    ? [SelectedUnit] extends [never]
        ? AnyByteSize
        : ByteSize<SelectedUnit>
    : never;

/**
 * Converts a storage size from any combination of units into the selected units. Same as
 * `date-vir`'s `convertDuration`: the total is split from the largest selected unit down, every
 * unit but the smallest gets a whole number, and the smallest selected unit gets the unrounded
 * remainder.
 *
 * @category Number
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {convertByteSize} from '@augment-vir/common';
 *
 * // `result1` is `{bytes: 10_485_760}`
 * const result1 = convertByteSize({megabytes: 10}, {bytes: true});
 * // `result2` is `{gigabytes: 1.5}`
 * const result2 = convertByteSize({gigabytes: 1, megabytes: 512}, {gigabytes: true});
 * // `result3` is `{gigabytes: 1, megabytes: 512}`
 * const result3 = convertByteSize({megabytes: 1536}, {gigabytes: true, megabytes: true});
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function convertByteSize<const Selection extends Readonly<ByteUnitSelection>>(
    size: Readonly<AnyByteSize>,
    units: Selection,
): ByteSizeBySelection<Selection> {
    const totalBytes = orderedByteUnits.reduce((sum, unit) => {
        return sum + (size[unit] ?? 0) * bytesPerUnit[unit];
    }, 0);
    const selectedUnits = orderedByteUnits.filter((unit) => units[unit]).toReversed();

    return selectedUnits.reduce(
        (accum, unit, index) => {
            const exactAmount = accum.remainingBytes / bytesPerUnit[unit];
            const amount =
                index === selectedUnits.length - 1 ? exactAmount : Math.trunc(exactAmount);

            return {
                result: {
                    ...accum.result,
                    [unit]: amount,
                },
                remainingBytes: accum.remainingBytes - amount * bytesPerUnit[unit],
            };
        },
        {
            result: {} satisfies AnyByteSize as ByteSizeBySelection<Selection>,
            remainingBytes: totalBytes,
        },
    ).result;
}
