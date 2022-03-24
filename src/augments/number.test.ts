import {clamp} from './number';

describe(clamp.name, () => {
    it('should successfully clamp downwards', () => {
        expect(
            clamp({
                max: 45,
                min: 31,
                value: 150,
            }),
        ).toBe(45);
    });

    it('should successfully clamp upwards', () => {
        expect(
            clamp({
                max: 45,
                min: 31,
                value: 13,
            }),
        ).toBe(31);
    });

    it("shouldn't change values in the middle", () => {
        expect(
            clamp({
                max: 45,
                min: 31,
                value: 42,
            }),
        ).toBe(42);
    });
});
