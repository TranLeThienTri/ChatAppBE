/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  hashPassword?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  userName?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  avatar?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  bio?: string;
}
