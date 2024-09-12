import {assertWrap} from '@augment-vir/assert';

// `result1` will be `['a']`
const result1 = assertWrap.deepEquals(['a'], ['a']);

const value: unknown = 'some value' as unknown;
// `result2` will be `'some value'` and it will have the type of `string`
const result2 = assertWrap.isString(value);

const value2: unknown = 'some value' as unknown;
// this will throw an error
const result3 = assertWrap.isNumber(value2);
