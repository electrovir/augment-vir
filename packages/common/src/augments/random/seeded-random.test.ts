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
                0.528_125_726_850_703_4,
                0.209_604_358_766_227_96,
                0.670_417_020_795_866_8,
                0.367_366_831_982_508_3,
                0.651_622_630_190_104_2,
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
                0.367_366_831_982_508_3,
                0.651_622_630_190_104_2,
                0.387_062_522_815_540_43,
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
        assert.strictEquals(random.next(), 0.528_125_726_850_703_4);

        const random2 = SeededRandom.fromState(random.exportState());
        assert.strictEquals(random.next(), 0.209_604_358_766_227_96);
        assert.strictEquals(random2.next(), 0.209_604_358_766_227_96);

        const random3 = random2.clone();
        assert.strictEquals(random.next(), 0.670_417_020_795_866_8);
        assert.strictEquals(random2.next(), 0.670_417_020_795_866_8);
        assert.strictEquals(random3.next(), 0.670_417_020_795_866_8);
    });
});
