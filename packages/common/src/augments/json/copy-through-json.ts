import JSON5 from 'json5';
import {Writable} from 'type-fest';

/** The input here must be serializable otherwise JSON parsing errors will be thrown */
export function copyThroughJson<T>(input: Readonly<T>): Writable<T> {
    try {
        return JSON5.parse(JSON5.stringify(input));
    } catch (error) {
        console.error(`Failed to JSON copy for`, input);
        throw error;
    }
}
