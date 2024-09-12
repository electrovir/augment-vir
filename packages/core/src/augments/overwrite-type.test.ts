import {describe, it} from '@augment-vir/test';
import {Overwrite} from './overwrite-type.js';

describe('Overwrite', () => {
    it('has proper types', () => {
        type thing1 = {a: string; b: number};
        const what: thing1 = {a: 'hello', b: 5};
        const who: Overwrite<thing1, {a: number}> = {...what, a: 2};
        // @ts-expect-error: what does not exist
        who.what = 'should not work';
    });
});
