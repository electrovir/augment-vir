import {addPrefix} from './prefix.js';
import {addSuffix} from './suffix.js';

export function wrapString({value, wrapper}: {value: string; wrapper: string}): string {
    return addPrefix({value: addSuffix({value, suffix: wrapper}), prefix: wrapper});
}
