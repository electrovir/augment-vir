import {type RequiredKeysOf} from '../object/required-keys.js';
import {type If} from './conditional-type.js';
import {type Merge} from './merge.js';
import {type OptionalKeysOf} from './optional-keys-of.js';
import {type Simplify} from './simplify.js';
import {type IsAny, type IsNever} from './type-checks.js';

/**
 * Fill in the unspecified properties of an options object with their defaults.
 *
 * Copied from the `ApplyDefaultOptions` type in the `type-fest` package so that this package's
 * public types do not depend on `type-fest` (see the note in `type-checks.ts`).
 *
 * @category Object
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type ApplyDefaultOptions<
    Options extends object,
    Defaults extends Simplify<
        Omit<Required<Options>, RequiredKeysOf<Options>> &
            Partial<Record<RequiredKeysOf<Options>, never>>
    >,
    SpecifiedOptions extends Options,
> = If<
    IsAny<SpecifiedOptions>,
    Defaults,
    If<
        IsNever<SpecifiedOptions>,
        Defaults,
        Simplify<
            Merge<
                Defaults,
                {
                    [Key in keyof SpecifiedOptions as Key extends OptionalKeysOf<Options>
                        ? undefined extends SpecifiedOptions[Key]
                            ? never
                            : Key
                        : Key]: SpecifiedOptions[Key];
                }
            > &
                /**
                 * `& Required<Options>` ensures that `ApplyDefaultOptions<SomeOption, ...>` is
                 * always assignable to `Required<SomeOption>`.
                 */
                Required<Options>
        >
    >
>;
