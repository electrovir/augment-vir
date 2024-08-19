import {check} from '@augment-vir/assert';
import {join} from 'node:path';
import {PackageJson} from 'type-fest';
import {readJsonFile} from '../fs/json.js';

export async function readPackageJson(dirPath: string): Promise<PackageJson> {
    const packageJsonPath = join(dirPath, 'package.json');
    const packageJson = (await readJsonFile(packageJsonPath)) as PackageJson | undefined;

    if (!packageJson) {
        throw new TypeError(`package.json file does not exist in '${dirPath}'`);
    }

    if (!check.isObject(packageJson)) {
        throw new TypeError(`Parsing package.json file did not return an object in '${dirPath}'`);
    }

    return packageJson;
}
