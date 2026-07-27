/* eslint-disable @typescript-eslint/no-empty-object-type -- `{}` is the "no options specified" input under test. */
import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type ApplyDefaultOptions} from './apply-default-options.js';

type Options = {
    first?: boolean;
    second?: number;
};

type Defaults = {
    first: false;
    second: 0;
};

/** `ApplyDefaultOptions` only sees an explicitly-`undefined` option if the option allows it. */
type OptionsAllowingUndefined = {
    first?: boolean | undefined;
    second?: number | undefined;
};

describe('ApplyDefaultOptions', () => {
    it('fills in every default when nothing is specified', () => {
        assert.tsType<ApplyDefaultOptions<Options, Defaults, {}>>().equals<{
            first: false;
            second: 0;
        }>();
    });

    it('keeps specified options and defaults the rest', () => {
        assert.tsType<ApplyDefaultOptions<Options, Defaults, {first: true}>>().equals<{
            first: true;
            second: 0;
        }>();
    });

    it('keeps every specified option', () => {
        assert.tsType<ApplyDefaultOptions<Options, Defaults, {first: true; second: 5}>>().equals<{
            first: true;
            second: 5;
        }>();
    });

    it('falls back to the default when an option is explicitly undefined', () => {
        assert
            .tsType<ApplyDefaultOptions<OptionsAllowingUndefined, Defaults, {first: undefined}>>()
            .equals<{
                first: false;
                second: 0;
            }>();
    });

    it('uses the defaults for any and never', () => {
        assert.tsType<ApplyDefaultOptions<Options, Defaults, any>>().equals<Defaults>();
        assert.tsType<ApplyDefaultOptions<Options, Defaults, never>>().equals<Defaults>();
    });

    it('always produces a fully required options object', () => {
        assert
            .tsType<ApplyDefaultOptions<Options, Defaults, {first: true}>>()
            .matches<Required<Options>>();
    });
});
