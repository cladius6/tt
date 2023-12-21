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
import { AuthGuard } from 'src/guards/auth.guard';
import { PrivateRateLimiterGuard } from '../rate-limiter/guards/private-rate-limiter.guard';
import { PublicRateLimiterGuard } from '../rate-limiter/guards/public-rate-limiter.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @UseGuards(PublicRateLimiterGuard)
  async findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard, PrivateRateLimiterGuard)
  async create(@Body() createArticleDto: CreateArticleDto) {
    await this.articlesService.create(createArticleDto);
  }

  @Get(':id')
  @UseGuards(PublicRateLimiterGuard)
  async findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, PrivateRateLimiterGuard)
  async delete(@Param('id') id: string) {
    return this.articlesService.delete(id);
  }
}
