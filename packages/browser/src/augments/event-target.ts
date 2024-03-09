import {PartialAndUndefined} from '@augment-vir/common';
import {Constructor} from 'type-fest';

export function extractEventTarget<ExpectedTargetClassConstructor extends Constructor<Element>>(
    event: Event,
    expectedTargetClass: ExpectedTargetClassConstructor,
    options: PartialAndUndefined<{
        /**
         * By default `extractEventTarget` uses the `Event.currentTarget` field to extract the event
         * target so that it extract the target to which the event handler was attached to. However,
         * if you wish to instead use the `Event.target` property, to extract the element which
         * originally fired the event, set this to true.
         */
        useOriginalTarget: boolean;
    }> = {},
): InstanceType<ExpectedTargetClassConstructor> {
    const target = options.useOriginalTarget ? event.target : event.currentTarget;

    if (!(target instanceof expectedTargetClass)) {
        const expectedName = expectedTargetClass.name;
        const actualName = target?.constructor.name;
        const message = options.useOriginalTarget
            ? `Current target from event '${event.type}' was not of type '${expectedName}'. Got '${actualName}'.`
            : `Target from event '${event.type}' was not of type '${expectedName}'. Got '${actualName}'.`;
        throw new Error(message);
    }

    return target as InstanceType<ExpectedTargetClassConstructor>;
}
