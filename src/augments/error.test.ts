import {expect} from 'chai';
import {describe, it} from 'mocha';
import {combineErrors, extractErrorMessage} from './error';

describe(extractErrorMessage.name, () => {
    it('should extract message from error object', () => {
        expect(extractErrorMessage(new Error('hello there'))).to.equal('hello there');
    });

    it('should return empty string for falsy inputs', () => {
        expect(extractErrorMessage(undefined)).to.equal('');
        expect(extractErrorMessage(null)).to.equal('');
        expect(extractErrorMessage(false)).to.equal('');
    });

    it('should return a string for other inputs', () => {
        expect(extractErrorMessage(54621)).to.equal('54621');
    });

    it('should return a string for strings', () => {
        expect(extractErrorMessage('just a string')).to.equal('just a string');
    });

    it('should pass type tests', () => {
        function acceptOnlyError(input: Error): void {}

        // verify that an empty array results in undefined as the return type
        // @ts-expect-error
        acceptOnlyError(combineErrors([]));

        // verify that no array results in an undefined return type
        // @ts-expect-error
        acceptOnlyError(combineErrors());

        // verify that undefined results in an undefined return type
        // @ts-expect-error
        acceptOnlyError(combineErrors(undefined));

        // verify that an array with Error instances results in an Error return type
        acceptOnlyError(combineErrors([new Error()]));

        // verify that a potentially empty Error array results in an Error|undefined return type
        const potentiallyEmptyErrorArray: Error[] = [];
        // @ts-expect-error
        acceptOnlyError(combineErrors(potentiallyEmptyErrorArray));
    });
});
