import {isBrowser} from '@augment-vir/common';
import {assert} from 'chai';
import {describe, it} from 'mocha';

describe(isBrowser.name, () => {
    it('should detect that we are not in a browser', () => {
        assert.strictEqual(isBrowser(), false);
    });
});
