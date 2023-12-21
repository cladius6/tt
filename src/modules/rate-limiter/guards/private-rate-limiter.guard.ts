import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { TokenUtil } from 'src/utils/token.utils';
import { RateLimiterUtils } from 'src/utils/rate-limiter.utils';
import { RateLimiterService } from '../rate-limiter.service';
import { RateLimitException } from 'src/exceptions/rate-limit.exception';
import { Request } from 'express';

@Injectable()
export class PrivateRateLimiterGuard implements CanActivate {
  private readonly IS_PRIVATE = true;

  constructor(
    @Inject(RateLimiterService) private rateLimiterService: RateLimiterService,
  ) {}

  protected getTracker(request: Record<string, any>): string {
    const token = TokenUtil.extractTokenFromHeader(request);
    return token;
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
      PrivateRateLimiterGuard.name,
    );

    const { isAllowed, resetTime } =
      await this.rateLimiterService.consumePoints(key, weight, this.IS_PRIVATE);
    if (!isAllowed) {
      throw new RateLimitException(
        `Rate limit exceeded. Try again in ${resetTime} seconds.`,
      );
      // return false;
    }

    return true;
  }
}
