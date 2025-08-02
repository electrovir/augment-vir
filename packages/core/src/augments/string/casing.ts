/**
 * Makes only the first letter of a string type lowercase while preserving the case of the rest.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {FirstLetterLowercase} from '@augment-vir/common';
 * type Example1 = FirstLetterLowercase<'HelloWorld'>; // 'helloWorld'
 * type Example2 = FirstLetterLowercase<'HELLO'>; // 'hELLO'
 * type Example3 = FirstLetterLowercase<'a'>; // 'a'
 * type Example4 = FirstLetterLowercase<''>; // ''
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type FirstLetterLowercase<T extends string> = T extends `${infer First}${infer Rest}`
    ? `${Lowercase<First>}${Rest}`
    : T;

/**
 * Makes only the first letter of a string type uppercase while preserving the case of the rest.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {FirstLetterUppercase} from '@augment-vir/common';
 * type Example1 = FirstLetterUppercase<'helloWorld'>; // 'HelloWorld'
 * type Example2 = FirstLetterUppercase<'hELLO'>; // 'HELLO'
 * type Example3 = FirstLetterUppercase<'a'>; // 'A'
 * type Example4 = FirstLetterUppercase<''>; // ''
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type FirstLetterUppercase<T extends string> = T extends `${infer First}${infer Rest}`
    ? `${Uppercase<First>}${Rest}`
    : T;
