import {parse} from 'node:path';

function getSystemRootPath() {
    return parse(process.cwd()).root;
}

export const systemRootPath = getSystemRootPath();
