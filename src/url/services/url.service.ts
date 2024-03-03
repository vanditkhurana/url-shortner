/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from '../entities/url.entity';
import { UrlDto } from '../dtos/url.dto';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) {}

  async shortenUrl(urlDto: UrlDto): Promise<string> {
    const { originalUrl } = urlDto;
    const shortUrl = this.generateShortUrl();
    
    const url = new this.urlModel({ originalUrl, shortUrl });
    await url.save();

    return shortUrl;
  }

  async getOriginalUrl(shortUrl: string): Promise<string | undefined> {
    const url = await this.urlModel.findOne({ shortUrl });
    return url ? url.originalUrl : '';
  }

  generateShortUrl(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortUrl = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      shortUrl += characters.charAt(randomIndex);
    }

    return shortUrl;
  }
}
