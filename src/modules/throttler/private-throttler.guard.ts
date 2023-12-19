import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ThrottlerException, ThrottlerGuard, ThrottlerOptions, ThrottlerStorage } from '@nestjs/throttler'
import { TokenUtil } from "src/utils/token.utils";

@Injectable()
export class PrivateThrottlerGuard extends ThrottlerGuard {
  constructor(_options: ThrottlerOptions[],storageService: ThrottlerStorage, reflector: Reflector) {
    super([{
      ttl: 3600,
      limit: 1,
    }], storageService, reflector);
  }

  async handleRequest(context: ExecutionContext, limit: number, ttl: number, throttler: ThrottlerOptions): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = TokenUtil.extractTokenFromHeader(request)
    const key = this.generateKey(context, token, throttler.name);
    const { totalHits } = await this.storageService.increment(key, ttl);

    if (totalHits > limit) {
      throw new ThrottlerException();
    }

    return true;
  }

}