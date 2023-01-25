import {itCases} from '@augment-vir/browser-testing';
import {html} from 'element-vir';
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import {convertTemplateToString} from './lit-template';

describe(convertTemplateToString.name, () => {
    itCases(convertTemplateToString, [
        {
            it: 'should handle attributes that are not surrounded in quotes',
            input: html`
                <img src=${'what have we here!?'} />
            `,
            expect: '<img src="what have we here!?" />',
        },
        {
            it: 'should handle unsafe SVG',
            input: unsafeSVG(`<svg></svg>`),
            expect: '<svg></svg>',
        },
    ]);
});
