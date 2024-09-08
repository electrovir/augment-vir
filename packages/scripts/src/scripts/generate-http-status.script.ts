/**
 * This generates `http-status.ts` in `@augment-vir/common` based on MDN documentation.
 *
 * How to run: cd packages/scripts; npx tsx src/scripts/generate-http-status.script.ts
 */

import {assert} from '@augment-vir/assert';
import {
    capitalizeFirstLetter,
    collapseWhiteSpace,
    kebabCaseToCamelCase,
    log,
    mapObjectValues,
    removePrefix,
    toEnsuredNumber,
} from '@augment-vir/common';
import {writeFileAndDir} from '@augment-vir/node';
import {JSDOM} from 'jsdom';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {relative} from 'node:path';
import {httpStatusOutputPath, mdnDownloadCachePath, monoRepoDirPath} from '../file-paths.js';

const mdnUrl = 'https://developer.mozilla.org/docs/Web/HTTP/Status#information_responses';

async function downloadMdn(): Promise<string> {
    if (existsSync(mdnDownloadCachePath)) {
        return String(await readFile(mdnDownloadCachePath));
    }

    const response = await fetch(mdnUrl);
    const body = await response.text();

    await writeFileAndDir(mdnDownloadCachePath, body);

    return body;
}

type ParsedHttpStatus = {
    name: string;
    number: number;
    description: string;
    url: string;
};

function determineStatusCategory(statusCode: number): HttpStatusCategory {
    if (statusCode >= 100 && statusCode < 200) {
        return HttpStatusCategory.Information;
    } else if (statusCode >= 200 && statusCode < 300) {
        return HttpStatusCategory.Success;
    } else if (statusCode >= 300 && statusCode < 400) {
        return HttpStatusCategory.Redirect;
    } else if (statusCode >= 400 && statusCode < 500) {
        return HttpStatusCategory.ClientError;
    } else if (statusCode >= 500 && statusCode < 600) {
        return HttpStatusCategory.ServerError;
    } else {
        throw new Error(`Unexpected http status code: ${statusCode}`);
    }
}

function parseStatusEntries(htmlString: string) {
    const dom = new JSDOM(htmlString);

    const statuses: ParsedHttpStatus[] = [];

    const elements = dom.window.document.querySelectorAll(
        [
            'section[aria-labelledby$="_responses"] dt',
            'section[aria-labelledby$="_responses"] dd',

            'section[aria-labelledby$="_messages"] dt',
            'section[aria-labelledby$="_messages"] dd',
        ].join(', '),
    );

    elements.forEach((element) => {
        if (element.tagName.toLowerCase() === 'dt') {
            const hyperlinkChild = element.querySelector('a');
            assert.isDefined(hyperlinkChild);
            const url = [
                'https://developer.mozilla.org',
                removePrefix({value: hyperlinkChild.href, prefix: '/'}),
            ].join('/');

            const [
                code,
                ...description
            ] = element.id.split('_');
            const name = kebabCaseToCamelCase(description.join('-'), {capitalizeFirstLetter: true});

            const newStatus: ParsedHttpStatus = {
                description: '',
                name,
                number: toEnsuredNumber(code),
                url,
            };

            statuses.push(newStatus);
        } else if (element.tagName.toLowerCase() === 'dd') {
            const latestStatus = statuses[statuses.length - 1];
            assert.isDefined(latestStatus);
            latestStatus.description = parseDescription(Array.from(element.children));
        } else {
            throw new Error(`Unexpected tag name: '${element.tagName}'`);
        }
    });

    const statusesByCategory: StatusesByCategory = {
        information: [],
        success: [],
        redirect: [],
        clientError: [],
        serverError: [],
    };

    statuses.forEach((status) => {
        const category = determineStatusCategory(status.number);
        statusesByCategory[category].push(status);
    });

    return mapObjectValues(statusesByCategory, (key, values) =>
        values.toSorted((a, b) => a.number - b.number),
    );
}

function parseDescription(children: Element[]): string {
    let description = '';
    children.forEach((child) => {
        if (child.tagName.toLowerCase() === 'p') {
            description += `\n\n${collapseWhiteSpace(child.textContent || '')}`;
        } else if (child.tagName.toLowerCase() === 'ul') {
            description += parseDescription(Array.from(child.children));
        } else if (child.tagName.toLowerCase() === 'li') {
            description += `\n- ${collapseWhiteSpace(child.textContent || '').replace(/ :/g, ':')}`;
        } else {
            throw new Error(`Unexpected description child tag: ${child.tagName}`);
        }
    });

    return description;
}

enum HttpStatusCategory {
    Information = 'information',
    Success = 'success',
    Redirect = 'redirect',
    ClientError = 'clientError',
    ServerError = 'serverError',
}

const orderedStatusCategories = [
    HttpStatusCategory.Information,
    HttpStatusCategory.Success,
    HttpStatusCategory.Redirect,
    HttpStatusCategory.ClientError,
    HttpStatusCategory.ServerError,
];

type StatusesByCategory = Record<HttpStatusCategory, ParsedHttpStatus[]>;

async function writeStatuses(statusesByCategory: StatusesByCategory) {
    let statusesInternals = '';
    let statusByCategoryString = '';

    orderedStatusCategories.forEach((category, index) => {
        const statuses = statusesByCategory[category];

        statusesInternals += `\n\n/** ${(index + 1) * 100} level codes (${category}) */\n\n`;
        statusByCategoryString += `[HttpStatusCategory.${capitalizeFirstLetter(category)}]: [`;

        statuses.forEach((status) => {
            statusesInternals += `/**\n* ${status.description}\n\n* See ${status.url}\n*/\n${status.name} = ${status.number},\n`;
            statusByCategoryString += `HttpStatus.${status.name},`;
        });

        statusByCategoryString += `],`;
    });

    const finalString = [
        `import type {ArrayElement} from '../array/array.js';

/**
 * All standardized HTTP status codes.
 *
 * These values are automatically parsed from https://developer.mozilla.org/docs/Web/HTTP/Status via
 * https://github.com/electrovir/augment-vir/blob/dev/packages/scripts/src/scripts/generate-http-status.script.ts
 * 
 * @category HTTP
 * @package [\`@augment-vir/common\`](https://www.npmjs.com/package/@augment-vir/common)
 * @category Package : @augment-vir/common
 */
export enum HttpStatus {`,
        statusesInternals,
        `}

/**
 * All standardized HTTP status code categories. These are determined by the first number in the
 * HTTP status code.
 *
 * @category HTTP
 * @package [\`@augment-vir/common\`](https://www.npmjs.com/package/@augment-vir/common)
 * @category Package : @augment-vir/common
 */
export enum HttpStatusCategory {
    Information = 'information',
    Success = 'success',
    Redirect = 'redirect',
    ClientError = 'clientError',
    ServerError = 'serverError',
}
    
/**
 * All standardized HTTP status codes grouped into their respective categories.
 *
 * @category HTTP
 * @package [\`@augment-vir/common\`](https://www.npmjs.com/package/@augment-vir/common)
 * @category Package : @augment-vir/common
 */
export const httpStatusByCategory = {`,
        statusByCategoryString,
        `} as const;

/**
 * All possible HTTP status codes for the given {@link HttpStatusCategory}.
 *
 * @category HTTP
 * @package [\`@augment-vir/common\`](https://www.npmjs.com/package/@augment-vir/common)
 * @category Package : @augment-vir/common
 */
export type HttpStatusByCategory<Category extends HttpStatusCategory> = ArrayElement<
    (typeof httpStatusByCategory)[Category]
>;
`,
        '\n',
    ].join('');

    await writeFileAndDir(httpStatusOutputPath, finalString);
    log.success(`Wrote to '${relative(monoRepoDirPath, httpStatusOutputPath)}'`);
}

async function generateHttpStatus() {
    const htmlString = await downloadMdn();
    const statuses = parseStatusEntries(htmlString);
    await writeStatuses(statuses);
}

await generateHttpStatus();
