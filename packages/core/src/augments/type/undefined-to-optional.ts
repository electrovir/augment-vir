import {type IsUnknown} from './is-unknown.js';
import {type Simplify} from './simplify.js';
import {type IsAny} from './type-checks.js';

type BaseKeyFilter<Type, Key extends keyof Type> = Key extends symbol
    ? never
    : Type[Key] extends symbol
      ? never
      : Type[Key] extends Record<string, unknown>
        ? Key
        : [(...arguments_: any[]) => any] extends [Type[Key]]
          ? never
          : Key;

type FilterDefinedKeys<T extends object> = Exclude<
    {
        [Key in keyof T]: IsAny<T[Key]> extends true
            ? Key
            : IsUnknown<T[Key]> extends true
              ? Key
              : undefined extends T[Key]
                ? never
                : T[Key] extends undefined
                  ? never
                  : BaseKeyFilter<T, Key>;
    }[keyof T],
    undefined
>;

type FilterOptionalKeys<T extends object> = Exclude<
    {
        [Key in keyof T]: IsAny<T[Key]> extends true
            ? never
            : undefined extends T[Key]
              ? T[Key] extends undefined
                  ? never
                  : BaseKeyFilter<T, Key>
              : never;
    }[keyof T],
    undefined
>;

/**
 * For an object `T`, if it has any properties that are a union with `undefined`, make those into
 * optional properties instead.
 *
 * Copied from the internal `UndefinedToOptional` type in the `type-fest` package so that this
 * package's public types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type UndefinedToOptional<T extends object> = Simplify<
    {
        [Key in keyof Pick<T, FilterDefinedKeys<T>>]: T[Key];
    } & {
        [Key in keyof Pick<T, FilterOptionalKeys<T>>]?: Exclude<T[Key], undefined>;
    }
>;
