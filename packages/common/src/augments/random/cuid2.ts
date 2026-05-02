import {createId} from '@paralleldrive/cuid2';

// cspell:word paralleldrive

/**
 * Creates a new CUID2 (collision-resistant unique identifier) using
 * [`@paralleldrive/cuid2`](https://www.npmjs.com/package/@paralleldrive/cuid2).
 *
 * @category Random
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function createCuid2(): string {
    return createId();
}
