import {describe, it} from 'mocha';
import {DoesExtend, ExpectFalse, ExpectTrue} from './type-test';

describe('DoesExtend', () => {
    it('should work on types', () => {
        type one = ExpectTrue<DoesExtend<unknown, Record<PropertyKey, any>>>;
        type two = ExpectFalse<DoesExtend<Record<PropertyKey, any>, unknown>>;
        // type three = ExpectFalse<DoesExtend<Record<'name', any>, {name: string} | string>>;
        type four = ExpectTrue<DoesExtend<{name: string} | string, Record<'name', any>>>;
        type five = ExpectTrue<DoesExtend<{name: string} | string, Record<'name', any>>>;
    });
});
