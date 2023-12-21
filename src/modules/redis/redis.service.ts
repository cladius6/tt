import { RedisService as NestJsRedisModule } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;
  private readonly scriptSrc: string;

  constructor(private readonly redisService: NestJsRedisModule) {
    this.redis = this.redisService.getClient();
    this.scriptSrc = this.getScriptSrc();
  }

  async set(key: string, value: any) {
    return this.redis.set(key, JSON.stringify(value));
  }

  getScriptSrc(): string {
    return `
      local totalHits = redis.call("INCR", KEYS[1])
      local timeToExpire = redis.call("PTTL", KEYS[1])
      if timeToExpire <= 0
        then
          redis.call("PEXPIRE", KEYS[1], tonumber(ARGV[1]))
          timeToExpire = tonumber(ARGV[1])
        end
      return { totalHits, timeToExpire }
    `
      .replace(/^\s+/gm, '')
      .trim();
  }

  async increment(key: string, ttl: number): Promise<Record<string, any>> {
    const results: number[] = (await this.redis.call(
      'EVAL',
      this.scriptSrc,
      1,
      key,
      ttl,
    )) as number[];

    if (!Array.isArray(results)) {
      throw new TypeError(
        `Expected result to be array of values, got ${results}`,
      );
    }

    if (results.length !== 2) {
      throw new Error(`Expected 2 values, got ${results.length}`);
    }

    const [totalHits, timeToExpire] = results;

    if (typeof totalHits !== 'number') {
      throw new TypeError('Expected totalHits to be a number');
    }

    if (typeof timeToExpire !== 'number') {
      throw new TypeError('Expected timeToExpire to be a number');
    }

    console.log({ totalHits, timeToExpire: Math.ceil(timeToExpire / 1000) });

    return {
      totalHits,
      timeToExpire: Math.ceil(timeToExpire / 1000),
    };
  }
}
