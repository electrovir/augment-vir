export function randomString(inputLength: number = 16): string {
    const arrayLength = Math.ceil(inputLength / 2);
    // server side
    if (typeof window === 'undefined' || !window.crypto) {
        throw new Error(
            `window/window.crypto is not defined for the "${randomString.name}" function. If using this in a Node.js context, import ${randomString.name} from 'augment-vir/node-js' instead`,
        );
    }
    const uintArray = new Uint8Array(arrayLength);
    window.crypto.getRandomValues(uintArray);
    return (
        Array.from(uintArray)
            .map((value) => value.toString(16).padStart(2, '0'))
            .join('')
            /**
             * Because getRandomValues works with even numbers only, we must then chop off extra
             * characters if they exist in the even that inputLength was odd.
             */
            .substring(0, inputLength)
    );
}
