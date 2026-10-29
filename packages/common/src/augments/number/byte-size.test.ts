import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {
    type AnyByteSize,
    type ByteSize,
    ByteUnit,
    convertByteSize,
    orderedByteUnits,
} from './byte-size.js';

describe('orderedByteUnits', () => {
    it('contains every ByteUnit exactly once', () => {
        assert.deepEquals(orderedByteUnits.toSorted(), Object.values(ByteUnit).toSorted());
    });
});

describe('ByteSize', () => {
    it('requires only the selected units', () => {
        assert.tsType<ByteSize<ByteUnit.Megabytes | ByteUnit.Gigabytes>>().equals<{
            megabytes: number;
            gigabytes: number;
        }>();
    });
    it('allows any unit when given true', () => {
        assert.tsType<ByteSize<true>>().matches<AnyByteSize>();
        assert.tsType<AnyByteSize>().matches<ByteSize<true>>();
    });
});

describe(convertByteSize.name, () => {
    itCases(convertByteSize, [
        {
            it: 'converts a larger unit to bytes',
            inputs: [
                {
                    megabytes: 10,
                },
                {
                    bytes: true,
                },
            ],
            expect: {
                bytes: 10_485_760,
            },
        },
        {
            it: 'sums mixed units into a fractional larger unit',
            inputs: [
                {
                    gigabytes: 1,
                    megabytes: 512,
                },
                {
                    gigabytes: true,
                },
            ],
            expect: {
                gigabytes: 1.5,
            },
        },
        {
            it: 'splits across multiple units with the remainder in the smallest',
            inputs: [
                {
                    bytes: 1_610_612_736 + 1536,
                },
                {
                    gigabytes: true,
                    megabytes: true,
                    kilobytes: true,
                },
            ],
            expect: {
                gigabytes: 1,
                megabytes: 512,
                kilobytes: 1.5,
            },
        },
        {
            it: 'ignores units selected as false',
            inputs: [
                {
                    megabytes: 1,
                },
                {
                    megabytes: false,
                    kilobytes: true,
                },
            ],
            expect: {
                kilobytes: 1024,
            },
        },
        {
            it: 'treats an empty size as zero',
            inputs: [
                {},
                {
                    kilobytes: true,
                },
            ],
            expect: {
                kilobytes: 0,
            },
        },
    ]);

    it('types the output by the selected units', () => {
        assert
            .tsType(
                convertByteSize(
                    {
                        megabytes: 1,
                    },
                    {
                        gigabytes: true,
                        megabytes: true,
                        bytes: false,
                    },
                ),
            )
            .equals<{
                gigabytes: number;
                megabytes: number;
            }>();
    });
});
