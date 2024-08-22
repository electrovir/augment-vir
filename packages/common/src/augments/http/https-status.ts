export {};
// /**
//  * Add more status codes to this enum as they are needed. See a list of standardized http status
//  * codes here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
//  *
//  * Make that each new status code is also placed within errorStatusCodes OR SuccessStatusCode (but
//  * not both).
//  */
// export enum HttpStatusCode {
//     /** 100 level codes */

//     /**
//      * Indicates that the client should continue the request or ignore the response if the request
//      * is already finished.
//      *
//      * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100
//      */
//     Continue = 100,
//     /**
//      * Response to an Upgrade request header and indicates the protocol that the server is switching
//      * to.
//      *
//      * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/101
//      */
//     SwitchingProtocols = 101,
//     /**
//      * Primarily intended to be used with the Link header, letting the user agent start preloading
//      * resources while the server prepares a response or preconnect to an origin from which the page
//      * will need resources.
//      *
//      * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103
//      */
//     EarlyHints = 103,

//     /** 200 level codes */

//     /**
//      * The request succeeded. The result meaning of "success" depends on the HTTP method:
//      *
//      * - GET: The resource has been fetched and transmitted in the message body.
//      * - HEAD: The representation headers are included in the response without any message body.
//      * - PUT or POST: The resource describing the result of the action is transmitted in the message
//      *   body.
//      * - TRACE: The message body contains the request message as received by the server.
//      *
//      * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
//      */
//     Ok = 200,
//     /**
//      * The request succeeded, and a new resource was created as a result. This is typically the
//      * response sent after POST requests, or some PUT requests.
//      *
//      * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
//      */
//     Created = 201,
//     /**
//      * The request has been received but not yet acted upon. It is noncommittal, since there is no
//      * way in HTTP to later send an asynchronous response indicating the outcome of the request. It
//      * is intended for cases where another process or server handles the request, or for batch
//      * processing.
//      *
//      * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202
//      */
//     Accepted = 202,
//     /**
//      * This response code means the returned metadata is not exactly the same as is available from
//      * the origin server, but is collected from a local or a third-party copy. This is mostly used
//      * for mirrors or backups of another resource. Except for that specific case, the 200 OK
//      * response is preferred to this status.
//      *
//      * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/203
//      */
//     NonAuthoritativeInformation = 203,
//     /**
//      * There is no content to send for this request, but the headers may be useful. The user agent
//      * may update its cached headers for this resource with the new ones.
//      *
//      * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
//      */
//     NoContent = 204,
//     /**
//      * Tells the user agent to reset the document which sent this request.
//      *
//      * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/205
//      */
//     ResetContent = 205,
//     /**
//      * This response code is used when the Range header is sent from the client to request only part
//      * of a resource.
//      *
//      * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206
//      */
//     PartialContent = 206,
//     /**
//      * Conveys information about multiple resources, for situations where multiple status codes
//      * might be appropriate.
//      *
//      * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/207
//      */
//     MultiStatus = 207,

//     BadRequest = 400,
//     /**
//      * User was not successfully authenticated. The user has either been logged out, their session
//      * expired, or they were never logged in in the first place.
//      */
//     Unauthorized = 401,
//     /** User was successfully authenticated but is not allowed to access the requested resource. */
//     Forbidden = 403,
//     Missing = 404,
//     /** The request method (GET, POST, etc.) is not allowed. */
//     MethodNotAllowed = 405,
//     GenericServerError = 500,
// }

// export const errorStatusCodes = [
//     HttpStatusCodeEnum.BadRequest,
//     HttpStatusCodeEnum.Unauthorized,
//     HttpStatusCodeEnum.Forbidden,
//     HttpStatusCodeEnum.Missing,
//     HttpStatusCodeEnum.MethodNotAllowed,
//     HttpStatusCodeEnum.GenericServerError,
// ] as const;

// export function isErrorStatus(status: HttpStatusCodeEnum): status is ErrorStatusCode {
//     return typedArrayIncludes(errorStatusCodes, status);
// }

// export type ErrorStatusCode = ArrayElement<typeof errorStatusCodes>;

// export const successStatusCodes = [
//     HttpStatusCodeEnum.Ok,
//     HttpStatusCodeEnum.EmptySuccess,
// ] as const;

// export type SuccessStatusCode = ArrayElement<typeof successStatusCodes>;
