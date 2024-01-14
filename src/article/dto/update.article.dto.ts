/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class UpdateArticleDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  content?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;
}
