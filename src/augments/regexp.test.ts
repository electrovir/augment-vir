import {addRegExpFlags, deDupeRegExFlags} from './regexp';

describe(deDupeRegExFlags.name, () => {
    it('deDupes consecutive flags', () => {
        expect(deDupeRegExFlags('iIiIgGgG')).toBe('ig');
    });
    it('deDupes nonconsecutive flags', () => {
        expect(deDupeRegExFlags('igIgI')).toBe('ig');
    });
});

describe(addRegExpFlags.name, () => {
    it('adds flags to a RegExp', () => {
        expect(addRegExpFlags(/nothing to see here/, 'i').flags).toBe('i');
    });
    it('does not duplicate flags', () => {
        expect(addRegExpFlags(/nothing to see here/i, 'i').flags).toBe('i');
    });
    it('preserves original flags', () => {
        expect(addRegExpFlags(/nothing to see here/g, 'i').flags).toBe('gi');
    });
});
