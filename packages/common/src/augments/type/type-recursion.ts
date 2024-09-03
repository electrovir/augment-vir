type TsRecursionArray = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,
    125,
    126,
    127,
    128,
    129,
    130,
    131,
    132,
    133,
    134,
    135,
    136,
    137,
    138,
    139,
    140,
    141,
    142,
    143,
    144,
    145,
    146,
    147,
    148,
    149,
    150,
];

/**
 * This is used as the baseline type for TypeScript recursion tracking indexes. Use this to manually
 * abort a type's recursion to prevent it from going too deep and throwing an error in TypeScript's
 * language server.
 *
 * @category Type : Common
 * @example
 *
 * ```ts
 * import type {
 *     TsRecursionTracker,
 *     TsRecursionStart,
 *     TsRecurse,
 *     TsTooMuchRecursion,
 * } from '@augment-vir/common';
 *
 * export type SomeType<Depth extends TsRecursionTracker = TsRecursionStart> =
 *     Depth extends TsTooMuchRecursion
 *         ? 'Error: recursive object depth is too deep.'
 *         : SomeType<TsRecurse<Depth>>;
 * ```
 *
 * @package @augment-vir/common
 */
export type TsRecursionTracker = keyof TsRecursionArray;

/**
 * Through experimentation on Typescript version 5.4.5, this is the maximum recursion depth we can
 * go to before TypeScript will block recursive types. Use this as the limit to type recursion.
 *
 * @category Type : Common
 * @example
 *
 * ```ts
 * import type {
 *     TsRecursionTracker,
 *     TsRecursionStart,
 *     TsRecurse,
 *     TsTooMuchRecursion,
 * } from '@augment-vir/common';
 *
 * export type SomeType<Depth extends TsRecursionTracker = TsRecursionStart> =
 *     Depth extends TsTooMuchRecursion
 *         ? 'Error: recursive object depth is too deep.'
 *         : SomeType<TsRecurse<Depth>>;
 * ```
 *
 * @package @augment-vir/common
 */
export type TsTooMuchRecursion = 91;
/**
 * This is the default starting recursion depth needed to get the full tested allowed recursion
 * depth.
 *
 * @category Type : Common
 * @example
 *
 * ```ts
 * import type {
 *     TsRecursionTracker,
 *     TsRecursionStart,
 *     TsRecurse,
 *     TsTooMuchRecursion,
 * } from '@augment-vir/common';
 *
 * export type SomeType<Depth extends TsRecursionTracker = TsRecursionStart> =
 *     Depth extends TsTooMuchRecursion
 *         ? 'Error: recursive object depth is too deep.'
 *         : SomeType<TsRecurse<Depth>>;
 * ```
 *
 * @package @augment-vir/common
 */
export type TsRecursionStart = 0;

/**
 * Increments a TypeScript recursion depth tracker.
 *
 * @category Type : Common
 * @example
 *
 * ```ts
 * import type {
 *     TsRecursionTracker,
 *     TsRecursionStart,
 *     TsRecurse,
 *     TsTooMuchRecursion,
 * } from '@augment-vir/common';
 *
 * export type SomeType<Depth extends TsRecursionTracker = TsRecursionStart> =
 *     Depth extends TsTooMuchRecursion
 *         ? 'Error: recursive object depth is too deep.'
 *         : SomeType<TsRecurse<Depth>>;
 * ```
 *
 * @package @augment-vir/common
 */
export type TsRecurse<CurrentRecursion extends TsRecursionTracker> =
    TsRecursionArray[CurrentRecursion] extends TsRecursionTracker
        ? TsRecursionArray[CurrentRecursion]
        : TsTooMuchRecursion;
