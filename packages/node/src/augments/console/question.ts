import {convertDuration, DurationUnit, type AnyDuration} from '@date-vir/duration';
import {createInterface} from 'node:readline';
import {log} from './log.js';

/** Can't test requiring user input. */
/* node:coverage disable */

export type AskQuestionOptions = {
    timeout: AnyDuration;
    hideUserInput: boolean;
};

const defaultAskQuestionOptions: AskQuestionOptions = {
    timeout: {seconds: 60},
    hideUserInput: false,
};

export async function askQuestion(
    questionToAsk: string,
    {
        hideUserInput = defaultAskQuestionOptions.hideUserInput,
        timeout = defaultAskQuestionOptions.timeout,
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
        const timeoutMs = convertDuration(timeout, DurationUnit.Milliseconds).milliseconds;

        const timeoutId = timeoutMs
            ? setTimeout(() => {
                  cliInterface.close();
                  reject(
                      new Error(
                          `Took too long to respond (over "${Math.floor(timeoutMs / 1000)}" seconds)`,
                      ),
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
