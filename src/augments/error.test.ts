import {extractErrorMessage} from './error';

describe(extractErrorMessage.name, () => {
    it('should extract message from error object', () => {
        expect(extractErrorMessage(new Error('hello there'))).toBe('hello there');
    });

    it('should return empty string for falsy inputs', () => {
        expect(extractErrorMessage(undefined)).toBe('');
        expect(extractErrorMessage(null)).toBe('');
        expect(extractErrorMessage(false)).toBe('');
    });

    it('should return a string for other inputs', () => {
        expect(extractErrorMessage(54621)).toBe('54621');
    });

    it('should return a string for strings', () => {
        expect(extractErrorMessage('just a string')).toBe('just a string');
    });
});
