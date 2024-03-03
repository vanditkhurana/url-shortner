/* eslint-disable prettier/prettier */
import { 
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from '../entities/url.entity';
import { UrlDto } from '../dtos/url.dto';
import { nanoid } from 'nanoid';
import { isURL } from 'class-validator';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) {}

  async shortenUrl(urlDto: UrlDto): Promise<string> {
    const { originalUrl } = urlDto;

    if (!isURL(originalUrl)) {
      throw new BadRequestException('String Must be a Valid URL');
    }

    const urlCode = nanoid(10);
    const baseURL = 'https://shortmyurl';

    try {

      let url = await this.urlModel.findOne({ originalUrl: originalUrl});
      
      if (url) return url.shortUrl;

      const shortUrl = `${baseURL}/${urlCode}`;

      url = new this.urlModel({
        urlCode,
        originalUrl,
        shortUrl,
      });

      await url.save();
      return url.shortUrl;
    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException('Server Error');
    }
  }

  async redirect(urlCode: string) {
    try {
      const url = await this.urlModel.findOne({ urlCode : urlCode });
      if (url) {
        url.analytics.clicks++;
      const { referralSource, activeHour, device, browser } = this.extractAnalyticsInfo();
      url.analytics.referralSources.push(referralSource);
      url.analytics.activeHours.push(activeHour);
      url.analytics.devices.push(device);
      url.analytics.browsers.push(browser);

      await url.save();

      return url.originalUrl;
      }
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Resource Not Found');
    }
  }

  async getAnalytics(urlCode: string) {
    try {
      const url = await this.urlModel.findOne({ urlCode });
      if (url) {
        return url.analytics;
      }
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Resource Not Found');
    }
  }

  extractAnalyticsInfo() {

    return {
      referralSource: 'direct', 
      activeHour: new Date().getHours(), 
      device: 'Desktop', 
      browser: 'Chrome', 
    };
  }
}
