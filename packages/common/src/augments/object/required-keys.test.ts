/* eslint-disable @typescript-eslint/ban-ts-comment */
import {describe} from '@augment-vir/test';
import {assertTypeOf} from 'run-time-assertions';
import {CompleteRequire, RequiredAndNotNull, SetRequiredAndNotNull} from './required-keys.js';

describe('CompleteRequire', ({it}) => {
    it('requires an indexed key', () => {
        assertTypeOf<CompleteRequire<Partial<Record<any, string>>>['hi']>().toEqualTypeOf<string>();
    });
    it('preserved key/value pairs', () => {
        type ExampleType = {a: string; b: number; c: RegExp};
        assertTypeOf<CompleteRequire<Partial<ExampleType>>>().toEqualTypeOf<ExampleType>();
    });
});

describe('SetRequiredAndNotNull', ({it}) => {
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
        // @ts-expect-error
        const yesNotDefined: SetRequiredAndNotNull<typeof missingStuff, 'yes'> = {
            ...missingStuff,
        };
    });
});

describe('RequiredAndNotNull', ({it}) => {
    it('has proper types', () => {
        const allDefined: RequiredAndNotNull<Partial<Record<'hello' | 'yes', string>>> = {
            hello: 'there',
            yes: 'I would like one',
        };

        const oneNotDefined: RequiredAndNotNull<
            Partial<Record<'hello' | 'yes', string | undefined>>
        > = {
            hello: 'there',
            // @ts-expect-error
            yes: undefined,
        };
    });
});
