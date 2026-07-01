import {describe, itCases} from '@augment-vir/test';
import {safeMatch} from './match.js';

describe(safeMatch.name, () => {
    itCases(safeMatch, [
        {
            it: 'matches a regexp',
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
            it: 'returns empty array when there is no match',
            inputs: [
                'derp derp',
                /la la la/,
            ],
            expect: [],
        },
    ]);
});
