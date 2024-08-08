import {ArrayElement} from '../array/array-element.js';

/**
 * Accepts an "Arguments" and "Return" generic to quickly make a function type. If "Arguments" is an
 * array, it is spread into the full function's Parameters list. If any argument should be an array,
 * instead of a rest parameter, put it inside of a tuple. If no arguments should be possible, pass
 * void to "Arguments". If you need an optional argument, pass it inside of a tuple.
 *
 * @example
 *     TypedFunction<string, number>; // (input: string) => number
 *
 * @example
 *     TypedFunction<string[], number>; // (...inputs: string[]) => number
 *
 * @example
 *     TypedFunction<[string[]], number>; // (input: string[]) => number
 *
 * @example
 *     TypedFunction<[string, number], number>; // (input1: string, input2: number) => number
 *
 * @example
 *     TypedFunction<[string | undefined], number>; // (input1: string|undefined) => number
 */
export type TypedFunction<Args, Return> = Args extends undefined | null
    ? (arg: Args) => Return
    : void extends Args
      ? () => Return
      : Args extends ReadonlyArray<any>
        ? number extends Args['length']
            ? (...args: ArrayElement<Args>[]) => Return
            : (...args: Args) => Return
        : (arg: Args) => Return;
