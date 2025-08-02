import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {type FirstLetterLowercase, type FirstLetterUppercase} from './casing.js';

describe('FirstLetterLowercase', () => {
    it('works', () => {
        assert.tsType<FirstLetterLowercase<'HelloWorld'>>().equals<'helloWorld'>();
        assert.tsType<FirstLetterLowercase<'HELLO'>>().equals<'hELLO'>();
        assert.tsType<FirstLetterLowercase<'a'>>().equals<'a'>();
        assert.tsType<FirstLetterLowercase<'A'>>().equals<'a'>();
        assert.tsType<FirstLetterLowercase<''>>().equals<''>();
    });
});

describe('FirstLetterUppercase', () => {
    it('works', () => {
        assert.tsType<FirstLetterUppercase<'HelloWorld'>>().equals<'HelloWorld'>();
        assert.tsType<FirstLetterUppercase<'hELLO'>>().equals<'HELLO'>();
        assert.tsType<FirstLetterUppercase<'a'>>().equals<'A'>();
        assert.tsType<FirstLetterUppercase<'A'>>().equals<'A'>();
        assert.tsType<FirstLetterUppercase<''>>().equals<''>();
    });
});
