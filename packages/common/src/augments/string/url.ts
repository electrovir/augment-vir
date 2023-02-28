const protocolSplit = '://';

/**
 * Joins all given arguments together as if they were parts of a URL. Preserves trailing slashes and
 * removes consecutive slashes in the path. This also encodes each part of the
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

    const fixedRest = rawRest
        .replace(/\/{2,}/g, '/')
        .split('/')
        .map((part) => encodeURIComponent(part));

    return [
        protocol,
        protocol ? protocolSplit : '',
        fixedRest.join('/'),
    ].join('');
}
