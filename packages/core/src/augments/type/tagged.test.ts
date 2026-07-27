import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type Tagged} from './tagged.js';

type AccountNumber = Tagged<number, 'AccountNumber'>;
type UserId = Tagged<string, 'UserId'>;
type PostId = Tagged<string, 'PostId'>;

describe('Tagged', () => {
    it('is assignable to its underlying type', () => {
        assert.tsType<AccountNumber>().matches<number>();
        assert.tsType<UserId>().matches<string>();
    });

    it('is not assignable from its underlying type', () => {
        assert.tsType<number>().notMatches<AccountNumber>();
        assert.tsType<string>().notMatches<UserId>();
    });

    it('produces distinct types for different tag names on the same base', () => {
        assert.tsType<UserId>().notEquals<PostId>();
        assert.tsType<UserId>().notMatches<PostId>();
    });

    it('supports per-tag metadata', () => {
        assert
            .tsType<Tagged<string, 'Currency', 'USD'>>()
            .notEquals<Tagged<string, 'Currency', 'EUR'>>();
    });
});
