import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from 'src/modules/articles/schemas/article.schema';
import { CreateArticleDto } from './dtos/create-article.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PrivateThrottlerGuard } from 'src/guards/private-throttler.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @UseGuards(ThrottlerGuard)
  async findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard, PrivateThrottlerGuard)
  async create(@Body() createArticleDto: CreateArticleDto) {
    await this.articlesService.create(createArticleDto);
  }

  @Get(':id')
  @UseGuards(ThrottlerGuard)
  async findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, PrivateThrottlerGuard)
  async delete(@Param('id') id: string) {
    return this.articlesService.delete(id);
  }
}
