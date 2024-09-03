import {Jsonify, Primitive} from 'type-fest';

/**
 * These are similar in purpose, name, and structure to type-fest's JsonValue types but these are
 * more permissive. The goal here is to allow any types that do not get serialized into just empty
 * objects. (For example, JSON.stringify(new Map()) returns "{}", so we don't want to allow that
 * type.)
 */

/**
 * All primitives that are allowed in JSON.
 *
 * Note that while `undefined` is allowed here, it will be behave slightly differently than the
 * others.
 *
 * - `JSON.stringify(undefined)` will output `undefined`, not a string.
 * - `JSON.stringify({a: null, b: undefined})` will output `'{"a": null}'`, omitting the `b` key
 *   entirely.
 *
 * @category JSON : Common
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export type JsonCompatiblePrimitive = Jsonify<Primitive> | undefined;

/**
 * An object that only contains JSON compatible values.
 *
 * @category JSON : Common
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export type JsonCompatibleObject =
    | Partial<{
          readonly [key: string | number]: JsonCompatibleValue | Readonly<JsonCompatibleValue>;
      }>
    | Partial<{
          [key: string | number]: JsonCompatibleValue | Readonly<JsonCompatibleValue>;
      }>;

/**
 * An array that only contains JSON compatible values.
 *
 * @category JSON : Common
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export type JsonCompatibleArray = JsonCompatibleValue[] | ReadonlyArray<JsonCompatibleValue>;

/**
 * Any JSON compatible value.
 *
 * @category JSON : Common
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export type JsonCompatibleValue =
    | JsonCompatiblePrimitive
    | JsonCompatibleObject
    | JsonCompatibleArray;
