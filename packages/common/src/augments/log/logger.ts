import type {PartialWithUndefined} from '@augment-vir/core';
import {mapEnumToObject} from '../object/map-enum.js';
import {mergeDefinedProperties} from '../object/merge-defined-properties.js';
import {defaultLogColorConfig, LogColorKey, LogOutputType} from './log-colors.js';
import {toLogString, ToLogStringParams, type LoggerOptions} from './log-string.js';
import {type LogWriters} from './log-writer.js';

/**
 * The base `log` methods.
 *
 * @category Log : Util
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export type LoggerLogs = Readonly<Record<LogColorKey, (...args: ReadonlyArray<unknown>) => void>>;

/**
 * Type for the `log` export.
 *
 * @category Log : Util
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export type Logger = LoggerLogs & {
    /**
     * Only logs if the given condition is `true`.
     *
     * @example
     *
     * ```ts
     * import {log} from '@augment-vir/common';
     *
     * // this will log
     * log.if(true).info('hi');
     * // this will not log
     * log.if(false).info('hi');
     * ```
     */
    if: (condition: boolean) => LoggerLogs;
};

/**
 * Default implementation of {@link LoggerOptions}.
 *
 * @category Log : Util
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export const defaultLoggerOptions: LoggerOptions = {
    colorConfig: defaultLogColorConfig,
    omitColors: false,
};

/**
 * A default {@link Logger} that simply does nothing.
 *
 * @category Log
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
export const emptyLog: Logger = createLogger({
    [LogOutputType.Error]() {},
    [LogOutputType.Standard]() {},
});

/**
 * Creates a custom {@link Logger}.
 *
 * @category Log
 * @category Package : @augment-vir/common
 * @package @augment-vir/common
 */
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
