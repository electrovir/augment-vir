import {describe, it, itCases} from '@augment-vir/test';
import {match} from './match.js';
import {assert} from '@augment-vir/assert';

describe(match.name, () => {
    itCases(match, [
        {
            it: 'uses case insensitivity',
            inputs: [
                'BeEg',
                'eg',
            ],
            expect: true,
        },
        {
            it: 'matches a string',
            inputs: [
                'this is it',
                'it',
            ],
            expect: true,
        },
        {
            it: 'mismatches',
            inputs: [
                'this is it',
                'not',
            ],
            expect: false,
        },
        {
            it: 'ignores an empty needle',
            inputs: [
                'this is it',
                '',
            ],
            expect: false,
        },
        {
            it: 'matches a RegExp',
            inputs: [
                'this is it',
                /.is./,
            ],
            expect: true,
        },
        {
            it: 'forces RegExp case insensitivity',
            inputs: [
                'this is it',
                /.IS./,
            ],
            expect: true,
        },
    ]);
    
    it('normally wouldn\'t match', () => {
        assert.isFalsy(/.IS./.exec('this is it'))
    });
});
