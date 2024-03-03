/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlModule } from './src/url/url.module';

const databaseUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/main';
@Module({
  imports: [
    MongooseModule.forRoot(databaseUrl),
    UrlModule,
  ],
})
export class AppModule {}
