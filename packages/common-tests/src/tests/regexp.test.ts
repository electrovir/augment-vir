import {itCases} from '@augment-vir/chai';
import {expect} from 'chai';
import {describe, it} from 'mocha';
import {addRegExpFlags, deDupeRegExFlags} from '../../../common/src';
import {safeMatch} from '../../../common/src/augments/regexp';

describe(deDupeRegExFlags.name, () => {
    it('deDupes consecutive flags', () => {
        expect(deDupeRegExFlags('iIiIgGgG')).to.equal('ig');
    });
    it('deDupes nonconsecutive flags', () => {
        expect(deDupeRegExFlags('igIgI')).to.equal('ig');
    });
});

describe(addRegExpFlags.name, () => {
    it('adds flags to a RegExp', () => {
        expect(addRegExpFlags(/nothing to see here/, 'i').flags).to.equal('i');
    });
    it('does not duplicate flags', () => {
        expect(addRegExpFlags(/nothing to see here/i, 'i').flags).to.equal('i');
    });
    it('preserves original flags', () => {
        expect(addRegExpFlags(/nothing to see here/g, 'i').flags).to.equal('gi');
    });
});

describe(safeMatch.name, () => {
    itCases(safeMatch, [
        {
            it: 'should match a regexp',
            inputs: [
                'derp derp',
                /erp/g,
            ],
            expect: [
                'erp',
                'erp',
            ],
        },
        {
            it: 'should return empty array when there is no match',
            inputs: [
                'derp derp',
                /la la la/,
            ],
            expect: [],
        },
    ]);
});
