import { EventEmitter } from 'node:events';
import { Request, Response } from 'express';
import { requestTelemetry } from './request-telemetry';

describe('safe request correlation', () => {
  it.each([undefined, { path: '/api/v1/goals/:goalId' }])(
    'logs route template only, ignoring caller identifiers and secrets',
    (route) => {
      const log = jest.fn(),
        next = jest.fn(),
        setHeader = jest.fn();
      const response = Object.assign(new EventEmitter(), {
        locals: {},
        setHeader,
        statusCode: 404,
      });
      const request = {
        method: 'GET',
        route,
        url: '/PRIVATE?token=PRIVATE',
        path: '/PRIVATE',
        headers: { 'x-request-id': 'PRIVATE', authorization: 'PRIVATE' },
        body: { notes: 'PRIVATE' },
      };
      requestTelemetry({ log })(
        request as unknown as Request,
        response as unknown as Response,
        next,
      );
      response.emit('finish');
      expect(next).toHaveBeenCalledTimes(1);
      const record = JSON.parse(log.mock.calls[0][0]);
      expect(record).toMatchObject({
        method: 'GET',
        path: route?.path ?? '<unmatched>',
        status: 404,
        level: 'info',
      });
      expect(record.requestId).toMatch(/^[a-f0-9-]{36}$/);
      expect(setHeader).toHaveBeenCalledWith('X-Request-Id', record.requestId);
      expect(log.mock.calls[0][0]).not.toContain('PRIVATE');
    },
  );
});
