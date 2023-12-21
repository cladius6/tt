import { HttpException, HttpStatus } from '@nestjs/common';

export const rateLimitExceptionMessage =
  'RateLimitException: Too Many Requests';

/**
 * Throws a HttpException with a 429 status code, indicating that too many
 * requests were being fired within a certain time window.
 */
export class RateLimitException extends HttpException {
  constructor(message?: string) {
    super(
      `${message || rateLimitExceptionMessage}`,
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
