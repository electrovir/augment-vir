import {check} from '@augment-vir/assert';
import {
    awaitedBlockingMap,
    collapseWhiteSpace,
    log,
    logColors,
    safeMatch,
} from '@augment-vir/common';
import {readDirRecursive} from '@augment-vir/node';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {basename, join, relative} from 'node:path';
import {getAllPublicPackageDirPaths} from '../file-paths.js';

async function assertAllAugmentsExported() {
    const publicPackageDirPaths = await getAllPublicPackageDirPaths();

    const passed = (await awaitedBlockingMap(publicPackageDirPaths, verifyPackage))
        .flat()
        .every(check.isTrue);

    if (!passed) {
        log.error('\nFailed exports check.');
        process.exit(1);
    }
}

async function verifyPackage(packageDirPath: string): Promise<boolean> {
    log.info(`${logColors.bold}${basename(packageDirPath)}`);
    const packageBaseName = basename(packageDirPath);
    const augmentsDirPath = join(packageDirPath, 'src', 'augments');
    const hasAugmentsDirectory = existsSync(augmentsDirPath);

    if (!hasAugmentsDirectory) {
        log.error(`package '${packageBaseName}' is public but has no augments folder`);
        return false;
    }

    const indexFilePath = join(packageDirPath, 'src', 'index.ts');

    const hasIndexFile = existsSync(indexFilePath);

    if (!hasIndexFile) {
        log.error(`package '${packageBaseName}' has augments but no index file`);
    }

    const relativeAugmentFilePaths = (await readDirRecursive(augmentsDirPath)).filter(
        (filePath) =>
            filePath.endsWith('.ts') &&
            !filePath.endsWith('.test.ts') &&
            !filePath.endsWith('.mock.ts'),
    );

    log.faint(`Checking ${relativeAugmentFilePaths.length} augment files...`);

    const indexExports = await readIndexFileExports(indexFilePath);

    const missingInExports = relativeAugmentFilePaths.filter((relativeAugmentFilePath) => {
        const matchedIndexExport = indexExports.find((indexExport) => {
            const indexExportFullPath = join(packageDirPath, 'src', indexExport).replace(
                /\.js/,
                '.ts',
            );
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

    missingInExports.forEach((missingExport) => {
        log.error(`Missing '${missingExport}'`);
    });
    exportsNotInAugments.forEach((unAugmentExport) => {
        log.error(
            `Package '${packageBaseName}' is exporting a non-augment file: '${unAugmentExport}'. All exports must be from the src/augments directory.`,
        );
    });

    return !missingInExports.length && !exportsNotInAugments.length;
}

async function readIndexFileExports(indexFilePath: string): Promise<string[]> {
    const indexFileContents = (await readFile(indexFilePath)).toString();
    const condensedContents = collapseWhiteSpace(indexFileContents);
    const exportLines = safeMatch(condensedContents, /export \* from '[^']+';/g);
    return exportLines
        .map((exportLine) => {
            const [
                ,
                exportPath,
            ] = safeMatch(exportLine, /export \* from '([^']+)';/);
            return exportPath;
        })
        .filter(check.isTruthy);
}

await assertAllAugmentsExported();
