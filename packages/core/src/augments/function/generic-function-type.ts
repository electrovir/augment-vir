import {type MaybePromise} from '../promise/maybe-promise.js';

/**
 * A function with no inputs and a return type of `Return` (which defaults to `any`).
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type NoInputsFunction<Return = any> = () => Return;

/**
 * A function with any inputs and a return type of `Return` (which defaults to `any`).
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type AnyFunction<Return = any> = (...args: any[]) => Return;

/**
 * A function with no inputs and no outputs.
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type EmptyFunction = () => void;
/**
 * An async function with no inputs and no outputs.
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type EmptyAsyncFunction = () => Promise<void>;
/**
 * A maybe async function with no inputs and no outputs.
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type EmptyMaybeAsyncFunction = () => MaybePromise<void>;
