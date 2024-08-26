import {check} from '@augment-vir/assert';
import {forEachEnv, MaybePromise, RuntimeEnv, stringify} from '@augment-vir/core';
import {filterMap} from '../array/filter.js';
import {removeSuffix} from '../string/suffix.js';
import {LogColorKey, type LogColorConfig} from './log-colors.js';
import {LogWriterParams} from './log-writer.js';

export type LoggerOptions = {
    colorConfig: LogColorConfig;
    omitColors: boolean;
};

export type ToLogStringParams = {
    colorKey: LogColorKey;
    args: ReadonlyArray<any>;
    options: Readonly<LoggerOptions>;
};

type ToLogString = (params: Readonly<ToLogStringParams>) => LogWriterParams;

async function createToLogString(): Promise<ToLogString> {
    return await forEachEnv<MaybePromise<ToLogString>>({
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
    });
}

export const toLogString: ToLogString = await createToLogString();
