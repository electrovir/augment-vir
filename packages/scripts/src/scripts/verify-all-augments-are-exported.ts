import {collapseWhiteSpace, isTruthy, safeMatch} from '@augment-vir/common';
import {readDirRecursive} from '@augment-vir/node-js';
import {existsSync} from 'fs';
import {readFile} from 'fs/promises';
import {basename, join, relative} from 'path';
import {getAllPublicPackageDirPaths} from '../repo-paths';

export async function assertAllAugmentsExported(): Promise<Error[]> {
    const publicPackageDirPaths = await getAllPublicPackageDirPaths();

    const errors = (await Promise.all(publicPackageDirPaths.map(verifyPackage))).flat();

    return errors;
}

async function verifyPackage(packageDirPath: string): Promise<Error[]> {
    const packageBaseName = basename(packageDirPath);
    const augmentsDirPath = join(packageDirPath, 'src', 'augments');
    const hasAugmentsDirectory = existsSync(augmentsDirPath);

    if (!hasAugmentsDirectory) {
        return [new Error(`package '${packageBaseName}' is public but has no augments folder`)];
    }

    const indexFilePath = join(packageDirPath, 'src', 'index.ts');

    const hasIndexFile = existsSync(indexFilePath);

    if (!hasIndexFile) {
        return [new Error(`package '${packageBaseName}' has augments but no index file`)];
    }

    const relativeAugmentFilePaths = (await readDirRecursive(augmentsDirPath)).filter(
        (filePath) => !filePath.endsWith('.test.ts'),
    );

    const indexExports = await readIndexFileExports(indexFilePath);

    const missingInExports = relativeAugmentFilePaths.filter((relativeAugmentFilePath) => {
        const matchedIndexExport = indexExports.find((indexExport) => {
            const indexExportFullPath = join(packageDirPath, 'src', indexExport) + '.ts';
            const augmentFileFullPath = join(
                packageDirPath,
                'src',
                'augments',
                relativeAugmentFilePath,
            );

            return indexExportFullPath === augmentFileFullPath;
        });

        return !matchedIndexExport;
    });

    const exportsNotInAugments = indexExports.filter(
        (indexExport) => !relative('', indexExport).startsWith('augments'),
    );

    return [
        ...missingInExports.map(
            (missingExport) =>
                new Error(`Missing '${missingExport}' export in '${packageBaseName}' package`),
        ),
        ...exportsNotInAugments.map(
            (unAugmentExport) =>
                new Error(
                    `Package '${packageBaseName}' is exporting a non-augment file: '${unAugmentExport}'. All exports must be from the src/augments directory.`,
                ),
        ),
    ];
}

async function readIndexFileExports(indexFilePath: string): Promise<string[]> {
    const indexFileContents = (await readFile(indexFilePath)).toString();
    const condensedContents = collapseWhiteSpace(indexFileContents);
    const exportLines = safeMatch(condensedContents, /export \* from '[^']+';/g);
    const exports = exportLines
        .map((exportLine) => {
            const [
                ,
                exportPath,
            ] = safeMatch(exportLine, /export \* from '([^']+)';/);
            return exportPath;
        })
        .filter(isTruthy);
    return exports;
}
