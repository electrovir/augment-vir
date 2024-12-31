import {existsSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {parseJsonConfigFileContent, readConfigFile, sys} from 'typescript';
import {findAncestor} from '../path/ancestor.js';

/**
 * Finds the closest `tsconfig.json` file and parses it.
 *
 * @category Path : Node
 * @category Package : @augment-vir/node
 * @returns `undefined` if no tsconfig was found or if a found tsconfig fails to parse.
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export function readTsconfig(startingPath: string) {
    const tsconfigDirPath = findAncestor(startingPath, (ancestorPath) =>
        existsSync(join(ancestorPath, 'tsconfig.json')),
    );
    const tsconfigPath = tsconfigDirPath ? join(tsconfigDirPath, 'tsconfig.json') : undefined;

    if (!tsconfigPath) {
        return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const {config, error} = readConfigFile(tsconfigPath, sys.readFile);

    if (error) {
        return undefined;
    }

    const parsedConfig = parseJsonConfigFileContent(config, sys, dirname(tsconfigPath));

    if (parsedConfig.errors.length) {
        return undefined;
    }

    return {
        tsconfig: parsedConfig,
        path: tsconfigPath,
    };
}
