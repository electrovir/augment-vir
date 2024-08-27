import {assert, AssertionError, CustomOutputAsserter} from '@augment-vir/assert';

function myFunctionToTest(name: string) {
    return `Hello there ${name}`;
}

const myCustomAsserter: CustomOutputAsserter<typeof myFunctionToTest> = (
    actual,
    expected,
    failureMessage,
) => {
    // Write your assertion in an `if`.
    if (!actual.startsWith('hello there') || actual.endsWith(expected)) {
        // Throw an `AssertionError` if the `if` fails.
        throw new AssertionError('', failureMessage);
    }
};
// Use your custom asserter as the first input to any `.output` guard.
assert.output(myCustomAsserter, myFunctionToTest, ['John'], 'John', 'Name insertion failed');
