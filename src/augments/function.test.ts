import {isTruthy} from './function';

describe(isTruthy.name, () => {
    it('should return true for various truthy things', () => {
        const stuffToTest: any[] = [
            'stuff',
            5,
            [],
            {},
        ];

        expect(stuffToTest.every(isTruthy)).toBe(true);
    });

    it('should filter out null types', () => {
        const stuffToTest: (string | undefined)[] = [
            'stuff',
            undefined,
            'derp',
        ];

        const onlyStrings: string[] = stuffToTest.filter(isTruthy);

        expect(onlyStrings).toEqual([
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

        expect(stuffToTest.some(isTruthy)).toBe(false);
    });
});
