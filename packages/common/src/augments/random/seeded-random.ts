/**
 * A class that produces deterministic, pseudo random numbers based on a given seed. This uses the
 * Alea v0.9 algorithm from Johannes Baagøe.
 *
 * @category Random : Util
 * @category Package : @augment-vir/common
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export type SeededRandomState = [
    number,
    number,
    number,
    number,
];

/**
 * A class that produces deterministic, pseudo random numbers based on a given seed. This uses the
 * Alea v0.9 algorithm from Johannes Baagøe.
 *
 * @category Random
 * @category Package : @augment-vir/common
 * @example
 *
 * ```ts
 * import {SeededRandom} from '@augment-vir/common';
 *
 * const random = SeededRandom.fromSeed('hello there');
 * console.info(random.next()); // this value will always be the same
 *
 * const random2 = SeededRandom.fromState(random.exportState());
 * console.info(random.next(), random2.next()); // both of these values will always be identical
 *
 * const random3 = random2.clone();
 * console.info(random.next(), random2.next(), random3.next()); // all of these values will always be identical
 * ```
 *
 * @package [`@augment-vir/common`](https://www.npmjs.com/package/@augment-vir/common)
 */
export class SeededRandom {
    /** Generate a new {@link SeededRandom} instance from a seed. */
    public static fromSeed(seed: string | number) {
        return new SeededRandom(new AleaRandom(seed));
    }
    /** Generate a new {@link SeededRandom} instance from a specific state. */
    public static fromState(state: SeededRandomState) {
        const alea = new AleaRandom('');
        alea.importState(state);
        return new SeededRandom(alea);
    }

    /**
     * Exports the current state of the seeded random number generator so it can be cloned to
     * another instance. Use {@link SeededRandom.fromState} to consume this state.
     */
    public exportState(): SeededRandomState {
        return this.alea.exportState();
    }

    /**
     * This constructor is private. Use {@link SeededRandom.fromSeed} or
     * {@link SeededRandom.fromState} instead.
     */
    protected constructor(protected readonly alea: AleaRandom) {}

    /** Generates the next deterministic pseudo random number. */
    public next(): number {
        return this.alea.next();
    }

    /**
     * Create a {@link SeededRandom} copy with the same state as this one. This is the same as
     * calling {@link SeededRandom.exportState} and passing it directly into
     * {@link SeededRandom.fromState}.
     */
    public clone() {
        return SeededRandom.fromState(this.exportState());
    }
}

/**
 * Alea algorithm has the following license from http://baagoe.com/en/RandomMusings/javascript. The
 * code has been modified to fit into a class structure and simplify code flow and arguments. The
 * algorithm itself has not changed.
 *
 * Copyright (C) 2010 by Johannes Baagøe (baagoe@baagoe.org)
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

/** Alea v0.9 */
class AleaRandom {
    protected n = 0xef_c8_24_9d;
    protected s: [
        number,
        number,
        number,
        number,
    ] = [
        this.mash(' '),
        this.mash(' '),
        this.mash(' '),
        1,
    ];

    /** Mash v0.9. */
    protected mash(input: any) {
        const data: string = input.toString();
        for (let i = 0; i < data.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.n += data.codePointAt(i)!;
            let h = 0.02519603282416938 * this.n;
            this.n = h >>> 0;
            h -= this.n;
            h *= this.n;
            this.n = h >>> 0;
            h -= this.n;
            this.n += h * 0x1_00_00_00_00; // 2^32
        }
        return (this.n >>> 0) * 2.3283064365386963e-10; // 2^-32
    }

    constructor(seed: string | number) {
        this.s[0] -= this.mash(seed);
        if (this.s[0] < 0) {
            this.s[0] += 1;
        }
        this.s[1] -= this.mash(seed);
        if (this.s[1] < 0) {
            this.s[1] += 1;
        }
        this.s[2] -= this.mash(seed);
        /* node:coverage ignore next 3: I don't care if we don't cover this */
        if (this.s[2] < 0) {
            this.s[2] += 1;
        }
    }

    public next() {
        const t = 2_091_639 * this.s[0] + this.s[3] * 2.3283064365386963e-10; // 2^-32
        this.s[0] = this.s[1];
        this.s[1] = this.s[2];
        // eslint-disable-next-line sonarjs/no-nested-assignment
        return (this.s[2] = t - (this.s[3] = t | 0));
    }

    public importState(state: typeof this.s) {
        this.s = state;
    }

    public exportState() {
        return [
            ...this.s,
        ] as typeof this.s;
    }
}
