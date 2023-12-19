import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {
  @Prop()
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop()
  body: string;

  @Prop({ required: false, default: false })
  published?: boolean;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
