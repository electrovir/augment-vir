import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {currentOperatingSystem, isOperatingSystem, OperatingSystem} from './operating-system.js';

describe('currentOperatingSystem', () => {
    it('has a valid value', () => {
        assert.isEnumValue(currentOperatingSystem, OperatingSystem);
    });
});

describe(isOperatingSystem.name, () => {
    it('returns a boolean', () => {
        assert.isBoolean(isOperatingSystem(OperatingSystem.Mac));
    });
});
