import {mapObjectValues} from '@augment-vir/common';
import {styles} from 'ansi-colors';
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

function toLoggingString({colors, args}: ToLoggingStringInputs): string {
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

function writeLog(inputs: ToLoggingStringInputs & {logType: 'stderr' | 'stdout'}) {
    process[inputs.logType].write(toLoggingString(inputs));
}

export enum LogType {
    info = 'info',
    error = 'error',
    bold = 'bold',
    mutate = 'mutate',
    faint = 'faint',
    success = 'success',
}

export const log: Record<LogType, (...args: ReadonlyArray<any>) => void> = {
    [LogType.info]: (...args: ReadonlyArray<any>) => {
        writeLog({
            logType: 'stdout',
            colors: ColorKey.info,
            args,
        });
    },
    [LogType.error]: (...args: ReadonlyArray<any>) => {
        writeLog({
            logType: 'stderr',
            colors: [
                ColorKey.error,
                ColorKey.bold,
            ],
            args,
        });
    },
    [LogType.bold]: (...args: ReadonlyArray<any>) => {
        writeLog({
            logType: 'stdout',
            colors: ColorKey.bold,
            args,
        });
    },
    [LogType.mutate]: (...args: ReadonlyArray<any>) => {
        writeLog({
            logType: 'stdout',
            colors: [
                ColorKey.bold,
                ColorKey.mutate,
            ],
            args,
        });
    },
    [LogType.faint]: (...args: ReadonlyArray<any>) => {
        writeLog({
            logType: 'stdout',
            colors: ColorKey.faint,
            args,
        });
    },
    [LogType.success]: (...args: ReadonlyArray<any>) => {
        writeLog({
            logType: 'stdout',
            colors: [
                ColorKey.bold,
                ColorKey.success,
            ],
            args,
        });
    },
} as const;

export const logIf: Record<LogType, (condition: boolean, ...args: ReadonlyArray<any>) => void> =
    mapObjectValues(log, (key) => {
        return (condition: boolean, ...args: ReadonlyArray<any>) => {
            if (condition) {
                log[key](...args);
            }
        };
    });

export async function askQuestion(questionToAsk: string, timeoutMs = 60_000): Promise<string> {
    const cliInterface = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

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

        cliInterface.question(questionToAsk + ' ', (response) => {
            if (timeoutId != undefined) {
                clearTimeout(timeoutId);
            }
            cliInterface.close();
            resolve(response);
        });
    });
}

export async function askQuestionUntilConditionMet({
    questionToAsk,
    conditionCallback,
    invalidInputMessage,
    tryCountMax = 5,
    timeoutMs = 60_000,
}: {
    questionToAsk: string;
    conditionCallback: (response: string) => boolean | Promise<boolean>;
    invalidInputMessage: string;
    tryCountMax?: number;
    /** Set to 0 to disable the timeout */
    timeoutMs?: number;
}): Promise<string> {
    let wasConditionMet = false;
    let retryCount = 0;
    let response = '';
    while (!wasConditionMet && retryCount <= tryCountMax) {
        response = (await askQuestion(questionToAsk, timeoutMs)).trim();
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
