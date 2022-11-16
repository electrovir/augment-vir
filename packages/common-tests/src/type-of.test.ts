import {isTypeOfWithArray} from '@augment-vir/common';
import {describe, it} from 'mocha';
import {Equal, ExpectTrue} from '../../common/src/augments/type-test';

describe(isTypeOfWithArray.name, () => {
    it('should properly type guard', () => {
        const possiblyNumber = 42 as number | number[];

        if (isTypeOfWithArray(possiblyNumber, 'array')) {
            type ShouldBeNarrowed = ExpectTrue<Equal<typeof possiblyNumber, number[]>>;
        }

        const anything = {} as any;

        if (isTypeOfWithArray(anything, 'bigint')) {
            type ShouldBeNarrowed = ExpectTrue<Equal<typeof anything, bigint>>;
        }
    });
});
