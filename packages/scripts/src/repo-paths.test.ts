import {assert} from 'chai';
import {getAllPublicPackageDirPaths} from './repo-paths';

describe(getAllPublicPackageDirPaths.name, () => {
    it('does not include the scripts package', async () => {
        const publicProjects = await getAllPublicPackageDirPaths();

        assert.isFalse(
            publicProjects.some((project) => project.endsWith('/scripts')),
            'a /scripts package was erroneously included',
        );
    });
});
