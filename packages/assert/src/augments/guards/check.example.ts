import {check} from '@augment-vir/assert';

const value: unknown = 'some value' as unknown;
if (check.isString(value)) {
    // `value` will now be typed as a `string` in here
}
