import { ExecutionContext } from '@nestjs/common';
import * as md5 from 'md5';

export class RateLimiterUtils {
  static generateKey(
    context: ExecutionContext,
    suffix: string,
    name: string,
  ): string {
    const prefix = `${context.getClass().name}-${
      context.getHandler().name
    }-${name}`;
    return md5(`${prefix}-${suffix}`);
  }

  static createEndpointPattern(method: string, path: string) {
    return `${method} ${path}`;
  }
}
