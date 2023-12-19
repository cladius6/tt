import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from 'src/articles/schemas/article.schema';
import { CreateArticleDto } from './dtos/create-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Post()
  async create(@Body() createArticleDto :CreateArticleDto){
    await this.articlesService.create(createArticleDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findOne(id);
  }

  @Get(':id')
  async delete(@Param('id') id: string) {
    return this.articlesService.delete(id);
  } 
}
