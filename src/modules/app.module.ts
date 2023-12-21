import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './articles/articles.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './app-config/app-config.module';
import { StorageConfiguration } from './app-config/storage-config.service';
import { RedisModule } from './redis/redis.module';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';

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
    RedisModule,
    RateLimiterModule,
  ],
})
export class AppModule {}
