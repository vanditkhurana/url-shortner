/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Redirect, Param, Get } from '@nestjs/common';
import { UrlService } from '../services/url.service';
import { UrlDto } from '../dtos/url.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shortenUrl(@Body() urlDto: UrlDto) {
    if (!urlDto.originalUrl) {
      return { error: `Invalid request. Please provide a valid URL. Example: 'https://example.com'.`, code: 400 };
    };

    if (!urlDto.originalUrl.startsWith("http://") && !urlDto.originalUrl.startsWith("https://")) {
      return {
        error: `Invalid request. Please provide a valid URL. Example: 'https://example.com'.`,
        code: 400,
      };
    }
    return this.urlService.shortenUrl(urlDto);
  }
  
  @Get(':urlCode')
  async redirectUrl(@Param('urlCode') urlCode : string) {
    const originalUrl = await this.urlService.redirect(urlCode);
    return { url: originalUrl };
  }
}
