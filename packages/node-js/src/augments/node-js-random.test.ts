import {itCases} from '@augment-vir/chai';
import {ensureMinAndMax, isUuid} from '@augment-vir/common';
import {assert} from 'chai';
import {describe, it} from 'mocha';
import {createUuid, randomInteger, randomString} from './node-js-random';

describe(randomString.name, () => {
    it('random string length is not required (has a default)', () => {
        assert.isTrue(!!randomString());
    });

    const length = 24;

    it('random string length matches specified length', () => {
        assert.lengthOf(randomString(length), length);
    });

    it('multiple calls to random string are not identical', () => {
        assert.notStrictEqual(randomString(), randomString());
    });

    it('length works with odd numbers', () => {
        assert.lengthOf(randomString(3), 3);
    });
});

describe(createUuid.name, () => {
    it('produces valid V4 uuids', () => {
        for (let i = 0; i < 1_000; i++) {
            assert.isTrue(isUuid(createUuid()));
        }
    });
});

describe(randomString.name, () => {
    it('should produce unique strings', () => {
        const randomStrings = Array(10)
            .fill(0)
            .map(() => {
                return randomString();
            });
        const randomStringSet = new Set(randomStrings);

        assert.strictEqual(
            randomStringSet.size,
            randomStrings.length,
            'some "random" strings were removed when converting to a set, meaning there were duplicates.',
        );
    });
});

describe(randomInteger.name, () => {
    itCases(
        (input: Parameters<typeof randomInteger>[0]) => {
            const loopMax = Math.abs(input.max - input.min) * 100;
            for (let i = 0; i < loopMax; i++) {
                const randomInt = randomInteger(input);
                assert.isAbove(
                    randomInt,
                    Math.floor(ensureMinAndMax(input).min) - 1,
                    'random integer was not within min bounds',
                );
                assert.isBelow(
                    randomInt,
                    Math.floor(ensureMinAndMax(input).max) + 1,
                    'random integer was not within max bounds',
                );
                assert.strictEqual(
                    randomInt,
                    Math.floor(randomInt),
                    'random number did not equal itself without decimals',
                );
            }

            return loopMax;
        },
        [
            {
                it: 'fits within easy bounds',
                input: {
                    min: 0,
                    max: 10,
                },
                throws: undefined,
            },
            {
                it: 'chops off bounds decimals',
                input: {
                    min: 0.999,
                    max: 2.999,
                },
                throws: undefined,
            },
            {
                it: 'works with negatives',
                input: {
                    min: -10,
                    max: -5,
                },
                throws: undefined,
            },
            {
                it: 'fits within larger bounds',
                input: {
                    min: 5,
                    /**
                     * Don't make this max too big or you could get your CPU stuck in a
                     * near-infinite loop.
                     */
                    max: 1_000,
                },
                throws: undefined,
            },
            {
                it: 'fixes backwards min and max values',
                input: {
                    min: 50,
                    max: 3,
                },
                throws: undefined,
            },
        ],
    );
});
