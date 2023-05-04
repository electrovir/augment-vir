import {getOrSetFromMap} from '@augment-vir/common';
import {randomString} from '@augment-vir/node-js';
import {assert} from 'chai';
import {describe} from 'mocha';

describe(getOrSetFromMap.name, () => {
    it('retrieves an existing item', () => {
        const exampleKey = {};
        const exampleValue = randomString();
        const exampleMap = new Map([
            [
                exampleKey,
                exampleValue,
            ],
        ]);

        assert.strictEqual(
            getOrSetFromMap(exampleMap, exampleKey, () => ''),
            exampleValue,
        );
    });

    it('sets a new item if it did not exist', () => {
        const exampleKey = {};
        const exampleValue = randomString();
        const exampleMap = new Map();

        assert.strictEqual(
            getOrSetFromMap(exampleMap, exampleKey, () => exampleValue),
            exampleValue,
        );
        assert.strictEqual(exampleMap.get(exampleKey), exampleValue);
    });

    it('works with WeakMap', () => {
        const exampleKey = {};
        const exampleValue = randomString();
        const exampleMap = new WeakMap();

        assert.strictEqual(
            getOrSetFromMap(exampleMap, exampleKey, () => exampleValue),
            exampleValue,
        );
        assert.strictEqual(exampleMap.get(exampleKey), exampleValue);
    });
});
