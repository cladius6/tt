import { Injectable } from '@nestjs/common';
import { z } from 'nestjs-zod/z';
import { ConfigService } from '@nestjs/config';

const ThrottlerEnvVariablesSchema = z.object({
  PRIVATE_RATE_LIMIT: z.number(),
  PRIVATE_RATE_TTL: z.number(),
  RATE_LIMIT: z.number(),
  RATE_TTL: z.number(),
});

type ThrottlerEnvVariables = z.infer<typeof ThrottlerEnvVariablesSchema>;

@Injectable()
export class ThrottlerConfiguration {
  readonly privateRateLimit: number;
  readonly privateRateTTL: number;
  readonly rateLimit: number;
  readonly rateTTL: number;

  constructor(readonly configService: ConfigService<ThrottlerEnvVariables>) {
    const config = ThrottlerEnvVariablesSchema.parse({
      PRIVATE_RATE_LIMIT: Number(configService.get('PRIVATE_RATE_LIMIT')),
      PRIVATE_RATE_TTL: Number(configService.get('PRIVATE_RATE_TTL')),
      RATE_LIMIT: Number(configService.get('RATE_LIMIT')),
      RATE_TTL: Number(configService.get('RATE_TTL')),
    });

    this.privateRateLimit = config.PRIVATE_RATE_LIMIT;
    this.privateRateTTL = config.PRIVATE_RATE_TTL;
    this.rateLimit = config.RATE_LIMIT;
    this.rateTTL = config.RATE_TTL;
  }
}
