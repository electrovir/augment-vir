import {
    DeepWriteable,
    IfEquals,
    Overwrite,
    RequiredAndNotNull,
    RequiredAndNotNullBy,
    UnPromise,
    Writeable,
} from './type';

{
    /** Writeable<T> and DeepWriteable<T> */

    type Menu = Readonly<{
        breakfast: Readonly<string[]>;
        lunch: Readonly<string[]>;
        dinner: Readonly<string[]>;
    }>;

    const myMenu: Menu = {
        breakfast: [],
        lunch: [],
        dinner: [],
    };

    // @ts-expect-error
    myMenu.breakfast = [];
    // @ts-expect-error
    myMenu.breakfast.push('egg');

    const myMutableMenu: Writeable<Menu> = {
        breakfast: [],
        lunch: [],
        dinner: [],
    };

    myMutableMenu.breakfast = [];
    // @ts-expect-error
    myMutableMenu.breakfast.push('egg');

    const myDeeplyMutableMenu: DeepWriteable<Menu> = {
        breakfast: [],
        lunch: [],
        dinner: [],
    };

    myDeeplyMutableMenu.breakfast = [];
    myDeeplyMutableMenu.breakfast.push('egg');
}

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
    /** UnPromise */
    const maybePromise: string | Promise<string> = '' as string | Promise<string>;
    // @ts-expect-error
    const badOnlyString: string = maybePromise;
    const unPromised: UnPromise<typeof maybePromise> = '' as UnPromise<typeof maybePromise>;

    const goodOnlyString: string = unPromised;
}
