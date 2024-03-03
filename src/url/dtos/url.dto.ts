/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';
export class UrlDto {
  @IsString()
  @IsNotEmpty()
  originalUrl: string;
}  