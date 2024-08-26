import {assert} from '@augment-vir/assert';
import {getEnumValues, isRuntimeEnv, RuntimeEnv} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {defaultLogColorConfig, LogColorKey, logColors} from './log-colors.js';
import {toLogString} from './log-string.js';
import {createLoggerWithStoredLogs} from './log.js';
import {createLogger, defaultLoggerOptions} from './logger.js';

if (isRuntimeEnv(RuntimeEnv.Node)) {
    describe(toLogString.name, () => {
        it('adds colors to strings', () => {
            assert.deepEquals(
                toLogString({
                    colorKey: LogColorKey.Error,
                    args: ['hi'],
                    options: defaultLoggerOptions,
                }),
                {
                    text: `${defaultLogColorConfig.error.colors.join('')}hi${logColors[LogColorKey.Reset]}`,
                    css: undefined,
                },
            );
        });
        it('converts objects to string', () => {
            assert.deepEquals(
                toLogString({
                    colorKey: LogColorKey.Error,
                    args: [{hi: 'bye'}],
                    options: defaultLoggerOptions,
                }),
                {
                    text: `${defaultLogColorConfig.error.colors.join('')}{ hi: 'bye' }${logColors[LogColorKey.Reset]}`,
                    css: undefined,
                },
            );
        });
    });

    describe(createLogger.name, () => {
        const allExpectedLogs = {
            stdout: [
                `${logColors[LogColorKey.Bold]}bold${logColors[LogColorKey.Reset]}`,
                `${logColors[LogColorKey.Faint]}faint${logColors[LogColorKey.Reset]}`,
                `${logColors[LogColorKey.Info]}info${logColors[LogColorKey.Reset]}`,
                `${logColors[LogColorKey.Mutate]}${logColors[LogColorKey.Bold]}mutate${logColors[LogColorKey.Reset]}`,
                `${logColors[LogColorKey.NormalWeight]}normalWeight${logColors[LogColorKey.Reset]}`,
                `plain${logColors[LogColorKey.Reset]}`,
                `${logColors[LogColorKey.Reset]}reset${logColors[LogColorKey.Reset]}`,
                `${logColors[LogColorKey.Success]}${logColors[LogColorKey.Bold]}success${logColors[LogColorKey.Reset]}`,
            ],
            stderr: [
                `${logColors[LogColorKey.Error]}${logColors[LogColorKey.Bold]}error${logColors[LogColorKey.Reset]}`,
                `${logColors[LogColorKey.Warning]}warning${logColors[LogColorKey.Reset]}`,
            ],
        };

        it('creates a logger', () => {
            const {logger, logs} = createLoggerWithStoredLogs();

            getEnumValues(LogColorKey).forEach((key) => {
                logger[key](key);
            });

            assert.deepEquals(logs, allExpectedLogs);
        });
        it('logs if true', () => {
            const {logger, logs} = createLoggerWithStoredLogs();

            getEnumValues(LogColorKey).forEach((key) => {
                logger.if(true)[key](key);
            });

            assert.deepEquals(logs, allExpectedLogs);
        });
        it('skips logging if false', () => {
            const {logger, logs} = createLoggerWithStoredLogs();

            getEnumValues(LogColorKey).forEach((key) => {
                logger.if(false)[key](key);
            });

            assert.deepEquals(logs, {
                stdout: [],
                stderr: [],
            });
        });
    });
}
