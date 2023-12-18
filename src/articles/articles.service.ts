import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticlesService {
  findAll(): string {
    return 'Hello World!';
  }
}
