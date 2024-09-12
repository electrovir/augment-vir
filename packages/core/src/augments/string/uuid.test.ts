import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {createUuidV4, type Uuid} from './uuid.js';

describe(createUuidV4.name, () => {
    it('creates a UUID', () => {
        const result = createUuidV4();
        assert.isUuid(result);
        assert.tsType(result).equals<Uuid>();
    });
});
