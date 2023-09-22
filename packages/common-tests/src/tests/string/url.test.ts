import {itCases} from '@augment-vir/chai';
import {joinUrlParts} from '@augment-vir/common';

describe(joinUrlParts.name, () => {
    itCases(joinUrlParts, [
        {
            it: 'formats simple url correctly',
            inputs: [
                'https://wikipedia.org',
                'other path',
                'page',
            ],
            expect: 'https://wikipedia.org/other path/page',
        },
        {
            it: 'strips duplicate slashes',
            inputs: [
                'https://wikipedia.org',
                '/path1/',
                'path2/',
                'path3',
                '/path4',
            ],
            expect: 'https://wikipedia.org/path1/path2/path3/path4',
        },
        {
            it: 'works without a protocol',
            inputs: [
                'wikipedia.org',
                '/path1/',
                'path2/',
                'path3',
                '/path4',
            ],
            expect: 'wikipedia.org/path1/path2/path3/path4',
        },
        {
            it: 'leaves trailing slashes',
            inputs: [
                'https://wikipedia.org',
                'a',
                'b',
                'c',
                'd/',
            ],
            expect: 'https://wikipedia.org/a/b/c/d/',
        },
        {
            it: 'splits parts with internal slashes',
            inputs: [
                'https://wikipedia.org',
                'start/end',
                'actual end',
            ],
            expect: 'https://wikipedia.org/start/end/actual end',
        },
        {
            it: 'does not encode url parts',
            inputs: [
                'http://localhost:5432',
                'start',
                'end',
            ],
            expect: 'http://localhost:5432/start/end',
        },
        {
            it: 'does not encode query params',
            inputs: [
                'https://wikipedia.org',
                'start/end',
                'actual end',
                '?stuff=yes&hi=what',
            ],
            expect: 'https://wikipedia.org/start/end/actual end?stuff=yes&hi=what',
        },
        {
            it: 'joins query params with &',
            inputs: [
                'https://wikipedia.org',
                'start/end',
                'actual end',
                '?stuff=hoopla',
                'hi=more',
            ],
            expect: 'https://wikipedia.org/start/end/actual end?stuff=hoopla&hi=more',
        },
        {
            it: 'does not join hash params with anything',
            inputs: [
                'https://wikipedia.org',
                'start/end',
                'actual end',
                '?stuff=some-hash',
                '#hash-stuff-he',
                're-hash',
            ],
            expect: 'https://wikipedia.org/start/end/actual end?stuff=some-hash#hash-stuff-here-hash',
        },
    ]);
});
