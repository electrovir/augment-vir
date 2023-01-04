import {assert} from 'chai';
import {describe, it} from 'mocha';
import {isBrowser} from '../../../common/src';

describe(isBrowser.name, () => {
    it('should detect that we are not in a browser', () => {
        assert.strictEqual(isBrowser(), false);
    });
});
