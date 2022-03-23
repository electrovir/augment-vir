import {join} from 'path';
import {InitialOptionsTsJest} from 'ts-jest';

const cwd = process.cwd();

export const virmatorJestConfig: InitialOptionsTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: cwd,
    // to account for GitHub Actions being really slow
    testTimeout: 20000,
    modulePathIgnorePatterns: ['.*.type.test.ts$'],
    roots: [join(cwd, 'src')],
    setupFilesAfterEnv: [join(__dirname, 'jest-setup.ts')],
    globals: {
        'ts-jest': {
            tsconfig: join(cwd, 'tsconfig.json'),
            diagnostics: {
                warnOnly: true,
                ignoreCodes: ['TS151001'],
            },
        },
    },
};

export default virmatorJestConfig;
