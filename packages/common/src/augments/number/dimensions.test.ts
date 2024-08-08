import {describe} from '@augment-vir/test';
import {Dimensions} from './dimensions.js';

describe('Dimensions', ({it}) => {
    it('is assignable to from expected object shape', () => {
        const testDimensions: Dimensions = {
            width: 0,
            height: Infinity,
        };
    });
});
