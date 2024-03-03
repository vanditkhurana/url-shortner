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

  @Prop({
    default: {
      clicks: 0,
      referralSources: [],
      activeHours: [],
      devices: [],
      browsers: [],
    },
    type : Object,
  })
  analytics: {
    clicks: number;
    referralSources: string[];
    activeHours: number[];
    devices: string[];
    browsers: string[];
  };
}

export const UrlSchema = SchemaFactory.createForClass(Url);
