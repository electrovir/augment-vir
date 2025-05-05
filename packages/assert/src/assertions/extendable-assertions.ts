import {type AssertFunction} from '../guard-types/assert-function.js';
import {type GuardGroup} from '../guard-types/guard-group.js';
import {booleanGuards} from './boolean.js';
import {boundaryGuards} from './boundary.js';
import {enumGuards} from './enum.js';
import {entryEqualityGuards} from './equality/entry-equality.js';
import {jsonEqualityGuards} from './equality/json-equality.js';
import {simpleEqualityGuards} from './equality/simple-equality.js';
import {httpGuards} from './http.js';
import {instanceGuards} from './instance.js';
import {keyGuards} from './keys.js';
import {lengthGuards} from './length.js';
import {neverGuard} from './never.js';
import {nullishGuards} from './nullish.js';
import {numericGuards} from './numeric.js';
import {outputGuards} from './output.js';
import {primitiveGuards} from './primitive.js';
import {promiseGuards} from './promise.js';
import {regexpGuards} from './regexp.js';
import {runtimeTypeGuards} from './runtime-type.js';
import {throwGuards} from './throws.js';
import {uuidGuards} from './uuid.js';
import {valueGuards} from './values.js';

export const extendableAssertions: typeof booleanGuards.assert &
    typeof boundaryGuards.assert &
    typeof entryEqualityGuards.assert &
    typeof enumGuards.assert &
    typeof httpGuards.assert &
    typeof instanceGuards.assert &
    typeof jsonEqualityGuards.assert &
    typeof keyGuards.assert &
    typeof lengthGuards.assert &
    typeof neverGuard.assert &
    typeof nullishGuards.assert &
    typeof numericGuards.assert &
    typeof outputGuards.assert &
    typeof primitiveGuards.assert &
    typeof promiseGuards.assert &
    typeof regexpGuards.assert &
    typeof runtimeTypeGuards.assert &
    typeof simpleEqualityGuards.assert &
    typeof throwGuards.assert &
    typeof uuidGuards.assert &
    typeof valueGuards.assert = {
    ...neverGuard.assert,
    ...booleanGuards.assert,
    ...boundaryGuards.assert,
    ...entryEqualityGuards.assert,
    ...enumGuards.assert,
    ...httpGuards.assert,
    ...instanceGuards.assert,
    ...jsonEqualityGuards.assert,
    ...keyGuards.assert,
    ...lengthGuards.assert,
    ...nullishGuards.assert,
    ...numericGuards.assert,
    ...outputGuards.assert,
    ...primitiveGuards.assert,
    ...promiseGuards.assert,
    ...regexpGuards.assert,
    ...runtimeTypeGuards.assert,
    ...simpleEqualityGuards.assert,
    ...throwGuards.assert,
    ...uuidGuards.assert,
    ...valueGuards.assert,
} satisfies Record<PropertyKey, AssertFunction<any>>;

/**
 * These overrides are required for more complex guards because TypeScript won't allow us to
 * maintain function type parameters when mapping such functions.
 */

export const guardOverrides: [
    typeof booleanGuards,
    typeof boundaryGuards,
    typeof entryEqualityGuards,
    typeof enumGuards,
    typeof httpGuards,
    typeof instanceGuards,
    typeof jsonEqualityGuards,
    typeof keyGuards,
    typeof lengthGuards,
    typeof neverGuard,
    typeof nullishGuards,
    typeof numericGuards,
    typeof outputGuards,
    typeof primitiveGuards,
    typeof promiseGuards,
    typeof regexpGuards,
    typeof runtimeTypeGuards,
    typeof simpleEqualityGuards,
    typeof throwGuards,
    typeof uuidGuards,
    typeof valueGuards,
] = [
    booleanGuards,
    boundaryGuards,
    entryEqualityGuards,
    enumGuards,
    httpGuards,
    instanceGuards,
    jsonEqualityGuards,
    keyGuards,
    lengthGuards,
    neverGuard,
    nullishGuards,
    numericGuards,
    outputGuards,
    primitiveGuards,
    promiseGuards,
    regexpGuards,
    runtimeTypeGuards,
    simpleEqualityGuards,
    throwGuards,
    uuidGuards,
    valueGuards,
] as const satisfies GuardGroup<any>[];
