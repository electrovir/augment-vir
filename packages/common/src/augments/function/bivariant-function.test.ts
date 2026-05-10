import {describe, it} from '@augment-vir/test';
import {type BivariantFunction} from './bivariant-function.js';

describe('BivariantFunction', () => {
    it('allows assigning a narrow-parameter function to a wider-parameter function type', () => {
        const narrow: (param: {kind: 'a'}) => void = () => {};

        const wider: BivariantFunction<[{kind: 'a' | 'b'}], void> = narrow;
    });

    it('allows assigning a wider-parameter function to a narrower-parameter function type', () => {
        const wider: (param: {kind: 'a' | 'b'}) => void = () => {};

        const narrow: BivariantFunction<[{kind: 'a'}], void> = wider;
    });

    it('allows function assignments that plain arrow function types do not', () => {
        const narrow: (params: {kind: 'a'}) => void = () => {};

        // @ts-expect-error: fails without BivariantFunction
        const wider: (params: {kind: 'a' | 'b'}) => void = narrow;
        const wider2: BivariantFunction<[{kind: 'a' | 'b'}], void> = narrow;
    });
});
