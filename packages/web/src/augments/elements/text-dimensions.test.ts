import {assert} from '@augment-vir/assert';
import {Dimensions, awaitedBlockingMap, mapObjectValues} from '@augment-vir/common';
import {describe, it, testWeb} from '@augment-vir/test';
import {CSSResult, css, html} from 'element-vir';
import {calculateTextDimensions} from './text-dimensions.js';

describe(calculateTextDimensions.name, () => {
    async function testCalculateTextDimensions(
        text: string,
        customStyles: CSSResult | undefined = css``,
    ): Promise<Dimensions> {
        const parentElement = await testWeb.render(html`
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
            width: number;
            height: number;
            buffer?: number;
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
                height: 18,
                width: 67,
            },
        },
        {
            name: 'wrapped long text',
            text: 'hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end hello there really long text super duper long why is it so long oh no it is never going to end',
            expect: {
                height: 112,
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
                height: 18,
                width: 4093,
                buffer: 1500,
            },
        },
    ];

    const defaultBuffer = 30;

    it('passes all test cases', async () => {
        await awaitedBlockingMap(testCases, async (testCase) => {
            const output = await testCalculateTextDimensions(testCase.text, testCase.customStyle);
            const buffer = testCase.expect.buffer || defaultBuffer;

            assert.isAbove(
                output.width,
                testCase.expect.width - buffer,
                `Width for '${testCase.name}' test case is below the buffer of '${buffer}'`,
            );
            assert.isBelow(
                output.width,
                testCase.expect.width + buffer,
                `Width for '${testCase.name}' test case is above the buffer of '${buffer}'`,
            );
            assert.isAbove(
                output.height,
                testCase.expect.height - buffer,
                `Height for '${testCase.name}' test case is below the buffer of '${buffer}'`,
            );
            assert.isBelow(
                output.height,
                testCase.expect.height + buffer,
                `Height for '${testCase.name}' test case is below the buffer of '${buffer}'`,
            );
        });
    });

    it('accepts custom options', async () => {
        const parentElement = await testWeb.render(html`
            <div></div>
        `);

        await calculateTextDimensions(parentElement, 'hi', {
            errorMessage: 'oops',
            timeout: {milliseconds: 9_000_000},
            debug: true,
        });
    });
});
