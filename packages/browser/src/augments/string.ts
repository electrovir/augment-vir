export function randomString(inputLength: number = 16): string {
    const arrayLength = Math.ceil(inputLength / 2);
    const uintArray = new Uint8Array(arrayLength);
    globalThis.crypto.getRandomValues(uintArray);
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
