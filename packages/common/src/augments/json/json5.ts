/** This is the _only_ way to import json5 that actually works. */
import json5 from 'json5';

/**
 * A simple wrapper for `json5.parse`. This is abstracted so that we don't have to worry about
 * remembering how to import json5 because a wrong import (like `import * as json5 from 'json5'`)
 * will fail at runtime but _not_ at build time.
 *
 * @category JSON : Common
 * @category Package : @augment-vir/common
 */
export function parseWithJson5(input: string): any {
    return json5.parse(input);
}

/**
 * A simple wrapper for `json5.stringify`. This is abstracted so that we don't have to worry about
 * remembering how to import json5 because a wrong import (like `import * as json5 from 'json5'`)
 * will fail at runtime but _not_ at build time.
 *
 * @category JSON : Common
 * @category Package : @augment-vir/common
 */
export function stringifyWithJson5(input: unknown): string {
    return json5.stringify(input);
}
