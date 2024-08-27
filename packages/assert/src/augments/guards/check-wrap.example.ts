import {checkWrap} from '@augment-vir/assert';

// `result1` will be `['a']`
const result1 = checkWrap.deepEquals(['a'], ['a']);

const value: unknown = 'some value' as unknown;
// `result2` will be `'some value'` and it will have the type of `string`
const result2 = checkWrap.isString(value);

const value2: unknown = 'some value' as unknown;
// `result` will be `undefined`
const result3 = checkWrap.isNumber(value2);
