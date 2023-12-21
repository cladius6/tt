import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RateLimiterService } from '../rate-limiter.service';
import { RateLimiterUtils } from 'src/utils/rate-limiter.utils';
import { RateLimitException } from 'src/exceptions/rate-limit.exception';
import { Request } from 'express';

@Injectable()
export class PublicRateLimiterGuard implements CanActivate {
  private readonly IS_PRIVATE = false;

  constructor(
    @Inject(RateLimiterService) private rateLimiterService: RateLimiterService,
  ) {}

  protected getTracker(request: Record<string, any>): string {
    return request.ip;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    // const response = context.switchToHttp().getResponse();

    const tracker = this.getTracker(request);

    const endpointPattern = RateLimiterUtils.createEndpointPattern(request);

    const weight = RateLimiterUtils.getWeightForEndpoint(endpointPattern);

    const key = RateLimiterUtils.generateKey(
      context,
      tracker,
      PublicRateLimiterGuard.name,
    );

    const { isAllowed, resetTime } =
      await this.rateLimiterService.consumePoints(key, weight, this.IS_PRIVATE);
    if (!isAllowed) {
      throw new RateLimitException(
        `Rate limit exceeded. Try again in ${resetTime} seconds.`,
      );
    }

    return true;
  }
}
