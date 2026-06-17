import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {SeededRandom} from './seeded-random.js';

describe(SeededRandom.name, () => {
    it('is deterministic', () => {
        const seeded = SeededRandom.fromSeed('hello there');
        const values = [
            seeded.next(),
            seeded.next(),
            seeded.next(),
            seeded.next(),
            seeded.next(),
        ];

        assert.deepEquals(
            values,
            [
                0.5281257268507034,
                0.20960435876622796,
                0.6704170207958668,
                0.3673668319825083,
                0.6516226301901042,
            ],
            'random values are not deterministic',
        );
    });
    it('can export its state', () => {
        const seeded = SeededRandom.fromSeed('hello there');
        seeded.next();
        seeded.next();
        seeded.next();
        seeded.next();
        seeded.next();
        seeded.next();
        const seeded2 = SeededRandom.fromState(seeded.exportState());

        assert.deepEquals(
            seeded.exportState(),
            [
                0.3673668319825083,
                0.6516226301901042,
                0.38706252281554043,
                1_402_270,
            ],
            'exported state is not deterministic',
        );

        assert.strictEquals(seeded.next(), seeded2.next(), 'copied state not creating same values');
        assert.strictEquals(seeded.next(), seeded2.next(), 'copied state not creating same values');
        assert.strictEquals(seeded.next(), seeded2.next(), 'copied state not creating same values');
        assert.strictEquals(seeded.next(), seeded2.next(), 'copied state not creating same values');
        assert.strictEquals(seeded.next(), seeded2.next(), 'copied state not creating same values');
        assert.strictEquals(seeded.next(), seeded2.next(), 'copied state not creating same values');
        assert.strictEquals(seeded.next(), seeded2.next(), 'copied state not creating same values');
    });
    it('works on the code example', () => {
        const random = SeededRandom.fromSeed('hello there');
        assert.strictEquals(random.next(), 0.5281257268507034);

        const random2 = SeededRandom.fromState(random.exportState());
        assert.strictEquals(random.next(), 0.20960435876622796);
        assert.strictEquals(random2.next(), 0.20960435876622796);

        const random3 = random2.clone();
        assert.strictEquals(random.next(), 0.6704170207958668);
        assert.strictEquals(random2.next(), 0.6704170207958668);
        assert.strictEquals(random3.next(), 0.6704170207958668);
    });
});
