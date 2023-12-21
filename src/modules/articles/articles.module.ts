import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './schemas/article.schema';
import { RateLimiterModule } from '../rate-limiter/rate-limiter.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    RateLimiterModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticleModule {}
