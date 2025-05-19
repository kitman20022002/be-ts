import httpStatus from 'http-status';

export class AppError extends Error {
  statusCode: number;

  context: Record<string, unknown>;

  constructor(
    message: string,
    statusCode = httpStatus.INTERNAL_SERVER_ERROR,
    context: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.context = {
      ...context,
    };

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message: string, context: Record<string, unknown> = {}) {
    return new AppError(message, httpStatus.BAD_REQUEST, context);
  }

  static notFound(message: string, context: Record<string, unknown> = {}) {
    return new AppError(message, httpStatus.NOT_FOUND, context);
  }
}
