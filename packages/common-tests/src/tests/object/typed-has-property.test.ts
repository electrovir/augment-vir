import {assertTypeOf} from '@augment-vir/chai';
import {expect} from 'chai';
import {describe, it} from 'mocha';
import {
    isObject,
    isPromiseLike,
    typedHasProperties,
    typedHasProperty,
} from '../../../../common/src';

describe(typedHasProperty.name, () => {
    const testObject = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
    };

    const testCases: {input: any; property: string; output: boolean}[] = [
        {
            input: testObject,
            property: 'a',
            output: true,
        },
        {
            input: testObject,
            property: 'b',
            output: true,
        },
        {
            input: testObject,
            property: 'blah',
            output: false,
        },
        {
            input: () => {},
            property: 'name',
            output: true,
        },
        {
            input: 'derp',
            property: 'tagName',
            output: false,
        },
        {
            input: 'derp',
            property: 'concat',
            output: true,
        },
    ];

    it('should pass all test cases', () => {
        testCases.forEach((testCase) => {
            const message = `Expected property ${testCase.property} to ${
                testCase.output ? '' : 'not '
            }exist.`;
            try {
                expect(typedHasProperty(testCase.input, testCase.property)).to.equal(
                    testCase.output,
                );
            } catch (error) {
                console.error(message);
                throw error;
            }
        });
    });

    it('should properly be able to access a property after checking it exists', () => {
        const idkWhatThisIs: unknown = (() => {}) as unknown;
        if (typedHasProperty(idkWhatThisIs, 'name')) {
            idkWhatThisIs.name;
            assertTypeOf(idkWhatThisIs.name).toBeUnknown();
            if (typedHasProperty(idkWhatThisIs, 'derp')) {
                idkWhatThisIs.derp;
            }
        } else {
            // @ts-expect-error
            idkWhatThisIs.name;
        }
    });

    it('should preserve property value type when it exists', () => {
        const whatever = {} as {name: string} | string | {derp: string};

        // should not be able to access the property directly
        // @ts-expect-error
        whatever.name;

        if (typedHasProperty(whatever, 'name')) {
            whatever.name;

            const onlyStrings: string = whatever.name;
        }
    });

    it('should preserve function properties', () => {
        interface dummy {
            stuff: string;
            callback: Function;
        }
        const interfaceWithFunction = {} as dummy;

        // should not be able to access the property directly
        // @ts-expect-error
        interfaceWithFunction.name;

        if (
            typedHasProperty(interfaceWithFunction, 'createMany') &&
            typeof interfaceWithFunction.createMany === 'function'
        ) {
            interfaceWithFunction.createMany;

            interfaceWithFunction.createMany();
        }
    });

    it('should enforce that an optional property exists', () => {
        const whatever = {} as {name?: string};

        // should be able to access the property directly
        const maybeUndefined: string | undefined = whatever.name;
        // @ts-expect-error
        const failsDefinedOnly: string = whatever.name;

        if (typedHasProperty(whatever, 'name')) {
            whatever.name;

            const onlyString: string = whatever.name;
        }
    });

    it('should work with generics', () => {
        function testIsPromiseLike<T>(input: T) {
            if (typedHasProperty(input, 'then')) {
                input.then;
            }
        }
    });

    it('should allow type narrowing', () => {
        function assertOutputProperty(
            keyPath: string,
            testExpectations: object,
            outputKey: string,
        ): void {
            if (!typedHasProperty(testExpectations, outputKey)) {
                throw new Error(`${keyPath} > ${outputKey} is missing.`);
            }

            const value = testExpectations[outputKey];

            if (typeof value !== 'string' && !isObject(value)) {
                throw new Error(`${keyPath} > "${outputKey}" is invalid. Got "${value}"`);
            } else if (isObject(value)) {
                if (!typedHasProperty(value, 'type') || value.type !== 'regexp') {
                    throw new Error(
                        `${keyPath} > "${outputKey}".type is invalid. Expected "regexp".`,
                    );
                }

                value;

                if (!typedHasProperty(value, 'value') || typeof value.value !== 'string') {
                    throw new Error(
                        `${keyPath} > "${outputKey}".value is invalid. Expected a string.`,
                    );
                }
            }
        }
    });
});

describe(typedHasProperties.name, () => {
    const testObject = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
    };

    it('should correctly test existing properties', () => {
        expect(
            typedHasProperties(testObject, [
                'a',
                'b',
                'c',
                'd',
                'e',
            ]),
        ).to.equal(true);
    });

    it('should correctly fail on nonexisting properties', () => {
        expect(
            typedHasProperties(testObject, [
                'abba',
                'blah',
                'cookie',
                'derp',
                'ear',
            ]),
        ).to.equal(false);
    });

    it('should pass type checks', () => {
        const whatever = {} as {name: string} | string;

        // should not be able to access the property directly
        // @ts-expect-error
        whatever.name;

        if (
            typedHasProperties(whatever, [
                'name',
                // 'value',
            ])
        ) {
            whatever.name;
            // @ts-expect-error
            whatever.value;

            const onlyStrings: string = whatever.name;
        }
        if (
            typedHasProperties(whatever, [
                'name',
                'value',
            ])
        ) {
            whatever.name;
            whatever.value;

            const onlyStrings: string = whatever.name;
        }

        type MaybePromise<T> =
            | (T extends Promise<infer ValueType> ? T | ValueType : Promise<T> | T)
            | undefined
            | {error: Error};

        const maybePromise = {} as MaybePromise<number>;

        if (isPromiseLike(maybePromise)) {
            const myPromise: PromiseLike<number> = maybePromise;
        } else if (typedHasProperty(maybePromise, 'error')) {
            const myError: Error = maybePromise.error;
        } else {
            maybePromise;
        }
    });
});
