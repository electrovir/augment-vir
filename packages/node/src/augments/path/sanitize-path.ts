import {collapseWhiteSpace, safeSplit} from '@augment-vir/common';
import {extname} from 'node:path';
import sanitizeFileName from 'sanitize-filename';

/** @deprecated: use `sanitizeFilePath` from `@augment-vir/common` instead. */
export function sanitizePath(original: string | null | undefined): string | undefined {
    if (!original) {
        return undefined;
    }
    const sanitized = sanitizeFileName(
        collapseWhiteSpace(original)
            .replaceAll(' ', '_')
            /** This ESLint error is wrong. */
            .replaceAll(/['()*"![\]{}\s?=&<>:/\-\\|]/g, '_')
            .replaceAll(/_{2,}/g, '_')
            .replace(/_$/, '')
            .replaceAll(/_\./g, '.')
            .replace(/^_+/, '')
            .replace(/^\.+/, '')
            .toLowerCase(),
    ).trim();

    const extension = extname(sanitized);

    if (extension) {
        return [
            safeSplit(sanitized, extension)[0],
            extension.replaceAll('_', ''),
        ].join('');
    } else {
        return sanitized || undefined;
    }
}
