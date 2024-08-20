import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {currentOperatingSystem, OperatingSystem} from './operating-system.js';

describe('currentOperatingSystem', () => {
    it('has a valid value', () => {
        assert.isEnumValue(currentOperatingSystem, OperatingSystem);
    });
});
