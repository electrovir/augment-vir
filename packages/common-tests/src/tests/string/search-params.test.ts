import {itCases} from '@augment-vir/chai';
import {
    mapObjectValues,
    objectToSearchParamsString,
    urlToSearchParamsObject,
} from '@augment-vir/common';
import {assertTypeOf} from 'run-time-assertions';

describe(objectToSearchParamsString.name, () => {
    itCases(objectToSearchParamsString, [
        {
            it: 'returns an empty string for an empty object',
            input: {},
            expect: '',
        },
        {
            it: 'converts an object into a search params string',
            input: {
                a: 'five',
                b: 'four',
            },
            expect: '?a=five&b=four',
        },
        {
            it: 'does not encode values',
            input: {a: 'what,five'},
            expect: '?a=what,five',
        },
        {
            it: 'filters out nullish values',
            input: {
                a: undefined,
                b: 'four',
                c: null,
                d: 'five',
            },
            expect: '?b=four&d=five',
        },
        {
            it: 'converts non-string primitives to strings',
            input: {
                a: 'string',
                b: 42,
                c: true,
                d: 52n,
            },
            expect: '?a=string&b=42&c=true&d=52',
        },
    ]);
});

describe(urlToSearchParamsObject.name, () => {
    const exampleUrl = 'https://example.com?a=what&b=five&who=you';
    const exampleUrlSearchParamsObject = {
        a: 'what',
        b: 'five',
        who: 'you',
    } as const;

    it('should propagate the generic type properly', () => {
        assertTypeOf(urlToSearchParamsObject(exampleUrl)).toEqualTypeOf<Record<string, string>>();

        const searchParamsObjectShape = mapObjectValues(exampleUrlSearchParamsObject, () => '');

        assertTypeOf(urlToSearchParamsObject(exampleUrl, searchParamsObjectShape)).toEqualTypeOf<
            typeof searchParamsObjectShape
        >();
    });

    itCases(urlToSearchParamsObject, [
        {
            it: 'should extract an empty object if no search params are included',
            inputs: ['https://example.com'],
            expect: {},
        },
        {
            it: 'does not decode anything',
            inputs: ['http://example.com/page?filters=Content.Type-0,1,2&sort=Number.%230'],
            expect: {
                filters: 'Content.Type-0,1,2',
                sort: 'Number.%230',
            },
        },
        {
            it: 'works with commas in the values',
            inputs: ['https://example.com?a=what,five'],
            expect: {a: 'what,five'},
        },
        {
            it: 'should extract all params',
            inputs: [exampleUrl],
            expect: exampleUrlSearchParamsObject,
        },
        {
            it: 'should extract all params from a URL',
            inputs: [new URL(exampleUrl)],
            expect: exampleUrlSearchParamsObject,
        },
        {
            it: 'should fail if the verification fails',
            inputs: [
                exampleUrl,
                {
                    q: '',
                },
            ],
            throws: 'Test object has extra keys',
        },
    ]);
});
