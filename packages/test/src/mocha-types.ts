/**
 * Extracted from https://www.npmjs.com/package/@types/mocha/v/10.0.7 with modifications to prevent
 * leakage of global types.
 *
 * The original code has the following license:
 *
 * MIT License
 *
 * Copyright (c) Microsoft Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE
 */

interface Runnable extends NodeJS.EventEmitter {
    on(event: 'error', listener: (error: any) => void): this;
    once(event: 'error', listener: (error: any) => void): this;
    addListener(event: 'error', listener: (error: any) => void): this;
    removeListener(event: 'error', listener: (error: any) => void): this;
    prependListener(event: 'error', listener: (error: any) => void): this;
    prependOnceListener(event: 'error', listener: (error: any) => void): this;
    emit(name: 'error', error: any): boolean;
}
interface Runnable extends NodeJS.EventEmitter {
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    addListener(event: string, listener: (...args: any[]) => void): this;
    removeListener(event: string, listener: (...args: any[]) => void): this;
    prependListener(event: string, listener: (...args: any[]) => void): this;
    prependOnceListener(event: string, listener: (...args: any[]) => void): this;
    emit(name: string, ...args: any[]): boolean;
}

interface Test extends Runnable {
    type: 'test';
    speed?: 'slow' | 'medium' | 'fast' | undefined; // added by reporters
    err?: Error | undefined; // added by reporters
    clone(): Test;
}

export interface MochaContext {
    test?: Runnable | undefined;
    currentTest?: Test | undefined;

    /** Get the context `Runnable`. */
    runnable(): Runnable;

    /** Set the context `Runnable`. */
    runnable(runnable: Runnable): MochaContext;

    /** Get test timeout. */
    timeout(): number;

    /** Set test timeout. */
    timeout(ms: string | number): MochaContext;

    /** Get test slowness threshold. */
    slow(): number;

    /** Set test slowness threshold. */
    slow(ms: string | number): MochaContext;

    /** Mark a test as skipped. */
    skip(): never;

    /** Get the number of allowed retries on failed tests. */
    retries(): number;

    /** Set the number of allowed retries on failed tests. */
    retries(n: number): MochaContext;

    [key: string]: any;
}
