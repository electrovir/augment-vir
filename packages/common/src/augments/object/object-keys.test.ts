/* eslint-disable @typescript-eslint/no-unused-expressions */
import {assert, describe} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {getObjectTypedKeys, omitObjectKeys, pickObjectKeys} from './object-keys.js';

describe(omitObjectKeys.name, ({it, itCases}) => {
    it('should create proper types', () => {
        const exampleObject = {
            five: 'four',
            4: 3,
            somethingElse: 4,
        } as const;
        const keysToRemove = [
            'five',
            'somethingElse',
        ] as const satisfies ReadonlyArray<keyof typeof exampleObject>;

        exampleObject.five;
        exampleObject.somethingElse;

        const output = omitObjectKeys(exampleObject, keysToRemove);

        assertTypeOf(output).toBeAssignableTo<
            Omit<typeof exampleObject, 'five' | 'somethingElse'>
        >();

        // @ts-expect-error: this property was omitted
        output.five;
        // @ts-expect-error: this property was omitted
        output.somethingElse;
    });

    itCases(
        (...inputs: Parameters<typeof omitObjectKeys<any, any>>) => omitObjectKeys(...inputs),
        [
            {
                it: 'should remove basic keys',
                inputs: [
                    {a: 1, b: 2, c: 3},
                    ['b'],
                ],
                expect: {a: 1, c: 3},
            },
        ],
    );
});

describe(pickObjectKeys.name, ({it, itCases}) => {
    it('should pick object types', () => {
        const exampleObject = {
            five: 'four',
            another: 'hi',
            somethingElse: 4,
        } as const;
        const keysToKeep = [
            'five',
            'somethingElse',
        ] as const satisfies ReadonlyArray<keyof typeof exampleObject>;

        assertTypeOf(exampleObject.another).toEqualTypeOf<'hi'>();

        const output = pickObjectKeys(exampleObject, keysToKeep);

        assertTypeOf(output).toBeAssignableTo<
            Pick<typeof exampleObject, 'five' | 'somethingElse'>
        >();

        // @ts-expect-error: this key was not picked
        output.another;
    });

    itCases(
        (...inputs: Parameters<typeof pickObjectKeys<any, any>>) => pickObjectKeys(...inputs),
        [
            {
                it: 'should keep basic keys',
                inputs: [
                    {a: 1, b: 2, c: 3},
                    ['b'],
                ],
                expect: {b: 2},
            },
        ],
    );
});

enum Planet {
    Mercury = 'mercury',
    Venus = 'venus',
    Earth = 'earth',
}

const greekNames: Record<Planet, string> = {
    [Planet.Mercury]: 'Hermes',
    [Planet.Venus]: 'Aphrodite',
    [Planet.Earth]: 'Earth',
};

describe(getObjectTypedKeys.name, ({it}) => {
    it('gets basic object keys', () => {
        assert.deepStrictEqual(getObjectTypedKeys(greekNames), [
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
        ]);
    });

    it('falls back to using Object.keys', () => {
        assert.isEmpty(getObjectTypedKeys(String('')));
    });

    it('includes symbols', () => {
        const mySymbol = Symbol('derp');

        assert.deepStrictEqual(getObjectTypedKeys({[mySymbol]: 'nothing', ...greekNames}), [
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
            mySymbol,
        ]);
    });
});
