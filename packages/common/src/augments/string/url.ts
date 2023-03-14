const protocolSplit = '://';

/**
 * Joins all given arguments together as if they were parts of a URL. Preserves trailing slashes and
 * removes consecutive slashes in the path. This also encodes each URL part.
 *
 * @example: joinToUrl('https://example.com', 'path1', 'path2/', '/path3/') === 'https://example.com/path1/path2/path3/'
 */
export function joinUrlParts(...urlParts: ReadonlyArray<string>): string {
    const rawJoined = urlParts.join('/');
    const [
        protocol,
        rawRest = '',
    ] = rawJoined.includes(protocolSplit)
        ? rawJoined.split(protocolSplit)
        : [
              '',
              rawJoined,
          ];

    let mapSearchParamsStarted = false;
    let reduceSearchParamsStarted = false;
    const fixedRest = rawRest
        .replace(/\/{2,}/g, '/')
        .split('/')
        .map((part) => {
            if (part.includes('?') || mapSearchParamsStarted) {
                mapSearchParamsStarted = true;
                return part;
            } else {
                return encodeURIComponent(part);
            }
        })
        .reduce((fillingUpArray, currentEntry, currentIndex, inputArray) => {
            if (reduceSearchParamsStarted) {
                return fillingUpArray;
            }

            const nextEntry = inputArray[currentIndex + 1];

            let newEntry = currentEntry;

            const nextHasQuestion = !currentEntry.includes('?') && nextEntry?.startsWith('?');

            if (nextEntry?.startsWith('?') || nextHasQuestion) {
                reduceSearchParamsStarted = true;
                let foundHash = false;
                const subsequentSearchParams = inputArray
                    .slice(nextHasQuestion ? currentIndex + 2 : currentIndex + 1)
                    .reduce((joinedParams, currentParam) => {
                        if (currentParam.includes('#')) {
                            foundHash = true;
                        }

                        if (foundHash) {
                            return joinedParams.concat(currentParam);
                        } else {
                            return [
                                joinedParams,
                                currentParam,
                            ].join('&');
                        }
                    }, '');

                newEntry = [
                    currentEntry,
                    nextEntry,
                    subsequentSearchParams,
                ].join('');
            }

            return fillingUpArray.concat(newEntry);
        }, [] as (string | undefined)[]);
    return [
        protocol,
        protocol ? protocolSplit : '',
        fixedRest.join('/'),
    ].join('');
}
