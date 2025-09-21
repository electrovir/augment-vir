import {diffLines, diffWords, type ChangeObject} from 'diff';
import {type TypedFunction} from '../function/typed-function-type.js';
import {stringify} from '../object/stringify.js';
import {isRuntimeEnv, RuntimeEnv} from '../runtime-env.js';

export function prettyDiff(actual: unknown, expected: unknown): string {
    const bothStrings = typeof expected === 'string' && typeof actual === 'string';
    const useLines: boolean = typeof expected !== 'string' || typeof actual !== 'string';
    const diffFunction = (useLines ? diffLines : diffWords) as TypedFunction<
        [string, string],
        ChangeObject<string>[]
    >;
    const expectedString = [
        bothStrings ? '' : '\n',
        stringify(expected, 4),
        '\n',
    ].join('');
    const actualString = [
        bothStrings ? '' : '\n',
        stringify(actual, 4),
        '\n',
    ].join('');

    const changes = addDiffColors(useLines, diffFunction(expectedString, actualString));

    const useColor = isRuntimeEnv(RuntimeEnv.Node);

    const explanationLine = [
        useColor ? NodeColor.Green : '',
        '+added ',
        useColor ? NodeColor.Red : '',
        '-missing ',
        useColor ? NodeColor.Reset : '',
    ].join('');

    return [
        explanationLine,
        bothStrings ? '\n\n' : '\n',
        changes,
    ].join('');
}

enum NodeColor {
    Green = '\x1b[32m',
    Red = '\x1b[31m',
    Reset = '\x1b[0m',
}
enum DiffPrefix {
    Added = '+',
    Removed = '-',
}

function addDiffColors(
    shouldUseLines: boolean,
    changes: ReadonlyArray<Readonly<ChangeObject<string>>>,
): string {
    const coloredDiff = shouldUseLines
        ? changes
              .flatMap((change) => {
                  return change.value
                      .split('\n')
                      .map((line) => {
                          return addColorToChange(line, change);
                      })
                      .join('\n');
              })
              .join('')
        : changes
              .map((change) => {
                  return addColorToChange(undefined, change);
              })
              .join('');

    return coloredDiff;
}

function addColorToChange(
    line: string | undefined,
    change: Readonly<ChangeObject<string>>,
): string {
    if (line != undefined && !line) {
        return '';
    }

    const useColor = isRuntimeEnv(RuntimeEnv.Node);

    const prefix = change.added
        ? DiffPrefix.Added
        : change.removed
          ? DiffPrefix.Removed
          : line == undefined
            ? ''
            : ' ';

    const color = change.added ? NodeColor.Green : change.removed ? NodeColor.Red : NodeColor.Reset;

    return [
        useColor ? color : '',
        prefix,
        line ?? change.value,
        NodeColor.Reset,
    ].join('');
}
