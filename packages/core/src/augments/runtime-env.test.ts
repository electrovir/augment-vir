import {describe, it} from '@augment-vir/test';
import assert from 'node:assert/strict';
import {determineRuntimeEnv, RuntimeEnv} from './runtime-env.js';

describe('determineVirEnv', () => {
    /** Other packages will test the web env. */

    it('detects node', () => {
        assert.strictEqual(determineRuntimeEnv(), RuntimeEnv.Node);
    });
});
