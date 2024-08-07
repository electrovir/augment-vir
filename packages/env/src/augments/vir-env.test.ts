import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {determineVirEnv, VirEnv} from './vir-env.js';

describe('determineVirEnv', () => {
    /** Other packages will test the web env. */

    it('detects node', () => {
        assert.strictEqual(determineVirEnv(), VirEnv.Node);
    });
});
