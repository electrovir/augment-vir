import {assert, describe} from '@augment-vir/test';
import {trimArrayStrings} from './string-array.js';

describe(trimArrayStrings.name, ({it}) => {
    it('white space is removed', () => {
        assert.deepStrictEqual(
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
