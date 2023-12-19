import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleModule } from './articles/articles.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest'), ArticleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}