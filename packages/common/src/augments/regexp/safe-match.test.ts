import {describe} from '@augment-vir/test';
import {safeMatch} from './safe-match.js';

describe(safeMatch.name, ({itCases}) => {
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
