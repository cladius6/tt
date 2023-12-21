import { Module } from '@nestjs/common';
import { RedisModule as NestJsRedisModule } from '@liaoliaots/nestjs-redis';
import { StorageConfiguration } from '../app-config/storage-config.service';
import { RedisService } from './redis.service';

@Module({
  imports: [
    NestJsRedisModule.forRootAsync({
      useFactory: (storage: StorageConfiguration) => {
        const host = storage.redisHost;
        const port = storage.redisPort;

        return {
          config: {
            host,
            port,
          },
        };
      },
      inject: [StorageConfiguration],
    }),
  ],
  exports: [RedisService],
  providers: [RedisService],
})
export class RedisModule {}
