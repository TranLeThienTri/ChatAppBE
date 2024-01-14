/* eslint-disable prettier/prettier */
import { MyGuards } from './../auth/guard/myjwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto, UpdateArticleDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
// import { Request } from 'express';
@ApiTags('Article')
@UseGuards(MyGuards)
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get('content')
  async getArticleByContent(@Body('content') content: string) {
    return await this.articleService.getArticleByContent(content);
  }
  @Get('all') //example: /article/
  async getAllArticle() {
    return await this.articleService.getAllArticle();
  }

  @Get(':id') //example: /article/123
  async getArticleById(@Param('id', ParseIntPipe) id: number) {
    return await this.articleService.getArticleById(id);
  }

  @Get('')
  async getArticleOfUser(@GetUser('id') userId: number) {
    return await this.articleService.getArticleOfUser(userId);
  }

  @Post() //example: /article/
  @UseInterceptors(
    FileInterceptor('image', {
      storage: storageConfig('post'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 10) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  async createNewArticle(
    @GetUser('id') userId: number,
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createArticleDto.image = file.destination + '/' + file.filename;
    }
    console.log(file);
    return await this.articleService.createArticle(userId, {
      ...createArticleDto,
    });
  }

  @Put(':id') //example: /article/123
  @UseInterceptors(
    FileInterceptor('image', {
      storage: storageConfig('post'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 10) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  async updateArticleById(
    @Param('id', ParseIntPipe) articleId: number, //validate noteId is "number"
    @Body() updateArticleDto: UpdateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateArticleDto.image = file.destination + '/' + file.filename;
    }
    return await this.articleService.UpdateArticleById(articleId, {
      ...updateArticleDto,
    });
  }

  @Delete(':id')
  async deleteArticleById(@Param('id', ParseIntPipe) id: number) {
    return await this.articleService.DeleteArticleById(id);
  }
}
