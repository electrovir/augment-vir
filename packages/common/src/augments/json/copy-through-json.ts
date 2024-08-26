import {Jsonify, Writable} from 'type-fest';

/** The input here must be serializable otherwise the output will not match the input. */
export function copyThroughJson<const T>(input: T): Writable<Jsonify<T>> {
    try {
        return JSON.parse(JSON.stringify(input));
        /* node:coverage ignore next 4 */
    } catch (error) {
        console.error(`Failed to JSON copy for`, input);
        throw error;
    }
}
