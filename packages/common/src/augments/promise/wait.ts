import {extractErrorMessage} from '../error';
import {createDeferredPromiseWrapper} from './deferred-promise';

export function wait(delayMs: number): Promise<void> {
    const deferredPromiseWrapper = createDeferredPromiseWrapper();

    if (delayMs !== Infinity) {
        setTimeout(
            () => {
                deferredPromiseWrapper.resolve();
            },
            delayMs <= 0 ? 0 : delayMs,
        );
    }

    return deferredPromiseWrapper.promise;
}

export async function waitValue<ResolutionValue>(
    delayMs: number,
    returnValue: ResolutionValue,
): Promise<ResolutionValue> {
    return wait(delayMs).then(() => returnValue);
}

export type WaitForConditionInputs = {
    conditionCallback: () => boolean | Promise<boolean>;
    timeoutMs?: number;
    intervalMs?: number;
    timeoutMessage?: string;
};

export async function waitForCondition({
    conditionCallback,
    timeoutMs = 10000,
    intervalMs = 100,
    timeoutMessage = '',
}: WaitForConditionInputs): Promise<void> {
    let condition: boolean = false;
    let lastError: unknown;
    async function checkCondition() {
        try {
            condition = !!(await conditionCallback());
        } catch (error) {
            condition = false;
            lastError = error;
        }
    }
    const startTime = Date.now();
    await checkCondition();

    while (!condition) {
        await wait(intervalMs);
        if (Date.now() - startTime >= timeoutMs) {
            const message = timeoutMessage ? `${timeoutMessage}: ` : '';
            throw new Error(
                `${message}Timeout of "${timeoutMs}" exceeded waiting for condition to be true${extractErrorMessage(
                    lastError,
                )}`,
            );
        }
        await checkCondition();
    }
}
