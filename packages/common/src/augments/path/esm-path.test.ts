import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {getEsmPath} from './esm-path.js';

describe(getEsmPath.name, () => {
    it('gets the esm file and dir paths', () => {
        const result = getEsmPath(import.meta);

        assert.endsWith(result.filePath, 'augments/file/esm-path.test.ts');
        assert.endsWith(result.dirPath, 'augments/file');
    });
});
