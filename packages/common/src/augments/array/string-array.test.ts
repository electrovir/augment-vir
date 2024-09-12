import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {trimArrayStrings} from './string-array.js';

describe(trimArrayStrings.name, () => {
    it('white space is removed', () => {
        assert.deepEquals(
            trimArrayStrings(
                `
                    who is this
                    what do you want
                    hello there
                    
                    
                `.split('\n'),
            ),
            [
                'who is this',
                'what do you want',
                'hello there',
            ],
        );
    });
});
