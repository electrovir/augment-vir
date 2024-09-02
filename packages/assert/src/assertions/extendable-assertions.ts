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
] as const satisfies GuardGroup<any>[];

export const checkOverrides: UnionToIntersection<ArrayElement<typeof guardOverrides>['check']> =
    Object.assign(
        {},
        ...guardOverrides
            .map((entry) => {
                if ('check' in entry) {
                    return entry.check;
                } else {
                    return undefined;
                }
            })
            .filter((entry) => !!entry),
    );

export const assertWrapOverrides: UnionToIntersection<
    Extract<ArrayElement<typeof guardOverrides>, {assertWrap: any}>['assertWrap']
> = Object.assign(
    {},
    ...guardOverrides
        .map((entry) => {
            if ('assertWrap' in entry) {
                return entry.assertWrap;
            } else {
                return undefined;
            }
        })
        .filter((entry) => !!entry),
);

export const checkWrapOverrides: UnionToIntersection<
    Extract<ArrayElement<typeof guardOverrides>, {checkWrap: any}>['checkWrap']
> = Object.assign(
    {},
    ...guardOverrides
        .map((entry) => {
            if ('checkWrap' in entry) {
                return entry.checkWrap;
            } else {
                return undefined;
            }
        })
        .filter((entry) => !!entry),
);

export const waitUntilOverrides: UnionToIntersection<
    Extract<ArrayElement<typeof guardOverrides>, {waitUntil: any}>['waitUntil']
> = Object.assign(
    {},
    ...guardOverrides
        .map((entry) => {
            if ('waitUntil' in entry) {
                return entry.waitUntil;
            } else {
                return undefined;
            }
        })
        .filter((entry) => !!entry),
);
