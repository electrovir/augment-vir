import {check} from '@augment-vir/assert';
import {MaybePromise, perEnv, RuntimeEnv, stringify} from '@augment-vir/core';
import {filterMap} from '../array/filter.js';
import {removeSuffix} from '../string/suffix.js';
import {LogColorKey, type LogColorConfig} from './log-colors.js';
import {LogWriterParams} from './log-writer.js';

/**
 * Options for a custom Logger.
 *
 * @category Log : Util
 * @package @augment-vir/common
 */
export type LoggerOptions = {
    colorConfig: LogColorConfig;
    omitColors: boolean;
};

/**
 * Parameters for {@link toLogString}.
 *
 * @category Log : Util
 * @package @augment-vir/common
 */
export type ToLogStringParams = {
    colorKey: LogColorKey;
    args: ReadonlyArray<any>;
    options: Readonly<LoggerOptions>;
};

type ToLogString = (params: Readonly<ToLogStringParams>) => LogWriterParams;

async function createToLogString(): Promise<ToLogString> {
    return await perEnv<MaybePromise<ToLogString>>({
        /** We calculate coverage in web, so the node code will never run in coverage tests. */
        /* node:coverage disable  */
        async [RuntimeEnv.Node]() {
            const {inspect} = await import('node:util');

            return ({args, colorKey, options}) => {
                const argStrings = args.map((arg) => {
                    if (typeof arg === 'string') {
                        return arg;
                    } else {
                        return inspect(arg);
                    }
                });

                const colorsString = options.omitColors
                    ? ''
                    : options.colorConfig[colorKey].colors.join('');

                const text = [
                    colorsString,
                    argStrings.join('\n'),
                    options.omitColors
                        ? ''
                        : options.colorConfig[LogColorKey.Reset].colors.join(''),
                ].join('');

                return {text, css: undefined};
            };
        },
        /**
         * We have no way to test color output in the browser console so this block is ignored in
         * coverage as well.
         */
        [RuntimeEnv.Web]() {
            return ({args, colorKey, options}) => {
                const css = options.omitColors
                    ? undefined
                    : filterMap(
                          options.colorConfig[colorKey].colors,
                          (cssString) =>
                              removeSuffix({
                                  value: cssString,
                                  suffix: ';',
                              }),
                          check.isTruthy,
                      ).join('; ');

                const argStrings = args.map((arg) => {
                    if (typeof arg === 'string') {
                        return arg;
                    } else {
                        return stringify(arg);
                    }
                });

                const text = [
                    argStrings.join('\n'),
                    options.omitColors
                        ? ''
                        : options.colorConfig[LogColorKey.Reset].colors.join(''),
                ].join('');

                return {text, css};
            };
        },
        /* node:coverage enable  */
    });
}

/**
 * Converts log arguments into a single {@link LogWriterParams}.
 *
 * @category Log : Util
 * @package @augment-vir/common
 */
export const toLogString: ToLogString = await createToLogString();
