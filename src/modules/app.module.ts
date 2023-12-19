import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './articles/articles.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forRoot('mongodb://root:root@localhost:27017'), ArticleModule,JwtModule.register({
    global: true,
    secret: 'temp-not-secure-secret',
  }),],
  controllers: [],
  providers: [],
})
export class AppModule {}