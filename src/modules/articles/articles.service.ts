import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Article } from 'src/modules/articles/schemas/article.schema';
import { CreateArticleDto } from './dtos/create-article.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ArticlesService {
  constructor(@InjectModel(Article.name) private articleModel: Model<Article> ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const createArticle = new this.articleModel(createArticleDto)
    return createArticle.save()
  }

  findAll(): Promise<Article[]> {
    return this.articleModel.find().exec()
  }

  findOne(id: string): Promise<Article> {
    return this.articleModel.findOne({ _id: id }).exec()
  }

  async delete(id: string) {
    const deletedArticle = await this.articleModel.findByIdAndDelete({ _id: id }).exec()
    return deletedArticle;
  }
}
