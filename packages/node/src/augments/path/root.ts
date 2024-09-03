import {parse} from 'node:path';

function getSystemRootPath() {
    return parse(process.cwd()).root;
}

/**
 * The root path of the system containing the cwd.
 *
 * @category Path : Node
 * @category Package : @augment-vir/node
 * @package @augment-vir/node
 */
export const systemRootPath = getSystemRootPath();
