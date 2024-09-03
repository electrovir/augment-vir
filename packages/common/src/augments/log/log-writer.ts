import {type LogOutputType} from './log-colors.js';

/**
 * Params for {@link LogWriter}
 *
 * @category Log : Util
 * @package @augment-vir/common
 */
export type LogWriterParams = {
    text: string;
    /** Typically this is only relevant in a browser console. */
    css: string | undefined;
};

/**
 * The final step in writing a log. This will actually perform the logging of text to the console.
 * CSS will be applied if this is called within a browser.
 *
 * @category Log : Util
 * @package @augment-vir/common
 */
export type LogWriter = (params: Readonly<LogWriterParams>) => void;

/**
 * A log writer for each log output type.
 *
 * @category Log : Util
 * @package @augment-vir/common
 */
export type LogWriters = Record<LogOutputType, LogWriter>;
