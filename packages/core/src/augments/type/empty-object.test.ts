/* eslint-disable @typescript-eslint/no-empty-object-type -- faithful copy of type-fest, which intentionally uses the `{}` identity type. */
import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type EmptyObject, type IsEmptyObject} from './empty-object.js';

type Union = EmptyObject | {id: number};

describe('EmptyObject', () => {
    it('is assignable to the unconstrained object type', () => {
        const empty: EmptyObject = {};
        assert.tsType(empty).matches<{}>();
    });

    it('rejects non-empty values', () => {
        assert.tsType<number[]>().notMatches<EmptyObject>();
        assert.tsType<{x: number}>().notMatches<EmptyObject>();
        assert.tsType<number>().notMatches<EmptyObject>();
        assert.tsType<null>().notMatches<EmptyObject>();
    });

    it('has no assignable properties', () => {
        const empty: EmptyObject = {};
        // @ts-expect-error: EmptyObject has no `bar` property.
        empty.bar = 42;
        // @ts-expect-error: EmptyObject has no `bar` property.
        empty.bar = {};
    });

    it('works as a union member', () => {
        const emptyMember: Union = {};
        // @ts-expect-error: `id` does not exist on the EmptyObject union member.
        const emptyMemberId: unknown = emptyMember.id;
        assert.tsType<{id: number}>().matches<Union>();
    });
});

describe('IsEmptyObject', () => {
    it('detects an empty object', () => {
        assert.tsType<IsEmptyObject<{}>>().equals<true>();
        assert.tsType<IsEmptyObject<EmptyObject>>().equals<true>();
    });

    it('detects non-empty types', () => {
        assert.tsType<IsEmptyObject<[]>>().equals<false>();
        assert.tsType<IsEmptyObject<null>>().equals<false>();
        assert.tsType<IsEmptyObject<() => void>>().equals<false>();
        assert.tsType<IsEmptyObject<{id: number}>>().equals<false>();
    });
});
