import type {ArrayElement} from '@augment-vir/core';
import type {UnionToIntersection} from 'type-fest';
import {AssertFunction} from '../guard-types/assert-function.js';
import {GuardGroup} from '../guard-types/guard-group.js';
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

export const extendableAssertions = {
    ...booleanGuards.assertions,
    ...boundaryGuards.assertions,
    ...entryEqualityGuards.assertions,
    ...enumGuards.assertions,
    ...instanceGuards.assertions,
    ...jsonEqualityGuards.assertions,
    ...keyGuards.assertions,
    ...lengthGuards.assertions,
    ...nullishGuards.assertions,
    ...numericGuards.assertions,
    ...primitiveGuards.assertions,
    ...promiseGuards.assertions,
    ...regexpGuards.assertions,
    ...runtimeTypeGuards.assertions,
    ...simpleEqualityGuards.assertions,
    ...throwGuards.assertions,
    ...uuidGuards.assertions,
    ...valueGuards.assertions,
    ...httpGuards.assertions,
    ...outputGuards.assertions,
} satisfies Record<PropertyKey, AssertFunction<any>>;

/**
 * These overrides are required for more complex guards because TypeScript won't allow us to
 * maintain function type parameters when mapping such functions.
 */

export const guardOverrides = [
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
] as const satisfies GuardGroup[];

export const checkOverrides: UnionToIntersection<
    Extract<ArrayElement<typeof guardOverrides>, {checkOverrides: any}>['checkOverrides']
> = Object.assign(
    {},
    ...guardOverrides
        .map((entry) => {
            if ('checkOverrides' in entry) {
                return entry.checkOverrides;
            } else {
                return undefined;
            }
        })
        .filter((entry) => !!entry),
);

export const assertWrapOverrides: UnionToIntersection<
    Extract<ArrayElement<typeof guardOverrides>, {assertWrapOverrides: any}>['assertWrapOverrides']
> = Object.assign(
    {},
    ...guardOverrides
        .map((entry) => {
            if ('assertWrapOverrides' in entry) {
                return entry.assertWrapOverrides;
            } else {
                return undefined;
            }
        })
        .filter((entry) => !!entry),
);

export const checkWrapOverrides: UnionToIntersection<
    Extract<ArrayElement<typeof guardOverrides>, {checkWrapOverrides: any}>['checkWrapOverrides']
> = Object.assign(
    {},
    ...guardOverrides
        .map((entry) => {
            if ('checkWrapOverrides' in entry) {
                return entry.checkWrapOverrides;
            } else {
                return undefined;
            }
        })
        .filter((entry) => !!entry),
);

export const waitUntilOverrides: UnionToIntersection<
    Extract<ArrayElement<typeof guardOverrides>, {waitUntilOverrides: any}>['waitUntilOverrides']
> = Object.assign(
    {},
    ...guardOverrides
        .map((entry) => {
            if ('waitUntilOverrides' in entry) {
                return entry.waitUntilOverrides;
            } else {
                return undefined;
            }
        })
        .filter((entry) => !!entry),
);
