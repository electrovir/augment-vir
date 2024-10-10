import {wait, type MaybePromise} from '@augment-vir/core';
import {describe, it, itCases} from '@augment-vir/test';
import {checkCustomDeepQuality} from './custom-equality.js';
import {assert} from './guards/assert.js';
import {check} from './guards/check.js';

describe(checkCustomDeepQuality.name, () => {
    itCases(checkCustomDeepQuality, [
        {
            it: 'accepts primitive equality',
            inputs: [
                'a',
                'a',
                check.strictEquals,
            ],
            expect: true,
        },
        {
            it: 'rejects primitive inequality',
            inputs: [
                'a',
                'b',
                check.strictEquals,
            ],
            expect: false,
        },
        {
            it: 'accepts object equality',
            inputs: [
                {
                    a: 'a',
                    b: 'b',
                },
                {
                    a: 'a',
                    b: 'b',
                },
                check.strictEquals,
            ],
            expect: true,
        },
        {
            it: 'rejects object key mismatch',
            inputs: [
                {
                    a: 'a',
                    b: 'b',
                },
                {
                    a: 'a',
                    b: 'b',
                    c: 'c',
                },
                check.strictEquals,
            ],
            expect: false,
        },
        {
            it: 'rejects object inequality',
            inputs: [
                {
                    a: 'a',
                    b: 'a',
                },
                {
                    a: 'a',
                    b: 'b',
                },
                check.strictEquals,
            ],
            expect: false,
        },
        {
            it: 'accepts array equality',
            inputs: [
                [
                    'a',
                    'b',
                ],
                [
                    'a',
                    'b',
                ],
                check.strictEquals,
            ],
            expect: true,
        },
        {
            it: 'rejects array inequality',
            inputs: [
                [
                    'a',
                    'a',
                ],
                [
                    'a',
                    'b',
                ],
                check.strictEquals,
            ],
            expect: false,
        },
        {
            it: 'rejects array length mismatch',
            inputs: [
                [
                    'a',
                    'a',
                ],
                [
                    'a',
                    'a',
                    'c',
                ],
                check.strictEquals,
            ],
            expect: false,
        },
        {
            it: 'passes along async errors',
            inputs: [
                [
                    'a',
                    'a',
                ],
                [
                    'a',
                    'a',
                ],
                async () => {
                    await wait({milliseconds: 0});
                    throw new Error('fake failure');
                },
            ],
            throws: {
                matchMessage: 'fake failure',
            },
        },
        {
            it: 'accepts RegExp equality',
            inputs: [
                /a/,
                /a/,
                check.strictEquals,
            ],
            expect: true,
        },
        {
            it: 'rejects RegExp inequality',
            inputs: [
                /a/,
                /b/,
                check.strictEquals,
            ],
            expect: false,
        },
        {
            it: 'accepts Map equality',
            inputs: [
                new Map([
                    [
                        'a',
                        'b',
                    ],
                    [
                        'b',
                        'c',
                    ],
                ]),
                new Map([
                    [
                        'a',
                        'b',
                    ],
                    [
                        'b',
                        'c',
                    ],
                ]),
                check.strictEquals,
            ],
            expect: true,
        },
        {
            it: 'accepts out of order Map equality',
            inputs: [
                new Map([
                    [
                        'b',
                        'c',
                    ],
                    [
                        'a',
                        'b',
                    ],
                ]),
                new Map([
                    [
                        'a',
                        'b',
                    ],
                    [
                        'b',
                        'c',
                    ],
                ]),
                check.strictEquals,
            ],
            expect: true,
        },
        {
            it: 'rejects Map inequality',
            inputs: [
                new Map([
                    [
                        'a',
                        'b',
                    ],
                    [
                        'b',
                        'c',
                    ],
                ]),
                new Map([
                    [
                        'a',
                        'b',
                    ],
                    [
                        'b',
                        'd',
                    ],
                ]),
                check.strictEquals,
            ],
            expect: false,
        },
        {
            it: 'accepts set equality',
            inputs: [
                new Set([
                    'a',
                    'b',
                    'c',
                ]),
                new Set([
                    'a',
                    'b',
                    'c',
                ]),
                check.strictEquals,
            ],
            expect: true,
        },
        {
            it: 'rejects set inequality',
            inputs: [
                new Set([
                    'a',
                    'b',
                    'c',
                ]),
                new Set([
                    'a',
                    'b',
                    'd',
                ]),
                check.strictEquals,
            ],
            expect: false,
        },
        {
            it: 'accepts async object equality',
            inputs: [
                {
                    a: 'a',
                    b: 'b',
                },
                {
                    a: 'a',
                    b: 'b',
                },
                (a, b) => Promise.resolve(check.strictEquals(a, b)),
            ],
            expect: true,
        },
        {
            it: 'rejects async object inequality',
            inputs: [
                {
                    a: 'a',
                    b: 'b',
                },
                {
                    a: 'a',
                    b: 'c',
                },
                (a, b) => Promise.resolve(check.strictEquals(a, b)),
            ],
            expect: false,
        },
    ]);

    it('handles equal circular references', () => {
        const circular1 = {hi: 'bye', nested: {}};
        circular1.nested = circular1;
        const circular2 = {hi: 'bye', nested: {}};
        circular2.nested = circular2;

        assert.isTrue(checkCustomDeepQuality(circular1, circular2, check.strictEquals));
    });
    it('handles circular arrays', () => {
        const circular1: any[] = [];
        circular1.push(circular1);

        assert.isTrue(checkCustomDeepQuality(circular1, circular1, check.strictEquals));
    });

    it('handles unequal circular references', () => {
        const circular1 = {hi: 'bye', nested: {}};
        circular1.nested = circular1;
        const circular2 = {hi: 'different', nested: {}};
        circular2.nested = circular2;

        assert.isFalse(checkCustomDeepQuality(circular1, circular2, check.strictEquals));
    });

    it('handles return types', async () => {
        const asyncResult = checkCustomDeepQuality('a', 'a', (a, b) =>
            Promise.resolve(check.strictEquals(a, b)),
        );
        assert.tsType(asyncResult).equals<Promise<boolean>>();
        await asyncResult;

        const syncResult = checkCustomDeepQuality('a', 'a', (a, b) => check.strictEquals(a, b));
        assert.tsType(syncResult).equals<boolean>();

        const maybeAsyncResult = checkCustomDeepQuality('a', 'a', (a, b) => {
            if (Math.random() > 0.5) {
                return Promise.resolve(check.strictEquals(a, b));
            } else {
                return check.strictEquals(a, b);
            }
        });
        assert.tsType(maybeAsyncResult).equals<MaybePromise<boolean>>();
        await maybeAsyncResult;
    });
});
