import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(error: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const statusCode = error instanceof HttpException ? error.getStatus() : 500;
    const detail = error instanceof HttpException ? error.getResponse() : null;
    const message =
      typeof detail === 'object' && detail && 'message' in detail
        ? detail.message
        : typeof detail === 'string'
          ? detail
          : 'Error interno del servidor';
    if (statusCode === 500)
      this.logger.error(
        'Unexpected request failure',
        error instanceof Prisma.PrismaClientKnownRequestError
          ? error.code
          : error instanceof Error
            ? error.name
            : 'UnknownError',
      );
    const codes: Record<number, string> = {
      400: 'VALIDATION_ERROR',
      401: 'UNAUTHORIZED',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      429: 'RATE_LIMITED',
      503: 'UNAVAILABLE',
    };
    response.status(statusCode).json({
      statusCode,
      code: codes[statusCode] ?? 'INTERNAL_ERROR',
      message,
      path: request.path,
      timestamp: new Date().toISOString(),
    });
  }
}
