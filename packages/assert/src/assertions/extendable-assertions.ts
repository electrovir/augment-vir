import type {ArrayElement} from '@augment-vir/core';
import type {UnionToIntersection} from 'type-fest';
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
    typeof instanceGuards.assert &
    typeof jsonEqualityGuards.assert &
    typeof keyGuards.assert &
    typeof lengthGuards.assert &
    typeof nullishGuards.assert &
    typeof numericGuards.assert &
    typeof primitiveGuards.assert &
    typeof promiseGuards.assert &
    typeof regexpGuards.assert &
    typeof runtimeTypeGuards.assert &
    typeof simpleEqualityGuards.assert &
    typeof throwGuards.assert &
    typeof uuidGuards.assert &
    typeof valueGuards.assert &
    typeof httpGuards.assert &
    typeof outputGuards.assert = {
    ...booleanGuards.assert,
    ...boundaryGuards.assert,
    ...entryEqualityGuards.assert,
    ...enumGuards.assert,
    ...instanceGuards.assert,
    ...jsonEqualityGuards.assert,
    ...keyGuards.assert,
    ...lengthGuards.assert,
    ...nullishGuards.assert,
    ...numericGuards.assert,
    ...primitiveGuards.assert,
    ...promiseGuards.assert,
    ...regexpGuards.assert,
    ...runtimeTypeGuards.assert,
    ...simpleEqualityGuards.assert,
    ...throwGuards.assert,
    ...uuidGuards.assert,
    ...valueGuards.assert,
    ...httpGuards.assert,
    ...outputGuards.assert,
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
    typeof instanceGuards,
    typeof jsonEqualityGuards,
    typeof keyGuards,
    typeof lengthGuards,
    typeof nullishGuards,
    typeof numericGuards,
    typeof primitiveGuards,
    typeof promiseGuards,
    typeof regexpGuards,
    typeof runtimeTypeGuards,
    typeof simpleEqualityGuards,
    typeof throwGuards,
    typeof uuidGuards,
    typeof valueGuards,
    typeof httpGuards,
    typeof outputGuards,
] = [
    booleanGuards,
    boundaryGuards,
    entryEqualityGuards,
    enumGuards,
    instanceGuards,
    jsonEqualityGuards,
    keyGuards,
    lengthGuards,
    nullishGuards,
    numericGuards,
    primitiveGuards,
    promiseGuards,
    regexpGuards,
    runtimeTypeGuards,
    simpleEqualityGuards,
    throwGuards,
    uuidGuards,
    valueGuards,
    httpGuards,
    outputGuards,
] as const satisfies GuardGroup<any>[];

export const checkOverrides: UnionToIntersection<ArrayElement<typeof guardOverrides>['check']> =
    Object.assign(
        {},
        ...guardOverrides.map((entry) => {
            return entry.check;
        }),
    );

export const assertWrapOverrides: UnionToIntersection<
    Extract<ArrayElement<typeof guardOverrides>, {assertWrap: any}>['assertWrap']
> = Object.assign(
    {},
    ...guardOverrides.map((entry) => {
        return entry.assertWrap;
    }),
);

export const checkWrapOverrides: UnionToIntersection<
    Extract<ArrayElement<typeof guardOverrides>, {checkWrap: any}>['checkWrap']
> = Object.assign(
    {},
    ...guardOverrides.map((entry) => {
        return entry.checkWrap;
    }),
);

export const waitUntilOverrides: UnionToIntersection<
    Extract<ArrayElement<typeof guardOverrides>, {waitUntil: any}>['waitUntil']
> = Object.assign(
    {},
    ...guardOverrides.map((entry) => {
        return entry.waitUntil;
    }),
);
