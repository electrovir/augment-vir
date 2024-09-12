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
            '*',
            'Web',
            'Web : Elements',
            'Node : Docker',
            'Node : Docker : Util',
            'Node : File',
            'Node : Npm',
            'Node : OS',
            'Node : Terminal',
            'Node : Terminal : Util',
            'Package : @augment-vir/common',
            'Package : @augment-vir/assert',
            'Package : @augment-vir/test',
            'Package : @augment-vir/web',
            'Package : @augment-vir/node',
        ],
        tsconfig: eslintTsconfigPath,
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
