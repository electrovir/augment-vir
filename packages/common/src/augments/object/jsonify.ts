import {Jsonify} from 'type-fest';

export function jsonify<InputGeneric>(input: InputGeneric): Jsonify<InputGeneric> {
    return JSON.parse(JSON.stringify(input));
}
