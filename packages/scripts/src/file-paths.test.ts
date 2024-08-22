import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {getAllPublicPackageDirPaths} from './file-paths.js';

describe(getAllPublicPackageDirPaths.name, () => {
    it('does not include the scripts package', async () => {
        const publicProjects = await getAllPublicPackageDirPaths();

        assert.isFalse(
            publicProjects.some((project) => project.endsWith('/scripts')),
            'a /scripts package was erroneously included',
        );
    });
});
