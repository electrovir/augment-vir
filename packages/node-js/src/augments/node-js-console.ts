import {mapObjectValues} from '@augment-vir/common';
import {styles} from 'ansi-colors';
import type {Socket} from 'net';
import {createInterface} from 'readline';
import {inspect} from 'util';

export enum ColorKey {
    bold = 'bold',
    error = 'error',
    faint = 'faint',
    normalWeight = 'normal-weight',
    info = 'info',
    mutate = 'mutate',
    reset = 'reset',
    success = 'success',
}

export const logColors: Readonly<Record<ColorKey, string>> = {
    [ColorKey.bold]: styles.bold.open,
    [ColorKey.error]: styles.red.open,
    [ColorKey.normalWeight]: '\x1b[22m',
    [ColorKey.faint]: styles.gray.open,
    [ColorKey.info]: styles.cyan.open,
    [ColorKey.mutate]: styles.magenta.open,
    [ColorKey.reset]: styles.reset.open,
    [ColorKey.success]: styles.green.open,
};

type ToLoggingStringInputs = {
    colors: ColorKey | ReadonlyArray<ColorKey>;
    args: ReadonlyArray<any>;
};

export function toLogString({colors, args}: ToLoggingStringInputs): string {
    const colorKeysArray: ReadonlyArray<ColorKey> = Array.isArray(colors) ? colors : [colors];

    return (
        colorKeysArray.map((colorKey) => logColors[colorKey]).join('') +
        args.map((arg) => {
            if (typeof arg === 'string') {
                return arg;
            } else {
                return inspect(arg);
            }
        }) +
        logColors[ColorKey.reset] +
        '\n'
    );
}

export enum LogOutputType {
    standard = 'stdout',
    error = 'stderr',
}

export type Logger = ReturnType<typeof createLogger>;

export function createLogger(logWriters: Record<LogOutputType, Pick<Socket, 'write'>>) {
    function writeLog(inputs: ToLoggingStringInputs & {logType: LogOutputType}) {
        logWriters[inputs.logType].write(toLogString(inputs));
    }
    const logger = {
        info(...args: ReadonlyArray<any>) {
            writeLog({
                logType: LogOutputType.standard,
                colors: ColorKey.info,
                args,
            });
        },
        error(...args: ReadonlyArray<any>) {
            writeLog({
                logType: LogOutputType.error,
                colors: [
                    ColorKey.error,
                    ColorKey.bold,
                ],
                args,
            });
        },
        bold(...args: ReadonlyArray<any>) {
            writeLog({
                logType: LogOutputType.standard,
                colors: ColorKey.bold,
                args,
            });
        },
        mutate(...args: ReadonlyArray<any>) {
            writeLog({
                logType: LogOutputType.standard,
                colors: [
                    ColorKey.bold,
                    ColorKey.mutate,
                ],
                args,
            });
        },
        faint(...args: ReadonlyArray<any>) {
            writeLog({
                logType: LogOutputType.standard,
                colors: ColorKey.faint,
                args,
            });
        },
        success(...args: ReadonlyArray<any>) {
            writeLog({
                logType: LogOutputType.standard,
                colors: [
                    ColorKey.bold,
                    ColorKey.success,
                ],
                args,
            });
        },
    } as const;

    return logger;
}

export const log: Logger = createLogger(process);

export const logIf: Record<
    keyof Logger,
    (condition: boolean, ...args: ReadonlyArray<any>) => void
> = mapObjectValues(log, (key) => {
    return (condition: boolean, ...args: ReadonlyArray<any>) => {
        if (condition) {
            log[key](...args);
        }
    };
});

export type AskQuestionOptions = {
    timeoutMs: number;
    hideUserInput: boolean;
};

const defaultAskQuestionOptions: AskQuestionOptions = {
    timeoutMs: 60_000,
    hideUserInput: false,
};

export async function askQuestion(
    questionToAsk: string,
    {
        hideUserInput = defaultAskQuestionOptions.hideUserInput,
        timeoutMs = defaultAskQuestionOptions.timeoutMs,
    }: Partial<AskQuestionOptions> = defaultAskQuestionOptions,
): Promise<string> {
    const cliInterface = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    if (hideUserInput) {
        let promptWritten = false;
        /** _writeToOutput is not in the types OR in the Node.js documentation but is a thing. */
        (cliInterface as unknown as {_writeToOutput: (prompt: string) => void})._writeToOutput = (
            prompt,
        ) => {
            if (!promptWritten) {
                (
                    cliInterface as unknown as {output: {write: (output: string) => void}}
                ).output.write(prompt);
                promptWritten = true;
            }
        };
    }

    // handle killing the process
    cliInterface.on('SIGINT', () => {
        cliInterface.close();
        process.stdout.write('\n');
        process.kill(process.pid, 'SIGINT');
    });

    return new Promise((resolve, reject) => {
        const timeoutId = timeoutMs
            ? setTimeout(() => {
                  cliInterface.close();
                  reject(
                      new Error(`Took too long to respond (over "${timeoutMs / 1_000}" seconds)`),
                  );
              }, timeoutMs)
            : undefined;

        process.stdout.write(questionToAsk + '\n');
        cliInterface.question('', (response) => {
            if (timeoutId != undefined) {
                clearTimeout(timeoutId);
            }
            cliInterface.close();
            resolve(response);
        });
    });
}

export type QuestionUntilConditionMetConfig = {
    questionToAsk: string;
    conditionCallback: (response: string) => boolean | Promise<boolean>;
    invalidInputMessage: string;
    tryCountMax?: number;
} & Partial<AskQuestionOptions>;

export async function askQuestionUntilConditionMet({
    questionToAsk,
    conditionCallback,
    invalidInputMessage,
    tryCountMax = 5,
    ...options
}: QuestionUntilConditionMetConfig): Promise<string> {
    let wasConditionMet = false;
    let retryCount = 0;
    let response = '';
    while (!wasConditionMet && retryCount <= tryCountMax) {
        response = (await askQuestion(questionToAsk, options)).trim();
        wasConditionMet = await conditionCallback(response);
        if (!wasConditionMet) {
            log.error(invalidInputMessage);
        }
        retryCount++;
    }
    if (retryCount > tryCountMax) {
        throw new Error(`Max input attempts (${tryCountMax}) exceeded.`);
    }
    return response;
}
