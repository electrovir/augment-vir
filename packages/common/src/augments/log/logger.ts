import type {PartialWithUndefined} from '@augment-vir/core';
import {mapEnumToObject} from '../object/map-enum.js';
import {mergeDefinedProperties} from '../object/merge-defined-properties.js';
import {defaultLogColorConfig, LogColorKey, LogOutputType} from './log-colors.js';
import {toLogString, ToLogStringParams, type LoggerOptions} from './log-string.js';
import {type LogWriters} from './log-writer.js';

export type LoggerLogs = Readonly<Record<LogColorKey, (...args: ReadonlyArray<unknown>) => void>>;

export type Logger = LoggerLogs & {if: (condition: boolean) => LoggerLogs};

export const defaultLoggerOptions: LoggerOptions = {
    colorConfig: defaultLogColorConfig,
    omitColors: false,
};

export const emptyLog: Logger = createLogger({
    [LogOutputType.Error]() {},
    [LogOutputType.Standard]() {},
});

export function createLogger(
    logWriters: LogWriters,
    optionsOverride?: PartialWithUndefined<LoggerOptions> | undefined,
): Logger {
    const options = mergeDefinedProperties(defaultLoggerOptions, optionsOverride);

    function writeLog(params: Omit<ToLogStringParams, 'options'>): void {
        logWriters[options.colorConfig[params.colorKey].logType](
            toLogString({
                ...params,
                options,
            }),
        );
    }
    const loggerLogs: LoggerLogs = mapEnumToObject(LogColorKey, (colorKey) => {
        return (...args: unknown[]) =>
            writeLog({
                args,
                colorKey,
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
