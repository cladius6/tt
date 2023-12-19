import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './articles/articles.module';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './app-config/app-config.module';
import { ThrottlerConfiguration } from './app-config/throttler-config.service';
import { StorageConfiguration } from './app-config/storage-config.service';
import Redis from 'ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.' + process.env.NODE_ENV || 'development', '.env'],
      isGlobal: true,
    }),
    AppConfigModule,
    MongooseModule.forRootAsync({
      useFactory: (config: StorageConfiguration) => ({
        uri: config.mongoDbUri,
      }),
      inject: [StorageConfiguration],
    }),
    ArticleModule,
    JwtModule.register({
      global: true,
      secret: 'temp-not-secure-secret',
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (
        config: ThrottlerConfiguration,
        storageConfig: StorageConfiguration,
      ) => ({
        throttlers: [
          {
            ttl: config.rateTTL,
            limit: config.rateLimit,
          },
        ],
        storage: new ThrottlerStorageRedisService(
          new Redis({
            host: storageConfig.redisHost,
            port: storageConfig.redisPort,
          }),
        ),
      }),
      inject: [ThrottlerConfiguration, StorageConfiguration],
    }),
  ],
})
export class AppModule {}
