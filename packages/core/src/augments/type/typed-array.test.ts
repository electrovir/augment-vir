import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type TypedArray} from './typed-array.js';

describe('TypedArray', () => {
    it('includes every typed array kind', () => {
        assert.tsType<Int8Array>().matches<TypedArray>();
        assert.tsType<Uint8Array>().matches<TypedArray>();
        assert.tsType<Uint8ClampedArray>().matches<TypedArray>();
        assert.tsType<Int16Array>().matches<TypedArray>();
        assert.tsType<Uint16Array>().matches<TypedArray>();
        assert.tsType<Int32Array>().matches<TypedArray>();
        assert.tsType<Uint32Array>().matches<TypedArray>();
        assert.tsType<Float32Array>().matches<TypedArray>();
        assert.tsType<Float64Array>().matches<TypedArray>();
        assert.tsType<BigInt64Array>().matches<TypedArray>();
        assert.tsType<BigUint64Array>().matches<TypedArray>();
    });

    it('matches typed array instances', () => {
        assert.tsType(new Uint8Array()).matches<TypedArray>();
        assert.tsType(new Float64Array()).matches<TypedArray>();
    });

    it('does not match non-typed-array values', () => {
        assert.tsType<number[]>().notMatches<TypedArray>();
        assert.tsType<readonly number[]>().notMatches<TypedArray>();
        assert.tsType<string>().notMatches<TypedArray>();
        assert.tsType<DataView>().notMatches<TypedArray>();
        assert.tsType<ArrayBuffer>().notMatches<TypedArray>();
    });
});
