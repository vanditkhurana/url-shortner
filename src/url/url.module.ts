/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlController } from './controllers/url.controller';
import { UrlService } from './services/url.service';
import { Url, UrlSchema } from './entities/url.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
  ],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
