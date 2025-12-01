import {assert, check, waitUntil} from '@augment-vir/assert';
import {type MaybePromise, type PartialWithUndefined} from '@augment-vir/common';
import {
    type DeclarativeElementDefinition,
    type DefinedTypedEvent,
    type TypedEvent,
} from 'element-vir';
import {type EmptyObject, type IsAny} from 'type-fest';
import {
    itCasesWithContext,
    type FunctionWithContextTestCase,
} from '../augments/universal-testing-suite/it-cases-with-context.js';
import {type UniversalTestContext} from '../augments/universal-testing-suite/universal-test-context.js';
import {renderElement} from './render-element.js';
import {extractElementText} from './symlinked/element-text.js';

export type ElementTestCaseExpect = {
    text: string | string[];
    events: Map<TypedEvent | DefinedTypedEvent<any, any>, unknown[]>;
};

export type ElementTestCase<Definition extends Readonly<DeclarativeElementDefinition>> = {
    it: string;
} & (IsAny<Definition> extends true
    ? {
          createInputs?:
              | ((testContext: Readonly<UniversalTestContext>) => MaybePromise<any>)
              | undefined;
      }
    : Definition['InputsType'] extends EmptyObject
      ? {
            createInputs?: never;
        }
      : {
            createInputs: (
                testContext: Readonly<UniversalTestContext>,
            ) => MaybePromise<Definition['InputsType']>;
        }) &
    PartialWithUndefined<{
        expect: PartialWithUndefined<ElementTestCaseExpect>;
        act: (instance: Definition['InstanceType']) => MaybePromise<void>;
        only: boolean;
        skip: boolean;
    }>;

export function elementCases<const Definition extends Readonly<DeclarativeElementDefinition>>(
    elementDefinition: Readonly<Definition>,
    testCases: ReadonlyArray<Readonly<ElementTestCase<Definition>>>,
) {
    itCasesWithContext(
        testRenderElement,
        () => {
            /** All assertions are done in the test callback. */
        },
        testCases.map((testCase): FunctionWithContextTestCase<typeof testRenderElement> => {
            return {
                it: testCase.it,
                inputs: [
                    elementDefinition,
                    testCase,
                ],
                throws: undefined,
            };
        }),
    );
}

async function testRenderElement(
    this: void,
    testContext: Readonly<UniversalTestContext>,
    elementDefinition: Readonly<DeclarativeElementDefinition>,
    testCase: ElementTestCase<any>,
) {
    const eventKeys = Array.from(testCase.expect?.events?.keys() || []);

    const events: Map<TypedEvent | DefinedTypedEvent<any, any>, unknown[]> = new Map(
        eventKeys.map((key) => {
            return [
                key,
                [],
            ];
        }),
    );

    const inputs = await testCase.createInputs?.(testContext);

    const instance = await renderElement<any>(elementDefinition, inputs);
    eventKeys.forEach((eventKey) => {
        instance.addEventListener(eventKey.type, (event: unknown) => {
            events.get(eventKey)?.push((event as TypedEvent).detail);
        });
    });

    await testCase.act?.(instance);

    await waitUntil.isTrue(
        () => {
            const text = extractElementText(instance);
            if (check.isArray(testCase.expect?.text)) {
                assert.hasValues(text, testCase.expect.text);
            } else if (check.isString(testCase.expect?.text)) {
                assert.hasValue(text, testCase.expect.text);
            }
            if (testCase.expect?.events) {
                testCase.expect.events.forEach((expectedEvents, eventKey) => {
                    const actualEvents = events.get(eventKey);
                    assert.isDefined(actualEvents);
                    assert.deepEquals(actualEvents, expectedEvents);
                });
            }
            return true;
        },
        {
            interval: {
                milliseconds: 100,
            },
            timeout: {
                minutes: 1,
            },
        },
    );
}
