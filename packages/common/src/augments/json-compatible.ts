import {Jsonify, Primitive} from 'type-fest';

/**
 * These are similar in purpose, name, and structure to type-fest's JsonValue types but these are
 * permissive. The goal here is to allow any types that do not get serialized into just empty
 * objects. (For example, JSON.stringify(new Map()) returns "{}", so we don't want to allow that
 * type.)
 */

export type JsonCompatiblePrimitiveValue = Jsonify<Primitive> | undefined;

export type JsonCompatibleObject =
    | Partial<{
          readonly [key: string | number]: JsonCompatibleValue | Readonly<JsonCompatibleValue>;
      }>
    | Partial<{
          [key: string | number]: JsonCompatibleValue | Readonly<JsonCompatibleValue>;
      }>;

export type JsonCompatibleArray =
    | JsonCompatibleValue[]
    /**
     * This weird readonly with object syntax for an array type is so that TypeScript doesn't
     * complain about JsonCompatibleArray circularly referencing itself
     */
    | ({
          readonly [P in number]: JsonCompatibleValue;
      } & ReadonlyArray<any>);

export type JsonCompatibleValue =
    | JsonCompatiblePrimitiveValue
    | JsonCompatibleObject
    | JsonCompatibleArray;
