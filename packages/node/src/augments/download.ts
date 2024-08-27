import {createWriteStream} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {Readable} from 'node:stream';
import {finished} from 'node:stream/promises';
import type {ReadableStream} from 'node:stream/web';

export async function downloadFile({url, writePath}: {url: string; writePath: string}) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
    }

    /** Idk how to actually trigger a response with no body. */
    /* node:coverage ignore next 3 */
    if (!response.body) {
        throw new Error(`Response body is missing from '${url}'.`);
    }

    await mkdir(dirname(writePath), {recursive: true});
    const fileStream = createWriteStream(writePath);
    await finished(Readable.fromWeb(response.body as ReadableStream).pipe(fileStream));
}
