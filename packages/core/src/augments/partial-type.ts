import {AnyObject} from './object/generic-object-type.js';

/**
 * Allow `T` to be partial or have `null` or `undefined` as the value for any of its keys.
 *
 * @category Type
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PartialWithNullable<T extends AnyObject> = {
    [Prop in keyof T]?: T[Prop] | null | undefined;
};

/**
 * Allow `T` to be partial or have `undefined` as the value for any of its keys.
 *
 * @category Type
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type PartialWithUndefined<T extends AnyObject> = {
    [Prop in keyof T]?: T[Prop] | undefined;
};
