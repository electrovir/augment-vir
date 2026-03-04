import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {fromAsyncIterable} from './from-async-iterable.js';

describe(fromAsyncIterable.name, () => {
    async function* createAsyncIterable(): AsyncIterable<number> {
        await Promise.resolve();
        yield 1;
        yield 2;
        yield 3;
    }

    function createAsyncIterator(): AsyncIterator<number> {
        let bareIndex = 0;
        const bareAsyncIterator: AsyncIterator<number> = {
            next(): Promise<IteratorResult<number>> {
                if (bareIndex >= 3) {
                    return Promise.resolve({
                        done: true,
                        value: undefined,
                    });
                }
                const current = bareIndex++;
                return Promise.resolve({
                    done: false,
                    value: current,
                });
            },
        };

        return bareAsyncIterator;
    }

    itCases(fromAsyncIterable, [
        {
            it: 'collects values from an AsyncIterable',
            input: createAsyncIterable(),
            expect: [
                1,
                2,
                3,
            ],
        },
        {
            it: 'collects values from a bare AsyncIterator',
            input: createAsyncIterator(),
            expect: [
                0,
                1,
                2,
            ],
        },
        {
            it: 'throws on invalid input',
            //  @ts-expect-error: intentionally incorrect input
            input: {},
            throws: {
                matchConstructor: TypeError,
            },
        },
    ]);

    it('produces proper types', async () => {
        assert.tsType(await fromAsyncIterable(createAsyncIterable())).equals<number[]>();
        assert.tsType(await fromAsyncIterable(createAsyncIterator())).equals<number[]>();
    });
});
