import {log} from '@augment-vir/common';
import {convertDuration, DurationUnit, type AnyDuration} from '@date-vir/duration';
import {createInterface} from 'node:readline';

/** Can't test requiring user input. */
/* node:coverage disable */

/**
 * Options for {@link askQuestion}.
 *
 * @category Node : Terminal : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type AskQuestionOptions = {
    timeout: AnyDuration;
    hideUserInput: boolean;
};

const defaultAskQuestionOptions: AskQuestionOptions = {
    timeout: {seconds: 60},
    hideUserInput: false,
};

/**
 * Asks the user a question in their terminal and then waits for them to type something in response.
 * The response is accepted once the user inputs a new line.
 *
 * @category Node : Terminal
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 * @see
 *  - {@link askQuestionUntilConditionMet}: ask a question on loop until the user provides a valid response.
 */
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

/**
 * Options for {@link askQuestionUntilConditionMet}.
 *
 * @category Node : Terminal : Util
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 */
export type QuestionUntilConditionMetOptions = {
    questionToAsk: string;
    /** Callback to call with the user's response to verify if their response is valid. */
    verifyResponseCallback: (response: string) => boolean | Promise<boolean>;
    invalidInputMessage: string;
    tryCountMax?: number;
} & Partial<AskQuestionOptions>;

/**
 * Asks the user a question in their terminal and then waits for them to type something in response.
 * The response is submitted once the user inputs a new line. If the response fails validation, the
 * question is presented again.
 *
 * @category Node : Terminal
 * @category Package : @augment-vir/node
 * @package [`@augment-vir/node`](https://www.npmjs.com/package/@augment-vir/node)
 * @see
 *  - {@link askQuestion}: ask a question and accept any response.
 */
export async function askQuestionUntilConditionMet({
    questionToAsk,
    verifyResponseCallback,
    invalidInputMessage,
    tryCountMax = 5,
    ...options
}: QuestionUntilConditionMetOptions): Promise<string> {
    let wasConditionMet = false;
    let retryCount = 0;
    let response = '';
    while (!wasConditionMet && retryCount <= tryCountMax) {
        response = (await askQuestion(questionToAsk, options)).trim();
        wasConditionMet = await verifyResponseCallback(response);
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
