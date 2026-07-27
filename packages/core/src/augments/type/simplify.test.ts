import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type Simplify} from './simplify.js';

type PositionProperties = {
    top: number;
    left: number;
};
type SizeProperties = {
    width: number;
    height: number;
};

describe('Simplify', () => {
    it('flattens an intersection into a single object type', () => {
        assert.tsType<Simplify<PositionProperties & SizeProperties>>().equals<{
            top: number;
            left: number;
            width: number;
            height: number;
        }>();
    });

    it('transforms an interface into an assignable type', () => {
        interface SomeInterface {
            foo: number;
            bar?: string;
            baz: number | undefined;
        }

        const valueAsLiteral = {
            foo: 123,
            bar: 'hello',
            baz: 456,
        };
        const valueAsSimplifiedInterface: Simplify<SomeInterface> = valueAsLiteral;

        /** A sealed literal and the simplified interface are assignable to an index signature. */
        assert.tsType(valueAsLiteral).matches<Record<string, unknown>>();
        assert.tsType(valueAsSimplifiedInterface).matches<Record<string, unknown>>();
        /** The raw interface is _not_ assignable, since it can be re-opened. */
        assert.tsType<SomeInterface>().notMatches<Record<string, unknown>>();
    });

    it('preserves the properties of the original type', () => {
        assert.tsType<Simplify<SomeInterfaceAsType>>().equals<SomeInterfaceAsType>();
    });
});

type SomeInterfaceAsType = {
    foo: number;
    bar?: string;
    baz: number | undefined;
};
