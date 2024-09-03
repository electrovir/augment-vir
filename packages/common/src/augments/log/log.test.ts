import {assert} from '@augment-vir/assert';
import {getEnumValues, isRuntimeEnv, RuntimeEnv} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {defaultLogColorConfig, LogColorKey, logColors} from './log-colors.js';
import {toLogString} from './log-string.js';
import {createArrayLogger} from './log.js';
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
        it('omits colors to strings', () => {
            assert.deepEquals(
                toLogString({
                    colorKey: LogColorKey.Error,
                    args: ['hi'],
                    options: {
                        ...defaultLoggerOptions,
                        omitColors: true,
                    },
                }),
                {
                    text: 'hi',
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
            const {log, logs} = createArrayLogger();

            getEnumValues(LogColorKey).forEach((key) => {
                log[key](key);
            });

            assert.deepEquals(logs, allExpectedLogs);
        });
        it('logs if true', () => {
            const {log, logs} = createArrayLogger();

            getEnumValues(LogColorKey).forEach((key) => {
                log.if(true)[key](key);
            });

            assert.deepEquals(logs, allExpectedLogs);
        });
        it('skips logging if false', () => {
            const {log, logs} = createArrayLogger();

            getEnumValues(LogColorKey).forEach((key) => {
                log.if(false)[key](key);
            });

            assert.deepEquals(logs, {
                stdout: [],
                stderr: [],
            });
        });
    });
}

describe(createArrayLogger.name, () => {
    it('stores logs', () => {
        const {log, logs} = createArrayLogger();

        log.error('this is an error');
        log.plain('this is a log');
        log.if(false).error('missing error');
        log.if(true).error('not missing error');
        log.if(false).plain('missing log');
        log.if(true).plain('not missing log');

        assert.deepEquals(logs, {
            stderr: [
                'this is an error',
                'not missing error',
            ],
            stdout: [
                'this is a log',
                'not missing log',
            ],
        });
    });
});
