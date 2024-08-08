export const falsyArray = [
    undefined,
    false,
    0,
    '',
    null,
    NaN as 0,
] as const;

export const truthyArray = [
    'stuff',
    5,
    [],
    {},
    /stuff/,
] as const;

describe(isFalsy.name, () => {
    it('returns false for various truthy things', () => {
        assert.isFalse(truthyArray.some(isFalsy));
    });

    it('filters out truthy types', () => {
        const stuffToTest: (string | undefined)[] = [
            'stuff',
            undefined,
            'derp',
        ];

        const onlyFalsy: undefined[] = stuffToTest.filter(isFalsy);

        assert.deepStrictEqual(onlyFalsy, [
            undefined,
        ]);
    });

    it('accepts falsy things', () => {
        assert.isTrue(falsyArray.every(isFalsy));
    });

    it('includes falsy types', () => {
        const stuffToTest = [
            ...falsyArray,
            'hello there',
        ] as const;

        const filtered = stuffToTest.filter(isFalsy);

        assertTypeOf(filtered).toMatchTypeOf<(undefined | false | 0 | '' | null)[]>();
        assertTypeOf(stuffToTest).not.toMatchTypeOf<(undefined | false | 0 | '' | null)[]>();
    });
});

describe('Falsy', () => {
    it('excludes truthy types', () => {
        assertTypeOf<Falsy<string | undefined>>().toEqualTypeOf<undefined>();
        assertTypeOf<Falsy<string | null>>().toEqualTypeOf<null>();
        assertTypeOf<Falsy<string | false>>().toEqualTypeOf<false>();
        assertTypeOf<Falsy<string | 0>>().toEqualTypeOf<0>();
        assertTypeOf<Falsy<string>>().toEqualTypeOf<never>();
        assertTypeOf<Falsy<string | -0>>().toEqualTypeOf<-0>();
        assertTypeOf<Falsy<string | 0n>>().toEqualTypeOf<0n>();
    });
});

describe(isTruthy.name, ({it}) => {
    it('should return true for various truthy things', () => {
        assert.isTrue(truthyArray.every(isTruthy));
    });

    it('should filter out null types', () => {
        const stuffToTest: (string | undefined)[] = [
            'stuff',
            undefined,
            'derp',
        ];

        const onlyStrings: string[] = stuffToTest.filter(isTruthy);

        assert.deepStrictEqual(onlyStrings, [
            'stuff',
            'derp',
        ]);
    });

    it('should fail on falsy things', () => {
        assert.isFalse(falsyArray.some(isTruthy));
    });

    it('excludes falsy types', () => {
        const stuffToTest = [
            ...falsyArray,
            'hello there',
        ] as const;

        const filtered = stuffToTest.filter(isTruthy);

        assertTypeOf(filtered).toMatchTypeOf<string[]>();
        assertTypeOf(stuffToTest).not.toMatchTypeOf<string[]>();
    });
});

describe(ifTruthy.name, ({it}) => {
    it('calls ifTruthyCallback when input is truthy', () => {
        truthyArray.forEach((truthyEntry) => {
            assert.strictEqual(
                ifTruthy(
                    truthyEntry,
                    () => 42,
                    () => false,
                ),
                42,
            );
        });
    });
    it('calls ifFalsyCallback when input is falsy', () => {
        falsyArray.forEach((truthyEntry) => {
            assert.strictEqual(
                ifTruthy(
                    truthyEntry,
                    () => 42,
                    () => false,
                ),
                false,
            );
        });
    });
    it('has return type of both callbacks', () => {
        assertTypeOf(
            ifTruthy(
                randomBoolean() ? 'five' : 0,
                (truthy) => {
                    assertTypeOf(truthy).toEqualTypeOf<'five'>();
                    return {truthy: true};
                },
                (falsy) => {
                    assertTypeOf(falsy).toEqualTypeOf<0>();
                    return {falsy: true};
                },
            ),
        ).toEqualTypeOf<{truthy: boolean} | {falsy: boolean}>();
    });
});

describe('Truthy', () => {
    it('excludes falsy types', () => {
        assertTypeOf<Truthy<string | undefined>>().toEqualTypeOf<string>();
        assertTypeOf<Truthy<string | null>>().toEqualTypeOf<string>();
        assertTypeOf<Truthy<string | false>>().toEqualTypeOf<string>();
        assertTypeOf<Truthy<string | 0>>().toEqualTypeOf<string>();
        assertTypeOf<Truthy<string>>().toEqualTypeOf<string>();
        assertTypeOf<Truthy<string | -0>>().toEqualTypeOf<string>();
        assertTypeOf<Truthy<string | 0n>>().toEqualTypeOf<string>();
    });
});
