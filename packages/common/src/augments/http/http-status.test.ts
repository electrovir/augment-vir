import {assert} from '@augment-vir/assert';
import {ArrayElement} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {
    HttpStatus,
    HttpStatusByCategory,
    HttpStatusCategory,
    isHttpStatusCategory,
} from './http-status';

describe(isHttpStatusCategory.name, () => {
    it('type guards inputs', () => {
        const status: number = 25;
        if (isHttpStatusCategory(status, HttpStatusCategory.Success)) {
            assert
                .tsType(status)
                .matches<ArrayElement<HttpStatusByCategory<HttpStatusCategory.Success>>>();
        }

        assert.isFalse(isHttpStatusCategory(status, HttpStatusCategory.Success));
        assert.isTrue(isHttpStatusCategory(HttpStatus.Accepted, HttpStatusCategory.Success));
    });
});
