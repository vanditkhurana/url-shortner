/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Url extends Document {
  @Prop({ required: true })
  urlCode: string | undefined;

  @Prop({ required: true })
  originalUrl: string | undefined;

  @Prop({ required: true })
  shortUrl: string | undefined;

  @Prop({ default: Date.now })
  createdAt: Date | undefined;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
