import {defineConfig} from '@playwright/test';
import {resolve} from 'node:path';

export default defineConfig({
    testDir: resolve(import.meta.dirname, '..', 'src'),
    testMatch: '*.test.e2e.ts',
    outputDir: resolve(
        import.meta.dirname,
        '..',
        '..',
        '..',
        '.not-committed',
        'playwright-output',
    ),
});
