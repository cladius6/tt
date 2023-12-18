import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Article {
  @Prop()
  title: string;

  @Prop({ required: false })
  description?: string;

  @Prop()
  body: string;

  @Prop({ required: false, default: false})
  published?: string;
}