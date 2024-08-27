import {defineConfig} from '@virmator/deps/configs/dep-cruiser.config.base';
import type {IConfiguration} from 'dependency-cruiser';

const baseConfig = defineConfig({
    fileExceptions: {
        // enter file exceptions by rule name here
        'no-orphans': {
            from: [
                'src/index.ts',
                /** Idk why dep-cruiser thinks this file is an orphan, it's clearly imported nearby. */
                'src/test-web/symlinked/element-focus.ts',
            ],
        },
        'not-to-unresolvable': {
            to: [
                'typedoc',
            ],
        },
    },
    omitRules: [
        // enter rule names here to omit
    ],
});

const depCruiserConfig: IConfiguration = {
    ...baseConfig,
};

module.exports = depCruiserConfig;
