import axios from 'axios';
import {writeFile} from 'fs/promises';

export async function downloadFile({url, writePath}: {url: string; writePath: string}) {
    const fileResponse = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    await writeFile(writePath, fileResponse.data);
}

export async function isStatusOkay(status: number): Promise<boolean> {
    return status < 300 && status >= 200;
}
