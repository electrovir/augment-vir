import {check} from '@augment-vir/assert';

/**
 * All standardized HTTP status codes.
 *
 * These values are automatically parsed from https://developer.mozilla.org/docs/Web/HTTP/Status via
 * https://github.com/electrovir/augment-vir/blob/dev/packages/scripts/src/scripts/generate-http-status.ts
 */
export enum HttpStatus {
    /** 100 level codes (information) */

    /**
     * This interim response indicates that the client should continue the request or ignore the
     * response if the request is already finished.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/100
     */
    Continue = 100,
    /**
     * This code is sent in response to an Upgrade request header from the client and indicates the
     * protocol the server is switching to.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/101
     */
    SwitchingProtocols = 101,
    /**
     * This code indicates that the server has received and is processing the request, but no response
     * is available yet.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/102
     */
    Processing = 102,
    /**
     * This status code is primarily intended to be used with the Link header, letting the user agent
     * start preloading resources while the server prepares a response or preconnect to an origin from
     * which the page will need resources.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/103
     */
    EarlyHints = 103,

    /** 200 level codes (success) */

    /**
     * The request succeeded. The result meaning of "success" depends on the HTTP method:
     *
     * - GET: The resource has been fetched and transmitted in the message body.
     * - HEAD: The representation headers are included in the response without any message body.
     * - PUT or POST: The resource describing the result of the action is transmitted in the message body.
     * - TRACE: The message body contains the request message as received by the server.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/200
     */
    Ok = 200,
    /**
     * The request succeeded, and a new resource was created as a result. This is typically the response
     * sent after POST requests, or some PUT requests.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/201
     */
    Created = 201,
    /**
     * The request has been received but not yet acted upon. It is noncommittal, since there is no way
     * in HTTP to later send an asynchronous response indicating the outcome of the request. It is
     * intended for cases where another process or server handles the request, or for batch processing.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/202
     */
    Accepted = 202,
    /**
     * This response code means the returned metadata is not exactly the same as is available from the
     * origin server, but is collected from a local or a third-party copy. This is mostly used for
     * mirrors or backups of another resource. Except for that specific case, the 200 OK response is
     * preferred to this status.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/203
     */
    NonAuthoritativeInformation = 203,
    /**
     * There is no content to send for this request, but the headers may be useful. The user agent may
     * update its cached headers for this resource with the new ones.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/204
     */
    NoContent = 204,
    /**
     * Tells the user agent to reset the document which sent this request.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/205
     */
    ResetContent = 205,
    /**
     * This response code is used when the Range header is sent from the client to request only part of
     * a resource.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/206
     */
    PartialContent = 206,
    /**
     * Conveys information about multiple resources, for situations where multiple status codes might be
     * appropriate.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/207
     */
    MultiStatus = 207,
    /**
     * Used inside a [dav:propstat](dav:propstat) response element to avoid repeatedly enumerating the
     * internal members of multiple bindings to the same collection.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/208
     */
    AlreadyReported = 208,
    /**
     * The server has fulfilled a GET request for the resource, and the response is a representation of
     * the result of one or more instance-manipulations applied to the current instance.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/226
     */
    ImUsed = 226,

    /** 300 level codes (redirect) */

    /**
     * The request has more than one possible response. The user agent or user should choose one of
     * them. (There is no standardized way of choosing one of the responses, but HTML links to the
     * possibilities are recommended so the user can pick.)
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/300
     */
    MultipleChoices = 300,
    /**
     * The URL of the requested resource has been changed permanently. The new URL is given in the
     * response.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/301
     */
    MovedPermanently = 301,
    /**
     * This response code means that the URI of requested resource has been changed temporarily .
     * Further changes in the URI might be made in the future. Therefore, this same URI should be used
     * by the client in future requests.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/302
     */
    Found = 302,
    /**
     * The server sent this response to direct the client to get the requested resource at another URI
     * with a GET request.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/303
     */
    SeeOther = 303,
    /**
     * This is used for caching purposes. It tells the client that the response has not been modified,
     * so the client can continue to use the same cached version of the response.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/304
     */
    NotModified = 304,
    /**
     * Defined in a previous version of the HTTP specification to indicate that a requested response
     * must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band
     * configuration of a proxy.
     *
     * See https://developer.mozilla.org/about:blank#305_use_proxy
     */
    UseProxy = 305,
    /**
     * This response code is no longer used; it is just reserved. It was used in a previous version of
     * the HTTP/1.1 specification.
     *
     * See https://developer.mozilla.org/about:blank#306_unused
     */
    Unused = 306,
    /**
     * The server sends this response to direct the client to get the requested resource at another URI
     * with the same method that was used in the prior request. This has the same semantics as the 302
     * Found HTTP response code, with the exception that the user agent must not change the HTTP method
     * used: if a POST was used in the first request, a POST must be used in the second request.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/307
     */
    TemporaryRedirect = 307,
    /**
     * This means that the resource is now permanently located at another URI, specified by the
     * Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP
     * response code, with the exception that the user agent must not change the HTTP method used: if a
     * POST was used in the first request, a POST must be used in the second request.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/308
     */
    PermanentRedirect = 308,

    /** 400 level codes (clientError) */

    /**
     * The server cannot or will not process the request due to something that is perceived to be a
     * client error (e.g., malformed request syntax, invalid request message framing, or deceptive
     * request routing).
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/400
     */
    BadRequest = 400,
    /**
     * Although the HTTP standard specifies "unauthorized", semantically this response means
     * "unauthenticated". That is, the client must authenticate itself to get the requested response.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/401
     */
    Unauthorized = 401,
    /**
     * This response code is reserved for future use. The initial aim for creating this code was using
     * it for digital payment systems, however this status code is used very rarely and no standard
     * convention exists.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/402
     */
    PaymentRequired = 402,
    /**
     * The client does not have access rights to the content; that is, it is unauthorized, so the server
     * is refusing to give the requested resource. Unlike 401 Unauthorized , the client's identity is
     * known to the server.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/403
     */
    Forbidden = 403,
    /**
     * The server cannot find the requested resource. In the browser, this means the URL is not
     * recognized. In an API, this can also mean that the endpoint is valid but the resource itself does
     * not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of
     * a resource from an unauthorized client. This response code is probably the most well known due to
     * its frequent occurrence on the web.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/404
     */
    NotFound = 404,
    /**
     * The request method is known by the server but is not supported by the target resource. For
     * example, an API may not allow calling DELETE to remove a resource.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/405
     */
    MethodNotAllowed = 405,
    /**
     * This response is sent when the web server, after performing server-driven content negotiation ,
     * doesn't find any content that conforms to the criteria given by the user agent.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/406
     */
    NotAcceptable = 406,
    /**
     * This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/407
     */
    ProxyAuthenticationRequired = 407,
    /**
     * This response is sent on an idle connection by some servers, even without any previous request by
     * the client. It means that the server would like to shut down this unused connection. This
     * response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP
     * pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the
     * connection without sending this message.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/408
     */
    RequestTimeout = 408,
    /**
     * This response is sent when a request conflicts with the current state of the server.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/409
     */
    Conflict = 409,
    /**
     * This response is sent when the requested content has been permanently deleted from server, with
     * no forwarding address. Clients are expected to remove their caches and links to the resource. The
     * HTTP specification intends this status code to be used for "limited-time, promotional services".
     * APIs should not feel compelled to indicate resources that have been deleted with this status
     * code.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/410
     */
    Gone = 410,
    /**
     * Server rejected the request because the Content-Length header field is not defined and the server
     * requires it.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/411
     */
    LengthRequired = 411,
    /**
     * The client has indicated preconditions in its headers which the server does not meet.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/412
     */
    PreconditionFailed = 412,
    /**
     * Request entity is larger than limits defined by server. The server might close the connection or
     * return an Retry-After header field.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/413
     */
    PayloadTooLarge = 413,
    /**
     * The URI requested by the client is longer than the server is willing to interpret.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/414
     */
    UriTooLong = 414,
    /**
     * The media format of the requested data is not supported by the server, so the server is rejecting
     * the request.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/415
     */
    UnsupportedMediaType = 415,
    /**
     * The range specified by the Range header field in the request cannot be fulfilled. It's possible
     * that the range is outside the size of the target URI's data.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/416
     */
    RangeNotSatisfiable = 416,
    /**
     * This response code means the expectation indicated by the Expect request header field cannot be
     * met by the server.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/417
     */
    ExpectationFailed = 417,
    /**
     * The server refuses the attempt to brew coffee with a teapot.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/418
     */
    ImATeapot = 418,
    /**
     * The request was directed at a server that is not able to produce a response. This can be sent by
     * a server that is not configured to produce responses for the combination of scheme and authority
     * that are included in the request URI.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/421
     */
    MisdirectedRequest = 421,
    /**
     * The request was well-formed but was unable to be followed due to semantic errors.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/422
     */
    UnprocessableContent = 422,
    /**
     * The resource that is being accessed is locked.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/423
     */
    Locked = 423,
    /**
     * The request failed due to failure of a previous request.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/424
     */
    FailedDependency = 424,
    /**
     * Indicates that the server is unwilling to risk processing a request that might be replayed.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/425
     */
    TooEarly = 425,
    /**
     * The server refuses to perform the request using the current protocol but might be willing to do
     * so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426
     * response to indicate the required protocol(s).
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/426
     */
    UpgradeRequired = 426,
    /**
     * The origin server requires the request to be conditional. This response is intended to prevent
     * the 'lost update' problem, where a client GET s a resource's state, modifies it and PUT s it back
     * to the server, when meanwhile a third party has modified the state on the server, leading to a
     * conflict.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/428
     */
    PreconditionRequired = 428,
    /**
     * The user has sent too many requests in a given amount of time ("rate limiting").
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/429
     */
    TooManyRequests = 429,
    /**
     * The server is unwilling to process the request because its header fields are too large. The
     * request may be resubmitted after reducing the size of the request header fields.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/431
     */
    RequestHeaderFieldsTooLarge = 431,
    /**
     * The user agent requested a resource that cannot legally be provided, such as a web page censored
     * by a government.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/451
     */
    UnavailableForLegalReasons = 451,

    /** 500 level codes (serverError) */

    /**
     * The server has encountered a situation it does not know how to handle.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/500
     */
    InternalServerError = 500,
    /**
     * The request method is not supported by the server and cannot be handled. The only methods that
     * servers are required to support (and therefore that must not return this code) are GET and HEAD
     * .
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/501
     */
    NotImplemented = 501,
    /**
     * This error response means that the server, while working as a gateway to get a response needed to
     * handle the request, got an invalid response.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/502
     */
    BadGateway = 502,
    /**
     * The server is not ready to handle the request. Common causes are a server that is down for
     * maintenance or that is overloaded. Note that together with this response, a user-friendly page
     * explaining the problem should be sent. This response should be used for temporary conditions and
     * the Retry-After HTTP header should, if possible, contain the estimated time before the recovery
     * of the service. The webmaster must also take care about the caching-related headers that are sent
     * along with this response, as these temporary condition responses should usually not be cached.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/503
     */
    ServiceUnavailable = 503,
    /**
     * This error response is given when the server is acting as a gateway and cannot get a response in
     * time.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/504
     */
    GatewayTimeout = 504,
    /**
     * The HTTP version used in the request is not supported by the server.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/505
     */
    HttpVersionNotSupported = 505,
    /**
     * The server has an internal configuration error: the chosen variant resource is configured to
     * engage in transparent content negotiation itself, and is therefore not a proper end point in the
     * negotiation process.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/506
     */
    VariantAlsoNegotiates = 506,
    /**
     * The method could not be performed on the resource because the server is unable to store the
     * representation needed to successfully complete the request.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/507
     */
    InsufficientStorage = 507,
    /**
     * The server detected an infinite loop while processing the request.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/508
     */
    LoopDetected = 508,
    /**
     * Further extensions to the request are required for the server to fulfill it.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/510
     */
    NotExtended = 510,
    /**
     * Indicates that the client needs to authenticate to gain network access.
     *
     * See https://developer.mozilla.org/docs/Web/HTTP/Status/511
     */
    NetworkAuthenticationRequired = 511,
}

export enum HttpStatusCategory {
    Information = 'information',
    Success = 'success',
    Redirect = 'redirect',
    ClientError = 'clientError',
    ServerError = 'serverError',
}

export const httpStatusByCategory = {
    [HttpStatusCategory.Information]: [
        HttpStatus.Continue,
        HttpStatus.SwitchingProtocols,
        HttpStatus.Processing,
        HttpStatus.EarlyHints,
    ],
    [HttpStatusCategory.Success]: [
        HttpStatus.Ok,
        HttpStatus.Created,
        HttpStatus.Accepted,
        HttpStatus.NonAuthoritativeInformation,
        HttpStatus.NoContent,
        HttpStatus.ResetContent,
        HttpStatus.PartialContent,
        HttpStatus.MultiStatus,
        HttpStatus.AlreadyReported,
        HttpStatus.ImUsed,
    ],
    [HttpStatusCategory.Redirect]: [
        HttpStatus.MultipleChoices,
        HttpStatus.MovedPermanently,
        HttpStatus.Found,
        HttpStatus.SeeOther,
        HttpStatus.NotModified,
        HttpStatus.UseProxy,
        HttpStatus.Unused,
        HttpStatus.TemporaryRedirect,
        HttpStatus.PermanentRedirect,
    ],
    [HttpStatusCategory.ClientError]: [
        HttpStatus.BadRequest,
        HttpStatus.Unauthorized,
        HttpStatus.PaymentRequired,
        HttpStatus.Forbidden,
        HttpStatus.NotFound,
        HttpStatus.MethodNotAllowed,
        HttpStatus.NotAcceptable,
        HttpStatus.ProxyAuthenticationRequired,
        HttpStatus.RequestTimeout,
        HttpStatus.Conflict,
        HttpStatus.Gone,
        HttpStatus.LengthRequired,
        HttpStatus.PreconditionFailed,
        HttpStatus.PayloadTooLarge,
        HttpStatus.UriTooLong,
        HttpStatus.UnsupportedMediaType,
        HttpStatus.RangeNotSatisfiable,
        HttpStatus.ExpectationFailed,
        HttpStatus.ImATeapot,
        HttpStatus.MisdirectedRequest,
        HttpStatus.UnprocessableContent,
        HttpStatus.Locked,
        HttpStatus.FailedDependency,
        HttpStatus.TooEarly,
        HttpStatus.UpgradeRequired,
        HttpStatus.PreconditionRequired,
        HttpStatus.TooManyRequests,
        HttpStatus.RequestHeaderFieldsTooLarge,
        HttpStatus.UnavailableForLegalReasons,
    ],
    [HttpStatusCategory.ServerError]: [
        HttpStatus.InternalServerError,
        HttpStatus.NotImplemented,
        HttpStatus.BadGateway,
        HttpStatus.ServiceUnavailable,
        HttpStatus.GatewayTimeout,
        HttpStatus.HttpVersionNotSupported,
        HttpStatus.VariantAlsoNegotiates,
        HttpStatus.InsufficientStorage,
        HttpStatus.LoopDetected,
        HttpStatus.NotExtended,
        HttpStatus.NetworkAuthenticationRequired,
    ],
} as const;

export type HttpStatusByCategory<Category extends HttpStatusCategory> =
    (typeof httpStatusByCategory)[Category];

export function isHttpStatusCategory<const Category extends HttpStatusCategory>(
    status: unknown,
    category: Category,
): status is HttpStatusByCategory<Category> {
    if (!check.isEnumValue(status, HttpStatus)) {
        return false;
    }
    return check.isIn(status, httpStatusByCategory[category]);
}
