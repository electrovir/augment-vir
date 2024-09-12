/**
 * Accepts an "Arguments" and "Return" generic to quickly make a function type. If "Arguments" is an
 * array, it is spread into the full function's Parameters list. If any argument should be an array,
 * instead of a rest parameter, put it inside of a tuple. If no arguments should be possible, pass
 * void to "Arguments". If you need an optional argument, pass it inside of a tuple.
 *
 * @category Function
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * TypedFunction<string, number>; // (input: string) => number
 * TypedFunction<string[], number>; // (...inputs: string[]) => number
 * TypedFunction<[string[]], number>; // (input: string[]) => number
 * TypedFunction<[string, number], number>; // (input1: string, input2: number) => number
 * TypedFunction<[string | undefined], number>; // (input1: string|undefined) => number
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type TypedFunction<Arguments, Return> = Arguments extends readonly any[]
    ? number extends Arguments['length']
        ? (...args: Arguments[number][]) => Return
        : (...args: Arguments) => Return
    : void extends Arguments
      ? () => Return
      : (arg: Arguments) => Return;
