import { Module } from '@nestjs/common';
import { PublicRateLimiterGuard } from './guards/public-rate-limiter.guard';
import { RateLimiterService } from './rate-limiter.service';
import { ThrottlerConfiguration } from '../app-config/throttler-config.service';
import { RedisModule } from '../redis/redis.module';
import { PrivateRateLimiterGuard } from './guards/private-rate-limiter.guard';

@Module({
  imports: [RedisModule],
  providers: [
    PrivateRateLimiterGuard,
    PublicRateLimiterGuard,
    RateLimiterService,
    ThrottlerConfiguration,
  ],
  exports: [
    PrivateRateLimiterGuard,
    PublicRateLimiterGuard,
    RateLimiterService,
  ],
})
export class RateLimiterModule {}
