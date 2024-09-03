import type {CompleteRequire} from './required-keys.js';

/**
 * Gets all values of an object.
 *
 * @category Object : Common
 * @package @augment-vir/common
 */
export type Values<T> = CompleteRequire<T>[keyof T];

/**
 * Gets the value within an object when all its keys are required.
 *
 * @category Object : Common
 * @package @augment-vir/common
 */
export type ValueAtRequiredKey<Parent, Key extends keyof Parent> = CompleteRequire<Parent>[Key];
