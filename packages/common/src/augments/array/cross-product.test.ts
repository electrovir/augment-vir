import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {crossProduct} from './cross-product.js';

describe(crossProduct.name, () => {
    itCases(crossProduct, [
        {
            it: 'handles empty input object',
            input: {},
            expect: [],
        },
        {
            it: 'handles single key',
            input: {
                a: [
                    1,
                    2,
                    3,
                ],
            },
            expect: [
                {
                    a: 1,
                },
                {
                    a: 2,
                },
                {
                    a: 3,
                },
            ],
        },
        {
            it: 'handles two keys',
            input: {
                a: [
                    1,
                    2,
                    3,
                ],
                b: [
                    'a',
                    'b',
                    'c',
                ],
            },
            expect: [
                {
                    a: 1,
                    b: 'a',
                },
                {
                    a: 1,
                    b: 'b',
                },
                {
                    a: 1,
                    b: 'c',
                },

                {
                    a: 2,
                    b: 'a',
                },
                {
                    a: 2,
                    b: 'b',
                },
                {
                    a: 2,
                    b: 'c',
                },

                {
                    a: 3,
                    b: 'a',
                },
                {
                    a: 3,
                    b: 'b',
                },
                {
                    a: 3,
                    b: 'c',
                },
            ],
        },
        {
            it: 'handles three keys with longest last',
            input: {
                a: [
                    1,
                    2,
                    3,
                ],
                b: [
                    'a',
                    'b',
                    'c',
                ],
                c: [
                    42n,
                    41n,
                    40n,
                    39n,
                ],
            },
            expect: [
                {
                    a: 1,
                    b: 'a',
                    c: 42n,
                },
                {
                    a: 1,
                    b: 'a',
                    c: 41n,
                },
                {
                    a: 1,
                    b: 'a',
                    c: 40n,
                },
                {
                    a: 1,
                    b: 'a',
                    c: 39n,
                },
                {
                    a: 1,
                    b: 'b',
                    c: 42n,
                },
                {
                    a: 1,
                    b: 'b',
                    c: 41n,
                },
                {
                    a: 1,
                    b: 'b',
                    c: 40n,
                },
                {
                    a: 1,
                    b: 'b',
                    c: 39n,
                },
                {
                    a: 1,
                    b: 'c',
                    c: 42n,
                },
                {
                    a: 1,
                    b: 'c',
                    c: 41n,
                },
                {
                    a: 1,
                    b: 'c',
                    c: 40n,
                },
                {
                    a: 1,
                    b: 'c',
                    c: 39n,
                },

                {
                    a: 2,
                    b: 'a',
                    c: 42n,
                },
                {
                    a: 2,
                    b: 'a',
                    c: 41n,
                },
                {
                    a: 2,
                    b: 'a',
                    c: 40n,
                },
                {
                    a: 2,
                    b: 'a',
                    c: 39n,
                },
                {
                    a: 2,
                    b: 'b',
                    c: 42n,
                },
                {
                    a: 2,
                    b: 'b',
                    c: 41n,
                },
                {
                    a: 2,
                    b: 'b',
                    c: 40n,
                },
                {
                    a: 2,
                    b: 'b',
                    c: 39n,
                },
                {
                    a: 2,
                    b: 'c',
                    c: 42n,
                },
                {
                    a: 2,
                    b: 'c',
                    c: 41n,
                },
                {
                    a: 2,
                    b: 'c',
                    c: 40n,
                },
                {
                    a: 2,
                    b: 'c',
                    c: 39n,
                },

                {
                    a: 3,
                    b: 'a',
                    c: 42n,
                },
                {
                    a: 3,
                    b: 'a',
                    c: 41n,
                },
                {
                    a: 3,
                    b: 'a',
                    c: 40n,
                },
                {
                    a: 3,
                    b: 'a',
                    c: 39n,
                },
                {
                    a: 3,
                    b: 'b',
                    c: 42n,
                },
                {
                    a: 3,
                    b: 'b',
                    c: 41n,
                },
                {
                    a: 3,
                    b: 'b',
                    c: 40n,
                },
                {
                    a: 3,
                    b: 'b',
                    c: 39n,
                },
                {
                    a: 3,
                    b: 'c',
                    c: 42n,
                },
                {
                    a: 3,
                    b: 'c',
                    c: 41n,
                },
                {
                    a: 3,
                    b: 'c',
                    c: 40n,
                },
                {
                    a: 3,
                    b: 'c',
                    c: 39n,
                },
            ],
        },
        {
            it: 'handles three keys with longest first',
            input: {
                c: [
                    42n,
                    41n,
                    40n,
                    39n,
                ],
                a: [
                    1,
                    2,
                    3,
                ],
                b: [
                    'a',
                    'b',
                    'c',
                ],
            },
            expect: [
                {
                    c: 42n,
                    a: 1,
                    b: 'a',
                },
                {
                    c: 42n,
                    a: 1,
                    b: 'b',
                },
                {
                    c: 42n,
                    a: 1,
                    b: 'c',
                },
                {
                    c: 42n,
                    a: 2,
                    b: 'a',
                },
                {
                    c: 42n,
                    a: 2,
                    b: 'b',
                },
                {
                    c: 42n,
                    a: 2,
                    b: 'c',
                },
                {
                    c: 42n,
                    a: 3,
                    b: 'a',
                },
                {
                    c: 42n,
                    a: 3,
                    b: 'b',
                },
                {
                    c: 42n,
                    a: 3,
                    b: 'c',
                },

                {
                    c: 41n,
                    a: 1,
                    b: 'a',
                },
                {
                    c: 41n,
                    a: 1,
                    b: 'b',
                },
                {
                    c: 41n,
                    a: 1,
                    b: 'c',
                },
                {
                    c: 41n,
                    a: 2,
                    b: 'a',
                },
                {
                    c: 41n,
                    a: 2,
                    b: 'b',
                },
                {
                    c: 41n,
                    a: 2,
                    b: 'c',
                },
                {
                    c: 41n,
                    a: 3,
                    b: 'a',
                },
                {
                    c: 41n,
                    a: 3,
                    b: 'b',
                },
                {
                    c: 41n,
                    a: 3,
                    b: 'c',
                },

                {
                    c: 40n,
                    a: 1,
                    b: 'a',
                },
                {
                    c: 40n,
                    a: 1,
                    b: 'b',
                },
                {
                    c: 40n,
                    a: 1,
                    b: 'c',
                },
                {
                    c: 40n,
                    a: 2,
                    b: 'a',
                },
                {
                    c: 40n,
                    a: 2,
                    b: 'b',
                },
                {
                    c: 40n,
                    a: 2,
                    b: 'c',
                },
                {
                    c: 40n,
                    a: 3,
                    b: 'a',
                },
                {
                    c: 40n,
                    a: 3,
                    b: 'b',
                },
                {
                    c: 40n,
                    a: 3,
                    b: 'c',
                },

                {
                    c: 39n,
                    a: 1,
                    b: 'a',
                },
                {
                    c: 39n,
                    a: 1,
                    b: 'b',
                },
                {
                    c: 39n,
                    a: 1,
                    b: 'c',
                },
                {
                    c: 39n,
                    a: 2,
                    b: 'a',
                },
                {
                    c: 39n,
                    a: 2,
                    b: 'b',
                },
                {
                    c: 39n,
                    a: 2,
                    b: 'c',
                },
                {
                    c: 39n,
                    a: 3,
                    b: 'a',
                },
                {
                    c: 39n,
                    a: 3,
                    b: 'b',
                },
                {
                    c: 39n,
                    a: 3,
                    b: 'c',
                },
            ],
        },
        {
            it: 'handles empty key last',
            input: {
                a: [1],
                b: [],
            },
            expect: [
                {
                    a: 1,
                },
            ],
        },
        {
            it: 'handles empty key first',
            input: {
                a: [],
                b: [1],
            },
            expect: [
                {
                    b: 1,
                },
            ],
        },
    ]);

    it('has proper types', () => {
        const result = crossProduct({
            a: [
                1,
                2,
            ],
            b: [
                'x',
                'y',
            ],
        });
        assert.tsType(result).equals<Readonly<{a: 1 | 2; b: 'x' | 'y'}>[]>();
        assert.isLengthExactly(result, 4);
    });
});
