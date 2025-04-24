import {describe, it} from '@augment-vir/test';
import {type Dimensions} from './dimensions.js';

describe('Dimensions', () => {
    it('is assignable to from expected object shape', () => {
        const testDimensions: Dimensions = {
            width: 0,
            height: Infinity,
        };
    });
});
