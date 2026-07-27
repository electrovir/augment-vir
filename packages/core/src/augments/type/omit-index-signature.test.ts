import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type OmitIndexSignature} from './omit-index-signature.js';

type ExampleInterface = {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
    [x: `head-${string}`]: string;
    [x: `${string}-tail`]: string;
    [x: `head-${string}-tail`]: string;
    [x: `${bigint}`]: string;
    [x: `embedded-${number}`]: string;

    foo: 'bar';
    qux?: 'baz';
};

type MappedType<ObjectType> = {
    [Key in keyof ObjectType]: {
        key: Key;
        value: Exclude<ObjectType[Key], undefined>;
    };
};

describe('OmitIndexSignature', () => {
    it('removes index signatures, leaving explicitly defined keys', () => {
        assert.tsType<OmitIndexSignature<ExampleInterface>>().equals<{
            foo: 'bar';
            qux?: 'baz';
        }>();
    });

    it('preserves explicit keys through a mapped type', () => {
        assert.tsType<OmitIndexSignature<MappedType<ExampleInterface>>>().equals<{
            foo: {key: 'foo'; value: 'bar'};
            qux?: {key: 'qux'; value: 'baz'};
        }>();
    });
});
