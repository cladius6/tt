import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Article } from 'src/schemas/article.schema';
import { CreateArticleDto } from './dtos/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(@Inject(Article.name) private articleModel: Model<Article> ) {}

  findAll(): string {
    return 'Hello World!';
  }

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const createArticle = new this.articleModel(createArticleDto)
    return createArticle

  }
}
