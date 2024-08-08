/**
 * Join elements into a string with commas separating each value. Add a conjunction before the final
 * item in the list. If the array has a length < 2, the conjunction is not added. If the list is
 * only of length 2, then no commas are added.
 *
 * @param list Array of items to be converted into strings. Works best if these are simply strings
 *   to begin with.
 * @param conjunction Defaults to 'and'. The conjunction to be used before the final element.
 */
export function joinWithFinalConjunction(list: ReadonlyArray<any>, conjunction = 'and'): string {
    if (list.length < 2) {
        /**
         * If there are not multiple things in the list to join, just turn the list into a string
         * for an empty list, this will be '', for a single item list, this will just be the first
         * item as a string.
         */
        return list.join('');
    }

    /** When there are only two items in the list, we don't want any commas. */
    const commaSep = list.length > 2 ? ', ' : ' ';

    const commaJoined = list.slice(0, -1).join(commaSep);
    return `${commaJoined}${commaSep}${conjunction} ${list[list.length - 1]}`;
}
