import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {
    type AbstractClass,
    type AbstractConstructor,
    type Class,
    type Constructor,
} from './constructor-type.js';

class Foo {
    public value: number;
    public extra: unknown;

    constructor(inputValue: number, inputExtra: unknown) {
        this.value = inputValue;
        this.extra = inputExtra;
    }

    public getValue(): number {
        return this.value;
    }
}

type PositionProperties = {
    top: number;
    left: number;
};

class Position {
    public top: number;
    public left: number;

    // eslint-disable-next-line @virmator/prefer-params-object -- exercising a multi-argument constructor signature
    constructor(parameterTop: number, parameterLeft: number) {
        this.top = parameterTop;
        this.left = parameterLeft;
    }
}

abstract class AbstractFoo {
    protected value: number;

    constructor(inputValue: number) {
        this.value = inputValue;
    }

    public abstract fooMethod(): void;
}

abstract class AbstractBar {
    public abstract barMethod(): void;
}

class ConcreteBar extends AbstractBar {
    public total: number;

    // eslint-disable-next-line @virmator/prefer-params-object -- exercising a multi-argument constructor signature
    constructor(first: number, second: number) {
        super();
        this.total = first + second;
    }

    public barMethod(): void {
        this.total = this.total + 1;
    }
}

function functionReceivingAbstractClass<T>(givenClass: AbstractClass<T>) {
    return givenClass;
}

describe('Constructor', () => {
    it('matches a class constructor', () => {
        assert.tsType(Foo).matches<Constructor<Foo>>();
        assert.tsType(Position).matches<
            Constructor<
                PositionProperties,
                [
                    number,
                    number,
                ]
            >
        >();
    });

    it('allows any arguments by default', () => {
        assert.tsType<ConstructorParameters<Constructor<Foo>>>().equals<any[]>();
        assert.tsType<InstanceType<Constructor<Foo>>>().equals<Foo>();
    });

    it('restricts constructor arguments when specified', () => {
        assert
            .tsType<
                ConstructorParameters<
                    Constructor<
                        Foo,
                        [
                            number,
                            number,
                        ]
                    >
                >
            >()
            .equals<
                [
                    number,
                    number,
                ]
            >();
        assert
            .tsType<
                InstanceType<
                    Constructor<
                        Foo,
                        [
                            number,
                            number,
                        ]
                    >
                >
            >()
            .equals<Foo>();
    });
});

describe('Class', () => {
    it('matches a class value', () => {
        assert.tsType(Position).matches<Class<PositionProperties>>();
        assert.tsType(Position).matches<
            Class<
                PositionProperties,
                [
                    number,
                    number,
                ]
            >
        >();
    });

    it('enforces the constructor argument count', () => {
        assert.tsType(Position).notMatches<Class<PositionProperties, [number]>>();

        // @ts-expect-error: Position requires two constructor arguments
        const tooFew: PositionProperties = new Position(17);

        assert.tsType(new Position(17, 34)).matches<PositionProperties>();
    });

    it('exposes the instance type on its prototype', () => {
        assert.tsType(Position.prototype).equals<PositionProperties>();
    });
});

describe('AbstractConstructor', () => {
    it('matches an abstract class', () => {
        assert.tsType(AbstractBar).matches<AbstractConstructor<{barMethod(): void}, []>>();
    });

    it('accepts abstract classes as parameters and rejects mismatched shapes', () => {
        functionReceivingAbstractClass(AbstractFoo);
        functionReceivingAbstractClass<AbstractBar>(AbstractBar);
        functionReceivingAbstractClass<AbstractBar>(ConcreteBar);

        // @ts-expect-error: AbstractFoo does not implement barMethod
        functionReceivingAbstractClass<AbstractBar>(AbstractFoo);
    });
});

describe('AbstractClass', () => {
    it('matches an abstract class value', () => {
        assert.tsType(AbstractBar).matches<AbstractClass<{barMethod(): void}, []>>();
    });

    it('exposes the instance type on its prototype', () => {
        assert.tsType(AbstractBar.prototype).matches<{barMethod(): void}>();
        assert.tsType(AbstractBar.prototype).notMatches<{fooMethod(): void}>();
    });

    it('supports concrete subclass construction', () => {
        // @ts-expect-error: two constructor arguments are required
        const tooFew = new ConcreteBar(12);

        assert.tsType(new ConcreteBar(12, 15)).matches<{barMethod(): void}>();
    });
});
