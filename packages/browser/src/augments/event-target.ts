import {Constructor} from 'type-fest';

export function extractEventTarget<ExpectedTargetClassConstructor extends Constructor<Element>>(
    event: Event,
    expectedTargetClass: ExpectedTargetClassConstructor,
    useDefaultTarget?: boolean,
): InstanceType<ExpectedTargetClassConstructor> {
    const target = useDefaultTarget ? event.target : event.currentTarget;

    if (!(target instanceof expectedTargetClass)) {
        throw new Error(
            `Target from event '${event.type}' was not of type '${expectedTargetClass.constructor.name}'. Got '${target?.constructor.name}'.`,
        );
    }

    return target as InstanceType<ExpectedTargetClassConstructor>;
}
