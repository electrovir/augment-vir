import {AnyObject} from './object/generic-object-type.js';

/**
 * Allow `T` to be partial or have `null` or `undefined` as the value for any of its keys.
 *
 * @category Type : Common
 * @category Object : Common
 * @package @augment-vir/common
 */
export type PartialWithNullable<T extends AnyObject> = {
    [Prop in keyof T]?: T[Prop] | null | undefined;
};

/**
 * Allow `T` to be partial or have `undefined` as the value for any of its keys.
 *
 * @category Type : Common
 * @category Object : Common
 * @package @augment-vir/common
 */
export type PartialWithUndefined<T extends AnyObject> = {
    [Prop in keyof T]?: T[Prop] | undefined;
};
