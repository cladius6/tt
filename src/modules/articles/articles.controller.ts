import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from 'src/modules/articles/schemas/article.schema';
import { CreateArticleDto } from './dtos/create-article.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { PrivateRoute } from 'src/decorators/private-route.decorator';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  @PrivateRoute()
  async create(@Body() createArticleDto :CreateArticleDto){
    await this.articlesService.create(createArticleDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findOne(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @PrivateRoute()
  async delete(@Param('id') id: string) {
    return this.articlesService.delete(id);
  } 
}
