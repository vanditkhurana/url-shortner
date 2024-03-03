/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from '../services/url.service';
import { UrlDto } from '../dtos/url.dto';

describe('UrlController', () => {
  let controller: UrlController;
  let urlService: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [UrlService],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    urlService = module.get<UrlService>(UrlService);
  });

  describe('shortenUrl', () => {
    it('should return shortened URL', async () => {
      const urlDto: UrlDto = { originalUrl: 'https://example.com' };

      jest.spyOn(urlService, 'shortenUrl').mockResolvedValue('shortened-url');

      const result = await controller.shortenUrl(urlDto);

      expect(result).toEqual('shortened-url');
    });

    it('should return an error for invalid URL', async () => {
      const urlDto: UrlDto = { originalUrl: 'invalid-url' };

      const result = await controller.shortenUrl(urlDto);

      expect(result).toEqual({
        error: `Invalid request. Please provide a valid URL. Example: 'https://example.com'.`,
        code: 400,
      });
    });
  });

  describe('redirectUrl', () => {
    it('should return original URL for a valid short URL', async () => {
      const shortUrl = 'valid-short-url';

      jest
        .spyOn(urlService, 'getOriginalUrl')
        .mockResolvedValue('https://example.com');

      const result = await controller.redirectUrl(shortUrl);

      expect(result).toEqual({ url: 'https://example.com' });
    });
  });
});
