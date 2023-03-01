import {isRuntimeTypeOf} from '@augment-vir/common';
import {join} from 'path';
import {PackageJson} from 'type-fest';
import {readJson} from '../node-js-json';

export async function readPackageJson(dirPath: string): Promise<PackageJson> {
    const packageJsonPath = join(dirPath, 'package.json');
    const packageJson = await readJson<PackageJson>(packageJsonPath);

    if (!packageJson) {
        throw new Error(`package.json file does not exist in '${dirPath}'`);
    }

    if (!isRuntimeTypeOf(packageJson, 'object')) {
        throw new Error(`Parsing package.json file did not return an object in '${dirPath}'`);
    }

    return packageJson;
}
