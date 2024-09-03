import {perEnv, RuntimeEnv} from '@augment-vir/core';

/**
 * Supported log output types.
 *
 * @category Log : Util
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export enum LogOutputType {
    /** Logged to stdout if the current environment supports it, or just `console.log`. */
    Standard = 'stdout',
    /** Logged to stderr if the current environment supports it, or just `console.error`. */
    Error = 'stderr',
}

/**
 * Standardized color keys for logging. If you want to use customized colors, use
 * [ansi-styles](https://www.npmjs.com/package/ansi-styles) in Node.js or [custom
 * CSS](https://developer.mozilla.org/en-US/docs/Web/API/console#styling_console_output) in
 * browsers.
 *
 * @category Log : Util
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export enum LogColorKey {
    Bold = 'bold',
    Error = 'error',
    Faint = 'faint',
    Info = 'info',
    Mutate = 'mutate',
    NormalWeight = 'normalWeight',
    Plain = 'plain',
    Reset = 'reset',
    Success = 'success',
    Warning = 'warning',
}

/**
 * Configuration for creating a logger. This is not required, as a default configuration is built-in
 * already.
 *
 * @category Log : Util
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export type LogColorConfig = Readonly<
    Record<
        LogColorKey,
        {
            /** Either an array of CSS property assignments */
            colors: string[];
            logType: LogOutputType;
        }
    >
>;

async function determineDefaultLogColors(): Promise<Record<LogColorKey, string>> {
    return await perEnv({
        /** We calculate coverage in web, so the node code will never run in coverage tests. */
        /* node:coverage disable  */
        async [RuntimeEnv.Node]() {
            const styles = (await import('ansi-styles')).default;

            return {
                [LogColorKey.Bold]: styles.bold.open,
                [LogColorKey.Error]: styles.red.open,
                [LogColorKey.Faint]: styles.gray.open,
                [LogColorKey.Info]: styles.cyan.open,
                [LogColorKey.Mutate]: styles.magenta.open,
                [LogColorKey.NormalWeight]: '\x1b[22m',
                [LogColorKey.Plain]: '',
                [LogColorKey.Reset]: styles.reset.open,
                [LogColorKey.Success]: styles.green.open,
                [LogColorKey.Warning]: styles.yellow.open,
            };
        },
        /* node:coverage enable  */
        [RuntimeEnv.Web]() {
            return Promise.resolve({
                [LogColorKey.Bold]: 'font-weight: bold',
                [LogColorKey.Error]: 'color: red',
                [LogColorKey.Faint]: 'color: grey',
                [LogColorKey.Info]: 'color: teal',
                [LogColorKey.Mutate]: 'color: magenta',
                [LogColorKey.NormalWeight]: '',
                [LogColorKey.Plain]: '',
                [LogColorKey.Reset]: '',
                [LogColorKey.Success]: 'color: green',
                [LogColorKey.Warning]: 'color: orange',
            });
        },
    });
}

/**
 * Mapping of color keys to the current color string.
 *
 * @category Log : Util
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export const logColors: Readonly<Record<LogColorKey, string>> = await determineDefaultLogColors();

/**
 * Default implementation of {@link LogColorConfig}.
 *
 * @category Log : Util
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export const defaultLogColorConfig: LogColorConfig = {
    [LogColorKey.Bold]: {
        colors: [
            logColors.bold,
        ],
        logType: LogOutputType.Standard,
    },
    [LogColorKey.Faint]: {
        colors: [
            logColors.faint,
        ],
        logType: LogOutputType.Standard,
    },
    [LogColorKey.Info]: {
        colors: [
            logColors.info,
        ],
        logType: LogOutputType.Standard,
    },
    [LogColorKey.Mutate]: {
        colors: [
            logColors.mutate,
            logColors.bold,
        ],
        logType: LogOutputType.Standard,
    },
    [LogColorKey.NormalWeight]: {
        colors: [
            logColors.normalWeight,
        ],
        logType: LogOutputType.Standard,
    },
    [LogColorKey.Plain]: {colors: [], logType: LogOutputType.Standard},
    [LogColorKey.Reset]: {
        colors: [
            logColors.reset,
        ],
        logType: LogOutputType.Standard,
    },
    [LogColorKey.Success]: {
        colors: [
            logColors.success,
            logColors.bold,
        ],
        logType: LogOutputType.Standard,
    },

    [LogColorKey.Error]: {
        colors: [
            logColors.error,
            logColors.bold,
        ],
        logType: LogOutputType.Error,
    },
    [LogColorKey.Warning]: {
        colors: [
            logColors.warning,
        ],
        logType: LogOutputType.Error,
    },
};
