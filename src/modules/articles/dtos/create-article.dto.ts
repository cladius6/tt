import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createArticleSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  body: z.string(),
  published: z.string().nullable().optional(),
});

export class CreateArticleDto extends createZodDto(createArticleSchema) {}
