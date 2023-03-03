import {randomString} from './browser-random';

/** Creates a new array which is a shuffled version of the input array. */
export function shuffleArray<ArrayElementType>(
    input: ReadonlyArray<ArrayElementType>,
): Array<ArrayElementType> {
    return input
        .map((value) => {
            return {value, sort: randomString()};
        })
        .sort((a, b) => a.sort.localeCompare(b.sort))
        .map(({value}) => value);
}
