/**
 * Removes ansi escape codes (such as terminal colors) within the given string.
 *
 * @category String
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export function removeAnsiEscapeCodes(input: string): string {
    return input.replace(ansiRegExp, '');
}

/** {@inheritDoc removeAnsiEscapeCodes} */
export const removeColor = removeAnsiEscapeCodes;

// cspell:disable
/**
 * Copied from
 * https://github.com/chalk/ansi-regex/blob/1b337add136eb520764634a328e2f6354398eee5/index.js
 *
 * The package has the following license from
 * https://github.com/chalk/ansi-regex/blob/1b337add136eb520764634a328e2f6354398eee5/license
 *
 * MIT License Copyright (c) Sindre Sorhus [sindresorhus@gmail.com](mailto:sindresorhus@gmail.com)
 * (https://sindresorhus.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
// cspell:enable
const patterns: string[] = [
    String.raw`[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)`,
    String.raw`(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))`,
];

/**
 * A RegExp that will match all ansi escape codes (such as terminal colors). Used in
 * {@link removeAnsiEscapeCodes}.
 *
 * @category String
 * @category RegExp
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export const ansiRegExp = new RegExp(patterns.join('|'), 'g');
