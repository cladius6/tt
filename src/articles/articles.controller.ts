import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from 'src/articles/schemas/article.schema';
import { CreateArticleDto } from './dtos/create-article.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createArticleDto :CreateArticleDto){
    await this.articlesService.create(createArticleDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findOne(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return this.articlesService.delete(id);
  } 
}
