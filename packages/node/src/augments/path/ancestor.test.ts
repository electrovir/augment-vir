import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {join} from 'node:path';
import {joinFilesToDir} from './ancestor.js';

describe(joinFilesToDir.name, () => {
    it('works', () => {
        assert.deepEquals(
            joinFilesToDir(join('a', 'b'), [
                'c',
                'd',
                'e',
                'f',
            ]),
            [
                join('a', 'b', 'c'),
                join('a', 'b', 'd'),
                join('a', 'b', 'e'),
                join('a', 'b', 'f'),
            ],
        );
    });
});
