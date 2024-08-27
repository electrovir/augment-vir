import {assert} from '@augment-vir/assert';
import {wait, type MaybePromise} from '@augment-vir/common';
import {describe, it, itCases} from '@augment-vir/test';
import {basename, join, relative} from 'node:path';
import {monoRepoDirPath} from '../../file-paths.mock.js';
import {findAncestor, joinFilesToDir} from './ancestor.js';

describe(joinFilesToDir.name, () => {
    it('works', () => {
        assert.deepEquals(
            joinFilesToDir(join('a', 'b'), [
                'c',
                'd',
                'e',
                'f',
            ]),
            [
                join('a', 'b', 'c'),
                join('a', 'b', 'd'),
                join('a', 'b', 'e'),
                join('a', 'b', 'f'),
            ],
        );
    });
});

describe(findAncestor.name, () => {
    it('has proper types', () => {
        assert.tsType(findAncestor(import.meta.dirname, () => true)).equals<string | undefined>();
        assert
            .tsType(findAncestor(import.meta.dirname, () => Promise.resolve(true)))
            .equals<Promise<string | undefined>>();
        assert
            .tsType(
                findAncestor(
                    import.meta.dirname,
                    () => Promise.resolve(true) as MaybePromise<boolean>,
                ),
            )
            .equals<MaybePromise<string | undefined>>();
    });

    async function testFindAncestor(callback: (path: string) => MaybePromise<boolean>) {
        const result = await findAncestor(import.meta.dirname, callback);

        if (!result) {
            return result;
        }

        return relative(monoRepoDirPath, result);
    }

    itCases(testFindAncestor, [
        {
            it: 'works',
            input: (dir) => {
                return basename(dir) === 'node';
            },
            expect: join('packages', 'node'),
        },
        {
            it: 'works with async callback',
            input: async (dir) => {
                await wait({milliseconds: 1});
                return basename(dir) === 'node';
            },
            expect: join('packages', 'node'),
        },
        {
            it: 'fails',
            input: () => {
                return false;
            },
            expect: undefined,
        },
        {
            it: 'fails with async callback',
            input: async () => {
                await wait({milliseconds: 1});
                return false;
            },
            expect: undefined,
        },
    ]);
});
