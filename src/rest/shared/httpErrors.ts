export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly message: string,
    readonly context: object = {},
  ) {
    super();

    // manually adjust the prototype as recommended in
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  toJSON(): object {
    const { status, message, context } = this;
    return {
      status,
      message,
      ...(Object.entries(context).length > 0 && { context }),
    };
  }

  toString(): string {
    return `HttpError ${this.status}`;
  }

  static notFound(message: string = 'not found', context?: object) {
    return new this(404, message, context);
  }

  static badRequest(message: string = 'bad request', context?: object) {
    return new this(400, message, context);
  }

  static internalServerError(
    message: string = 'internal server error',
    context?: object,
  ) {
    return new this(500, message, context);
  }

  static serviceUnavailable(
    message: string = 'service unavailable',
    context?: object,
  ) {
    return new this(503, message, context);
  }

  static conflict(message: string = 'conflict', context?: object) {
    return new this(409, message, context);
  }

  static unauthorized(message: string = 'unauthorized', context?: object) {
    return new this(401, message, context);
  }
}
