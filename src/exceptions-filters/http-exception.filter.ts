import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (status === 429) {
      const rateLimit = response.getHeader('x-ratelimit-limit');
      const rateLimitRemaining = response.getHeader('x-ratelimit-remaining');
      const rateLimitReset = response.getHeader('x-ratelimit-reset');
      const retryAfter = response.getHeader('Retry-After');

      response.status(status).json({
        statusCode: status,
        message: `Rate limit exceeded. You can make up to ${rateLimit} requests. Try again in ${retryAfter} seconds.`,
        limit: rateLimit,
        remaining: rateLimitRemaining,
        resetTime: rateLimitReset,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        message: exception.message,
      });
    }
  }
}
