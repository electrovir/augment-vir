import {
    IfEquals,
    Overwrite,
    RequiredAndNotNull,
    RequiredAndNotNullBy,
    wrapNarrowTypeWithTypeCheck,
} from '../../../common/src';

{
    /** Overwrite */
    type thing1 = {a: string; b: number};
    const what: thing1 = {a: 'hello', b: 5};
    const who: Overwrite<thing1, {a: number}> = {...what, a: 2};
    // @ts-expect-error
    who.what = 'should not work';
}

{
    /** IfEquals */
    const yesAssignment: IfEquals<string, string, Date, RegExp> = new Date();
    const noAssignment: IfEquals<string, number, Date, RegExp> = new RegExp('');
}

{
    /** RequiredAndNotNull */
    const allDefined: RequiredAndNotNull<Record<'hello' | 'yes', string>> = {
        hello: 'there',
        yes: 'I would like one',
    };
    const oneNotDefined: RequiredAndNotNull<Record<'hello' | 'yes', string>> = {
        hello: 'there',
        // @ts-expect-error
        yes: undefined,
    };

    /** RequiredAndNotNullBy */
    const missingStuff: Partial<typeof allDefined> = {};
    const yesDefined: RequiredAndNotNullBy<typeof missingStuff, 'yes'> = {
        ...missingStuff,
        yes: 'yo',
    };
    // @ts-expect-error
    const yesNotDefined: RequiredAndNotNullBy<typeof missingStuff, 'yes'> = {
        ...missingStuff,
    };
}

{
    /** WrapTypeWithReadonly */
    function acceptsOnlySpecificType(input: {thingie: 5}) {
        return input;
    }
    const specificObject = wrapNarrowTypeWithTypeCheck<Record<string, number>>()({
        thingie: 5,
    } as const);
    acceptsOnlySpecificType(specificObject);

    const vagueObject: Record<string, number> = {thingie: 5};
    // @ts-expect-error
    acceptsOnlySpecificType(vagueObject);

    const lessVagueObject: Record<string, number> = {thingie: 5} as const;
    // @ts-expect-error
    acceptsOnlySpecificType(lessVagueObject);

    // this one works but doesn't enforce a specific type on the value at assignment
    const unTypedObject = {thingie: 5} as const;
    acceptsOnlySpecificType(unTypedObject);
}
