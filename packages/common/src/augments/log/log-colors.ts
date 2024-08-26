import {forEachEnv, RuntimeEnv} from '@augment-vir/core';

export enum LogOutputType {
    Standard = 'stdout',
    Error = 'stderr',
}

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
    return await forEachEnv({
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

export const logColors: Readonly<Record<LogColorKey, string>> = await determineDefaultLogColors();

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
