import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './articles/articles.module';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis'

@Module({
  imports: [MongooseModule.forRoot('mongodb://root:root@localhost:27017'), ArticleModule, JwtModule.register({
    global: true,
    secret: 'temp-not-secure-secret',
  }),
  ThrottlerModule.forRoot({
    throttlers: [{
      ttl: 10000,
      limit: 2,
    }], storage: new ThrottlerStorageRedisService()
  }),
  ],
})
export class AppModule { }
