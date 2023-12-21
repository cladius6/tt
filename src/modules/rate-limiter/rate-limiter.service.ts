import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { ThrottlerConfiguration } from '../app-config/throttler-config.service';

@Injectable()
export class RateLimiterService {
  private readonly publicTTL: number;
  private readonly publicLimit: number;
  private readonly privateTTL: number;
  private readonly privateLimit: number;

  constructor(
    @Inject(RedisService)
    private readonly redisService: RedisService,
    @Inject(ThrottlerConfiguration)
    throttlerConfiguration: ThrottlerConfiguration,
  ) {
    this.publicTTL = throttlerConfiguration.rateTTL;
    this.publicLimit = throttlerConfiguration.rateLimit;
    this.privateTTL = throttlerConfiguration.privateRateTTL;
    this.privateLimit = throttlerConfiguration.privateRateLimit;
  }

  private getLimit(isPrivate: boolean) {
    return isPrivate ? this.privateLimit : this.publicLimit;
  }

  private getTTL(isPrivate: boolean) {
    return isPrivate ? this.privateTTL : this.publicTTL;
  }

  public async consumePoints(
    key: string,
    weight: number,
    isPrivate: boolean,
  ): Promise<{ isAllowed: boolean; resetTime?: number }> {
    const ttl = this.getTTL(isPrivate);
    const limit = this.getLimit(isPrivate);

    const { totalHits, timeToExpire } = await this.redisService.increment(
      key,
      ttl,
    );

    if (totalHits > limit) {
      return { isAllowed: false, resetTime: timeToExpire };
    }

    return { isAllowed: totalHits + weight <= limit };
  }
}
