import { Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RequestHandler } from 'express';

/** Server-generated correlation only. Never log URLs, query, headers or bodies. */
export function requestTelemetry(
  logger: Pick<Logger, 'log'> = new Logger('HTTP'),
): RequestHandler {
  return (request, response, next) => {
    const started = performance.now();
    const requestId = randomUUID();
    response.locals.requestId = requestId;
    response.setHeader('X-Request-Id', requestId);
    response.once('finish', () => {
      logger.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'info',
          requestId,
          method: request.method,
          // Use only server route templates; unmatched user input is not log data.
          path:
            typeof request.route?.path === 'string'
              ? request.route.path
              : '<unmatched>',
          status: response.statusCode,
          duration: Math.round(performance.now() - started),
        }),
      );
    });
    next();
  };
}
