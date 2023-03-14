import {assertTypeOf, itCases} from '@augment-vir/browser-testing';
import {mapObjectValues} from '@augment-vir/common';
import {objectToSearchParamsString, searchParamStringToObject} from './search-params';

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

describe(searchParamStringToObject.name, () => {
    const exampleUrl = 'https://example.com?a=what&b=five&who=you';
    const exampleUrlSearchParamsObject = {
        a: 'what',
        b: 'five',
        who: 'you',
    } as const;

    it('should propagate the generic type properly', () => {
        assertTypeOf(searchParamStringToObject(exampleUrl)).toEqualTypeOf<Record<string, string>>();

        const searchParamsObjectShape = mapObjectValues(exampleUrlSearchParamsObject, () => '');

        assertTypeOf(searchParamStringToObject(exampleUrl, searchParamsObjectShape)).toEqualTypeOf<
            typeof searchParamsObjectShape
        >();
    });

    itCases(searchParamStringToObject, [
        {
            it: 'should extract an empty object if no search params are included',
            inputs: ['https://example.com'],
            expect: {},
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
