import {collapseWhiteSpace, safeSplit} from '@augment-vir/common';
import {extname} from 'node:path';
import sanitizeFileName from 'sanitize-filename';

export function sanitizePath(original: string | null | undefined): string {
    if (!original) {
        return '';
    }
    const sanitized = sanitizeFileName(
        collapseWhiteSpace(original)
            .replaceAll(' ', '_')
            /** This ESLint error is wrong. */
            // eslint-disable-next-line sonarjs/duplicates-in-character-class
            .replaceAll(/['()*"![\]{}\s?=&<>:"/\-\\|]/g, '_')
            .replaceAll(/_{2,}/g, '_')
            .replace(/_$/, '')
            .replaceAll(/_\./g, '.')
            .replace(/^_+/, '')
            .toLowerCase(),
    ).trim();

    const extension = extname(sanitized);

    if (extension) {
        return [
            safeSplit(sanitized, extension)[0],
            extension.replaceAll('_', ''),
        ].join('');
    } else {
        return sanitized;
    }
}
