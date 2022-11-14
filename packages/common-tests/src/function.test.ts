import {isTruthy} from '@augment-vir/common';
import {expect} from 'chai';
import {describe, it} from 'mocha';

describe(isTruthy.name, () => {
    it('should return true for various truthy things', () => {
        const stuffToTest: any[] = [
            'stuff',
            5,
            [],
            {},
        ];

        expect(stuffToTest.every(isTruthy)).to.equal(true);
    });

    it('should filter out null types', () => {
        const stuffToTest: (string | undefined)[] = [
            'stuff',
            undefined,
            'derp',
        ];

        const onlyStrings: string[] = stuffToTest.filter(isTruthy);

        expect(onlyStrings).to.deep.equal([
            'stuff',
            'derp',
        ]);
    });

    it('should fail on falsy things', () => {
        const stuffToTest: any[] = [
            undefined,
            false,
            0,
            '',
            null,
            NaN,
        ];

        expect(stuffToTest.some(isTruthy)).to.equal(false);
    });
});
