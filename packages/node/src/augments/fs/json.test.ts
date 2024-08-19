import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {readFile, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {
    testFilesDir,
    workspaceQueryDir,
    workspaceQueryPackageJsonPath,
} from '../../file-paths.mock.js';
import {appendJsonFile, readJsonFile, writeJsonFile} from './json.js';

const tempOutFilePath = join(testFilesDir, 'temp-json-out.json');

describe(writeJsonFile.name, () => {
    const originalData = {
        a: 'b',
        c: 'd',
    };

    it('writes a json file', async () => {
        try {
            await writeJsonFile(tempOutFilePath, originalData);
            const contents = (await readFile(tempOutFilePath)).toString();
            assert.strictEquals(contents, '{\n    "a": "b",\n    "c": "d"\n}');
        } finally {
            await rm(tempOutFilePath, {force: true});
        }
    });
    it('adds a trailing new line', async () => {
        try {
            await writeJsonFile(tempOutFilePath, originalData, {includeTrailingNewLine: true});
            const contents = (await readFile(tempOutFilePath)).toString();
            assert.strictEquals(contents, '{\n    "a": "b",\n    "c": "d"\n}\n');
        } finally {
            await rm(tempOutFilePath, {force: true});
        }
    });
});

describe(readJsonFile.name, () => {
    it('reads valid json', async () => {
        assert.deepEquals(await readJsonFile(workspaceQueryPackageJsonPath), {type: 'module'});
    });
    it('handles invalid json', async () => {
        assert.isUndefined(await readJsonFile(join(workspaceQueryDir, 'does-not-exist.json')));
    });
});

describe(appendJsonFile.name, () => {
    it('appends to an object', async () => {
        try {
            await writeJsonFile(tempOutFilePath, {a: 'b'});
            await appendJsonFile(tempOutFilePath, {c: 'd'});

            assert.deepEquals(await readJsonFile(tempOutFilePath), {a: 'b', c: 'd'});
        } finally {
            await rm(tempOutFilePath, {force: true});
        }
    });
    it('appends to an array', async () => {
        try {
            await writeJsonFile(tempOutFilePath, ['a']);
            await appendJsonFile(tempOutFilePath, ['b']);

            assert.deepEquals(await readJsonFile(tempOutFilePath), [
                'a',
                'b',
            ]);
        } finally {
            await rm(tempOutFilePath, {force: true});
        }
    });
    it('appends to an empty file', async () => {
        try {
            await appendJsonFile(tempOutFilePath, ['b']);

            assert.deepEquals(await readJsonFile(tempOutFilePath), [
                'b',
            ]);
        } finally {
            await rm(tempOutFilePath, {force: true});
        }
    });
    it('appends to non object data', async () => {
        try {
            await writeJsonFile(tempOutFilePath, 'a');
            await appendJsonFile(tempOutFilePath, ['b']);

            assert.deepEquals(await readJsonFile(tempOutFilePath), [
                'a',
                'b',
            ]);
        } finally {
            await rm(tempOutFilePath, {force: true});
        }
    });
    it('errors on mismatch data types', async () => {
        try {
            await writeJsonFile(tempOutFilePath, ['a']);
            await assert.throws(appendJsonFile(tempOutFilePath, {b: 'c'}), {
                matchMessage: 'Type mismatch between new JSON data to append and current JSON data',
            });
        } finally {
            await rm(tempOutFilePath, {force: true});
        }
    });
});
