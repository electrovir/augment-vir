import JSON5 from 'json5';
import {Jsonify} from 'type-fest';

export function jsonify<T>(input: T): Jsonify<T> {
    return JSON5.parse(JSON5.stringify(input));
}
