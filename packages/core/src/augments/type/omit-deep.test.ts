import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type OmitDeep, type Paths} from './omit-deep.js';

type Post = {
    id: number;
    author: {
        id: number;
        name: {
            first: string;
            last: string;
        };
    };
};

describe('Paths', () => {
    it('includes every intermediate and leaf path', () => {
        assert
            .tsType<Paths<Post>>()
            .equals<
                | 'id'
                | 'author'
                | 'author.id'
                | 'author.name'
                | 'author.name.first'
                | 'author.name.last'
            >();
    });

    it('recurses into arrays and tuples', () => {
        assert
            .tsType<Paths<{listA: string[]; listB: [{filename: string}]}>>()
            .equals<'listA' | 'listB' | `listA.${number}` | 'listB.0' | 'listB.0.filename'>();
    });

    it('restricts to leaves when leavesOnly is set', () => {
        assert
            .tsType<Paths<Post, {leavesOnly: true}>>()
            .equals<'id' | 'author.id' | 'author.name.first' | 'author.name.last'>();
    });

    it('restricts to a single depth when depth is set', () => {
        assert.tsType<Paths<Post, {depth: 0}>>().equals<'id' | 'author'>();
        assert.tsType<Paths<Post, {depth: 1}>>().equals<'author.id' | 'author.name'>();
    });

    it('stops recursing past maxRecursionDepth', () => {
        assert.tsType<Paths<Post, {maxRecursionDepth: 0}>>().equals<'id' | 'author'>();
    });

    it('uses bracket notation for numeric keys when requested', () => {
        assert
            .tsType<Paths<{array: ['foo']}, {bracketNotation: true}>>()
            .equals<'array' | 'array[0]'>();
    });

    it('resolves to never for non-recursive types', () => {
        assert.tsType<Paths<string>>().equals<never>();
        assert.tsType<Paths<never>>().equals<never>();
    });
});

describe('OmitDeep', () => {
    it('omits a top-level key', () => {
        assert.tsType<OmitDeep<{a: number; b: string}, 'a'>>().equals<{b: string}>();
    });

    it('omits a deeply-nested key', () => {
        assert.tsType<OmitDeep<{a: {b: number; c: string}}, 'a.b'>>().equals<{a: {c: string}}>();
    });

    it('omits multiple paths at once', () => {
        assert
            .tsType<OmitDeep<{a: {b: number; c: string}; d: boolean}, 'a.b' | 'd'>>()
            .equals<{a: {c: string}}>();
    });

    it('omits a key from every element of an array via a numeric index', () => {
        assert
            .tsType<OmitDeep<{items: Array<{id: number; name: string}>}, `items.${number}.name`>>()
            .equals<{items: Array<{id: number}>}>();
    });

    it('leaves the type unchanged when the path does not exist', () => {
        assert.tsType<OmitDeep<{a: {b: number}}, 'a.z'>>().equals<{a: {b: number}}>();
    });
});
