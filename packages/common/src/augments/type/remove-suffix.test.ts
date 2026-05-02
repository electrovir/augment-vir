import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type RemoveSuffix} from './remove-suffix.js';

describe('RemoveSuffix', () => {
    it('removes a matching single suffix', () => {
        assert
            .tsType<RemoveSuffix<'vira-red-foreground-body', ['body']>>()
            .equals<'vira-red-foreground'>();
    });

    it('returns the original when no suffix matches', () => {
        assert
            .tsType<
                RemoveSuffix<
                    'vira-red-foreground',
                    [
                        'body',
                        'header',
                    ]
                >
            >()
            .equals<'vira-red-foreground'>();
    });

    it('matches the first suffix in the array', () => {
        assert
            .tsType<
                RemoveSuffix<
                    'vira-red-foreground-body',
                    [
                        'body',
                        'header',
                    ]
                >
            >()
            .equals<'vira-red-foreground'>();
    });

    it('matches a later suffix when earlier ones do not match', () => {
        assert
            .tsType<
                RemoveSuffix<
                    'vira-red-foreground-header',
                    [
                        'body',
                        'header',
                    ]
                >
            >()
            .equals<'vira-red-foreground'>();
    });

    it('prefers compound suffix over simple suffix when listed first', () => {
        assert
            .tsType<
                RemoveSuffix<
                    'vira-red-foreground-small-body',
                    [
                        'small-body',
                        'body',
                    ]
                >
            >()
            .equals<'vira-red-foreground'>();
    });

    it('matches simple suffix when compound suffix is listed later', () => {
        assert
            .tsType<
                RemoveSuffix<
                    'vira-red-foreground-small-body',
                    [
                        'body',
                        'small-body',
                    ]
                >
            >()
            .equals<'vira-red-foreground-small'>();
    });

    it('returns the original with an empty suffixes array', () => {
        assert.tsType<RemoveSuffix<'vira-red-foreground', []>>().equals<'vira-red-foreground'>();
    });

    it('works with a union of originals', () => {
        assert
            .tsType<
                RemoveSuffix<
                    'vira-red-foreground-body' | 'vira-red-foreground-header',
                    [
                        'body',
                        'header',
                    ]
                >
            >()
            .equals<'vira-red-foreground'>();
    });

    it('can be applied twice like in real usage', () => {
        type FirstPass = RemoveSuffix<
            'vira-red-foreground-small-body',
            [
                'small-body',
                'body',
            ]
        >;
        type SecondPass = RemoveSuffix<FirstPass, ['-']>;

        assert.tsType<FirstPass>().equals<'vira-red-foreground'>();
        assert.tsType<SecondPass>().equals<'vira-red-foreground'>();
    });

    it('strips trailing double-dash with a dash-only suffix', () => {
        type Result = RemoveSuffix<'vira-red-on-self--', ['-']>;

        assert.tsType<Result>().equals<'vira-red-on-self'>();
    });

    it('does not strip a single trailing dash with a dash-only suffix', () => {
        type Result = RemoveSuffix<'vira-red-on-self-', ['-']>;

        assert.tsType<Result>().equals<'vira-red-on-self-'>();
    });
});
