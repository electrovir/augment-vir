import {describe, itCases} from '@augment-vir/test';
import {removeDuplicateCharacters} from './remove-duplicate-characters.js';

describe(removeDuplicateCharacters.name, () => {
    itCases(removeDuplicateCharacters, [
        {
            it: 'removes from multiple inputs',
            inputs: [
                'aAaBc',
                'QrsAa',
            ],
            expect: 'aABcQrs',
        },
    ]);
});
