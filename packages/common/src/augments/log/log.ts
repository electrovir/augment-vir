import {isRuntimeEnv, RuntimeEnv, type PartialWithUndefined} from '@augment-vir/core';
import {addPrefix} from '../string/prefix.js';
import {LogOutputType} from './log-colors.js';
import {LoggerOptions} from './log-string.js';
import {LogWriters} from './log-writer.js';
import {createLogger, type Logger} from './logger.js';

export const defaultLogWriters: LogWriters =
    /** We calculate coverage in web, so the node code will never run in coverage tests. */
    /* node:coverage disable  */
    isRuntimeEnv(RuntimeEnv.Node)
        ? {
              [LogOutputType.Error]({text}) {
                  process.stderr.write(text + '\n');
              },
              [LogOutputType.Standard]({text}) {
                  process.stdout.write(text + '\n');
              },
          }
        : /* node:coverage enable  */
          {
              [LogOutputType.Error]({text, css}) {
                  console.error(addPrefix({value: text, prefix: '%c'}), css);
              },
              [LogOutputType.Standard]({text, css}) {
                  // eslint-disable-next-line no-console
                  console.log(addPrefix({value: text, prefix: '%c'}), css);
              },
          };

export const log: Logger = createLogger(defaultLogWriters);

export function createLoggerWithStoredLogs(
    options?: PartialWithUndefined<LoggerOptions> | undefined,
) {
    const logs = {
        stdout: [] as string[],
        stderr: [] as string[],
    };
    const log = createLogger(
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

    return {log, logs};
}
