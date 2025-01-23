import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {getEnumValues} from '../enum/enum-values.js';
import {HttpMethod} from './http-method.js';

describe('HttpMethod', () => {
    it('has all uppercase methods', () => {
        getEnumValues(HttpMethod).forEach((value) => {
            assert.strictEquals(value.toUpperCase(), value);
        });
    });
});
