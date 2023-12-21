import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
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

  static createEndpointPattern(request: Request) {
    const method = request.method;
    const path = request.route.path;
    return `${method} ${path}`;
  }

  static getWeightForEndpoint(endpoint: string): number {
    const weights = {
      'GET /articles': 1, // List all articles
      'POST /articles': 5, // Create a new article
      'GET /articles/:id': 1, // Get a single article
      'DELETE /articles/:id': 3, // Delete an article
    };

    const defaultWeight = 1;

    return weights[endpoint] || defaultWeight;
  }
}
