/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlService } from './url.service';
import { Url } from '../entities/url.entity';
import { UrlDto } from '../dtos/url.dto';

describe('UrlService', () => {
  let urlService: UrlService;
  let urlModel: Model<Url>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getModelToken(Url.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
    urlModel = module.get<Model<Url>>(getModelToken(Url.name));
  });

  it('should be defined', () => {
    expect(urlService).toBeDefined();
  });

  describe('shortenUrl', () => {
    it('should generate a short URL and save it', async () => {
      const urlDto: UrlDto = { originalUrl: 'http://example.com' };
      const expectedShortUrl = 'generatedShortUrl';

      jest.spyOn(urlService, 'generateShortUrl').mockReturnValue(expectedShortUrl);
      jest.spyOn(urlModel.prototype, 'save').mockResolvedValueOnce(undefined);

      const result = await urlService.shortenUrl(urlDto);

      expect(result).toEqual(expectedShortUrl);
      expect(urlModel.prototype.save).toHaveBeenCalledWith();
    });
  });

  describe('getOriginalUrl', () => {
    it('should return the original URL based on short URL', async () => {
      const shortUrl = 'sampleShortUrl';
      const expectedOriginalUrl = 'http://example.com';

      jest.spyOn(urlModel, 'findOne').mockResolvedValueOnce({ originalUrl: expectedOriginalUrl });

      const result = await urlService.getOriginalUrl(shortUrl);

      expect(result).toEqual(expectedOriginalUrl);
      expect(urlModel.findOne).toHaveBeenCalledWith({ shortUrl });
    });

    it('should return undefined if short URL is not found', async () => {
      const shortUrl = 'nonexistentShortUrl';

      jest.spyOn(urlModel, 'findOne').mockResolvedValueOnce(null);

      const result = await urlService.getOriginalUrl(shortUrl);

      expect(result).toBeUndefined();
      expect(urlModel.findOne).toHaveBeenCalledWith({ shortUrl });
    });
  });

  describe('generateShortUrl', () => {
    it('should generate a random short URL', () => {
      const result = urlService.generateShortUrl();
      expect(result).toHaveLength(6); // Adjust the length based on your implementation
    });
  });
});
