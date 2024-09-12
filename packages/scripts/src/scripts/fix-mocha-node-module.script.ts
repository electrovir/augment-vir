import {existsSync} from 'node:fs';
import {mkdir, rename} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {monoRepoNodeModulesDirPath, packagePaths} from '../file-paths.js';

async function fixMochaNodeModule() {
    const monoRepoMochaDirPath = join(monoRepoNodeModulesDirPath, '@types', 'mocha');
    if (!existsSync(monoRepoMochaDirPath)) {
        console.info('node_modules/@types/mocha already installed in the correct location.');
        return;
    }

    console.info('moving node_modules/@types/mocha already into the correct location.');
    const newMochaDirPath = join(packagePaths.test, 'node_modules', '@types', 'mocha');

    await mkdir(dirname(newMochaDirPath), {recursive: true});

    await rename(monoRepoMochaDirPath, newMochaDirPath);
}

void fixMochaNodeModule();
