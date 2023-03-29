import {itCases} from '@augment-vir/browser-testing';
import {clamp, ensureMinAndMax, isUuid} from '@augment-vir/common';
import {assert} from '@open-wc/testing';
import {createUuid, randomBoolean, randomInteger, randomString} from './browser-random';

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

describe(randomBoolean.name, () => {
    itCases(
        (likelyTrue: number) => {
            const counts = {
                true: 0,
                false: 0,
            };
            for (let i = 0; i < 1_000_000; i++) {
                if (randomBoolean(likelyTrue)) {
                    counts.true++;
                } else {
                    counts.false++;
                }
            }
            const percentActuallyTrue = (counts.true / (counts.true + counts.false)) * 100;
            assert.isAbove(
                percentActuallyTrue,
                clamp({value: likelyTrue, min: 0, max: 100}) - 1,
                'actual true percent was below acceptable range',
            );
            assert.isBelow(
                percentActuallyTrue,
                clamp({value: likelyTrue, min: 0, max: 100}) + 1,
                'actual true percent was above acceptable range',
            );
        },
        [
            {
                it: 'works with straight 50/50',
                input: 50,
                throws: undefined,
            },
            {
                it: 'clamps to 100',
                input: 5000,
                throws: undefined,
            },
            {
                it: 'clamps to 0',
                input: -100,
                throws: undefined,
            },
            {
                it: 'works with a different percentage',
                input: 39,
                throws: undefined,
            },
        ],
    );
});

describe(createUuid.name, () => {
    it('produces valid V4 uuids', () => {
        for (let i = 0; i < 1_000; i++) {
            assert.isTrue(isUuid(createUuid()));
        }
    });
});

describe(randomInteger.name, () => {
    itCases(
        (input: Parameters<typeof randomInteger>[0]) => {
            const loopMax = Math.abs(input.max - input.min) * 100;
            for (let i = 0; i < loopMax; i++) {
                const randomInt = randomInteger(input);
                assert.isAbove(randomInt, Math.floor(ensureMinAndMax(input).min) - 1);
                assert.isBelow(randomInt, Math.floor(ensureMinAndMax(input).max) + 1);
                assert.strictEqual(randomInt, Math.floor(randomInt));
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
