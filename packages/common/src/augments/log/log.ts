import {addPrefix, PartialWithUndefined, RuntimeEnv} from '@augment-vir/common';
import {isRuntimeEnv} from '@augment-vir/core';
import {LogOutputType} from './log-colors.js';
import {LoggerOptions} from './log-string.js';
import {LogWriters} from './log-writer.js';
import {createLogger, type Logger} from './logger.js';

export const defaultLogWriters: LogWriters = isRuntimeEnv(RuntimeEnv.Node)
    ? {
          [LogOutputType.Error]({text}) {
              process.stderr.write(text + '\n');
          },
          [LogOutputType.Standard]({text}) {
              process.stdout.write(text + '\n');
          },
      }
    : {
          [LogOutputType.Error]({text, css}) {
              console.error(addPrefix({value: text, prefix: '%c'}), css);
          },
          [LogOutputType.Standard]({text, css}) {
              // eslint-disable-next-line no-console
              console.log(addPrefix({value: text, prefix: '%c'}), css);
          },
      };

export const emptyLog: Logger = createLogger({
    [LogOutputType.Error]() {},
    [LogOutputType.Standard]() {},
});

export const log: Logger = createLogger(defaultLogWriters);

export function createLoggerWithStoredLogs(
    options?: PartialWithUndefined<LoggerOptions> | undefined,
) {
    const logs = {
        stdout: [] as string[],
        stderr: [] as string[],
    };
    const logger = createLogger(
        {
            stderr({text}) {
                logs.stderr.push(text);
            },
            stdout({text}) {
                logs.stdout.push(text);
            },
        },
        options,
    );

    return {logger, logs};
}
