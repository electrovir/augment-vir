import {assert} from '@augment-vir/assert';
import {getEnumValues} from '@augment-vir/core';
import {describe, it} from '@augment-vir/test';
import {
    createLogger,
    createLoggerWithStoredLogs,
    LogColorKey,
    logColors,
    toLogString,
} from './log.js';

describe(toLogString.name, () => {
    it('adds colors to strings', () => {
        assert.strictEquals(
            toLogString({
                colors: [
                    LogColorKey.bold,
                    LogColorKey.error,
                ],
                args: ['hi'],
            }),
            `${logColors[LogColorKey.bold]}${logColors[LogColorKey.error]}hi${logColors[LogColorKey.reset]}\n`,
        );
    });
    it('converts objects to string', () => {
        assert.strictEquals(
            toLogString({
                colors: [
                    LogColorKey.bold,
                    LogColorKey.error,
                ],
                args: [{hi: 'bye'}],
            }),
            `${logColors[LogColorKey.bold]}${logColors[LogColorKey.error]}{ hi: 'bye' }${logColors[LogColorKey.reset]}\n`,
        );
    });
});

describe(createLogger.name, () => {
    const allExpectedLogs = {
        stdout: [
            `${logColors[LogColorKey.bold]}bold${logColors[LogColorKey.reset]}\n`,
            `${logColors[LogColorKey.faint]}faint${logColors[LogColorKey.reset]}\n`,
            `${logColors[LogColorKey.info]}info${logColors[LogColorKey.reset]}\n`,
            `${logColors[LogColorKey.mutate]}${logColors[LogColorKey.bold]}mutate${logColors[LogColorKey.reset]}\n`,
            `${logColors[LogColorKey.normalWeight]}normalWeight${logColors[LogColorKey.reset]}\n`,
            `plain${logColors[LogColorKey.reset]}\n`,
            `${logColors[LogColorKey.reset]}reset${logColors[LogColorKey.reset]}\n`,
            `${logColors[LogColorKey.success]}${logColors[LogColorKey.bold]}success${logColors[LogColorKey.reset]}\n`,
        ],
        stderr: [
            `${logColors[LogColorKey.error]}${logColors[LogColorKey.bold]}error${logColors[LogColorKey.reset]}\n`,
            `${logColors[LogColorKey.warning]}warning${logColors[LogColorKey.reset]}\n`,
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
