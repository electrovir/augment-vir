import {isRuntimeEnv, RuntimeEnv, type PartialWithUndefined} from '@augment-vir/core';
import {addPrefix} from '../string/prefix.js';
import {LogOutputType} from './log-colors.js';
import {LoggerOptions} from './log-string.js';
import {LogWriters} from './log-writer.js';
import {createLogger, type Logger} from './logger.js';

/**
 * Default implementation of {@link LogWriters} that is dependent on the current runtime environment.
 *
 * @category Log : Util
 * @package @augment-vir/common
 */
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

/**
 * The default `log`. Use this in place of `console` methods for styled outputs in both Node.js and
 * the browser.
 *
 * @category Log : Common
 * @example
 *
 * ```ts
 * import {log} from '@augment-vir/common';
 *
 * log.info('hi');
 * log.error('failure');
 * ```
 *
 * @package @augment-vir/common
 */
export const log: Logger = createLogger(defaultLogWriters);

/**
 * Creates a custom logger that doesn't actually log but stores the logs into a object for later
 * usage. This is particularly useful in tests.
 *
 * @category Log : Common
 * @example
 *
 * ```ts
 * import {createArrayLogger} from '@augment-vir/common';
 *
 * const {log, logs} = createArrayLogger();
 *
 * log.info('hi');
 * // `logs[LogOutputType.Standard]` is now `['hi']`
 * ```
 *
 * @package @augment-vir/common
 */
export function createArrayLogger(options?: PartialWithUndefined<LoggerOptions> | undefined) {
    const logs = {
        [LogOutputType.Standard]: [] as string[],
        [LogOutputType.Error]: [] as string[],
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
