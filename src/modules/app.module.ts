import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './articles/articles.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './app-config/app-config.module';
import { StorageConfiguration } from './app-config/storage-config.service';
import { RedisModule } from './redis/redis.module';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';
import { BaseConfiguration } from './app-config/base-config.service';

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
    JwtModule.registerAsync({
      useFactory: (config: BaseConfiguration) => ({
        global: true,
        secret: config.jwtSecret,
      }),
    }),
    RedisModule,
    RateLimiterModule,
  ],
})
export class AppModule {}
