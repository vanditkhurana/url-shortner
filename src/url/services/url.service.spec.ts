/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UrlService } from './url.service';
import { Url } from '../entities/url.entity';
import { UrlDto } from '../dtos/url.dto';
import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { nanoid } from 'nanoid';

const mockUrlModel = {
  findOne: jest.fn(),
  save: jest.fn(),
};

jest.mock('@nestjs/mongoose', () => ({
  InjectModel: jest.fn(() => ({})),
  getModelToken: jest.fn(),
}));

describe('UrlService', () => {
  let service: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getModelToken(Url.name),
          useValue: mockUrlModel,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  describe('shortenUrl', () => {
    it('should throw BadRequestException for invalid URL', async () => {
      const invalidUrlDto: UrlDto = { originalUrl: 'invalid-url' };

      await expect(service.shortenUrl(invalidUrlDto)).rejects.toThrow(BadRequestException);
    });

    it('should return shortUrl if originalUrl already exists', async () => {
      const existingUrlDto: UrlDto = { originalUrl: 'https://existing-url.com' };
      const existingUrl = {
        urlCode: nanoid(10),
        originalUrl: existingUrlDto.originalUrl,
        shortUrl: 'https://shortmyurl/existing-code',
      };

      jest.spyOn(nanoid as any, 'nanoid').mockReturnValue(existingUrl.urlCode);
      jest.spyOn(service['urlModel'], 'findOne').mockResolvedValue(existingUrl);

      await expect(service.shortenUrl(existingUrlDto)).resolves.toBe(existingUrl.shortUrl);
    });

    it('should create and return shortUrl for a new originalUrl', async () => {
      const newUrlDto: UrlDto = { originalUrl: 'https://new-url.com' };
      const newUrlCode = 'new-url-code';
      const newShortUrl = 'https://shortmyurl/new-url-code';

      jest.spyOn(nanoid as any, 'nanoid').mockReturnValue(newUrlCode);
      jest.spyOn(service['urlModel'], 'findOne').mockResolvedValue(null);

      await expect(service.shortenUrl(newUrlDto)).resolves.toBe(newShortUrl);
    });

    it('should throw UnprocessableEntityException on server error', async () => {
      const errorDto: UrlDto = { originalUrl: 'https://error-url.com' };

      mockUrlModel.findOne.mockRejectedValue(new Error('Test error'));

      await expect(service.shortenUrl(errorDto)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('redirect', () => {
    it('should return originalUrl if urlCode exists', async () => {
      const urlCode = 'existing-url-code';
      const existingUrl = {
        urlCode,
        originalUrl: 'https://existing-url.com',
        shortUrl: 'https://shortmyurl/existing-url-code',
      };

      mockUrlModel.findOne.mockResolvedValue(existingUrl);

      await expect(service.redirect(urlCode)).resolves.toBe(existingUrl.originalUrl);
    });

    it('should throw NotFoundException if urlCode does not exist', async () => {
      const nonExistingCode = 'non-existing-url-code';

      mockUrlModel.findOne.mockResolvedValue(null);

      await expect(service.redirect(nonExistingCode)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException on server error', async () => {
      const errorUrlCode = 'error-url-code';

      mockUrlModel.findOne.mockRejectedValue(new Error('Test error'));

      await expect(service.redirect(errorUrlCode)).rejects.toThrow(NotFoundException);
    });
  });
});
