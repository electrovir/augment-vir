import {describe, itCases} from '@augment-vir/test';
import {sanitizePath} from './sanitize-path.js';

describe(sanitizePath.name, () => {
    itCases(sanitizePath, [
        // cspell:disable
        {
            it: 'passes a clean file name',
            input: 'derp.pdf',
            expect: 'derp.pdf',
        },
        {
            it: 'removes spaces and lowercases',
            input: ' My File Name.PDF ',
            expect: 'my_file_name.pdf',
        },
        {
            it: 'removes brackets, quotes, asterisks, and exclamations',
            input: 'a(b)c[d]{e}!"f"*.pdf',
            expect: 'a_b_c_d_e_f.pdf',
        },
        {
            it: 'removes question mark, ampersand, equals, and colon',
            input: 'a?b&c=d:e.pdf',
            expect: 'a_b_c_d_e.pdf',
        },
        {
            it: 'removes forward and back slashes',
            input: String.raw`a/b\c.pdf`,
            expect: 'a_b_c.pdf',
        },
        {
            it: 'removes pipes, hyphens, and underscores',
            input: 'a-b_c|d.pdf',
            expect: 'a_b_c_d.pdf',
        },
        {
            it: 'keeps dots and lowercases extension',
            input: 'Report.v1.PDF',
            expect: 'report.v1.pdf',
        },
        {
            it: 'removes everything',
            input: '***???!!!',
            expect: '',
        },
        {
            it: 'fixes real file name',
            input: 'MAR - 08/18/2025',
            expect: 'mar_08_18_2025',
        },
        {
            it: 'removes all kinds of whitespace including tabs and newlines',
            input: 'bad\tname\n data .pdf',
            expect: 'bad_name_data.pdf',
        },
        {
            it: 'handles unicode letters and spaces',
            input: 'Ångström 2024.PDF',
            expect: 'ångström_2024.pdf',
        },
        {
            it: 'strips angle brackets and quotes',
            input: '<bad>"name".pdf',
            expect: 'bad_name.pdf',
        },
        {
            it: 'strips url-like params characters',
            input: 'file-name=weird&stuff?.pdf',
            expect: 'file_name_weird_stuff.pdf',
        },
        {
            it: 'sanitizes path-like inputs',
            input: String.raw`C:\temp\Bad File.PDF`,
            expect: 'c_temp_bad_file.pdf',
        },
        {
            it: 'handles names without an extension',
            input: 'PDF',
            expect: 'pdf',
        },
        {
            it: 'removes hyphen before extension',
            input: 'file-.pdf',
            expect: 'file.pdf',
        },
        {
            it: 'removes pipe suffix segment',
            input: 'file|notes.pdf',
            expect: 'file_notes.pdf',
        },
        {
            it: 'repairs punctuation inside extension',
            input: 'name.pd:f',
            expect: 'name.pdf',
        },
    ]);
});
