import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type DistributedOmit} from './distributed-omit.js';

type A = {
    type: 'a';
    shared: string;
    onlyA: number;
};
type B = {
    type: 'b';
    shared: string;
    onlyB: boolean;
};

describe('DistributedOmit', () => {
    it('omits a key from a non-union type', () => {
        assert.tsType<DistributedOmit<A, 'shared'>>().equals<{type: 'a'; onlyA: number}>();
    });

    it('distributes over union members, retaining member-specific keys', () => {
        assert
            .tsType<DistributedOmit<A | B, 'shared'>>()
            .equals<{type: 'a'; onlyA: number} | {type: 'b'; onlyB: boolean}>();
    });

    it('omits a shared key from every member', () => {
        assert
            .tsType<'shared' extends keyof DistributedOmit<A | B, 'shared'> ? true : false>()
            .equals<false>();
    });

    it('preserves the discriminant when omitting other keys', () => {
        assert
            .tsType<DistributedOmit<A | B, 'onlyA' | 'onlyB'>>()
            .equals<{type: 'a'; shared: string} | {type: 'b'; shared: string}>();
    });
});
