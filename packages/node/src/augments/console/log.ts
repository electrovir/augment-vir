import {mapEnumToObject, removeColor, type PartialWithUndefined} from '@augment-vir/common';
import styles from 'ansi-styles';
import type {Socket} from 'node:net';
import {inspect} from 'node:util';

export enum LogColorKey {
    bold = 'bold',
    error = 'error',
    faint = 'faint',
    info = 'info',
    mutate = 'mutate',
    normalWeight = 'normalWeight',
    plain = 'plain',
    reset = 'reset',
    success = 'success',
    warning = 'warning',
}

export const logColors: Readonly<Record<LogColorKey, string>> = {
    [LogColorKey.bold]: styles.bold.open,
    [LogColorKey.error]: styles.red.open,
    [LogColorKey.faint]: styles.gray.open,
    [LogColorKey.info]: styles.cyan.open,
    [LogColorKey.mutate]: styles.magenta.open,
    [LogColorKey.normalWeight]: '\x1b[22m',
    [LogColorKey.plain]: '',
    [LogColorKey.reset]: styles.reset.open,
    [LogColorKey.success]: styles.green.open,
    [LogColorKey.warning]: styles.yellow.open,
};

type ToLoggingStringInputs = {
    colors: ReadonlyArray<LogColorKey>;
    args: ReadonlyArray<any>;
};

export function toLogString({colors, args}: ToLoggingStringInputs): string {
    return (
        colors.map((colorKey) => logColors[colorKey]).join('') +
        args
            .map((arg) => {
                if (typeof arg === 'string') {
                    return arg;
                } else {
                    return inspect(arg);
                }
            })
            .join('\n') +
        logColors[LogColorKey.reset] +
        '\n'
    );
}

export enum LogOutputType {
    standard = 'stdout',
    error = 'stderr',
}

export type LoggerLogs = Readonly<Record<LogColorKey, (...args: ReadonlyArray<unknown>) => void>>;

export type Logger = LoggerLogs & {if: (condition: boolean) => LoggerLogs};

const loggerColors: Readonly<Record<LogColorKey, {logType: LogOutputType; colors: LogColorKey[]}>> =
    {
        [LogColorKey.bold]: {
            colors: [
                LogColorKey.bold,
            ],
            logType: LogOutputType.standard,
        },
        [LogColorKey.faint]: {
            colors: [
                LogColorKey.faint,
            ],
            logType: LogOutputType.standard,
        },
        [LogColorKey.info]: {
            colors: [
                LogColorKey.info,
            ],
            logType: LogOutputType.standard,
        },
        [LogColorKey.mutate]: {
            colors: [
                LogColorKey.mutate,
                LogColorKey.bold,
            ],
            logType: LogOutputType.standard,
        },
        [LogColorKey.normalWeight]: {
            colors: [
                LogColorKey.normalWeight,
            ],
            logType: LogOutputType.standard,
        },
        [LogColorKey.plain]: {colors: [], logType: LogOutputType.standard},
        [LogColorKey.reset]: {
            colors: [
                LogColorKey.reset,
            ],
            logType: LogOutputType.standard,
        },
        [LogColorKey.success]: {
            colors: [
                LogColorKey.success,
                LogColorKey.bold,
            ],
            logType: LogOutputType.standard,
        },

        [LogColorKey.error]: {
            colors: [
                LogColorKey.error,
                LogColorKey.bold,
            ],
            logType: LogOutputType.error,
        },
        [LogColorKey.warning]: {
            colors: [
                LogColorKey.warning,
            ],
            logType: LogOutputType.error,
        },
    };

export function createLogger(logWriters: Record<LogOutputType, Pick<Socket, 'write'>>) {
    function writeLog(inputs: ToLoggingStringInputs & {logType: LogOutputType}): void {
        logWriters[inputs.logType].write(toLogString(inputs));
    }
    const loggerLogs: LoggerLogs = mapEnumToObject(LogColorKey, (key) => {
        return (...args: unknown[]) =>
            writeLog({
                args,
                ...loggerColors[key],
            });
    });

    return {
        ...loggerLogs,
        if(condition: boolean) {
            if (condition) {
                return loggerLogs;
            } else {
                return emptyLog;
            }
        },
    };
}

export function createLoggerWithStoredLogs(
    options: PartialWithUndefined<{removeColors: boolean}> = {},
) {
    const logs = {
        stdout: [] as string[],
        stderr: [] as string[],
    };
    const logger = createLogger({
        stderr: {
            write(arg) {
                logs.stderr.push(options.removeColors ? removeColor(String(arg)) : String(arg));
                return true;
            },
        },
        stdout: {
            write(arg) {
                logs.stdout.push(options.removeColors ? removeColor(String(arg)) : String(arg));
                return true;
            },
        },
    });

    return {logger, logs};
}

export const emptyLog: Logger = createLogger({
    stderr: {
        write() {
            return true;
        },
    },
    stdout: {
        write() {
            return true;
        },
    },
});

export const log: Logger = createLogger(process);
