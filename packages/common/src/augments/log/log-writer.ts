import {type LogOutputType} from './log-colors.js';

export type LogWriterParams = {
    text: string;
    /** Typically this is only relevant in a browser console. */
    css: string | undefined;
};

export type LogWriter = (params: Readonly<LogWriterParams>) => void;

export type LogWriters = Record<LogOutputType, LogWriter>;
