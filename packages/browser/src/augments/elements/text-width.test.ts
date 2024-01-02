import {Dimensions, awaitedBlockingMap, mapObjectValues} from '@augment-vir/common';
import {assert, fixture} from '@open-wc/testing';
import {CSSResult, css, html} from 'element-vir';
import {isRunTimeType} from 'run-time-assertions';
import {calculateTextDimensions} from './text-width';

describe(calculateTextDimensions.name, () => {
    async function testCalculateTextDimensions(
        text: string,
        customStyles: CSSResult | undefined = css``,
    ): Promise<Dimensions> {
        const parentElement = await fixture(html`
            <div
                style=${css`
                    ${customStyles}
                    display: inline-block;
                `}
            ></div>
        `);

        const rawDimensions = await calculateTextDimensions(parentElement, text);

        return mapObjectValues(rawDimensions, (key, value) => Math.round(value));
    }

    const testCases: ReadonlyArray<{
        name: string;
        text: string;
        customStyle?: CSSResult | undefined;
        expect: {
            width: number | {min: number; max: number};
            height: number | {min: number; max: number};
        };
    }> = [
        {
            name: 'empty string',
            text: '',
            expect: {
                height: 0,
                width: 0,
            },
        },
        {
            name: 'simple text',
            text: 'hello there',
            expect: {
                height: {
                    min: 17,
                    max: 20,
                },
                width: 68,
            },
        },
        {
            name: 'wrapped long text',
            text: 'hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end',
            expect: {
                height: {
                    min: 107,
                    max: 116,
                },
                width: 792,
            },
        },
        {
            name: 'unwrapped long text',
            text: 'hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end',
            customStyle: css`
                white-space: nowrap;
            `,
            expect: {
                height: {
                    min: 17,
                    max: 20,
                },
                width: 4093,
            },
        },
    ];

    it('passes all test cases', async () => {
        await awaitedBlockingMap(testCases, async (testCase) => {
            const output = await testCalculateTextDimensions(testCase.text, testCase.customStyle);
            if (isRunTimeType(testCase.expect.width, 'number')) {
                assert.strictEqual(
                    output.width,
                    testCase.expect.width,
                    `Incorrect exact width for '${testCase.name}' test case`,
                );
            } else {
                assert.isAbove(
                    output.width,
                    testCase.expect.width.min,
                    `Incorrect min width for '${testCase.name}' test case`,
                );
                assert.isBelow(
                    output.width,
                    testCase.expect.width.max,
                    `Incorrect max width for '${testCase.name}' test case`,
                );
            }
            if (isRunTimeType(testCase.expect.height, 'number')) {
                assert.strictEqual(
                    output.height,
                    testCase.expect.height,
                    `Incorrect exact height for '${testCase.name}' test case`,
                );
            } else {
                assert.isAbove(
                    output.height,
                    testCase.expect.height.min,
                    `Incorrect min height for '${testCase.name}' test case`,
                );
                assert.isBelow(
                    output.height,
                    testCase.expect.height.max,
                    `Incorrect max height for '${testCase.name}' test case`,
                );
            }
        });
    });

    it('accepts custom options', async () => {
        const parentElement = await fixture(html`
            <div></div>
        `);

        await calculateTextDimensions(parentElement, 'hi', {
            errorMessage: 'oops',
            timeout: {milliseconds: 9_000_000},
        });
    });
});
