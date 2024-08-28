import {runTypedoc} from '@virmator/docs';
import {baseTypedocConfig} from '@virmator/docs/configs/typedoc.config.base';
import {join} from 'node:path';
import {type TypeDocOptions} from 'typedoc';
import {eslintTsconfigPath, monoRepoDirPath, packagePaths} from '../file-paths.js';

async function main() {
    const checkOnly = process.argv.includes('check');

    const typeDocConfig: Partial<TypeDocOptions> = {
        ...baseTypedocConfig,
        out: join(monoRepoDirPath, 'dist-docs'),
        entryPoints: [
            join(packagePaths.scripts, 'src', 'typedoc-entry-point.ts'),
        ],
        intentionallyNotExported: [],
        defaultCategory: 'MISSING CATEGORY',
        categoryOrder: [
            'Main',
            'Internal',
        ],
        tsconfig: eslintTsconfigPath,
        requiredToBeDocumented: [],
        blockTags: [
            /** The default tags we use. */
            '@category',
            '@default',
            '@example',
            '@param',
            '@returns',
            '@template',
            '@throws',
            '@see',

            /** Custom tags we've added. */
            '@package',
        ],
        name: 'augment-vir',
        readme: join(monoRepoDirPath, 'README.md'),
    };

    await runTypedoc({
        config: typeDocConfig,
        checkOnly,
        packageDir: monoRepoDirPath,
    });
}

await main();
