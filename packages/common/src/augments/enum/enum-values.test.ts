import {assert, describe} from '@augment-vir/test';
import {getEnumValues} from './enum-values.js';

enum Planet {
    Mercury = 'mercury',
    Venus = 'venus',
    Earth = 'earth',
}

describe(getEnumValues.name, ({it}) => {
    it('gets basic enum values properly', () => {
        assert.deepStrictEqual(getEnumValues(Planet), [
            Planet.Mercury,
            Planet.Venus,
            Planet.Earth,
        ]);
    });
});
