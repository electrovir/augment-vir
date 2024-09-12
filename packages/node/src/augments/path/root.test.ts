import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {sep} from 'node:path';
import {toPosixPath} from './os-path.js';
import {systemRootPath} from './root.js';

describe('systemRootPath', () => {
    it('returns the system root', () => {
        if (sep === '/') {
            assert.strictEquals(toPosixPath(systemRootPath), '/');
        } else {
            assert.matches(toPosixPath(systemRootPath), /\/\w\//);
        }
    });
});
