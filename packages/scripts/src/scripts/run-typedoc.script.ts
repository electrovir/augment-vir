import {runTypedoc} from '@virmator/docs';
import {baseTypedocConfig} from '@virmator/docs/configs/typedoc.config.base.js';
import {join} from 'node:path';
import {type PartialDeep} from 'type-fest';
import {type GlobString, type NormalizedPath, type TypeDocOptionMap} from 'typedoc';
import {eslintTsconfigPath, monoRepoDirPath, packagePaths} from '../file-paths.js';

async function main() {
    const typeDocConfig: PartialDeep<TypeDocOptionMap> = {
        ...baseTypedocConfig,
        out: join(monoRepoDirPath, 'dist-docs') as NormalizedPath,
        entryPoints: [
            join(packagePaths.scripts, 'src', 'typedoc-entry-point.ts') as GlobString,
        ],
        intentionallyNotExported: [],
        defaultCategory: 'MISSING CATEGORY',
        categoryOrder: [
            '*',
            'Web',
            'Web : Elements',
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
        tsconfig: eslintTsconfigPath as NormalizedPath,
        blockTags: [
            /** The default tags we use. */
            '@category',
            '@default',
            '@deprecated',
            '@example',
            '@param',
            '@returns',
            '@see',
            '@template',
            '@throws',

            /** Custom tags we've added. */
            '@package',
        ],
        name: 'augment-vir',
        readme: join(monoRepoDirPath, 'README.md'),
    };

    await runTypedoc({
        config: typeDocConfig,
        checkOnly: false,
        packageDir: monoRepoDirPath,
    });
}

await main();
