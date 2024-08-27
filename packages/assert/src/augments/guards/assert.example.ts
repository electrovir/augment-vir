import {assert} from '@augment-vir/assert';

const value: unknown = 'some value' as unknown;
assert.isString(value);
// `value` will now be typed as a `string`
