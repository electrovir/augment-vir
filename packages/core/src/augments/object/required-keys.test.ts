import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {
    type CompleteRequire,
    type RequiredAndNotNull,
    type RequiredKeysOf,
    type SetRequiredAndNotNull,
} from './required-keys.js';

describe('CompleteRequire', () => {
    it('requires an indexed key', () => {
        assert.tsType<CompleteRequire<Partial<Record<any, string>>>['hi']>().equals<string>();
    });
    it('preserved key/value pairs', () => {
        type ExampleType = {a: string; b: number; c: RegExp};
        assert.tsType<CompleteRequire<Partial<ExampleType>>>().equals<ExampleType>();
    });
});

describe('SetRequiredAndNotNull', () => {
    const allDefined: CompleteRequire<Partial<Record<'hello' | 'yes', string>>> = {
        hello: 'there',
        yes: 'I would like one',
    };

    it('has proper types', () => {
        const missingStuff: Partial<typeof allDefined> = {};
        const yesDefined: SetRequiredAndNotNull<typeof missingStuff, 'yes'> = {
            ...missingStuff,
            yes: 'yo',
        };
        // @ts-expect-error: missing surely defined 'yes' key
        const yesNotDefined: SetRequiredAndNotNull<typeof missingStuff, 'yes'> = {
            ...missingStuff,
        };
    });
});

describe('RequiredAndNotNull', () => {
    it('has proper types', () => {
        const allDefined: RequiredAndNotNull<Partial<Record<'hello' | 'yes', string>>> = {
            hello: 'there',
            yes: 'I would like one',
        };

        const oneNotDefined: RequiredAndNotNull<
            Partial<Record<'hello' | 'yes', string | undefined>>
        > = {
            hello: 'there',
            // @ts-expect-error: missing defined 'yes' key
            yes: undefined,
        };
    });
});

describe('RequiredKeysOf', () => {
    it('extracts required keys', () => {
        assert.tsType<RequiredKeysOf<{a: string; b?: boolean}>>().equals<'a'>();
        assert.tsType<RequiredKeysOf<{a?: string; b?: boolean}>>().equals<never>();
        assert.tsType<RequiredKeysOf<{a: string; b: boolean}>>().equals<'a' | 'b'>();
    });

    it('handles readonly and mixed keys', () => {
        assert
            .tsType<
                RequiredKeysOf<{readonly a: string; readonly b?: number; c: boolean; d?: string}>
            >()
            .equals<'a' | 'c'>();
    });

    it('is assignable to keyof but not vice versa', () => {
        assert
            .tsType<RequiredKeysOf<{a?: string; b: number}>>()
            .matches<keyof {a?: string; b: number}>();
        assert.tsType<RequiredKeysOf<{a?: string; b: number}>>().matches<PropertyKey>();
        assert
            .tsType<keyof {a?: string; b: number}>()
            .notMatches<RequiredKeysOf<{a?: string; b: number}>>();
    });
});
