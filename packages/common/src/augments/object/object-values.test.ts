import {describe} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {getObjectTypedValues, ValueAtRequiredKey} from './object-values.js';

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

describe('ValueAtRequiredKey', ({it}) => {
    it('requires an indexed key', () => {
        assertTypeOf<
            ValueAtRequiredKey<Partial<Record<any, string>>, 'hi'>
        >().toEqualTypeOf<string>();
    });
});

describe(getObjectTypedValues.name, ({itCases, it}) => {
    itCases(getObjectTypedValues, [
        {
            it: 'gets basic values',
            input: greekNames,
            expect: [
                greekNames[Planet.Mercury],
                greekNames[Planet.Venus],
                greekNames[Planet.Earth],
            ],
        },
        {
            it: 'does something with non-objects',
            input: 'hello there',
            expect: [
                'h',
                'e',
                'l',
                'l',
                'o',
                ' ',
                't',
                'h',
                'e',
                'r',
                'e',
            ],
        },
    ]);

    it('handles optional properties', () => {
        const exampleObject = {} as Partial<Record<Planet, string>>;

        assertTypeOf(getObjectTypedValues(exampleObject)).toEqualTypeOf<string[]>();

        const example2 = {} as Partial<{
            [x in string]: RegExp;
        }>;

        assertTypeOf(getObjectTypedValues(example2)).toEqualTypeOf<RegExp[]>();
    });

    it('handles nullable properties', () => {
        const exampleObject = {} as Partial<Record<Planet, string | undefined>>;

        assertTypeOf(getObjectTypedValues(exampleObject)).toEqualTypeOf<(string | undefined)[]>();
    });
});
