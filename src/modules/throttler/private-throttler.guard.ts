import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ThrottlerException, ThrottlerGuard, ThrottlerOptions, ThrottlerStorage } from '@nestjs/throttler'
import { TokenUtil } from "src/utils/token.utils";

@Injectable()
export class PrivateThrottlerGuard extends ThrottlerGuard {
  constructor(_options: ThrottlerOptions[], storageService: ThrottlerStorage, reflector: Reflector) {
    super([{
      ttl: 3600,
      limit: 1,
    }], storageService, reflector);
  }

  protected async getTracker(request: Record<string, any>): Promise<string> {
    const token = TokenUtil.extractTokenFromHeader(request)
    return token
  }

  async handleRequest(context: ExecutionContext, limit: number, ttl: number, throttler: ThrottlerOptions): Promise<boolean> {
    // Here we start to check the amount of requests being done against the ttl.
    const { req, res } = this.getRequestResponse(context);
    const ignoreUserAgents = throttler.ignoreUserAgents ?? this.commonOptions.ignoreUserAgents;
    // Return early if the current user agent should be ignored.
    if (Array.isArray(ignoreUserAgents)) {
      for (const pattern of ignoreUserAgents) {
        if (pattern.test(req.headers['user-agent'])) {
          return true;
        }
      }
    }
    const tracker = await this.getTracker(req);
    const key = this.generateKey(context, tracker, throttler.name);
    const { totalHits, timeToExpire } = await this.storageService.increment(key, ttl);

    const getThrottlerSuffix = (name: string) => (name === 'default' ? '' : `-${name}`);

    // Throw an error when the user reached their limit.
    if (totalHits > limit) {
      res.header(`Retry-After${getThrottlerSuffix(throttler.name)}`, timeToExpire);
      await this.throwThrottlingException(context, {
        limit,
        ttl,
        key,
        tracker,
        totalHits,
        timeToExpire,
      });
    }

    res.header(`${this.headerPrefix}-Limit${getThrottlerSuffix(throttler.name)}`, limit);
    // We're about to add a record so we need to take that into account here.
    // Otherwise the header says we have a request left when there are none.
    res.header(
      `${this.headerPrefix}-Remaining${getThrottlerSuffix(throttler.name)}`,
      Math.max(0, limit - totalHits),
    );
    res.header(`${this.headerPrefix}-Reset${getThrottlerSuffix(throttler.name)}`, timeToExpire);

    return true;
  }

}